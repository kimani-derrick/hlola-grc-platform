const express = require('express');
const {
  assignControlToEntity,
  getEntityControls,
  getControlEntities,
  updateControlStatus,
  removeControlFromEntity,
  getEntityControlStats,
  getControlsByStatus,
  getOverdueControls,
  getUpcomingControls
} = require('../controllers/controlAssignmentController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, assignControlSchema, updateControlStatusSchema } = require('../middleware/validation');

const router = express.Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// Control Assignment Management
router.post('/entities/:entityId/controls/:controlId', requireRole(['admin', 'compliance_manager']), validateRequest(assignControlSchema), assignControlToEntity);
router.get('/entities/:entityId/controls', getEntityControls);
router.get('/entities/:entityId/controls/stats', getEntityControlStats);
router.get('/entities/:entityId/controls/status', getControlsByStatus);
router.get('/entities/:entityId/controls/overdue', getOverdueControls);
router.get('/entities/:entityId/controls/upcoming', getUpcomingControls);
router.put('/entities/:entityId/controls/:controlId', requireRole(['admin', 'compliance_manager']), validateRequest(updateControlStatusSchema), updateControlStatus);
router.delete('/entities/:entityId/controls/:controlId', requireRole(['admin']), removeControlFromEntity);

// Control Entity Management
router.get('/controls/:controlId/entities', getControlEntities);

module.exports = router;
