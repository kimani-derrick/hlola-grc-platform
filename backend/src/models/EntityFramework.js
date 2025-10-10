const { pool } = require('../config/database');

const query = (text, params) => pool.query(text, params);

class EntityFramework {
  static async assignFramework({ entityId, frameworkId, complianceScore = 0, auditReadinessScore = 0, lastAuditDate, nextAuditDate, certificationStatus = 'not-applicable', certificationExpiry, complianceDeadline }) {
    const result = await query(
      `INSERT INTO entity_frameworks (entity_id, framework_id, compliance_score, audit_readiness_score, last_audit_date, next_audit_date, certification_status, certification_expiry, compliance_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (entity_id, framework_id) 
       DO UPDATE SET 
         compliance_score = EXCLUDED.compliance_score,
         audit_readiness_score = EXCLUDED.audit_readiness_score,
         last_audit_date = EXCLUDED.last_audit_date,
         next_audit_date = EXCLUDED.next_audit_date,
         certification_status = EXCLUDED.certification_status,
         certification_expiry = EXCLUDED.certification_expiry,
         compliance_deadline = EXCLUDED.compliance_deadline,
         updated_at = CURRENT_TIMESTAMP
       RETURNING id, entity_id, framework_id, compliance_score, audit_readiness_score, last_audit_date, next_audit_date, certification_status, certification_expiry, compliance_deadline, created_at, updated_at`,
      [entityId, frameworkId, complianceScore, auditReadinessScore, lastAuditDate, nextAuditDate, certificationStatus, certificationExpiry, complianceDeadline]
    );
    return result.rows[0];
  }

  static async findByEntityId(entityId, organizationId) {
    const result = await query(
      `SELECT ef.*, f.name as framework_name, f.description as framework_description, 
              f.region, f.country, f.category, f.type, f.priority, f.risk_level, f.status,
              e.name as entity_name
       FROM entity_frameworks ef
       JOIN frameworks f ON ef.framework_id = f.id
       JOIN entities e ON ef.entity_id = e.id
       WHERE ef.entity_id = $1 AND e.organization_id = $2 AND ef.is_active = true
       ORDER BY f.name ASC`,
      [entityId, organizationId]
    );
    return result.rows;
  }

  static async findByFrameworkId(frameworkId, organizationId) {
    const result = await query(
      `SELECT ef.*, f.name as framework_name, f.description as framework_description,
              e.name as entity_name, e.entity_type, e.risk_level as entity_risk_level,
              o.name as organization_name
       FROM entity_frameworks ef
       JOIN frameworks f ON ef.framework_id = f.id
       JOIN entities e ON ef.entity_id = e.id
       JOIN organizations o ON e.organization_id = o.id
       WHERE ef.framework_id = $1 AND e.organization_id = $2 AND ef.is_active = true
       ORDER BY e.name ASC`,
      [frameworkId, organizationId]
    );
    return result.rows;
  }

