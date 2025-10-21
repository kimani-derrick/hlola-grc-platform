const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class PlatformAdmin {
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM platform_admins WHERE email = $1 AND is_active = true',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error finding platform admin by email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, created_at, updated_at, is_active FROM platform_admins WHERE id = $1 AND is_active = true',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error finding platform admin by ID:', error);
      throw error;
    }
  }

  static async create(adminData) {
    try {
      const { 
        email, 
        first_name, 
        last_name, 
        password 
      } = adminData;

      // Hash password
      const password_hash = await bcrypt.hash(password, 12);

      const result = await pool.query(
        `INSERT INTO platform_admins (
          email, first_name, last_name, password_hash
        ) VALUES ($1, $2, $3, $4) 
        RETURNING id, email, first_name, last_name, created_at`,
        [email, first_name, last_name, password_hash]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating platform admin:', error);
      throw error;
    }
  }

  static async update(id, adminData) {
    try {
      const { first_name, last_name, email } = adminData;
      
      const result = await pool.query(
        `UPDATE platform_admins SET 
          first_name = $1, 
          last_name = $2, 
          email = $3,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = $4 AND is_active = true
        RETURNING id, email, first_name, last_name, updated_at`,
        [first_name, last_name, email, id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating platform admin:', error);
      throw error;
    }
  }

  static async updatePassword(id, newPassword) {
    try {
      const password_hash = await bcrypt.hash(newPassword, 12);
      
      const result = await pool.query(
        `UPDATE platform_admins SET 
          password_hash = $1,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 AND is_active = true
        RETURNING id, email`,
        [password_hash, id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating platform admin password:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete by setting is_active to false
      const result = await pool.query(
        'UPDATE platform_admins SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, email, first_name, last_name',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting platform admin:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(
        `SELECT id, email, first_name, last_name, created_at, updated_at, is_active
         FROM platform_admins 
         ORDER BY created_at DESC`
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting all platform admins:', error);
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  static async checkEmailExists(email, excludeId = null) {
    try {
      let query = 'SELECT id FROM platform_admins WHERE email = $1';
      let params = [email];

      if (excludeId) {
        query += ' AND id != $2';
        params.push(excludeId);
      }

      const result = await pool.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking email exists:', error);
      throw error;
    }
  }
}

module.exports = PlatformAdmin;
