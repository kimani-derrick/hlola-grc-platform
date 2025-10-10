const { pool } = require('../config/database');

const query = (text, params) => pool.query(text, params);

class ControlAssignment {
  static async assignToEntity({ entityId, controlId, assignedTo, assignedTeam, priority, dueDate }) {
    const result = await query(
      `INSERT INTO control_assignments (entity_id, control_id, assigned_to, assigned_team, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (entity_id, control_id) DO UPDATE SET
         assigned_to = EXCLUDED.assigned_to,
         assigned_team = EXCLUDED.assigned_team,
         priority = EXCLUDED.priority,
         due_date = EXCLUDED.due_date,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [entityId, controlId, assignedTo, assignedTeam, priority, dueDate]
    );
    return result.rows[0];
  }

  static async findByEntityId(entityId, organizationId) {
    const result = await query(
      `SELECT ca.*, c.title as control_title, c.description as control_description, c.category as control_category, 
              c.priority as control_priority, c.implementation_level, c.evidence_requirements,
              f.name as framework_name, f.region, f.country, f.category as framework_category,
              u.first_name, u.last_name, u.email as assigned_user_email
       FROM control_assignments ca
       JOIN controls c ON ca.control_id = c.id
       JOIN frameworks f ON c.framework_id = f.id
       JOIN entities e ON ca.entity_id = e.id
       LEFT JOIN users u ON ca.assigned_to = u.id
       WHERE ca.entity_id = $1 AND e.organization_id = $2
       ORDER BY ca.created_at DESC`,
      [entityId, organizationId]
    );
    return result.rows;
  }

  static async findByControlId(controlId, organizationId) {
    const result = await query(
      `SELECT ca.*, e.name as entity_name, e.description as entity_description, e.entity_type,
              c.title as control_title, c.category as control_category,
              f.name as framework_name,
              u.first_name, u.last_name, u.email as assigned_user_email
       FROM control_assignments ca
       JOIN entities e ON ca.entity_id = e.id
       JOIN controls c ON ca.control_id = c.id
       JOIN frameworks f ON c.framework_id = f.id
       LEFT JOIN users u ON ca.assigned_to = u.id
       WHERE ca.control_id = $1 AND e.organization_id = $2
       ORDER BY ca.created_at DESC`,
      [controlId, organizationId]
    );
    return result.rows;
  }

  static async findByEntityAndControl(entityId, controlId) {
    const result = await query(
      `SELECT ca.*, c.title as control_title, c.description as control_description,
              e.name as entity_name, f.name as framework_name
       FROM control_assignments ca
       JOIN controls c ON ca.control_id = c.id
       JOIN entities e ON ca.entity_id = e.id
       JOIN frameworks f ON c.framework_id = f.id
       WHERE ca.entity_id = $1 AND ca.control_id = $2`,
      [entityId, controlId]
    );
    return result.rows[0];
  }

  static async updateStatus(entityId, controlId, { status, completionRate, reviewNotes }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
      
      // Set started_at if status is changing to in-progress
      if (status === 'in-progress') {
        updates.push(`started_at = CASE WHEN started_at IS NULL THEN CURRENT_TIMESTAMP ELSE started_at END`);
      }
      
      // Set completed_at if status is changing to completed
      if (status === 'completed') {
        updates.push(`completed_at = CURRENT_TIMESTAMP`);
      }
    }
    if (completionRate !== undefined) {
      updates.push(`completion_rate = $${paramCount++}`);
      values.push(completionRate);
    }
    if (reviewNotes !== undefined) {
      updates.push(`review_notes = $${paramCount++}`);
      values.push(reviewNotes);
    }

    if (updates.length === 0) {
      return await ControlAssignment.findByEntityAndControl(entityId, controlId);
    }

    updates.push(`last_reviewed_at = CURRENT_TIMESTAMP`);
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(entityId, controlId);

    const result = await query(
      `UPDATE control_assignments 
       SET ${updates.join(', ')}
       WHERE entity_id = $${paramCount} AND control_id = $${paramCount + 1}
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async removeFromEntity(entityId, controlId) {
    const result = await query(
      `DELETE FROM control_assignments 
       WHERE entity_id = $1 AND control_id = $2
       RETURNING id`,
      [entityId, controlId]
    );
    return result.rows[0];
  }

  static async getImplementationStats(entityId, organizationId) {
    const result = await query(
      `SELECT
         COUNT(ca.id) AS total_controls_assigned,
         SUM(CASE WHEN ca.status = 'completed' THEN 1 ELSE 0 END) AS controls_completed,
         SUM(CASE WHEN ca.status = 'in-progress' THEN 1 ELSE 0 END) AS controls_in_progress,
         SUM(CASE WHEN ca.status = 'not-started' THEN 1 ELSE 0 END) AS controls_not_started,
         SUM(CASE WHEN ca.status = 'needs-review' THEN 1 ELSE 0 END) AS controls_needs_review,
         AVG(ca.completion_rate) AS average_completion_rate,
         SUM(CASE WHEN ca.due_date < CURRENT_DATE AND ca.status != 'completed' THEN 1 ELSE 0 END) AS overdue_controls,
         SUM(CASE WHEN ca.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' AND ca.status != 'completed' THEN 1 ELSE 0 END) AS due_this_week
       FROM control_assignments ca
       JOIN entities e ON ca.entity_id = e.id
       WHERE ca.entity_id = $1 AND e.organization_id = $2`,
      [entityId, organizationId]
    );
    return result.rows[0];
  }

  static async getControlsByStatus(entityId, organizationId, status) {
    const result = await query(
      `SELECT ca.*, c.title as control_title, c.description as control_description, c.category as control_category,
              c.priority as control_priority, c.implementation_level, c.evidence_requirements,
              f.name as framework_name, f.region, f.country,
              u.first_name, u.last_name, u.email as assigned_user_email
       FROM control_assignments ca
       JOIN controls c ON ca.control_id = c.id
       JOIN frameworks f ON c.framework_id = f.id
       JOIN entities e ON ca.entity_id = e.id
       LEFT JOIN users u ON ca.assigned_to = u.id
       WHERE ca.entity_id = $1 AND e.organization_id = $2 AND ca.status = $3
       ORDER BY ca.due_date ASC, ca.priority DESC`,
      [entityId, organizationId, status]
    );
    return result.rows;
  }

  static async getOverdueControls(entityId, organizationId) {
    const result = await query(
      `SELECT ca.*, c.title as control_title, c.description as control_description, c.category as control_category,
              c.priority as control_priority, c.implementation_level,
              f.name as framework_name, f.region, f.country,
              u.first_name, u.last_name, u.email as assigned_user_email,
              ca.due_date - CURRENT_DATE as days_overdue
       FROM control_assignments ca
       JOIN controls c ON ca.control_id = c.id
       JOIN frameworks f ON c.framework_id = f.id
       JOIN entities e ON ca.entity_id = e.id
       LEFT JOIN users u ON ca.assigned_to = u.id
       WHERE ca.entity_id = $1 AND e.organization_id = $2 
         AND ca.due_date < CURRENT_DATE AND ca.status != 'completed'
       ORDER BY ca.due_date ASC`,
      [entityId, organizationId]
    );
    return result.rows;
  }

  static async getUpcomingControls(entityId, organizationId, days = 7) {
    const result = await query(
      `SELECT ca.*, c.title as control_title, c.description as control_description, c.category as control_category,
              c.priority as control_priority, c.implementation_level,
              f.name as framework_name, f.region, f.country,
              u.first_name, u.last_name, u.email as assigned_user_email,
              ca.due_date - CURRENT_DATE as days_until_due
       FROM control_assignments ca
       JOIN controls c ON ca.control_id = c.id
       JOIN frameworks f ON c.framework_id = f.id
       JOIN entities e ON ca.entity_id = e.id
       LEFT JOIN users u ON ca.assigned_to = u.id
       WHERE ca.entity_id = $1 AND e.organization_id = $2 
         AND ca.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
         AND ca.status != 'completed'
       ORDER BY ca.due_date ASC`,
      [entityId, organizationId]
    );
    return result.rows;
  }

  static async getControlsByPriority(entityId, organizationId, priority) {
    const result = await query(
      `SELECT ca.*, c.title as control_title, c.description as control_description, c.category as control_category,
              c.priority as control_priority, c.implementation_level,
              f.name as framework_name, f.region, f.country,
              u.first_name, u.last_name, u.email as assigned_user_email
       FROM control_assignments ca
       JOIN controls c ON ca.control_id = c.id
       JOIN frameworks f ON c.framework_id = f.id
       JOIN entities e ON ca.entity_id = e.id
       LEFT JOIN users u ON ca.assigned_to = u.id
       WHERE ca.entity_id = $1 AND e.organization_id = $2 AND ca.priority = $3
       ORDER BY ca.due_date ASC`,
      [entityId, organizationId, priority]
    );
    return result.rows;
  }
}

module.exports = ControlAssignment;
