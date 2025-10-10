const { pool } = require('../config/database');
const logger = require('../config/logger');

const query = (text, params) => pool.query(text, params);

class AuditTimeline {
  static async create({
    entityId,
    frameworkId,
    eventType,
    eventDate,
    eventTitle,
    description,
    status = 'completed',
    relatedDocuments = []
  }) {
    try {
      const result = await query(
        `INSERT INTO audit_timeline (
          entity_id, framework_id, event_type, event_date, event_title,
          description, status, related_documents
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          entityId, frameworkId, eventType, eventDate, eventTitle,
          description, status, relatedDocuments
        ]
      );

      logger.info('Audit timeline event created in DB', {
        timelineId: result.rows[0].id,
        eventTitle: eventTitle,
        eventType: eventType,
        entityId: entityId
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating audit timeline event in DB', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  static async findAll({
    organizationId,
    entityId,
    frameworkId,
    eventType,
    status,
    startDate,
    endDate,
    limit,
    offset,
    sortBy = 'event_date',
    sortOrder = 'DESC'
  }) {
    let queryText = `
      SELECT at.*,
             e.name as entity_name,
             f.name as framework_name
      FROM audit_timeline at
      JOIN entities e ON at.entity_id = e.id
      LEFT JOIN frameworks f ON at.framework_id = f.id
      WHERE e.organization_id = $1
    `;
    const params = [organizationId];
    let paramCount = 2;

    if (entityId) {
      queryText += ` AND at.entity_id = $${paramCount++}`;
      params.push(entityId);
    }
    if (frameworkId) {
      queryText += ` AND at.framework_id = $${paramCount++}`;
      params.push(frameworkId);
    }
    if (eventType) {
      queryText += ` AND at.event_type = $${paramCount++}`;
      params.push(eventType);
    }
    if (status) {
      queryText += ` AND at.status = $${paramCount++}`;
      params.push(status);
    }
    if (startDate) {
      queryText += ` AND at.event_date >= $${paramCount++}`;
      params.push(startDate);
    }
    if (endDate) {
      queryText += ` AND at.event_date <= $${paramCount++}`;
      params.push(endDate);
    }

    queryText += ` ORDER BY at.${sortBy} ${sortOrder}`;

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

    if (updates.eventType !== undefined) { updatesList.push(`event_type = $${paramCount++}`); values.push(updates.eventType); }
    if (updates.eventDate !== undefined) { updatesList.push(`event_date = $${paramCount++}`); values.push(updates.eventDate); }
    if (updates.eventTitle !== undefined) { updatesList.push(`event_title = $${paramCount++}`); values.push(updates.eventTitle); }
    if (updates.description !== undefined) { updatesList.push(`description = $${paramCount++}`); values.push(updates.description); }
    if (updates.status !== undefined) { updatesList.push(`status = $${paramCount++}`); values.push(updates.status); }
    if (updates.relatedDocuments !== undefined) { updatesList.push(`related_documents = $${paramCount++}`); values.push(updates.relatedDocuments); }

    if (updatesList.length === 0) {
      return await AuditTimeline.findById(id);
    }

    updatesList.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE audit_timeline SET ${updatesList.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      `DELETE FROM audit_timeline WHERE id = $1 RETURNING id, event_title`,
      [id]
    );
    return result.rows[0];
  }

  static async getUpcomingEvents(organizationId, daysAhead = 30) {
    const result = await query(
      `SELECT at.*,
              e.name as entity_name,
              f.name as framework_name
       FROM audit_timeline at
       JOIN entities e ON at.entity_id = e.id
       LEFT JOIN frameworks f ON at.framework_id = f.id
       WHERE e.organization_id = $1 
       AND at.event_date <= CURRENT_DATE + INTERVAL '${daysAhead} days'
       AND at.event_date >= CURRENT_DATE
       AND at.status IN ('scheduled', 'in-progress')
       ORDER BY at.event_date ASC`,
      [organizationId]
    );

    return result.rows;
  }

  static async getTimelineStats(organizationId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN event_type = 'audit' THEN 1 END) as audit_events,
        COUNT(CASE WHEN event_type = 'certification' THEN 1 END) as certification_events,
        COUNT(CASE WHEN event_type = 'milestone' THEN 1 END) as milestone_events,
        COUNT(CASE WHEN event_type = 'gap-identified' THEN 1 END) as gap_identified_events,
        COUNT(CASE WHEN event_type = 'gap-resolved' THEN 1 END) as gap_resolved_events,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_events,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_events,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_events
      FROM audit_timeline at
      JOIN entities e ON at.entity_id = e.id
      WHERE e.organization_id = $1`,
      [organizationId]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      `SELECT at.*,
              e.name as entity_name,
              f.name as framework_name
       FROM audit_timeline at
       JOIN entities e ON at.entity_id = e.id
       LEFT JOIN frameworks f ON at.framework_id = f.id
       WHERE at.id = $1`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = AuditTimeline;
