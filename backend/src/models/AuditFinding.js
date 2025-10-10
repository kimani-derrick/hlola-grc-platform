const { pool } = require('../config/database');
const logger = require('../config/logger');

const query = (text, params) => pool.query(text, params);

class AuditFinding {
  static async create({
    auditId,
    controlId,
    findingType,
    severity,
    title,
    description,
    evidence,
    recommendation,
    assignedTo,
    dueDate
  }) {
    try {
      const result = await query(
        `INSERT INTO audit_findings (
          audit_id, control_id, finding_type, severity, title, description,
          evidence, recommendation, assigned_to, due_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          auditId, controlId, findingType, severity, title, description,
          evidence, recommendation, assignedTo, dueDate
        ]
      );

      logger.info('Audit finding created in DB', {
        findingId: result.rows[0].id,
        title: title,
        severity: severity,
        auditId: auditId
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating audit finding in DB', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  static async findById(id) {
    const result = await query(
      `SELECT af.*,
              a.title as audit_title,
              c.title as control_title,
              u.first_name as assignee_first_name,
              u.last_name as assignee_last_name,
              u.email as assignee_email
       FROM audit_findings af
       LEFT JOIN audits a ON af.audit_id = a.id
       LEFT JOIN controls c ON af.control_id = c.id
       LEFT JOIN users u ON af.assigned_to = u.id
       WHERE af.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByAuditId(auditId) {
    const result = await query(
      `SELECT af.*,
              c.title as control_title,
              u.first_name as assignee_first_name,
              u.last_name as assignee_last_name,
              u.email as assignee_email
       FROM audit_findings af
       LEFT JOIN controls c ON af.control_id = c.id
       LEFT JOIN users u ON af.assigned_to = u.id
       WHERE af.audit_id = $1
       ORDER BY af.severity DESC, af.created_at DESC`,
      [auditId]
    );
    return result.rows;
  }

  static async findAll({
    auditId,
    severity,
    status,
    assignedTo,
    findingType,
    limit,
    offset,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  }) {
    let queryText = `
      SELECT af.*,
             a.title as audit_title,
             c.title as control_title,
             u.first_name as assignee_first_name,
             u.last_name as assignee_last_name,
             u.email as assignee_email
      FROM audit_findings af
      LEFT JOIN audits a ON af.audit_id = a.id
      LEFT JOIN controls c ON af.control_id = c.id
      LEFT JOIN users u ON af.assigned_to = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (auditId) {
      queryText += ` AND af.audit_id = $${paramCount++}`;
      params.push(auditId);
    }
    if (severity) {
      queryText += ` AND af.severity = $${paramCount++}`;
      params.push(severity);
    }
    if (status) {
      queryText += ` AND af.status = $${paramCount++}`;
      params.push(status);
    }
    if (assignedTo) {
      queryText += ` AND af.assigned_to = $${paramCount++}`;
      params.push(assignedTo);
    }
    if (findingType) {
      queryText += ` AND af.finding_type = $${paramCount++}`;
      params.push(findingType);
    }

    queryText += ` ORDER BY af.${sortBy} ${sortOrder}`;

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

    if (updates.controlId !== undefined) { updatesList.push(`control_id = $${paramCount++}`); values.push(updates.controlId); }
    if (updates.findingType !== undefined) { updatesList.push(`finding_type = $${paramCount++}`); values.push(updates.findingType); }
    if (updates.severity !== undefined) { updatesList.push(`severity = $${paramCount++}`); values.push(updates.severity); }
    if (updates.title !== undefined) { updatesList.push(`title = $${paramCount++}`); values.push(updates.title); }
    if (updates.description !== undefined) { updatesList.push(`description = $${paramCount++}`); values.push(updates.description); }
    if (updates.evidence !== undefined) { updatesList.push(`evidence = $${paramCount++}`); values.push(updates.evidence); }
    if (updates.recommendation !== undefined) { updatesList.push(`recommendation = $${paramCount++}`); values.push(updates.recommendation); }
    if (updates.assignedTo !== undefined) { updatesList.push(`assigned_to = $${paramCount++}`); values.push(updates.assignedTo); }
    if (updates.dueDate !== undefined) { updatesList.push(`due_date = $${paramCount++}`); values.push(updates.dueDate); }

    if (updatesList.length === 0) {
      return await AuditFinding.findById(id);
    }

    updatesList.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE audit_findings SET ${updatesList.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      `DELETE FROM audit_findings WHERE id = $1 RETURNING id, title`,
      [id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status, resolvedAt = null) {
    const result = await query(
      `UPDATE audit_findings SET status = $1, resolved_at = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [status, resolvedAt, id]
    );
    return result.rows[0];
  }

  static async getFindingsStats(auditId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_findings,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_findings,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_findings,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_findings,
        COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_findings,
        COUNT(CASE WHEN severity = 'info' THEN 1 END) as info_findings,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_findings,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_findings,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_findings,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_findings,
        COUNT(CASE WHEN finding_type = 'non-conformity' THEN 1 END) as non_conformities,
        COUNT(CASE WHEN finding_type = 'observation' THEN 1 END) as observations,
        COUNT(CASE WHEN finding_type = 'opportunity' THEN 1 END) as opportunities
      FROM audit_findings
      WHERE audit_id = $1`,
      [auditId]
    );

    return result.rows[0];
  }

  static async getCriticalFindings(organizationId) {
    const result = await query(
      `SELECT af.*,
              a.title as audit_title,
              e.name as entity_name,
              f.name as framework_name,
              c.title as control_title,
              u.first_name as assignee_first_name,
              u.last_name as assignee_last_name,
              u.email as assignee_email
       FROM audit_findings af
       JOIN audits a ON af.audit_id = a.id
       JOIN entities e ON a.entity_id = e.id
       LEFT JOIN frameworks f ON a.framework_id = f.id
       LEFT JOIN controls c ON af.control_id = c.id
       LEFT JOIN users u ON af.assigned_to = u.id
       WHERE e.organization_id = $1 
       AND af.severity = 'critical'
       AND af.status IN ('open', 'in-progress')
       ORDER BY af.created_at DESC`,
      [organizationId]
    );

    return result.rows;
  }
}

module.exports = AuditFinding;
