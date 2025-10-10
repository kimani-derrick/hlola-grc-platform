const { pool } = require('../config/database');

const query = (text, params) => pool.query(text, params);

class Control {
  static async create({ frameworkId, controlId, title, description, category, subcategory, priority, implementationLevel, businessImpact, technicalRequirements, legalRequirements, implementationGuidance, testingProcedures, evidenceRequirements, fineAmount, fineCurrency = 'EUR' }) {
    const result = await query(
      `INSERT INTO controls (framework_id, control_id, title, description, category, subcategory, priority, implementation_level, business_impact, technical_requirements, legal_requirements, implementation_guidance, testing_procedures, evidence_requirements, fine_amount, fine_currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [frameworkId, controlId, title, description, category, subcategory, priority, implementationLevel, businessImpact, technicalRequirements, legalRequirements, implementationGuidance, testingProcedures, evidenceRequirements, fineAmount, fineCurrency]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      `SELECT c.*, f.name as framework_name, f.region, f.country, f.category as framework_category
       FROM controls c
       JOIN frameworks f ON c.framework_id = f.id
       WHERE c.id = $1 AND c.is_active = true`,
      [id]
    );
    return result.rows[0];
  }

  static async findAll({ limit, offset, search, frameworkId, category, priority, implementationLevel, sortBy, sortOrder } = {}) {
    let queryText = `
      SELECT c.*, f.name as framework_name, f.region, f.country, f.category as framework_category
      FROM controls c
      JOIN frameworks f ON c.framework_id = f.id
      WHERE c.is_active = true AND f.is_active = true
    `;
    const queryParams = [];
    let paramCount = 1;

    if (search) {
      queryText += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }
    if (frameworkId) {
      queryText += ` AND c.framework_id = $${paramCount}`;
      queryParams.push(frameworkId);
      paramCount++;
    }
    if (category) {
      queryText += ` AND c.category = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }
    if (priority) {
      queryText += ` AND c.priority = $${paramCount}`;
      queryParams.push(priority);
      paramCount++;
    }
    if (implementationLevel) {
      queryText += ` AND c.implementation_level = $${paramCount}`;
      queryParams.push(implementationLevel);
      paramCount++;
    }

    // Add sorting
    const validSortColumns = ['title', 'category', 'priority', 'implementation_level', 'created_at', 'updated_at'];
    const finalSortBy = sortBy && validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const finalSortOrder = sortOrder && ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    queryText += ` ORDER BY c.${finalSortBy} ${finalSortOrder}`;

    // Add pagination
    if (limit) {
      queryText += ` LIMIT $${paramCount++}`;
      queryParams.push(limit);
    }
    if (offset) {
      queryText += ` OFFSET $${paramCount++}`;
      queryParams.push(offset);
    }

    const result = await query(queryText, queryParams);
    return result.rows;
  }

