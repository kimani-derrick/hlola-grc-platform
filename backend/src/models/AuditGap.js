const { pool } = require('../config/database');
const logger = require('../config/logger');

const query = (text, params) => pool.query(text, params);

class AuditGap {
  static async create({
    entityId,
    frameworkId,
    controlId,
    title,
    description,
    category,
    severity,
    impactDescription,
    remediationPlan,
    estimatedEffort,
    assignedTo,
    assignedTeam,
    dueDate
  }) {
    try {
      const result = await query(
        `INSERT INTO audit_gaps (
          entity_id, framework_id, control_id, title, description, category,
          severity, impact_description, remediation_plan, estimated_effort,
          assigned_to, assigned_team, due_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          entityId, frameworkId, controlId, title, description, category,
          severity, impactDescription, remediationPlan, estimatedEffort,
          assignedTo, assignedTeam, dueDate
        ]
      );

      logger.info('Audit gap created in DB', {
        gapId: result.rows[0].id,
        title: title,
        severity: severity,
        entityId: entityId
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating audit gap in DB', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  static async findById(id, organizationId) {
    const result = await query(
      `SELECT ag.*,
              e.name as entity_name,
              f.name as framework_name,
              c.title as control_title,
              u.first_name as assignee_first_name,
              u.last_name as assignee_last_name,
              u.email as assignee_email
       FROM audit_gaps ag
       JOIN entities e ON ag.entity_id = e.id
       LEFT JOIN frameworks f ON ag.framework_id = f.id
       LEFT JOIN controls c ON ag.control_id = c.id
       LEFT JOIN users u ON ag.assigned_to = u.id
       WHERE ag.id = $1 AND e.organization_id = $2`,
      [id, organizationId]
    );
    return result.rows[0];
  }

  static async findAll({
    organizationId,
    entityId,
    frameworkId,
    category,
    severity,
    status,
    assignedTo,
    limit,
    offset,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  }) {
    let queryText = `
      SELECT ag.*,
             e.name as entity_name,
             f.name as framework_name,
             c.title as control_title,
             u.first_name as assignee_first_name,
             u.last_name as assignee_last_name,
             u.email as assignee_email
      FROM audit_gaps ag
      JOIN entities e ON ag.entity_id = e.id
      LEFT JOIN frameworks f ON ag.framework_id = f.id
      LEFT JOIN controls c ON ag.control_id = c.id
      LEFT JOIN users u ON ag.assigned_to = u.id
      WHERE e.organization_id = $1
    `;
    const params = [organizationId];
    let paramCount = 2;

    if (entityId) {
      queryText += ` AND ag.entity_id = $${paramCount++}`;
      params.push(entityId);
    }
    if (frameworkId) {
      queryText += ` AND ag.framework_id = $${paramCount++}`;
      params.push(frameworkId);
    }
    if (category) {
      queryText += ` AND ag.category = $${paramCount++}`;
      params.push(category);
    }
    if (severity) {
      queryText += ` AND ag.severity = $${paramCount++}`;
      params.push(severity);
    }
    if (status) {
      queryText += ` AND ag.status = $${paramCount++}`;
      params.push(status);
    }
    if (assignedTo) {
      queryText += ` AND ag.assigned_to = $${paramCount++}`;
      params.push(assignedTo);
    }

    queryText += ` ORDER BY ag.${sortBy} ${sortOrder}`;

    if (limit) {
      queryText += ` LIMIT $${paramCount++}`;
      params.push(limit);
    }
    if (offset) {
      queryText += ` OFFSET $${paramCount++}`;
      params.push(offset);
    }

    const result = await query(queryText, params);
    return result.rows;
  }

  static async update(id, updates) {
    const updatesList = [];
    const values = [];
    let paramCount = 1;

    if (updates.title !== undefined) { updatesList.push(`title = $${paramCount++}`); values.push(updates.title); }
    if (updates.description !== undefined) { updatesList.push(`description = $${paramCount++}`); values.push(updates.description); }
    if (updates.category !== undefined) { updatesList.push(`category = $${paramCount++}`); values.push(updates.category); }
    if (updates.severity !== undefined) { updatesList.push(`severity = $${paramCount++}`); values.push(updates.severity); }
    if (updates.impactDescription !== undefined) { updatesList.push(`impact_description = $${paramCount++}`); values.push(updates.impactDescription); }
    if (updates.remediationPlan !== undefined) { updatesList.push(`remediation_plan = $${paramCount++}`); values.push(updates.remediationPlan); }
    if (updates.estimatedEffort !== undefined) { updatesList.push(`estimated_effort = $${paramCount++}`); values.push(updates.estimatedEffort); }
    if (updates.assignedTo !== undefined) { updatesList.push(`assigned_to = $${paramCount++}`); values.push(updates.assignedTo); }
    if (updates.assignedTeam !== undefined) { updatesList.push(`assigned_team = $${paramCount++}`); values.push(updates.assignedTeam); }
    if (updates.dueDate !== undefined) { updatesList.push(`due_date = $${paramCount++}`); values.push(updates.dueDate); }

    if (updatesList.length === 0) {
      return await AuditGap.findById(id);
    }

    updatesList.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE audit_gaps SET ${updatesList.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      `DELETE FROM audit_gaps WHERE id = $1 RETURNING id, title`,
      [id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status, resolvedAt = null) {
    const result = await query(
      `UPDATE audit_gaps SET status = $1, resolved_at = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [status, resolvedAt, id]
    );
    return result.rows[0];
  }

  static async getGapStats(entityId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_gaps,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_gaps,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_gaps,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_gaps,
        COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_gaps,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_gaps,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_gaps,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_gaps,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_gaps,
        COUNT(CASE WHEN category = 'documentation' THEN 1 END) as documentation_gaps,
        COUNT(CASE WHEN category = 'technical' THEN 1 END) as technical_gaps,
        COUNT(CASE WHEN category = 'procedural' THEN 1 END) as procedural_gaps,
        COUNT(CASE WHEN category = 'evidence' THEN 1 END) as evidence_gaps
      FROM audit_gaps
      WHERE entity_id = $1`,
      [entityId]
    );

    return result.rows[0];
  }

  static async getOverdueGaps(organizationId) {
    const result = await query(
      `SELECT ag.*,
              e.name as entity_name,
              f.name as framework_name,
              c.title as control_title,
              u.first_name as assignee_first_name,
              u.last_name as assignee_last_name,
              u.email as assignee_email
       FROM audit_gaps ag
       JOIN entities e ON ag.entity_id = e.id
       LEFT JOIN frameworks f ON ag.framework_id = f.id
       LEFT JOIN controls c ON ag.control_id = c.id
       LEFT JOIN users u ON ag.assigned_to = u.id
       WHERE e.organization_id = $1 
       AND ag.due_date < CURRENT_DATE
       AND ag.status IN ('open', 'in-progress')
       ORDER BY ag.due_date ASC`,
      [organizationId]
    );

    return result.rows;
  }
}

module.exports = AuditGap;
