const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  createGapSchema,
  updateGapSchema,
  updateGapStatusSchema
} = require('../middleware/validation');

const {
  createGap,
  getGap,
  getAllGaps,
  updateGap,
  deleteGap,
  updateGapStatus,
  getGapStats
} = require('../controllers/auditGapController');

// Apply authentication to all routes
router.use(authenticateToken);

// Audit Gap Management Routes
router.post('/', requireRole(['admin', 'compliance_manager']), validateRequest(createGapSchema), createGap);
router.get('/', getAllGaps);
router.get('/stats', getGapStats);
router.get('/:id', getGap);
router.put('/:id', validateRequest(updateGapSchema), updateGap);
router.put('/:id/status', validateRequest(updateGapStatusSchema), updateGapStatus);
router.delete('/:id', requireRole(['admin']), deleteGap);

module.exports = router;
