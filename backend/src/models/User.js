const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, role, department, job_title, organization_id, entity_id, created_at, updated_at, is_active FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { 
        organization_id, 
        entity_id, 
        email, 
        first_name, 
        last_name, 
        role, 
        password, 
        department, 
        job_title 
      } = userData;

      // Hash password
      const password_hash = await bcrypt.hash(password, 12);

      const result = await pool.query(
        `INSERT INTO users (
          organization_id, entity_id, email, first_name, last_name, 
          role, password_hash, department, job_title
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id, email, first_name, last_name, role, department, job_title, organization_id, entity_id, created_at`,
        [organization_id, entity_id, email, first_name, last_name, role, password_hash, department, job_title]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const { first_name, last_name, role, department, job_title } = userData;
      
      const result = await pool.query(
        `UPDATE users SET 
          first_name = $1, 
          last_name = $2, 
          role = $3, 
          department = $4, 
          job_title = $5, 
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = $6 
        RETURNING id, email, first_name, last_name, role, department, job_title, organization_id, entity_id, updated_at`,
        [first_name, last_name, role, department, job_title, id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, email, first_name, last_name',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getAll(organizationId = null) {
    try {
      let query = `
        SELECT id, email, first_name, last_name, role, department, job_title, 
               organization_id, entity_id, created_at, updated_at, is_active
        FROM users
      `;
      let params = [];

      if (organizationId) {
        query += ' WHERE organization_id = $1';
        params.push(organizationId);
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
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
      let query = 'SELECT id FROM users WHERE email = $1';
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

module.exports = User;

