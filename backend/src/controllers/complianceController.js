const ComplianceEngine = require('../services/complianceEngine');
const TaskGenerator = require('../services/taskGenerator');
const Entity = require('../models/Entity');
const logger = require('../config/logger');

/**
 * Get compliance dashboard data
 */
const getComplianceDashboard = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { entityId, frameworkId, includeHistory = false, dateRange } = req.query;
    
    logger.info('Getting compliance dashboard', {
      organizationId,
      entityId,
      frameworkId,
      includeHistory,
      dateRange
    });
    
    // Get all entity-framework combinations or specific one
    const assignments = entityId && frameworkId 
      ? [{ entity_id: entityId, framework_id: frameworkId }]
      : await getOrganizationAssignments(organizationId);
    
    const dashboardData = {
      overallScore: 0,
      entities: [],
      totalGaps: 0,
      criticalGaps: 0,
      highGaps: 0,
      mediumGaps: 0,
      lowGaps: 0,
      openTasks: 0,
      overdueTasks: 0,
      completedTasks: 0,
      totalAudits: 0,
      activeAudits: 0,
      riskExposure: {
        totalExposure: 0,
        currentExposure: 0,
        exposurePercentage: 0,
        currency: 'EUR',
        controlsAtRisk: 0,
        totalControls: 0
      },
      lastUpdated: new Date().toISOString()
    };
    
    let totalScore = 0;
    let validAssignments = 0;
    
    for (const assignment of assignments) {
      try {
        const result = await ComplianceEngine.checkEntityCompliance(
          assignment.entity_id,
          assignment.framework_id
        );
        
        // Get entity and framework names
        const entity = await Entity.findById(assignment.entity_id);
        const framework = await getFrameworkById(assignment.framework_id);
        
        const entityData = {
          entityId: assignment.entity_id,
          entityName: entity ? entity.name : 'Unknown Entity',
          frameworkId: assignment.framework_id,
          frameworkName: framework ? framework.name : 'Unknown Framework',
          score: result.score,
          gaps: result.gaps.length,
          requiredControls: result.requiredControls,
          tasksGenerated: result.tasksGenerated,
          riskExposure: result.riskExposure || {
            totalExposure: 0,
            currentExposure: 0,
            exposurePercentage: 0,
            currency: 'EUR',
            controlsAtRisk: 0,
            totalControls: 0
          },
          lastChecked: new Date().toISOString()
        };
        
        dashboardData.entities.push(entityData);
        
        // Aggregate data
        totalScore += result.score;
        validAssignments++;
        dashboardData.totalGaps += result.gaps.length;
        
        // Aggregate risk exposure
        if (result.riskExposure) {
          dashboardData.riskExposure.totalExposure += parseFloat(result.riskExposure.totalExposure) || 0;
          dashboardData.riskExposure.currentExposure += parseFloat(result.riskExposure.currentExposure) || 0;
          dashboardData.riskExposure.controlsAtRisk += result.riskExposure.controlsAtRisk;
          dashboardData.riskExposure.totalControls += result.riskExposure.totalControls;
        }
        
        // Count gaps by severity
        result.gaps.forEach(gap => {
          switch (gap.severity) {
            case 'critical':
              dashboardData.criticalGaps++;
              break;
            case 'high':
              dashboardData.highGaps++;
              break;
            case 'medium':
              dashboardData.mediumGaps++;
              break;
            case 'low':
              dashboardData.lowGaps++;
              break;
          }
        });
        
        logger.debug('Processed assignment for dashboard', {
          entityId: assignment.entity_id,
          frameworkId: assignment.framework_id,
          score: result.score,
          gaps: result.gaps.length
        });
      } catch (error) {
        logger.error('Error processing assignment for dashboard', {
          error: error.message,
          entityId: assignment.entity_id,
          frameworkId: assignment.framework_id
        });
      }
    }
    
    // Calculate average score
    if (validAssignments > 0) {
      dashboardData.overallScore = Math.round(totalScore / validAssignments);
    }
    
    // Calculate overall risk exposure percentage
    if (dashboardData.riskExposure.totalExposure > 0) {
      dashboardData.riskExposure.exposurePercentage = Math.round(
        (dashboardData.riskExposure.currentExposure / dashboardData.riskExposure.totalExposure) * 100
      );
    }
    
    // Get task statistics
    const taskStats = await getTaskStatistics(organizationId, entityId);
    dashboardData.openTasks = taskStats.open;
    dashboardData.overdueTasks = taskStats.overdue;
    dashboardData.completedTasks = taskStats.completed;
    
    // Get audit statistics
    const auditStats = await getAuditStatistics(organizationId, entityId);
    dashboardData.totalAudits = auditStats.total;
    dashboardData.activeAudits = auditStats.active;
    
    // Add historical data if requested
    if (includeHistory) {
      dashboardData.history = await getComplianceHistory(organizationId, entityId, dateRange);
    }
    
    logger.info('Compliance dashboard data retrieved', {
      organizationId,
      overallScore: dashboardData.overallScore,
      totalEntities: dashboardData.entities.length,
      totalGaps: dashboardData.totalGaps,
      openTasks: dashboardData.openTasks
    });
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    logger.error('Error getting compliance dashboard', {
      error: error.message,
      stack: error.stack,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

/**
 * Trigger manual compliance check
 */
const triggerComplianceCheck = async (req, res, next) => {
  try {
    const { entityId, frameworkId } = req.body;
    const organizationId = req.user.organizationId;
    
    logger.info('Triggering manual compliance check', {
      entityId,
      frameworkId,
      organizationId
    });
    
    // Verify entity belongs to organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found or does not belong to your organization'
      });
    }
    
    // Run compliance check
    const result = await ComplianceEngine.checkEntityCompliance(
      entityId,
      frameworkId
    );
    
    logger.info('Manual compliance check completed', {
      entityId,
      frameworkId,
      score: result.score,
      gaps: result.gaps.length,
      tasksGenerated: result.tasksGenerated
    });
    
    res.json({
      success: true,
      message: 'Compliance check completed successfully',
      data: {
        entityId,
        frameworkId,
        entityName: entity.name,
        complianceScore: result.score,
        gapsDetected: result.gaps.length,
        tasksGenerated: result.tasksGenerated,
        requiredControls: result.requiredControls,
        gaps: result.gaps.map(gap => ({
          controlId: gap.controlId,
          title: gap.title,
          description: gap.description,
          category: gap.category,
          severity: gap.severity
        })),
        checkedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error triggering compliance check', {
      error: error.message,
      stack: error.stack,
      entityId: req.body.entityId,
      frameworkId: req.body.frameworkId
    });
    next(error);
  }
};

