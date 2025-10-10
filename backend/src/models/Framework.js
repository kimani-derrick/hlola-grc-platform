const { pool } = require('../config/database');

const query = (text, params) => pool.query(text, params);

class Framework {
  static async create({ name, description, region, country, category, type, icon, color, complianceDeadline, priority, riskLevel, status, requirementsCount, applicableCountries, industryScope, maxFineAmount, maxFineCurrency = 'EUR' }) {
    const result = await query(
      `INSERT INTO frameworks (name, description, region, country, category, type, icon, color, compliance_deadline, priority, risk_level, status, requirements_count, applicable_countries, industry_scope, max_fine_amount, max_fine_currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING id, name, description, region, country, category, type, icon, color, compliance_deadline, priority, risk_level, status, requirements_count, applicable_countries, industry_scope, max_fine_amount, max_fine_currency, created_at`,
      [name, description, region, country, category, type, icon, color, complianceDeadline, priority, riskLevel, status, requirementsCount, applicableCountries, industryScope, maxFineAmount, maxFineCurrency]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      `SELECT f.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', fb.id,
                    'penaltyAmount', fb.penalty_amount,
                    'penaltyCurrency', fb.penalty_currency,
                    'businessBenefits', fb.business_benefits,
                    'marketAccess', fb.market_access,
                    'competitiveAdvantage', fb.competitive_advantage
                  )
                ) FILTER (WHERE fb.id IS NOT NULL), 
                '[]'::json
              ) as business_impacts
       FROM frameworks f
       LEFT JOIN framework_business_impacts fb ON f.id = fb.framework_id
       WHERE f.id = $1 AND f.is_active = true
       GROUP BY f.id`,
      [id]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let queryText = `SELECT * FROM frameworks WHERE is_active = true`;
    const params = [];
    let paramCount = 1;

    if (filters.category) {
      queryText += ` AND category = $${paramCount++}`;
      params.push(filters.category);
    }

    if (filters.region) {
      queryText += ` AND region = $${paramCount++}`;
      params.push(filters.region);
    }

    if (filters.type) {
      queryText += ` AND type = $${paramCount++}`;
      params.push(filters.type);
    }

    if (filters.status) {
      queryText += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters.search) {
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    queryText += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      queryText += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      queryText += ` OFFSET $${paramCount++}`;
      params.push(filters.offset);
    }

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findByCategory(category) {
    const result = await query(
      `SELECT * FROM frameworks WHERE category = $1 AND is_active = true ORDER BY name ASC`,
      [category]
    );
    return result.rows;
  }

  static async findByRegion(region) {
    const result = await query(
      `SELECT * FROM frameworks WHERE region = $1 AND is_active = true ORDER BY name ASC`,
      [region]
    );
    return result.rows;
  }

  static async search(searchTerm) {
    const result = await query(
      `SELECT * FROM frameworks 
       WHERE is_active = true 
       AND (name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1)
       ORDER BY name ASC`,
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  static async update(id, updates) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = [
      'name', 'description', 'region', 'country', 'category', 'type', 
      'icon', 'color', 'compliance_deadline', 'priority', 'risk_level', 
      'status', 'requirements_count', 'applicable_countries', 'industry_scope'
    ];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (updateFields.length === 0) {
      return await Framework.findById(id);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE frameworks 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramCount} AND is_active = true
       RETURNING id, name, description, region, country, category, type, icon, color, compliance_deadline, priority, risk_level, status, requirements_count, applicable_countries, industry_scope, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      `UPDATE frameworks 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async getCount(filters = {}) {
    let queryText = `SELECT COUNT(*) FROM frameworks WHERE is_active = true`;
    const params = [];
    let paramCount = 1;

    if (filters.category) {
      queryText += ` AND category = $${paramCount++}`;
      params.push(filters.category);
    }

    if (filters.region) {
      queryText += ` AND region = $${paramCount++}`;
      params.push(filters.region);
    }

    if (filters.type) {
      queryText += ` AND type = $${paramCount++}`;
      params.push(filters.type);
    }

    if (filters.status) {
      queryText += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters.search) {
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }

  static async getByCategoryGrouped() {
    const result = await query(
      `SELECT category, COUNT(*) as count, 
              json_agg(
                json_build_object(
                  'id', id,
                  'name', name,
                  'description', description,
                  'region', region,
                  'country', country,
                  'type', type,
                  'priority', priority,
                  'riskLevel', risk_level,
                  'status', status
                ) ORDER BY name
              ) as frameworks
       FROM frameworks 
       WHERE is_active = true 
       GROUP BY category 
       ORDER BY category`,
      []
    );
    return result.rows;
  }

  static async getByRegionGrouped() {
    const result = await query(
      `SELECT region, COUNT(*) as count,
              json_agg(
                json_build_object(
                  'id', id,
                  'name', name,
                  'description', description,
                  'country', country,
                  'category', category,
                  'type', type,
                  'priority', priority,
                  'riskLevel', risk_level,
                  'status', status
                ) ORDER BY name
              ) as frameworks
       FROM frameworks 
       WHERE is_active = true 
       GROUP BY region 
       ORDER BY region`,
      []
    );
    return result.rows;
  }
}

module.exports = Framework;
