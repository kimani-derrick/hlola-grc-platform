const { pool } = require('../config/database');
const logger = require('../config/logger');

class OptimizedReportAggregator {
  /**
   * Get organization-wide compliance statistics - OPTIMIZED VERSION
   * This version uses CTEs and simpler queries for much better performance
   */
  static async aggregateOrganizationStats(organizationId, filters = {}) {
    try {
      const { dateRange, entityId, frameworkId } = filters;
      
      // Build base WHERE clause
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

      // OPTIMIZED QUERY - Using CTEs for better performance
      const query = `
        WITH entity_stats AS (
          SELECT 
            e.id as entity_id,
            e.name as entity_name,
            COUNT(DISTINCT ef.framework_id) as framework_count,
            COUNT(DISTINCT c.id) as control_count
          FROM entities e
          LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id
          LEFT JOIN frameworks f ON ef.framework_id = f.id
          LEFT JOIN controls c ON f.id = c.framework_id
          ${whereClause}
          GROUP BY e.id, e.name
        ),
        task_stats AS (
          SELECT 
            e.id as entity_id,
            COUNT(DISTINCT t.id) as total_tasks,
            COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
            COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') as pending_tasks,
            COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'in-progress') as in_progress_tasks,
            COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'overdue') as overdue_tasks
          FROM entities e
          LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id
          LEFT JOIN frameworks f ON ef.framework_id = f.id
          LEFT JOIN controls c ON f.id = c.framework_id
          LEFT JOIN control_assignments ca ON c.id = ca.control_id AND ca.entity_id = e.id
          LEFT JOIN tasks t ON c.id = t.control_id AND t.created_at >= e.created_at
          ${whereClause}
          GROUP BY e.id
        ),
        evidence_stats AS (
          SELECT 
            e.id as entity_id,
            COUNT(DISTINCT d.id) as total_evidence
          FROM entities e
          LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id
          LEFT JOIN frameworks f ON ef.framework_id = f.id
          LEFT JOIN controls c ON f.id = c.framework_id
          LEFT JOIN documents d ON c.id = d.control_id
          ${whereClause}
          GROUP BY e.id
        ),
        gap_stats AS (
          SELECT 
            e.id as entity_id,
            COUNT(DISTINCT ag.id) as total_gaps,
            COUNT(DISTINCT ag.id) FILTER (WHERE ag.status = 'open') as open_gaps
          FROM entities e
          LEFT JOIN audit_gaps ag ON e.id = ag.entity_id
          ${whereClause.replace('LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id\nLEFT JOIN frameworks f ON ef.framework_id = f.id', '')}
          GROUP BY e.id
        ),
        compliance_stats AS (
          SELECT 
            e.id as entity_id,
            AVG(ch.compliance_score) as avg_compliance_score
          FROM entities e
          LEFT JOIN compliance_history ch ON e.id = ch.entity_id
          ${whereClause.replace('LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id\nLEFT JOIN frameworks f ON ef.framework_id = f.id', '')}
          GROUP BY e.id
        )
        SELECT 
          COUNT(DISTINCT es.entity_id) as total_entities,
          SUM(es.framework_count) as total_frameworks,
          SUM(es.control_count) as total_controls,
          COALESCE(SUM(ts.total_tasks), 0) as total_tasks,
          COALESCE(SUM(ts.completed_tasks), 0) as completed_tasks,
          COALESCE(SUM(ts.pending_tasks), 0) as pending_tasks,
          COALESCE(SUM(ts.in_progress_tasks), 0) as in_progress_tasks,
          COALESCE(SUM(ts.overdue_tasks), 0) as overdue_tasks,
          COALESCE(SUM(evs.total_evidence), 0) as total_evidence,
          COALESCE(SUM(gs.total_gaps), 0) as total_gaps,
          COALESCE(SUM(gs.open_gaps), 0) as open_gaps,
          AVG(cs.avg_compliance_score) as avg_compliance_score
        FROM entity_stats es
        LEFT JOIN task_stats ts ON es.entity_id = ts.entity_id
        LEFT JOIN evidence_stats evs ON es.entity_id = evs.entity_id
        LEFT JOIN gap_stats gs ON es.entity_id = gs.entity_id
        LEFT JOIN compliance_stats cs ON es.entity_id = cs.entity_id
      `;

      const startTime = Date.now();
      const result = await pool.query(query, params);
      const executionTime = Date.now() - startTime;
      
      logger.info('Optimized overview query executed', {
        organizationId,
        executionTime: `${executionTime}ms`,
        filters
      });

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
          : 0,
        complianceScore: parseFloat(stats.avg_compliance_score) || 0
      };
    } catch (error) {
      logger.error('Error in optimized overview aggregation', {
        organizationId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Get task progress with optimized query
   */
  static async aggregateTaskProgress(organizationId, filters = {}) {
    try {
      const { frameworkId, controlId, status, priority, assignee, dateRange } = filters;
      
      let whereClause = 'WHERE e.organization_id = $1';
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
        ${whereClause}
        AND t.created_at >= e.created_at
        GROUP BY t.id, t.title, t.description, t.status, t.priority, t.category, 
                 t.estimated_hours, t.due_date, t.created_at, t.updated_at, 
                 c.title, c.control_id, f.name, e.name, u.first_name, u.last_name
        ORDER BY t.due_date ASC, t.priority DESC
      `;

      const startTime = Date.now();
      const result = await pool.query(query, params);
      const executionTime = Date.now() - startTime;
      
      logger.info('Optimized tasks query executed', {
        organizationId,
        executionTime: `${executionTime}ms`,
        taskCount: result.rows.length
      });
      
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
        assigneeFirstName: row.assignee_first_name,
        assigneeLastName: row.assignee_last_name,
        evidenceCount: parseInt(row.evidence_count) || 0,
        isOverdue: row.is_overdue
      }));
    } catch (error) {
      logger.error('Error in optimized task aggregation', {
        organizationId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Get frameworks report with optimized query
   */
  static async aggregateFrameworksProgress(organizationId, filters = {}) {
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
          f.id,
          f.name,
          f.description,
          f.region,
          f.category,
          f.priority,
          f.risk_level,
          f.status,
          COUNT(DISTINCT e.id) as assigned_entities,
          COUNT(DISTINCT c.id) as total_controls,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') as pending_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'in-progress') as in_progress_tasks,
          COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'overdue') as overdue_tasks,
          COUNT(DISTINCT d.id) as total_evidence,
          AVG(ch.compliance_score) as avg_compliance_score,
          ef.created_at as assigned_date,
          ef.compliance_score as entity_compliance_score,
          ef.audit_readiness_score,
          ef.certification_status
        FROM frameworks f
        LEFT JOIN entity_frameworks ef ON f.id = ef.framework_id
        LEFT JOIN entities e ON ef.entity_id = e.id
        LEFT JOIN controls c ON f.id = c.framework_id
        LEFT JOIN control_assignments ca ON c.id = ca.control_id AND ca.entity_id = e.id
        LEFT JOIN tasks t ON c.id = t.control_id AND t.created_at >= e.created_at
        LEFT JOIN documents d ON c.id = d.control_id
        LEFT JOIN compliance_history ch ON e.id = ch.entity_id
        ${whereClause}
        GROUP BY f.id, f.name, f.description, f.region, f.category, f.priority, 
                 f.risk_level, f.status, ef.created_at, ef.compliance_score, 
                 ef.audit_readiness_score, ef.certification_status
        ORDER BY f.priority DESC, f.name ASC
      `;

      const startTime = Date.now();
      const result = await pool.query(query, params);
      const executionTime = Date.now() - startTime;
      
      logger.info('Optimized frameworks query executed', {
        organizationId,
        executionTime: `${executionTime}ms`,
        frameworkCount: result.rows.length
      });
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        region: row.region,
        category: row.category,
        priority: row.priority,
        riskLevel: row.risk_level,
        status: row.status,
        assignedEntities: parseInt(row.assigned_entities) || 0,
        totalControls: parseInt(row.total_controls) || 0,
        totalTasks: parseInt(row.total_tasks) || 0,
        completedTasks: parseInt(row.completed_tasks) || 0,
        pendingTasks: parseInt(row.pending_tasks) || 0,
        inProgressTasks: parseInt(row.in_progress_tasks) || 0,
        overdueTasks: parseInt(row.overdue_tasks) || 0,
        totalEvidence: parseInt(row.total_evidence) || 0,
        avgComplianceScore: parseFloat(row.avg_compliance_score) || 0,
        assignedDate: row.assigned_date,
        entityComplianceScore: parseFloat(row.entity_compliance_score) || 0,
        auditReadinessScore: parseFloat(row.audit_readiness_score) || 0,
        certificationStatus: row.certification_status,
        completionRate: row.total_tasks > 0 
          ? Math.round((row.completed_tasks / row.total_tasks) * 100) 
          : 0
      }));
    } catch (error) {
      logger.error('Error in optimized frameworks aggregation', {
        organizationId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = OptimizedReportAggregator;
