const { pool } = require('../config/database');
const logger = require('../config/logger');

const query = (text, params) => pool.query(text, params);

class Audit {
  static async create({
    entityId,
    frameworkId,
    auditPackageId,
    title,
    description,
    auditType,
    priority,
    auditor,
    startDate,
    endDate,
    progress = 0,
    nextMilestone,
    estimatedCompletion,
    createdBy
  }) {
    try {
      const result = await query(
        `INSERT INTO audits (
          entity_id, framework_id, audit_package_id, title, description,
          audit_type, priority, auditor, start_date, end_date, progress,
          next_milestone, estimated_completion, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          entityId, frameworkId, auditPackageId, title, description,
          auditType, priority, auditor, startDate, endDate, progress,
          nextMilestone, estimatedCompletion, createdBy
        ]
      );

      logger.info('Audit created in DB', {
        auditId: result.rows[0].id,
        title: title,
        auditType: auditType,
        entityId: entityId
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating audit in DB', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  static async findById(id, organizationId) {
    const result = await query(
      `SELECT a.*,
              e.name as entity_name,
              f.name as framework_name,
              u.first_name as creator_first_name,
              u.last_name as creator_last_name,
              u.email as creator_email
       FROM audits a
       JOIN entities e ON a.entity_id = e.id
       LEFT JOIN frameworks f ON a.framework_id = f.id
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.id = $1 AND e.organization_id = $2`,
      [id, organizationId]
    );
    return result.rows[0];
  }

  static async findAll({
    organizationId,
    entityId,
    frameworkId,
    status,
    auditType,
    priority,
    limit,
    offset,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  }) {
    let queryText = `
      SELECT a.*,
             e.name as entity_name,
             f.name as framework_name,
             u.first_name as creator_first_name,
             u.last_name as creator_last_name,
             u.email as creator_email
      FROM audits a
      JOIN entities e ON a.entity_id = e.id
      LEFT JOIN frameworks f ON a.framework_id = f.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE e.organization_id = $1
    `;
    const params = [organizationId];
    let paramCount = 2;

    if (entityId) {
      queryText += ` AND a.entity_id = $${paramCount++}`;
      params.push(entityId);
    }
    if (frameworkId) {
      queryText += ` AND a.framework_id = $${paramCount++}`;
      params.push(frameworkId);
    }
    if (status) {
      queryText += ` AND a.status = $${paramCount++}`;
      params.push(status);
    }
    if (auditType) {
      queryText += ` AND a.audit_type = $${paramCount++}`;
      params.push(auditType);
    }
    if (priority) {
      queryText += ` AND a.priority = $${paramCount++}`;
      params.push(priority);
    }

    queryText += ` ORDER BY a.${sortBy} ${sortOrder}`;

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

  static async countAll({
    organizationId,
    entityId,
    frameworkId,
    status,
    auditType,
    priority
  }) {
    let queryText = `
      SELECT COUNT(*)
      FROM audits a
      JOIN entities e ON a.entity_id = e.id
      WHERE e.organization_id = $1
    `;
    const params = [organizationId];
    let paramCount = 2;

    if (entityId) {
      queryText += ` AND a.entity_id = $${paramCount++}`;
      params.push(entityId);
    }
    if (frameworkId) {
      queryText += ` AND a.framework_id = $${paramCount++}`;
      params.push(frameworkId);
    }
    if (status) {
      queryText += ` AND a.status = $${paramCount++}`;
      params.push(status);
    }
    if (auditType) {
      queryText += ` AND a.audit_type = $${paramCount++}`;
      params.push(auditType);
    }
    if (priority) {
      queryText += ` AND a.priority = $${paramCount++}`;
      params.push(priority);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count, 10);
  }

  static async update(id, updates) {
    const updatesList = [];
    const values = [];
    let paramCount = 1;

    if (updates.title !== undefined) { updatesList.push(`title = $${paramCount++}`); values.push(updates.title); }
    if (updates.description !== undefined) { updatesList.push(`description = $${paramCount++}`); values.push(updates.description); }
    if (updates.auditType !== undefined) { updatesList.push(`audit_type = $${paramCount++}`); values.push(updates.auditType); }
    if (updates.priority !== undefined) { updatesList.push(`priority = $${paramCount++}`); values.push(updates.priority); }
    if (updates.auditor !== undefined) { updatesList.push(`auditor = $${paramCount++}`); values.push(updates.auditor); }
    if (updates.startDate !== undefined) { updatesList.push(`start_date = $${paramCount++}`); values.push(updates.startDate); }
    if (updates.endDate !== undefined) { updatesList.push(`end_date = $${paramCount++}`); values.push(updates.endDate); }
    if (updates.progress !== undefined) { updatesList.push(`progress = $${paramCount++}`); values.push(updates.progress); }
    if (updates.nextMilestone !== undefined) { updatesList.push(`next_milestone = $${paramCount++}`); values.push(updates.nextMilestone); }
    if (updates.estimatedCompletion !== undefined) { updatesList.push(`estimated_completion = $${paramCount++}`); values.push(updates.estimatedCompletion); }

    if (updatesList.length === 0) {
      return await Audit.findById(id);
    }

    updatesList.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE audits SET ${updatesList.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      `DELETE FROM audits WHERE id = $1 RETURNING id, title`,
      [id]
    );
    return result.rows[0];
  }

  static async updateProgress(id, progress, nextMilestone) {
    const result = await query(
      `UPDATE audits SET progress = $1, next_milestone = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [progress, nextMilestone, id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await query(
      `UPDATE audits SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  static async getAuditWithFindings(id, organizationId) {
    const audit = await Audit.findById(id, organizationId);
    if (!audit) return null;

    // Get findings for this audit
    const findingsResult = await query(
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
      [id]
    );

    return {
      ...audit,
      findings: findingsResult.rows
    };
  }

  static async getAuditStats(organizationId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_audits,
        COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning_audits,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_audits,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_audits,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_audits,
        COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical_audits,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_audits,
        AVG(progress) as average_progress
      FROM audits a
      JOIN entities e ON a.entity_id = e.id
      WHERE e.organization_id = $1`,
      [organizationId]
    );

    return result.rows[0];
  }

  static async getUpcomingAudits(organizationId, daysAhead = 30) {
    const result = await query(
      `SELECT a.*,
              e.name as entity_name,
              f.name as framework_name
       FROM audits a
       JOIN entities e ON a.entity_id = e.id
       LEFT JOIN frameworks f ON a.framework_id = f.id
       WHERE e.organization_id = $1 
       AND a.start_date <= CURRENT_DATE + INTERVAL '${daysAhead} days'
       AND a.start_date >= CURRENT_DATE
       AND a.status IN ('planning', 'in-progress')
       ORDER BY a.start_date ASC`,
      [organizationId]
    );

    return result.rows;
  }

  static async getOverdueAudits(organizationId) {
    const result = await query(
      `SELECT a.*,
              e.name as entity_name,
              f.name as framework_name
       FROM audits a
       JOIN entities e ON a.entity_id = e.id
       LEFT JOIN frameworks f ON a.framework_id = f.id
       WHERE e.organization_id = $1 
       AND a.end_date < CURRENT_DATE
       AND a.status IN ('planning', 'in-progress')
       ORDER BY a.end_date ASC`,
      [organizationId]
    );

    return result.rows;
  }
}

module.exports = Audit;
