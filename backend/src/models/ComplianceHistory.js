const { pool } = require('../config/database');
const logger = require('../config/logger');

const query = (text, params) => pool.query(text, params);

class ComplianceHistory {
  static async create({
    entityId,
    frameworkId,
    complianceScore,
    milestone,
    eventType,
    eventDate,
    description
  }) {
    try {
      const result = await query(
        `INSERT INTO compliance_history (
          entity_id, framework_id, compliance_score, milestone,
          event_type, event_date, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          entityId, frameworkId, complianceScore, milestone,
          eventType, eventDate, description
        ]
      );

      logger.info('Compliance history event created in DB', {
        historyId: result.rows[0].id,
        milestone: milestone,
        eventType: eventType,
        entityId: entityId
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating compliance history event in DB', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  static async findAll({
    organizationId,
    entityId,
    frameworkId,
    eventType,
    startDate,
    endDate,
    limit,
    offset,
    sortBy = 'event_date',
    sortOrder = 'DESC'
  }) {
    let queryText = `
      SELECT ch.*,
             e.name as entity_name,
             f.name as framework_name
      FROM compliance_history ch
      JOIN entities e ON ch.entity_id = e.id
      LEFT JOIN frameworks f ON ch.framework_id = f.id
      WHERE e.organization_id = $1
    `;
    const params = [organizationId];
    let paramCount = 2;

    if (entityId) {
      queryText += ` AND ch.entity_id = $${paramCount++}`;
      params.push(entityId);
    }
    if (frameworkId) {
      queryText += ` AND ch.framework_id = $${paramCount++}`;
      params.push(frameworkId);
    }
    if (eventType) {
      queryText += ` AND ch.event_type = $${paramCount++}`;
      params.push(eventType);
    }
    if (startDate) {
      queryText += ` AND ch.event_date >= $${paramCount++}`;
      params.push(startDate);
    }
    if (endDate) {
      queryText += ` AND ch.event_date <= $${paramCount++}`;
      params.push(endDate);
    }

    queryText += ` ORDER BY ch.${sortBy} ${sortOrder}`;

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

  static async getComplianceTrend(entityId, frameworkId, months = 12) {
    const result = await query(
      `SELECT 
        DATE_TRUNC('month', event_date) as month,
        AVG(compliance_score) as average_score,
        COUNT(*) as event_count,
        MAX(compliance_score) as max_score,
        MIN(compliance_score) as min_score
      FROM compliance_history
      WHERE entity_id = $1
      AND ($2 IS NULL OR framework_id = $2)
      AND event_date >= CURRENT_DATE - INTERVAL '${months} months'
      GROUP BY DATE_TRUNC('month', event_date)
      ORDER BY month ASC`,
      [entityId, frameworkId]
    );

    return result.rows;
  }

  static async recordAuditEvent(auditId, eventType, description) {
    // First get the audit details to extract entity and framework
    const auditResult = await query(
      `SELECT entity_id, framework_id FROM audits WHERE id = $1`,
      [auditId]
    );

    if (auditResult.rows.length === 0) {
      throw new Error('Audit not found');
    }

    const { entity_id, framework_id } = auditResult.rows[0];

    // Record the compliance history event
    return await ComplianceHistory.create({
      entityId: entity_id,
      frameworkId: framework_id,
      complianceScore: 0, // Will be updated based on audit results
      milestone: `Audit Event: ${eventType}`,
      eventType: eventType,
      eventDate: new Date().toISOString().split('T')[0],
      description: description
    });
  }

  static async getLatestComplianceScore(entityId, frameworkId) {
    const result = await query(
      `SELECT compliance_score, event_date, milestone
       FROM compliance_history
       WHERE entity_id = $1
       AND ($2 IS NULL OR framework_id = $2)
       ORDER BY event_date DESC
       LIMIT 1`,
      [entityId, frameworkId]
    );

    return result.rows[0];
  }

  static async getComplianceStats(organizationId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN event_type = 'achievement' THEN 1 END) as achievements,
        COUNT(CASE WHEN event_type = 'audit' THEN 1 END) as audits,
        COUNT(CASE WHEN event_type = 'update' THEN 1 END) as updates,
        COUNT(CASE WHEN event_type = 'gap-closed' THEN 1 END) as gap_closures,
        AVG(compliance_score) as average_score,
        MAX(compliance_score) as max_score,
        MIN(compliance_score) as min_score
      FROM compliance_history ch
      JOIN entities e ON ch.entity_id = e.id
      WHERE e.organization_id = $1`,
      [organizationId]
    );

    return result.rows[0];
  }
}

module.exports = ComplianceHistory;
