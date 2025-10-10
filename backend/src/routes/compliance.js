const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  getComplianceDashboard,
  triggerComplianceCheck,
  getComplianceTrends,
  getComplianceGaps
} = require('../controllers/complianceController');
const {
  createSmartAudit
} = require('../controllers/auditController');
const {
  createSmartAuditSchema,
  triggerComplianceCheckSchema,
  complianceDashboardSchema
} = require('../middleware/validation');

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @route GET /api/compliance/dashboard
 * @desc Get compliance dashboard with overall scores and statistics
 * @access Private (Admin, Compliance Manager, Auditor)
 */
router.get('/dashboard', 
  requireRole(['admin', 'compliance_manager', 'auditor']),
  getComplianceDashboard
);

/**
 * @route POST /api/compliance/check
 * @desc Trigger manual compliance check for specific entity/framework
 * @access Private (Admin, Compliance Manager)
 */
router.post('/check', 
  requireRole(['admin', 'compliance_manager']), 
  validateRequest(triggerComplianceCheckSchema), 
  triggerComplianceCheck
);

/**
 * @route POST /api/compliance/smart-audit
 * @desc Create smart audit with automated gap detection and findings
 * @access Private (Admin, Compliance Manager)
 */
router.post('/smart-audit', 
  requireRole(['admin', 'compliance_manager']), 
  validateRequest(createSmartAuditSchema), 
  createSmartAudit
);

/**
 * @route GET /api/compliance/trends
 * @desc Get compliance trends over time
 * @access Private (Admin, Compliance Manager, Auditor)
 */
router.get('/trends',
  requireRole(['admin', 'compliance_manager', 'auditor']),
  getComplianceTrends
);

/**
 * @route GET /api/compliance/gaps
 * @desc Get compliance gaps with filtering options
 * @access Private (Admin, Compliance Manager, Auditor)
 */
router.get('/gaps',
  requireRole(['admin', 'compliance_manager', 'auditor']),
  getComplianceGaps
);

/**
 * @route GET /api/compliance/status
 * @desc Get compliance engine status and scheduler information
 * @access Private (Admin, Compliance Manager)
 */
router.get('/status', 
  requireRole(['admin', 'compliance_manager']),
  async (req, res, next) => {
    try {
      const ComplianceScheduler = require('../services/complianceScheduler');
      const status = ComplianceScheduler.getStatus();
      
      res.json({
        success: true,
        data: {
          scheduler: status,
          engine: {
            status: 'active',
            lastCheck: new Date().toISOString(),
            version: '1.0.0'
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/compliance/trigger-all
 * @desc Trigger compliance checks for all active assignments
 * @access Private (Admin)
 */
router.post('/trigger-all',
  requireRole(['admin']),
  async (req, res, next) => {
    try {
      const ComplianceScheduler = require('../services/complianceScheduler');
      
      // Run all compliance checks
      await ComplianceScheduler.runAllComplianceChecks();
      
      res.json({
        success: true,
        message: 'Compliance checks triggered for all active assignments',
        data: {
          triggeredAt: new Date().toISOString(),
          status: 'completed'
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET /api/compliance/health
 * @desc Get compliance engine health status
 * @access Private (Admin, Compliance Manager)
 */
router.get('/health',
  requireRole(['admin', 'compliance_manager']),
  async (req, res, next) => {
    try {
      const { pool } = require('../config/database');
      
      // Test database connection
      const dbResult = await pool.query('SELECT NOW() as current_time');
      
      // Get scheduler status
      const ComplianceScheduler = require('../services/complianceScheduler');
      const schedulerStatus = ComplianceScheduler.getStatus();
      
      // Get recent activity counts
      const [auditCount, gapCount, taskCount] = await Promise.all([
        pool.query('SELECT COUNT(*) as count FROM audits WHERE created_at > NOW() - INTERVAL \'24 hours\''),
        pool.query('SELECT COUNT(*) as count FROM audit_gaps WHERE created_at > NOW() - INTERVAL \'24 hours\''),
        pool.query('SELECT COUNT(*) as count FROM tasks WHERE created_at > NOW() - INTERVAL \'24 hours\'')
      ]);
      
      res.json({
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: {
            connected: true,
            currentTime: dbResult.rows[0].current_time
          },
          scheduler: schedulerStatus,
          activity: {
            auditsLast24h: parseInt(auditCount.rows[0].count),
            gapsLast24h: parseInt(gapCount.rows[0].count),
            tasksLast24h: parseInt(taskCount.rows[0].count)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message
        }
      });
    }
  }
);

module.exports = router;