/**
 * Get compliance trends over time
 */
const getComplianceTrends = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { entityId, frameworkId, days = 30 } = req.query;
    
    logger.info('Getting compliance trends', {
      organizationId,
      entityId,
      frameworkId,
      days
    });
    
    const trends = await getComplianceHistory(organizationId, entityId, {
      startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
    
    res.json({
      success: true,
      data: {
        trends,
        period: `${days} days`,
        entityId,
        frameworkId
      }
    });
  } catch (error) {
    logger.error('Error getting compliance trends', {
      error: error.message,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

/**
 * Get compliance gaps summary
 */
const getComplianceGaps = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { entityId, frameworkId, severity, status = 'open' } = req.query;
    
    logger.info('Getting compliance gaps', {
      organizationId,
      entityId,
      frameworkId,
      severity,
      status
    });
    
    const { pool } = require('../config/database');
    
    let query = `
      SELECT ag.*, c.title as control_title, c.description as control_description,
             e.name as entity_name, f.name as framework_name
      FROM audit_gaps ag
      LEFT JOIN controls c ON ag.control_id = c.id
      LEFT JOIN entities e ON ag.entity_id = e.id
      LEFT JOIN frameworks f ON ag.framework_id = f.id
      WHERE e.organization_id = $1
    `;
    
    const params = [organizationId];
    let paramCount = 1;
    
    if (entityId) {
      paramCount++;
      query += ` AND ag.entity_id = $${paramCount}`;
      params.push(entityId);
    }
    
    if (frameworkId) {
      paramCount++;
      query += ` AND ag.framework_id = $${paramCount}`;
      params.push(frameworkId);
    }
    
    if (severity) {
      paramCount++;
      query += ` AND ag.severity = $${paramCount}`;
      params.push(severity);
    }
    
    if (status) {
      paramCount++;
      query += ` AND ag.status = $${paramCount}`;
      params.push(status);
    }
    
    query += ` ORDER BY ag.severity DESC, ag.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    logger.info('Compliance gaps retrieved', {
      organizationId,
      count: result.rows.length,
      filters: { entityId, frameworkId, severity, status }
    });
    
    res.json({
      success: true,
      data: {
        gaps: result.rows,
        count: result.rows.length,
        filters: { entityId, frameworkId, severity, status }
      }
    });
  } catch (error) {
    logger.error('Error getting compliance gaps', {
      error: error.message,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

// Helper functions

/**
 * Get all entity-framework assignments for an organization
 */
async function getOrganizationAssignments(organizationId) {
  try {
    const { pool } = require('../config/database');
    const result = await pool.query(`
      SELECT DISTINCT ef.entity_id, ef.framework_id, ef.created_at
      FROM entity_frameworks ef
      INNER JOIN entities e ON ef.entity_id = e.id
      WHERE e.organization_id = $1 AND ef.is_active = true
      ORDER BY ef.created_at DESC
    `, [organizationId]);
    
    return result.rows;
  } catch (error) {
    logger.error('Error getting organization assignments', {
      error: error.message,
      organizationId
    });
    return [];
  }
}

/**
 * Get framework by ID
 */
async function getFrameworkById(frameworkId) {
  try {
    const { pool } = require('../config/database');
    const result = await pool.query(`
      SELECT id, name, description, category, type, region, country
      FROM frameworks
      WHERE id = $1
    `, [frameworkId]);
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error getting framework by ID', {
      error: error.message,
      frameworkId
    });
    return null;
  }
}

/**
 * Get task statistics for organization/entity
 */
async function getTaskStatistics(organizationId, entityId = null) {
  try {
    const { pool } = require('../config/database');
    
    let query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN t.status = 'in-progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN t.status = 'overdue' THEN 1 END) as overdue
      FROM tasks t
      INNER JOIN controls c ON t.control_id = c.id
      INNER JOIN control_assignments ca ON c.id = ca.control_id
      INNER JOIN entities e ON ca.entity_id = e.id
      WHERE e.organization_id = $1
    `;
    
    const params = [organizationId];
    
    if (entityId) {
      query += ` AND ca.entity_id = $2`;
      params.push(entityId);
    }
    
    const result = await pool.query(query, params);
    const stats = result.rows[0];
    
    return {
      total: parseInt(stats.total) || 0,
      pending: parseInt(stats.pending) || 0,
      inProgress: parseInt(stats.in_progress) || 0,
      completed: parseInt(stats.completed) || 0,
      overdue: parseInt(stats.overdue) || 0,
      open: parseInt(stats.pending) + parseInt(stats.in_progress) || 0
    };
  } catch (error) {
    logger.error('Error getting task statistics', {
      error: error.message,
      organizationId,
      entityId
    });
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      autoGenerated: 0,
      open: 0
    };
  }
}

/**
 * Get audit statistics for organization/entity
 */
async function getAuditStatistics(organizationId, entityId = null) {
  try {
    const { pool } = require('../config/database');
    
    let query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status IN ('planning', 'in-progress') THEN 1 END) as active
      FROM audits a
      INNER JOIN entities e ON a.entity_id = e.id
      WHERE e.organization_id = $1
    `;
    
    const params = [organizationId];
    
    if (entityId) {
      query += ` AND a.entity_id = $2`;
      params.push(entityId);
    }
    
    const result = await pool.query(query, params);
    const stats = result.rows[0];
    
    return {
      total: parseInt(stats.total) || 0,
      active: parseInt(stats.active) || 0
    };
  } catch (error) {
    logger.error('Error getting audit statistics', {
      error: error.message,
      organizationId,
      entityId
    });
    return {
      total: 0,
      active: 0
    };
  }
}

/**
 * Get compliance history for organization/entity
 */
async function getComplianceHistory(organizationId, entityId = null, dateRange = null) {
  try {
    const { pool } = require('../config/database');
    
    let query = `
      SELECT ch.*, e.name as entity_name, f.name as framework_name
      FROM compliance_history ch
      INNER JOIN entities e ON ch.entity_id = e.id
      LEFT JOIN frameworks f ON ch.framework_id = f.id
      WHERE e.organization_id = $1
    `;
    
    const params = [organizationId];
    let paramCount = 1;
    
    if (entityId) {
      paramCount++;
      query += ` AND ch.entity_id = $${paramCount}`;
      params.push(entityId);
    }
    
    if (dateRange && dateRange.startDate) {
      paramCount++;
      query += ` AND ch.event_date >= $${paramCount}`;
      params.push(dateRange.startDate);
    }
    
    if (dateRange && dateRange.endDate) {
      paramCount++;
      query += ` AND ch.event_date <= $${paramCount}`;
      params.push(dateRange.endDate);
    }
    
    query += ` ORDER BY ch.event_date DESC LIMIT 100`;
    
    const result = await pool.query(query, params);
    
    return result.rows;
  } catch (error) {
    logger.error('Error getting compliance history', {
      error: error.message,
      organizationId,
      entityId
    });
    return [];
  }
}

module.exports = {
  getComplianceDashboard,
  triggerComplianceCheck,
  getComplianceTrends,
  getComplianceGaps
};
