const { pool } = require('../config/database');
const logger = require('../config/logger');

class InsightsGenerator {
  /**
   * Generate basic rule-based insights for organization
   */
  static async generateInsights(organizationId) {
    try {
      const insights = [];

      // Check framework progress
      const frameworkInsights = await this.checkFrameworkProgress(organizationId);
      insights.push(...frameworkInsights);

      // Check overdue tasks
      const overdueInsights = await this.checkOverdueTasks(organizationId);
      insights.push(...overdueInsights);

      // Check approaching deadlines
      const deadlineInsights = await this.checkApproachingDeadlines(organizationId);
      insights.push(...deadlineInsights);

      // Check team performance
      const performanceInsights = await this.checkTeamPerformance(organizationId);
      insights.push(...performanceInsights);

      // Check positive trends
      const positiveInsights = await this.checkPositiveTrends(organizationId);
      insights.push(...positiveInsights);

      // Check evidence gaps
      const evidenceInsights = await this.checkEvidenceGaps(organizationId);
      insights.push(...evidenceInsights);

      // Sort by priority and return
      return insights.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    } catch (error) {
      logger.error('Error generating insights', {
        error: error.message,
        organizationId
      });
      throw error;
    }
  }

  /**
   * Check for frameworks falling behind schedule
   */
  static async checkFrameworkProgress(organizationId) {
    try {
      const query = `
        SELECT 
          f.id,
          f.name,
          f.compliance_deadline,
          AVG(ch.compliance_score) as avg_compliance_score,
          COUNT(DISTINCT ch.id) as check_count,
          LAG(AVG(ch.compliance_score)) OVER (PARTITION BY f.id ORDER BY DATE_TRUNC('day', ch.created_at)) as prev_score
        FROM frameworks f
        JOIN entity_frameworks ef ON f.id = ef.framework_id
        JOIN entities e ON ef.entity_id = e.id
        LEFT JOIN compliance_history ch ON ef.entity_id = ch.entity_id AND f.id = ch.framework_id
        WHERE e.organization_id = $1
          AND f.compliance_deadline IS NOT NULL
          AND ch.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY f.id, f.name, f.compliance_deadline, DATE_TRUNC('day', ch.created_at)
        HAVING COUNT(DISTINCT ch.id) >= 2
      `;

      const result = await pool.query(query, [organizationId]);
      const insights = [];

      for (const row of result.rows) {
        const currentScore = parseFloat(row.avg_compliance_score) || 0;
        const prevScore = parseFloat(row.prev_score) || 0;
        const daysToDeadline = Math.ceil((new Date(row.compliance_deadline) - new Date()) / (1000 * 60 * 60 * 24));

        // Framework falling behind (score decreased by more than 10%)
        if (prevScore > 0 && currentScore < prevScore - 10) {
          insights.push({
            type: 'warning',
            title: 'Framework Compliance Declining',
            description: `${row.name} compliance score has decreased from ${Math.round(prevScore)}% to ${Math.round(currentScore)}%`,
            recommendation: 'Review framework implementation and address identified gaps immediately',
            affectedItems: [{
              type: 'framework',
              id: row.id,
              name: row.name
            }],
            priority: 'high',
            category: 'framework_progress'
          });
        }

        // Framework approaching deadline with low compliance
        if (daysToDeadline <= 90 && currentScore < 50) {
          insights.push({
            type: 'critical',
            title: 'Critical Deadline Approaching',
            description: `${row.name} compliance deadline is in ${daysToDeadline} days with only ${Math.round(currentScore)}% compliance`,
            recommendation: 'Accelerate implementation efforts and consider additional resources',
            affectedItems: [{
              type: 'framework',
              id: row.id,
              name: row.name
            }],
            priority: 'high',
            category: 'deadline_risk'
          });
        }
      }

      return insights;
    } catch (error) {
      logger.error('Error checking framework progress', {
        error: error.message,
        organizationId
      });
      return [];
    }
  }

