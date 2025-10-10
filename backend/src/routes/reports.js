const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateQuery } = require('../middleware/validation');
const reportController = require('../controllers/reportController');

// Apply authentication to all routes
router.use(authenticateToken);

// Overview report - organization-wide statistics
router.get('/overview', 
  requireRole(['admin', 'compliance_manager']),
  validateQuery('reportOverviewSchema'),
  reportController.getOverviewReport
);

// Frameworks report - framework progress across organization
router.get('/frameworks',
  requireRole(['admin', 'compliance_manager']),
  validateQuery('reportFrameworksSchema'),
  reportController.getFrameworksReport
);

// Controls report - control implementation status
router.get('/controls',
  requireRole(['admin', 'compliance_manager']),
  validateQuery('reportControlsSchema'),
  reportController.getControlsReport
);

// Tasks report - task completion analytics
router.get('/tasks',
  requireRole(['admin', 'compliance_manager']),
  validateQuery('reportTasksSchema'),
  reportController.getTasksReport
);

// Trends report - historical compliance trends
router.get('/trends',
  requireRole(['admin', 'compliance_manager']),
  validateQuery('reportTrendsSchema'),
  reportController.getTrendsReport
);

// Insights report - AI-generated insights and recommendations
router.get('/insights',
  requireRole(['admin', 'compliance_manager']),
  reportController.getInsightsReport
);

module.exports = router;
