const { pool } = require('../config/database');

const query = (text, params) => pool.query(text, params);

class Organization {
  static async create({ name, industry, country }) {
    const result = await query(
      `INSERT INTO organizations (name, industry, country)
       VALUES ($1, $2, $3)
       RETURNING id, name, industry, country, created_at`,
      [name, industry, country]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query('SELECT * FROM organizations WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findAll() {
    const result = await query('SELECT * FROM organizations ORDER BY created_at DESC');
    return result.rows;
  }

  static async update(id, { name, industry, country }) {
    const result = await query(
      `UPDATE organizations 
       SET name = $1, industry = $2, country = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, name, industry, country, updated_at`,
      [name, industry, country, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM organizations WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = Organization;