  /**
   * Check for high overdue task counts
   */
  static async checkOverdueTasks(organizationId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as overdue_count,
          COUNT(DISTINCT f.id) as affected_frameworks,
          COUNT(DISTINCT e.id) as affected_entities
        FROM tasks t
        JOIN controls c ON t.control_id = c.id
        JOIN frameworks f ON c.framework_id = f.id
        JOIN control_assignments ca ON c.id = ca.control_id
        JOIN entities e ON ca.entity_id = e.id
        WHERE e.organization_id = $1
          AND t.due_date < NOW()
          AND t.status != 'completed'
      `;

      const result = await pool.query(query, [organizationId]);
      const row = result.rows[0];
      const overdueCount = parseInt(row.overdue_count) || 0;

      if (overdueCount > 0) {
        return [{
          type: overdueCount > 20 ? 'critical' : 'warning',
          title: 'Overdue Tasks Detected',
          description: `${overdueCount} tasks are overdue across ${row.affected_frameworks} frameworks and ${row.affected_entities} entities`,
          recommendation: 'Review overdue tasks and reassign resources as needed',
          affectedItems: [{
            type: 'tasks',
            count: overdueCount,
            frameworks: parseInt(row.affected_frameworks),
            entities: parseInt(row.affected_entities)
          }],
          priority: overdueCount > 20 ? 'high' : 'medium',
          category: 'overdue_tasks'
        }];
      }

      return [];
    } catch (error) {
      logger.error('Error checking overdue tasks', {
        error: error.message,
        organizationId
      });
      return [];
    }
  }

  /**
   * Check for approaching deadlines with low compliance
   */
  static async checkApproachingDeadlines(organizationId) {
    try {
      const query = `
        SELECT 
          f.id,
          f.name,
          f.compliance_deadline,
          AVG(ch.compliance_score) as avg_compliance_score,
          COUNT(DISTINCT e.id) as entity_count
        FROM frameworks f
        JOIN entity_frameworks ef ON f.id = ef.framework_id
        JOIN entities e ON ef.entity_id = e.id
        LEFT JOIN compliance_history ch ON ef.entity_id = ch.entity_id AND f.id = ch.framework_id
        WHERE e.organization_id = $1
          AND f.compliance_deadline IS NOT NULL
          AND f.compliance_deadline BETWEEN NOW() AND NOW() + INTERVAL '90 days'
        GROUP BY f.id, f.name, f.compliance_deadline
      `;

      const result = await pool.query(query, [organizationId]);
      const insights = [];

      for (const row of result.rows) {
        const complianceScore = parseFloat(row.avg_compliance_score) || 0;
        const daysToDeadline = Math.ceil((new Date(row.compliance_deadline) - new Date()) / (1000 * 60 * 60 * 24));

        if (complianceScore < 70) {
          insights.push({
            type: complianceScore < 30 ? 'critical' : 'warning',
            title: 'Deadline Risk Detected',
            description: `${row.name} deadline is in ${daysToDeadline} days with ${Math.round(complianceScore)}% compliance across ${row.entity_count} entities`,
            recommendation: 'Implement accelerated compliance plan and consider deadline extension if necessary',
            affectedItems: [{
              type: 'framework',
              id: row.id,
              name: row.name,
              deadline: row.compliance_deadline
            }],
            priority: complianceScore < 30 ? 'high' : 'medium',
            category: 'deadline_risk'
          });
        }
      }

      return insights;
    } catch (error) {
      logger.error('Error checking approaching deadlines', {
        error: error.message,
        organizationId
      });
      return [];
    }
  }

  /**
   * Check team performance issues
   */
  static async checkTeamPerformance(organizationId) {
    try {
      const query = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          COUNT(t.id) as total_tasks,
          COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
          COUNT(t.id) FILTER (WHERE t.due_date < NOW() AND t.status != 'completed') as overdue_tasks
        FROM users u
        JOIN tasks t ON u.id = t.assignee_id
        JOIN controls c ON t.control_id = c.id
        JOIN frameworks f ON c.framework_id = f.id
        JOIN control_assignments ca ON c.id = ca.control_id
        JOIN entities e ON ca.entity_id = e.id
        WHERE e.organization_id = $1
          AND t.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY u.id, u.first_name, u.last_name
        HAVING COUNT(t.id) >= 5
      `;

      const result = await pool.query(query, [organizationId]);
      const insights = [];

      for (const row of result.rows) {
        const totalTasks = parseInt(row.total_tasks) || 0;
        const completedTasks = parseInt(row.completed_tasks) || 0;
        const overdueTasks = parseInt(row.overdue_tasks) || 0;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        if (completionRate < 30) {
          insights.push({
            type: 'warning',
            title: 'Low Team Performance Detected',
            description: `${row.first_name} ${row.last_name} has completed only ${Math.round(completionRate)}% of assigned tasks (${completedTasks}/${totalTasks})`,
            recommendation: 'Review workload distribution and provide additional support or training',
            affectedItems: [{
              type: 'user',
              id: row.id,
              name: `${row.first_name} ${row.last_name}`,
              completionRate: Math.round(completionRate),
              overdueTasks
            }],
            priority: 'medium',
            category: 'team_performance'
          });
        }

        if (overdueTasks > totalTasks * 0.5) {
          insights.push({
            type: 'critical',
            title: 'High Overdue Task Rate',
            description: `${row.first_name} ${row.last_name} has ${overdueTasks} overdue tasks out of ${totalTasks} total tasks`,
            recommendation: 'Immediately reassign some tasks or provide additional resources',
            affectedItems: [{
              type: 'user',
              id: row.id,
              name: `${row.first_name} ${row.last_name}`,
              overdueTasks,
              totalTasks
            }],
            priority: 'high',
            category: 'team_performance'
          });
        }
      }

      return insights;
    } catch (error) {
      logger.error('Error checking team performance', {
        error: error.message,
        organizationId
      });
      return [];
    }
  }

  /**
   * Check for positive trends
   */
  static async checkPositiveTrends(organizationId) {
    try {
      const query = `
        SELECT 
          f.id,
          f.name,
          AVG(ch.compliance_score) as avg_compliance_score,
          COUNT(DISTINCT ch.id) as check_count,
          LAG(AVG(ch.compliance_score)) OVER (PARTITION BY f.id ORDER BY DATE_TRUNC('day', ch.created_at)) as prev_score
        FROM frameworks f
        JOIN entity_frameworks ef ON f.id = ef.framework_id
        JOIN entities e ON ef.entity_id = e.id
        LEFT JOIN compliance_history ch ON ef.entity_id = ch.entity_id AND f.id = ch.framework_id
        WHERE e.organization_id = $1
          AND ch.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY f.id, f.name, DATE_TRUNC('day', ch.created_at)
        HAVING COUNT(DISTINCT ch.id) >= 2
      `;

      const result = await pool.query(query, [organizationId]);
      const insights = [];

      for (const row of result.rows) {
        const currentScore = parseFloat(row.avg_compliance_score) || 0;
        const prevScore = parseFloat(row.prev_score) || 0;

        // Significant improvement (score increased by more than 15%)
        if (prevScore > 0 && currentScore > prevScore + 15) {
          insights.push({
            type: 'success',
            title: 'Excellent Progress Detected',
            description: `${row.name} compliance score has improved from ${Math.round(prevScore)}% to ${Math.round(currentScore)}%`,
            recommendation: 'Continue current implementation strategy and consider sharing best practices',
            affectedItems: [{
              type: 'framework',
              id: row.id,
              name: row.name
            }],
            priority: 'low',
            category: 'positive_trend'
          });
        }

        // High compliance achievement
        if (currentScore >= 90) {
          insights.push({
            type: 'success',
            title: 'High Compliance Achievement',
            description: `${row.name} has achieved ${Math.round(currentScore)}% compliance`,
            recommendation: 'Consider this framework as a model for other implementations',
            affectedItems: [{
              type: 'framework',
              id: row.id,
              name: row.name
            }],
            priority: 'low',
            category: 'high_achievement'
          });
        }
      }

      return insights;
    } catch (error) {
      logger.error('Error checking positive trends', {
        error: error.message,
        organizationId
      });
      return [];
    }
  }

  /**
   * Check for evidence gaps
   */
  static async checkEvidenceGaps(organizationId) {
    try {
      const query = `
        SELECT 
          c.id,
          c.title,
          c.evidence_requirements,
          f.name as framework_name,
          COUNT(DISTINCT ca.id) as total_assignments,
          COUNT(DISTINCT d.id) as evidence_count,
          COUNT(DISTINCT ag.id) as gap_count
        FROM controls c
        JOIN frameworks f ON c.framework_id = f.id
        LEFT JOIN control_assignments ca ON c.id = ca.control_id
        LEFT JOIN entities e ON ca.entity_id = e.id
        LEFT JOIN documents d ON c.id = d.control_id
        LEFT JOIN audit_gaps ag ON e.id = ag.entity_id AND c.id = ag.control_id
        WHERE e.organization_id = $1
          AND c.evidence_requirements IS NOT NULL
        GROUP BY c.id, c.title, c.evidence_requirements, f.name
        HAVING COUNT(DISTINCT ca.id) > 0
      `;

      const result = await pool.query(query, [organizationId]);
      const insights = [];

      for (const row of result.rows) {
        const totalAssignments = parseInt(row.total_assignments) || 0;
        const evidenceCount = parseInt(row.evidence_count) || 0;
        const gapCount = parseInt(row.gap_count) || 0;
        const evidenceRate = totalAssignments > 0 ? (evidenceCount / totalAssignments) * 100 : 0;

        if (evidenceRate < 50 && gapCount > 0) {
          insights.push({
            type: 'warning',
            title: 'Evidence Collection Gap',
            description: `${row.title} in ${row.framework_name} has only ${Math.round(evidenceRate)}% evidence coverage with ${gapCount} gaps`,
            recommendation: 'Focus on evidence collection for this control and review evidence requirements',
            affectedItems: [{
              type: 'control',
              id: row.id,
              title: row.title,
              frameworkName: row.framework_name,
              evidenceRequirements: row.evidence_requirements
            }],
            priority: 'medium',
            category: 'evidence_gap'
          });
        }
      }

      return insights;
    } catch (error) {
      logger.error('Error checking evidence gaps', {
        error: error.message,
        organizationId
      });
      return [];
    }
  }
}

module.exports = InsightsGenerator;