  static async updateCompliance(entityId, frameworkId, updates) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = [
      'compliance_score', 'audit_readiness_score', 'last_audit_date', 
      'next_audit_date', 'certification_status', 'certification_expiry', 'compliance_deadline'
    ];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (updateFields.length === 0) {
      return await EntityFramework.findByEntityId(entityId);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(entityId, frameworkId);

    const result = await query(
      `UPDATE entity_frameworks 
       SET ${updateFields.join(', ')}
       WHERE entity_id = $${paramCount} AND framework_id = $${paramCount + 1} AND is_active = true
       RETURNING id, entity_id, framework_id, compliance_score, audit_readiness_score, last_audit_date, next_audit_date, certification_status, certification_expiry, compliance_deadline, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async removeFramework(entityId, frameworkId) {
    const result = await query(
      `UPDATE entity_frameworks 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP 
       WHERE entity_id = $1 AND framework_id = $2
       RETURNING id`,
      [entityId, frameworkId]
    );
    return result.rows[0];
  }

  static async getComplianceScore(entityId, frameworkId) {
    const result = await query(
      `SELECT compliance_score, audit_readiness_score, last_audit_date, next_audit_date, 
              certification_status, certification_expiry, compliance_deadline
       FROM entity_frameworks 
       WHERE entity_id = $1 AND framework_id = $2 AND is_active = true`,
      [entityId, frameworkId]
    );
    return result.rows[0];
  }

  static async getEntityComplianceOverview(entityId, organizationId) {
    const result = await query(
      `SELECT 
         COUNT(*) as total_frameworks,
         AVG(compliance_score) as avg_compliance_score,
         AVG(audit_readiness_score) as avg_audit_readiness_score,
         COUNT(CASE WHEN certification_status = 'certified' THEN 1 END) as certified_count,
         COUNT(CASE WHEN certification_status = 'pending' THEN 1 END) as pending_count,
         COUNT(CASE WHEN certification_status = 'expired' THEN 1 END) as expired_count,
         COUNT(CASE WHEN compliance_score >= 80 THEN 1 END) as high_compliance_count,
         COUNT(CASE WHEN compliance_score < 50 THEN 1 END) as low_compliance_count
       FROM entity_frameworks ef
       JOIN entities e ON ef.entity_id = e.id
       WHERE ef.entity_id = $1 AND e.organization_id = $2 AND ef.is_active = true`,
      [entityId, organizationId]
    );
    return result.rows[0];
  }

  static async getFrameworkComplianceOverview(frameworkId, organizationId) {
    const result = await query(
      `SELECT 
         COUNT(*) as total_entities,
         AVG(compliance_score) as avg_compliance_score,
         AVG(audit_readiness_score) as avg_audit_readiness_score,
         COUNT(CASE WHEN certification_status = 'certified' THEN 1 END) as certified_count,
         COUNT(CASE WHEN certification_status = 'pending' THEN 1 END) as pending_count,
         COUNT(CASE WHEN certification_status = 'expired' THEN 1 END) as expired_count,
         COUNT(CASE WHEN compliance_score >= 80 THEN 1 END) as high_compliance_count,
         COUNT(CASE WHEN compliance_score < 50 THEN 1 END) as low_compliance_count
       FROM entity_frameworks ef
       JOIN entities e ON ef.entity_id = e.id
       WHERE ef.framework_id = $1 AND e.organization_id = $2 AND ef.is_active = true`,
      [frameworkId, organizationId]
    );
    return result.rows[0];
  }

  static async checkAssignment(entityId, frameworkId) {
    const result = await query(
      `SELECT id FROM entity_frameworks 
       WHERE entity_id = $1 AND framework_id = $2 AND is_active = true`,
      [entityId, frameworkId]
    );
    return result.rows[0];
  }

  static async getUpcomingAudits(organizationId, daysAhead = 30) {
    const result = await query(
      `SELECT ef.*, f.name as framework_name, e.name as entity_name,
              o.name as organization_name
       FROM entity_frameworks ef
       JOIN frameworks f ON ef.framework_id = f.id
       JOIN entities e ON ef.entity_id = e.id
       JOIN organizations o ON e.organization_id = o.id
       WHERE e.organization_id = $1 AND ef.is_active = true
       AND (ef.next_audit_date IS NOT NULL AND ef.next_audit_date <= CURRENT_DATE + INTERVAL '${daysAhead} days')
       ORDER BY ef.next_audit_date ASC`,
      [organizationId]
    );
    return result.rows;
  }

  static async getExpiringCertifications(organizationId, daysAhead = 30) {
    const result = await query(
      `SELECT ef.*, f.name as framework_name, e.name as entity_name,
              o.name as organization_name
       FROM entity_frameworks ef
       JOIN frameworks f ON ef.framework_id = f.id
       JOIN entities e ON ef.entity_id = e.id
       JOIN organizations o ON e.organization_id = o.id
       WHERE e.organization_id = $1 AND ef.is_active = true
       AND (ef.certification_expiry IS NOT NULL AND ef.certification_expiry <= CURRENT_DATE + INTERVAL '${daysAhead} days')
       ORDER BY ef.certification_expiry ASC`,
      [organizationId]
    );
    return result.rows;
  }
}

module.exports = EntityFramework;
