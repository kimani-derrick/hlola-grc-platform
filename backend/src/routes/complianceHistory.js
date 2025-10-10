const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { recordEventSchema } = require('../middleware/validation');

const {
  recordEvent,
  getHistory,
  getTrend,
  getLatestComplianceScore,
  getComplianceStats
} = require('../controllers/complianceHistoryController');

// Apply authentication to all routes
router.use(authenticateToken);

// Compliance History Routes
router.post('/', requireRole(['admin', 'compliance_manager']), validateRequest(recordEventSchema), recordEvent);
router.get('/', getHistory);
router.get('/trend', getTrend);
router.get('/latest-score', getLatestComplianceScore);
router.get('/stats', getComplianceStats);

module.exports = router;
