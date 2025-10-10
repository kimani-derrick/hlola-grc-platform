const { pool } = require('../config/database');
const logger = require('../config/logger');

class ReportAggregator {
  /**
   * Get organization-wide compliance statistics
   */
  static async aggregateOrganizationStats(organizationId, filters = {}) {
    try {
      const { dateRange, entityId, frameworkId } = filters;
      
      let whereClause = 'WHERE e.organization_id = $1';
      const params = [organizationId];
      let paramCount = 1;

      if (entityId) {
        paramCount++;
        whereClause += ` AND e.id = $${paramCount}`;
        params.push(entityId);
      }

      if (frameworkId) {
        paramCount++;
        whereClause += ` AND f.id = $${paramCount}`;
        params.push(frameworkId);
      }

      if (dateRange && dateRange.start && dateRange.end) {
        paramCount++;
        whereClause += ` AND ef.created_at >= $${paramCount}`;
        params.push(dateRange.start);
        paramCount++;
        whereClause += ` AND ef.created_at <= $${paramCount}`;
        params.push(dateRange.end);
      }

      const query = `
        SELECT 
          COUNT(DISTINCT e.id) as total_entities,
          COUNT(DISTINCT f.id) as total_frameworks,
          COUNT(DISTINCT c.id) as total_controls,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') as pending_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'in-progress') as in_progress_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'overdue') as overdue_tasks,
          COUNT(DISTINCT d.id) as total_evidence,
          COUNT(DISTINCT ag.id) as total_gaps,
          COUNT(DISTINCT ag.id) FILTER (WHERE ag.status = 'open') as open_gaps,
          AVG(ch.compliance_score) as avg_compliance_score
        FROM entities e
        LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id
        LEFT JOIN frameworks f ON ef.framework_id = f.id
        LEFT JOIN controls c ON f.id = c.framework_id
        LEFT JOIN control_assignments ca ON c.id = ca.control_id
        LEFT JOIN tasks t ON c.id = t.control_id 
          AND t.created_at >= e.created_at
          AND EXISTS (
            SELECT 1 FROM control_assignments ca2 
            JOIN entities e2 ON ca2.entity_id = e2.id 
            WHERE ca2.control_id = t.control_id 
            AND e2.organization_id = e.organization_id
            AND ca2.entity_id = e.id
          )
        LEFT JOIN documents d ON c.id = d.control_id
        LEFT JOIN audit_gaps ag ON e.id = ag.entity_id
        LEFT JOIN compliance_history ch ON e.id = ch.entity_id
        ${whereClause}
      `;

      const result = await pool.query(query, params);
      const stats = result.rows[0];

      return {
        totalEntities: parseInt(stats.total_entities) || 0,
        totalFrameworks: parseInt(stats.total_frameworks) || 0,
        totalControls: parseInt(stats.total_controls) || 0,
        totalTasks: parseInt(stats.total_tasks) || 0,
        completedTasks: parseInt(stats.completed_tasks) || 0,
        pendingTasks: parseInt(stats.pending_tasks) || 0,
        inProgressTasks: parseInt(stats.in_progress_tasks) || 0,
        overdueTasks: parseInt(stats.overdue_tasks) || 0,
        totalEvidence: parseInt(stats.total_evidence) || 0,
        totalGaps: parseInt(stats.total_gaps) || 0,
        openGaps: parseInt(stats.open_gaps) || 0,
        avgComplianceScore: parseFloat(stats.avg_compliance_score) || 0,
        taskCompletionRate: stats.total_tasks > 0 
          ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) 
          : 0
      };
    } catch (error) {
      logger.error('Error aggregating organization stats', {
        error: error.message,
        organizationId,
        filters
      });
      throw error;
    }
  }

  /**
   * Get framework progress across organization
   */
  static async aggregateFrameworkProgress(organizationId, filters = {}) {
    try {
      const { frameworkId, region, priority, riskLevel, dateRange } = filters;
      
      let whereClause = 'WHERE e.organization_id = $1';
      const params = [organizationId];
      let paramCount = 1;

      if (frameworkId) {
        paramCount++;
        whereClause += ` AND f.id = $${paramCount}`;
        params.push(frameworkId);
      }

      if (region) {
        paramCount++;
        whereClause += ` AND f.region = $${paramCount}`;
        params.push(region);
      }

      if (priority) {
        paramCount++;
        whereClause += ` AND f.priority = $${paramCount}`;
        params.push(priority);
      }

      if (riskLevel) {
        paramCount++;
        whereClause += ` AND f.risk_level = $${paramCount}`;
        params.push(riskLevel);
      }

      if (dateRange && dateRange.start && dateRange.end) {
        paramCount++;
        whereClause += ` AND ef.created_at >= $${paramCount}`;
        params.push(dateRange.start);
        paramCount++;
        whereClause += ` AND ef.created_at <= $${paramCount}`;
        params.push(dateRange.end);
      }

      const query = `
        SELECT 
          f.id,
          f.name,
          f.description,
          f.region,
          f.country,
          f.category,
          f.type,
          f.priority,
          f.risk_level,
          f.compliance_deadline,
          COUNT(DISTINCT e.id) as assigned_entities,
          COUNT(DISTINCT c.id) as total_controls,
          COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'completed') as completed_controls,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') as pending_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'in-progress') as in_progress_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'overdue') as overdue_tasks,
          COUNT(DISTINCT d.id) as total_evidence,
          COUNT(DISTINCT ag.id) as total_gaps,
          COUNT(DISTINCT ag.id) FILTER (WHERE ag.status = 'open') as open_gaps,
          AVG(ch.compliance_score) as avg_compliance_score,
          MAX(ch.created_at) as last_compliance_check
        FROM frameworks f
        LEFT JOIN entity_frameworks ef ON f.id = ef.framework_id
        LEFT JOIN entities e ON ef.entity_id = e.id
        LEFT JOIN controls c ON f.id = c.framework_id
        LEFT JOIN control_assignments ca ON c.id = ca.control_id
        LEFT JOIN tasks t ON c.id = t.control_id 
          AND t.created_at >= e.created_at
          AND EXISTS (
            SELECT 1 FROM control_assignments ca2 
            JOIN entities e2 ON ca2.entity_id = e2.id 
            WHERE ca2.control_id = t.control_id 
            AND e2.organization_id = e.organization_id
            AND ca2.entity_id = e.id
          )
        LEFT JOIN documents d ON c.id = d.control_id
        LEFT JOIN audit_gaps ag ON e.id = ag.entity_id AND f.id = ag.framework_id
        LEFT JOIN compliance_history ch ON e.id = ch.entity_id AND f.id = ch.framework_id
        ${whereClause}
        GROUP BY f.id, f.name, f.description, f.region, f.country, f.category, f.type, f.priority, f.risk_level, f.compliance_deadline
        ORDER BY f.name
      `;

      const result = await pool.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        region: row.region,
        country: row.country,
        category: row.category,
        type: row.type,
        priority: row.priority,
        riskLevel: row.risk_level,
        complianceDeadline: row.compliance_deadline,
        assignedEntities: parseInt(row.assigned_entities) || 0,
        totalControls: parseInt(row.total_controls) || 0,
        completedControls: parseInt(row.completed_controls) || 0,
        totalTasks: parseInt(row.total_tasks) || 0,
        completedTasks: parseInt(row.completed_tasks) || 0,
        pendingTasks: parseInt(row.pending_tasks) || 0,
        inProgressTasks: parseInt(row.in_progress_tasks) || 0,
        overdueTasks: parseInt(row.overdue_tasks) || 0,
        totalEvidence: parseInt(row.total_evidence) || 0,
        totalGaps: parseInt(row.total_gaps) || 0,
        openGaps: parseInt(row.open_gaps) || 0,
        avgComplianceScore: parseFloat(row.avg_compliance_score) || 0,
        lastComplianceCheck: row.last_compliance_check,
        controlCompletionRate: row.total_controls > 0 
          ? Math.round((row.completed_controls / row.total_controls) * 100) 
          : 0,
        taskCompletionRate: row.total_tasks > 0 
          ? Math.round((row.completed_tasks / row.total_tasks) * 100) 
          : 0
      }));
    } catch (error) {
      logger.error('Error aggregating framework progress', {
        error: error.message,
        organizationId,
        filters
      });
      throw error;
    }
  }

  /**
   * Get control implementation status across organization
   */
  static async aggregateControlProgress(organizationId, filters = {}) {
    try {
      const { frameworkId, status, priority, category, assignee } = filters;
      
      let whereClause = 'WHERE e.organization_id = $1';
      const params = [organizationId];
      let paramCount = 1;

      if (frameworkId) {
        paramCount++;
        whereClause += ` AND f.id = $${paramCount}`;
        params.push(frameworkId);
      }

      if (status) {
        paramCount++;
        whereClause += ` AND ca.status = $${paramCount}`;
        params.push(status);
      }

      if (priority) {
        paramCount++;
        whereClause += ` AND c.priority = $${paramCount}`;
        params.push(priority);
      }

      if (category) {
        paramCount++;
        whereClause += ` AND c.category = $${paramCount}`;
        params.push(category);
      }

      if (assignee) {
        paramCount++;
        whereClause += ` AND ca.assignee_id = $${paramCount}`;
        params.push(assignee);
      }

      const query = `
        SELECT 
          c.id,
          c.control_id,
          c.title,
          c.description,
          c.category,
          c.priority,
          f.name as framework_name,
          f.region as framework_region,
          COUNT(DISTINCT e.id) as assigned_entities,
          COUNT(DISTINCT ca.id) as total_assignments,
          COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'completed') as completed_assignments,
          COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'in-progress') as in_progress_assignments,
          COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'not-started') as not_started_assignments,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
          COUNT(DISTINCT d.id) as total_evidence,
          COUNT(DISTINCT ag.id) as total_gaps,
          COUNT(DISTINCT ag.id) FILTER (WHERE ag.status = 'open') as open_gaps,
          AVG(ca.completion_rate) as avg_completion_rate
        FROM controls c
        JOIN frameworks f ON c.framework_id = f.id
        LEFT JOIN control_assignments ca ON c.id = ca.control_id
        LEFT JOIN entities e ON ca.entity_id = e.id
        LEFT JOIN tasks t ON c.id = t.control_id 
          AND t.created_at >= e.created_at
          AND EXISTS (
            SELECT 1 FROM control_assignments ca2 
            JOIN entities e2 ON ca2.entity_id = e2.id 
            WHERE ca2.control_id = t.control_id 
            AND e2.organization_id = e.organization_id
            AND ca2.entity_id = e.id
          )
        LEFT JOIN documents d ON c.id = d.control_id
        LEFT JOIN audit_gaps ag ON e.id = ag.entity_id AND c.id = ag.control_id
        ${whereClause}
        GROUP BY c.id, c.control_id, c.title, c.description, c.category, c.priority, f.name, f.region
        ORDER BY f.name, c.control_id
      `;

      const result = await pool.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        controlId: row.control_id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority,
        frameworkName: row.framework_name,
        frameworkRegion: row.framework_region,
        assignedEntities: parseInt(row.assigned_entities) || 0,
        totalAssignments: parseInt(row.total_assignments) || 0,
        completedAssignments: parseInt(row.completed_assignments) || 0,
        inProgressAssignments: parseInt(row.in_progress_assignments) || 0,
        notStartedAssignments: parseInt(row.not_started_assignments) || 0,
        totalTasks: parseInt(row.total_tasks) || 0,
        completedTasks: parseInt(row.completed_tasks) || 0,
        totalEvidence: parseInt(row.total_evidence) || 0,
        totalGaps: parseInt(row.total_gaps) || 0,
        openGaps: parseInt(row.open_gaps) || 0,
        avgCompletionRate: parseFloat(row.avg_completion_rate) || 0,
        assignmentCompletionRate: row.total_assignments > 0 
          ? Math.round((row.completed_assignments / row.total_assignments) * 100) 
          : 0,
        taskCompletionRate: row.total_tasks > 0 
          ? Math.round((row.completed_tasks / row.total_tasks) * 100) 
          : 0
      }));
    } catch (error) {
      logger.error('Error aggregating control progress', {
        error: error.message,
        organizationId,
        filters
      });
      throw error;
    }
  }

  /**
   * Get task completion analytics
   */
  static async aggregateTaskProgress(organizationId, filters = {}) {
    try {
      const { frameworkId, controlId, status, priority, assignee, dateRange } = filters;
      
      let whereClause = '';
      const params = [organizationId];
      let paramCount = 1;

      if (frameworkId) {
        paramCount++;
        whereClause += ` AND f.id = $${paramCount}`;
        params.push(frameworkId);
      }

      if (controlId) {
        paramCount++;
        whereClause += ` AND c.id = $${paramCount}`;
        params.push(controlId);
      }

      if (status) {
        paramCount++;
        whereClause += ` AND t.status = $${paramCount}`;
        params.push(status);
      }

      if (priority) {
        paramCount++;
        whereClause += ` AND t.priority = $${paramCount}`;
        params.push(priority);
      }

      if (assignee) {
        paramCount++;
        whereClause += ` AND t.assignee_id = $${paramCount}`;
        params.push(assignee);
      }

      if (dateRange && dateRange.start && dateRange.end) {
        paramCount++;
        whereClause += ` AND t.created_at >= $${paramCount}`;
        params.push(dateRange.start);
        paramCount++;
        whereClause += ` AND t.created_at <= $${paramCount}`;
        params.push(dateRange.end);
      }

      // Add WHERE clause prefix if we have additional filters
      if (whereClause) {
        whereClause = ' AND' + whereClause.substring(3); // Remove the first " AND"
      }

      const query = `
        SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.category,
          t.estimated_hours,
          t.due_date,
          t.created_at,
          t.updated_at,
          c.title as control_title,
          c.control_id,
          f.name as framework_name,
          e.name as entity_name,
          u.first_name as assignee_first_name,
          u.last_name as assignee_last_name,
          COUNT(DISTINCT d.id) as evidence_count,
          CASE 
            WHEN t.due_date < NOW() AND t.status != 'completed' THEN true
            ELSE false
          END as is_overdue
        FROM tasks t
        JOIN controls c ON t.control_id = c.id
        JOIN frameworks f ON c.framework_id = f.id
        JOIN control_assignments ca ON c.id = ca.control_id
        JOIN entities e ON ca.entity_id = e.id
        LEFT JOIN users u ON t.assignee_id = u.id
        LEFT JOIN documents d ON c.id = d.control_id
        WHERE e.organization_id = $1
        AND t.created_at >= e.created_at
        ${whereClause}
        GROUP BY t.id, t.title, t.description, t.status, t.priority, t.category, t.estimated_hours, t.due_date, t.created_at, t.updated_at, c.title, c.control_id, f.name, e.name, u.first_name, u.last_name
        ORDER BY t.due_date ASC, t.priority DESC
      `;

      const result = await pool.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        category: row.category,
        estimatedHours: row.estimated_hours,
        dueDate: row.due_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        controlTitle: row.control_title,
        controlId: row.control_id,
        frameworkName: row.framework_name,
        entityName: row.entity_name,
        assigneeName: row.assignee_first_name && row.assignee_last_name 
          ? `${row.assignee_first_name} ${row.assignee_last_name}` 
          : null,
        evidenceCount: parseInt(row.evidence_count) || 0,
        isOverdue: row.is_overdue
      }));
    } catch (error) {
      logger.error('Error aggregating task progress', {
        error: error.message,
        organizationId,
        filters
      });
      throw error;
    }
  }

  /**
   * Generate compliance trends from compliance_history
   */
  static async generateComplianceTrends(organizationId, filters = {}) {
    try {
      const { dateRange, entityId, frameworkId, granularity = 'daily' } = filters;
      
      let whereClause = 'WHERE e.organization_id = $1';
      const params = [organizationId];
      let paramCount = 1;

      if (entityId) {
        paramCount++;
        whereClause += ` AND ch.entity_id = $${paramCount}`;
        params.push(entityId);
      }

      if (frameworkId) {
        paramCount++;
        whereClause += ` AND ch.framework_id = $${paramCount}`;
        params.push(frameworkId);
      }

      if (dateRange && dateRange.start && dateRange.end) {
        paramCount++;
        whereClause += ` AND ch.created_at >= $${paramCount}`;
        params.push(dateRange.start);
        paramCount++;
        whereClause += ` AND ch.created_at <= $${paramCount}`;
        params.push(dateRange.end);
      }

      let dateGrouping;
      switch (granularity) {
        case 'hourly':
          dateGrouping = "DATE_TRUNC('hour', ch.created_at)";
          break;
        case 'daily':
          dateGrouping = "DATE_TRUNC('day', ch.created_at)";
          break;
        case 'weekly':
          dateGrouping = "DATE_TRUNC('week', ch.created_at)";
          break;
        case 'monthly':
          dateGrouping = "DATE_TRUNC('month', ch.created_at)";
          break;
        default:
          dateGrouping = "DATE_TRUNC('day', ch.created_at)";
      }

      const query = `
        SELECT 
          ${dateGrouping} as period,
          COUNT(DISTINCT ch.entity_id) as entities_count,
          COUNT(DISTINCT ch.framework_id) as frameworks_count,
          AVG(ch.compliance_score) as avg_compliance_score,
          MIN(ch.compliance_score) as min_compliance_score,
          MAX(ch.compliance_score) as max_compliance_score,
          COUNT(*) as total_checks
        FROM compliance_history ch
        JOIN entities e ON ch.entity_id = e.id
        ${whereClause}
        GROUP BY ${dateGrouping}
        ORDER BY period ASC
      `;

      const result = await pool.query(query, params);
      
      return result.rows.map(row => ({
        period: row.period,
        entitiesCount: parseInt(row.entities_count) || 0,
        frameworksCount: parseInt(row.frameworks_count) || 0,
        avgComplianceScore: parseFloat(row.avg_compliance_score) || 0,
        minComplianceScore: parseFloat(row.min_compliance_score) || 0,
        maxComplianceScore: parseFloat(row.max_compliance_score) || 0,
        totalChecks: parseInt(row.total_checks) || 0
      }));
    } catch (error) {
      logger.error('Error generating compliance trends', {
        error: error.message,
        organizationId,
        filters
      });
      throw error;
    }
  }
}

module.exports = ReportAggregator;