  static async countAll({ search, frameworkId, category, priority, implementationLevel } = {}) {
    let queryText = `
      SELECT COUNT(*)
      FROM controls c
      JOIN frameworks f ON c.framework_id = f.id
      WHERE c.is_active = true AND f.is_active = true
    `;
    const queryParams = [];
    let paramCount = 1;

    if (search) {
      queryText += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }
    if (frameworkId) {
      queryText += ` AND c.framework_id = $${paramCount}`;
      queryParams.push(frameworkId);
      paramCount++;
    }
    if (category) {
      queryText += ` AND c.category = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }
    if (priority) {
      queryText += ` AND c.priority = $${paramCount}`;
      queryParams.push(priority);
      paramCount++;
    }
    if (implementationLevel) {
      queryText += ` AND c.implementation_level = $${paramCount}`;
      queryParams.push(implementationLevel);
      paramCount++;
    }

    const result = await query(queryText, queryParams);
    return parseInt(result.rows[0].count, 10);
  }

  static async findByFrameworkId(frameworkId) {
    const result = await query(
      `SELECT c.*, f.name as framework_name, f.region, f.country, f.category as framework_category
       FROM controls c
       JOIN frameworks f ON c.framework_id = f.id
       WHERE c.framework_id = $1 AND c.is_active = true AND f.is_active = true
       ORDER BY c.title ASC`,
      [frameworkId]
    );
    return result.rows;
  }

  static async findByCategory(category) {
    const result = await query(
      `SELECT c.*, f.name as framework_name, f.region, f.country, f.category as framework_category
       FROM controls c
       JOIN frameworks f ON c.framework_id = f.id
       WHERE c.category = $1 AND c.is_active = true AND f.is_active = true
       ORDER BY c.title ASC`,
      [category]
    );
    return result.rows;
  }

  static async search(searchTerm, { limit, offset } = {}) {
    const result = await query(
      `SELECT c.*, f.name as framework_name, f.region, f.country, f.category as framework_category
       FROM controls c
       JOIN frameworks f ON c.framework_id = f.id
       WHERE c.is_active = true AND f.is_active = true
         AND (c.title ILIKE $1 OR c.description ILIKE $1 OR c.control_id ILIKE $1)
       ORDER BY c.title ASC
       ${limit ? `LIMIT $2` : ''}
       ${offset ? `OFFSET $3` : ''}`,
      limit && offset ? [`%${searchTerm}%`, limit, offset] : limit ? [`%${searchTerm}%`, limit] : [`%${searchTerm}%`]
    );
    return result.rows;
  }

  static async update(id, { controlId, title, description, category, subcategory, priority, implementationLevel, businessImpact, technicalRequirements, legalRequirements, implementationGuidance, testingProcedures, evidenceRequirements }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (controlId !== undefined) { updates.push(`control_id = $${paramCount++}`); values.push(controlId); }
    if (title !== undefined) { updates.push(`title = $${paramCount++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${paramCount++}`); values.push(description); }
    if (category !== undefined) { updates.push(`category = $${paramCount++}`); values.push(category); }
    if (subcategory !== undefined) { updates.push(`subcategory = $${paramCount++}`); values.push(subcategory); }
    if (priority !== undefined) { updates.push(`priority = $${paramCount++}`); values.push(priority); }
    if (implementationLevel !== undefined) { updates.push(`implementation_level = $${paramCount++}`); values.push(implementationLevel); }
    if (businessImpact !== undefined) { updates.push(`business_impact = $${paramCount++}`); values.push(businessImpact); }
    if (technicalRequirements !== undefined) { updates.push(`technical_requirements = $${paramCount++}`); values.push(technicalRequirements); }
    if (legalRequirements !== undefined) { updates.push(`legal_requirements = $${paramCount++}`); values.push(legalRequirements); }
    if (implementationGuidance !== undefined) { updates.push(`implementation_guidance = $${paramCount++}`); values.push(implementationGuidance); }
    if (testingProcedures !== undefined) { updates.push(`testing_procedures = $${paramCount++}`); values.push(testingProcedures); }
    if (evidenceRequirements !== undefined) { updates.push(`evidence_requirements = $${paramCount++}`); values.push(evidenceRequirements); }

    if (updates.length === 0) {
      return await Control.findById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE controls 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND is_active = true
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      `UPDATE controls 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async getGroupedByCategory() {
    const result = await query(`
      SELECT c.category, COUNT(*) as count,
      json_agg(json_build_object('id', c.id, 'title', c.title, 'description', c.description, 'priority', c.priority, 'implementationLevel', c.implementation_level)) as controls
      FROM controls c
      JOIN frameworks f ON c.framework_id = f.id
      WHERE c.is_active = true AND f.is_active = true
      GROUP BY c.category
      ORDER BY c.category ASC
    `);
    return result.rows;
  }

  static async getGroupedByFramework() {
    const result = await query(`
      SELECT f.id as framework_id, f.name as framework_name, f.region, f.country, COUNT(c.id) as control_count,
      json_agg(json_build_object('id', c.id, 'title', c.title, 'description', c.description, 'priority', c.priority, 'category', c.category)) as controls
      FROM frameworks f
      LEFT JOIN controls c ON f.id = c.framework_id AND c.is_active = true
      WHERE f.is_active = true
      GROUP BY f.id, f.name, f.region, f.country
      ORDER BY f.name ASC
    `);
    return result.rows;
  }
}

module.exports = Control;
