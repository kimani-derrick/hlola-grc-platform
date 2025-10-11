const ReportAggregator = require('../services/reportAggregator');
const OptimizedReportAggregator = require('../services/optimizedReportAggregator');
const InsightsGenerator = require('../services/insightsGenerator');
const logger = require('../config/logger');

/**
 * Get organization overview report
 */
const getOverviewReport = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const filters = {
      dateRange: req.query.dateRange ? JSON.parse(req.query.dateRange) : null,
      entityId: req.query.entityId,
      frameworkId: req.query.frameworkId
    };

    logger.info('Generating overview report', {
      requestId: req.requestId,
      organizationId,
      filters
    });

    const stats = await OptimizedReportAggregator.aggregateOrganizationStats(organizationId, filters);

    res.json({
      success: true,
      data: {
        overview: stats,
        summary: {
          complianceStatus: stats.avgComplianceScore >= 80 ? 'excellent' : 
                          stats.avgComplianceScore >= 60 ? 'good' : 
                          stats.avgComplianceScore >= 40 ? 'needs_improvement' : 'critical',
          riskLevel: stats.openGaps > 20 ? 'high' : 
                    stats.openGaps > 10 ? 'medium' : 'low',
          progressStatus: stats.taskCompletionRate >= 80 ? 'on_track' : 
                         stats.taskCompletionRate >= 60 ? 'behind_schedule' : 'at_risk'
        }
      },
      filters,
      metadata: {
        generatedAt: new Date().toISOString(),
        organizationId,
        reportType: 'overview'
      }
    });
  } catch (error) {
    logger.error('Error generating overview report', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

/**
 * Get frameworks progress report
 */
const getFrameworksReport = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const filters = {
      frameworkId: req.query.frameworkId,
      region: req.query.region,
      priority: req.query.priority,
      riskLevel: req.query.riskLevel,
      dateRange: req.query.dateRange ? JSON.parse(req.query.dateRange) : null
    };

    logger.info('Generating frameworks report', {
      requestId: req.requestId,
      organizationId,
      filters
    });

    const frameworks = await OptimizedReportAggregator.aggregateFrameworksProgress(organizationId, filters);

    // Calculate summary statistics
    const summary = {
      totalFrameworks: frameworks.length,
      avgComplianceScore: frameworks.length > 0 
        ? Math.round(frameworks.reduce((sum, f) => sum + f.avgComplianceScore, 0) / frameworks.length)
        : 0,
      frameworksOnTrack: frameworks.filter(f => f.taskCompletionRate >= 80).length,
      frameworksAtRisk: frameworks.filter(f => f.taskCompletionRate < 40).length,
      totalGaps: frameworks.reduce((sum, f) => sum + f.openGaps, 0)
    };

    res.json({
      success: true,
      data: {
        frameworks,
        summary
      },
      filters,
      metadata: {
        generatedAt: new Date().toISOString(),
        organizationId,
        reportType: 'frameworks'
      }
    });
  } catch (error) {
    logger.error('Error generating frameworks report', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

/**
 * Get controls progress report
 */
const getControlsReport = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const filters = {
      frameworkId: req.query.frameworkId,
      status: req.query.status,
      priority: req.query.priority,
      category: req.query.category,
      assignee: req.query.assignee
    };

    logger.info('Generating controls report', {
      requestId: req.requestId,
      organizationId,
      filters
    });

    const controls = await ReportAggregator.aggregateControlProgress(organizationId, filters);

    // Calculate summary statistics
    const summary = {
      totalControls: controls.length,
      avgCompletionRate: controls.length > 0 
        ? Math.round(controls.reduce((sum, c) => sum + c.avgCompletionRate, 0) / controls.length)
        : 0,
      completedControls: controls.filter(c => c.assignmentCompletionRate >= 100).length,
      inProgressControls: controls.filter(c => c.assignmentCompletionRate > 0 && c.assignmentCompletionRate < 100).length,
      notStartedControls: controls.filter(c => c.assignmentCompletionRate === 0).length,
      totalGaps: controls.reduce((sum, c) => sum + c.openGaps, 0)
    };

    res.json({
      success: true,
      data: {
        controls,
        summary
      },
      filters,
      metadata: {
        generatedAt: new Date().toISOString(),
        organizationId,
        reportType: 'controls'
      }
    });
  } catch (error) {
    logger.error('Error generating controls report', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

/**
 * Get tasks progress report
 */
const getTasksReport = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const filters = {
      frameworkId: req.query.frameworkId,
      controlId: req.query.controlId,
      status: req.query.status,
      priority: req.query.priority,
      assignee: req.query.assignee,
      dateRange: req.query.dateRange ? JSON.parse(req.query.dateRange) : null
    };

    logger.info('Generating tasks report', {
      requestId: req.requestId,
      organizationId,
      filters
    });

    const tasks = await OptimizedReportAggregator.aggregateTaskProgress(organizationId, filters);

    // Calculate summary statistics
    const summary = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      overdueTasks: tasks.filter(t => t.isOverdue).length,
      avgEstimatedHours: tasks.length > 0 
        ? Math.round(tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0) / tasks.length)
        : 0,
      totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)
    };

    res.json({
      success: true,
      data: {
        tasks,
        summary
      },
      filters,
      metadata: {
        generatedAt: new Date().toISOString(),
        organizationId,
        reportType: 'tasks'
      }
    });
  } catch (error) {
    logger.error('Error generating tasks report', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

/**
 * Get compliance trends report
 */
const getTrendsReport = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const filters = {
      dateRange: req.query.dateRange ? JSON.parse(req.query.dateRange) : null,
      entityId: req.query.entityId,
      frameworkId: req.query.frameworkId,
      granularity: req.query.granularity || 'daily'
    };

    logger.info('Generating trends report', {
      requestId: req.requestId,
      organizationId,
      filters
    });

    const trends = await ReportAggregator.generateComplianceTrends(organizationId, filters);

    // Calculate trend analysis
    const trendAnalysis = {
      overallTrend: trends.length >= 2 ? 
        (trends[trends.length - 1].avgComplianceScore - trends[0].avgComplianceScore) : 0,
      peakCompliance: trends.length > 0 ? 
        Math.max(...trends.map(t => t.avgComplianceScore)) : 0,
      lowestCompliance: trends.length > 0 ? 
        Math.min(...trends.map(t => t.avgComplianceScore)) : 0,
      totalDataPoints: trends.length
    };

    res.json({
      success: true,
      data: {
        trends,
        analysis: trendAnalysis
      },
      filters,
      metadata: {
        generatedAt: new Date().toISOString(),
        organizationId,
        reportType: 'trends'
      }
    });
  } catch (error) {
    logger.error('Error generating trends report', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

/**
 * Get insights report
 */
const getInsightsReport = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    logger.info('Generating insights report', {
      requestId: req.requestId,
      organizationId
    });

    const insights = await InsightsGenerator.generateInsights(organizationId);

    // Group insights by category
    const insightsByCategory = insights.reduce((acc, insight) => {
      if (!acc[insight.category]) {
        acc[insight.category] = [];
      }
      acc[insight.category].push(insight);
      return acc;
    }, {});

    // Calculate summary
    const summary = {
      totalInsights: insights.length,
      criticalInsights: insights.filter(i => i.type === 'critical').length,
      warningInsights: insights.filter(i => i.type === 'warning').length,
      successInsights: insights.filter(i => i.type === 'success').length,
      infoInsights: insights.filter(i => i.type === 'info').length,
      highPriorityInsights: insights.filter(i => i.priority === 'high').length,
      mediumPriorityInsights: insights.filter(i => i.priority === 'medium').length,
      lowPriorityInsights: insights.filter(i => i.priority === 'low').length
    };

    res.json({
      success: true,
      data: {
        insights,
        insightsByCategory,
        summary
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        organizationId,
        reportType: 'insights'
      }
    });
  } catch (error) {
    logger.error('Error generating insights report', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      organizationId: req.user.organizationId
    });
    next(error);
  }
};

module.exports = {
  getOverviewReport,
  getFrameworksReport,
  getControlsReport,
  getTasksReport,
  getTrendsReport,
  getInsightsReport
};
