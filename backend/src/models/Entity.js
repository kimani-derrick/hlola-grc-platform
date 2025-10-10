const { pool } = require('../config/database');

const query = (text, params) => pool.query(text, params);

class Entity {
  static async create({ organizationId, name, description, entityType, country, region, industry, size, riskLevel, complianceOfficer }) {
    const result = await query(
      `INSERT INTO entities (organization_id, name, description, entity_type, country, region, industry, size, risk_level, compliance_officer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, organization_id, name, description, entity_type, country, region, industry, size, risk_level, compliance_officer, created_at`,
      [organizationId, name, description, entityType, country, region, industry, size, riskLevel, complianceOfficer]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      `SELECT e.*, o.name as organization_name 
       FROM entities e 
       LEFT JOIN organizations o ON e.organization_id = o.id 
       WHERE e.id = $1 AND e.is_active = true`, 
      [id]
    );
    return result.rows[0];
  }

  static async findByOrganizationId(organizationId) {
    const result = await query(
      `SELECT * FROM entities 
       WHERE organization_id = $1 AND is_active = true 
       ORDER BY created_at DESC`, 
      [organizationId]
    );
    return result.rows;
  }

  static async update(id, { name, description, entityType, country, region, industry, size, riskLevel, complianceOfficer }) {
    // Build dynamic query to only update provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (entityType !== undefined) {
      updates.push(`entity_type = $${paramCount++}`);
      values.push(entityType);
    }
    if (country !== undefined) {
      updates.push(`country = $${paramCount++}`);
      values.push(country);
    }
    if (region !== undefined) {
      updates.push(`region = $${paramCount++}`);
      values.push(region);
    }
    if (industry !== undefined) {
      updates.push(`industry = $${paramCount++}`);
      values.push(industry);
    }
    if (size !== undefined) {
      updates.push(`size = $${paramCount++}`);
      values.push(size);
    }
    if (riskLevel !== undefined) {
      updates.push(`risk_level = $${paramCount++}`);
      values.push(riskLevel);
    }
    if (complianceOfficer !== undefined) {
      updates.push(`compliance_officer = $${paramCount++}`);
      values.push(complianceOfficer);
    }

    if (updates.length === 0) {
      // No updates provided, return current entity
      return await Entity.findById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE entities 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND is_active = true
       RETURNING id, organization_id, name, description, entity_type, country, region, industry, size, risk_level, compliance_officer, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      `UPDATE entities 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING id`, 
      [id]
    );
    return result.rows[0];
  }

  static async assignUser(entityId, userId) {
    const result = await query(
      `UPDATE users 
       SET entity_id = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, entity_id`, 
      [entityId, userId]
    );
    return result.rows[0];
  }

  static async getUsersByEntityId(entityId) {
    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.department, u.job_title, u.created_at
       FROM users u 
       WHERE u.entity_id = $1 AND u.is_active = true 
       ORDER BY u.created_at DESC`, 
      [entityId]
    );
    return result.rows;
  }

  static async findDefaultEntityByOrganizationId(organizationId) {
    const result = await query(
      `SELECT id FROM entities 
       WHERE organization_id = $1 AND name = 'Main Operations' AND is_active = true 
       LIMIT 1`, 
      [organizationId]
    );
    return result.rows[0];
  }
}

module.exports = Entity;
