const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  createAuditSchema,
  updateAuditSchema,
  updateAuditProgressSchema,
  updateAuditStatusSchema,
  createFindingSchema,
  updateFindingSchema
} = require('../middleware/validation');

const {
  createAudit,
  getAudit,
  getAllAudits,
  updateAudit,
  deleteAudit,
  updateAuditProgress,
  updateAuditStatus,
  getAuditStats,
  createFinding,
  getFindings,
  updateFinding,
  deleteFinding,
  getFindingsStats
} = require('../controllers/auditController');

// Apply authentication to all routes
router.use(authenticateToken);

// Audit Management Routes
router.post('/', requireRole(['admin', 'compliance_manager']), validateRequest(createAuditSchema), createAudit);
router.get('/', getAllAudits);
router.get('/stats', getAuditStats);
router.get('/:id', getAudit);
router.put('/:id', requireRole(['admin', 'compliance_manager']), validateRequest(updateAuditSchema), updateAudit);
router.put('/:id/progress', validateRequest(updateAuditProgressSchema), updateAuditProgress);
router.put('/:id/status', validateRequest(updateAuditStatusSchema), updateAuditStatus);
router.delete('/:id', requireRole(['admin']), deleteAudit);

// Audit Findings Routes
router.post('/:id/findings', requireRole(['admin', 'compliance_manager', 'auditor']), validateRequest(createFindingSchema), createFinding);
router.get('/:id/findings', getFindings);
router.get('/:id/findings/stats', getFindingsStats);
router.put('/:auditId/findings/:findingId', validateRequest(updateFindingSchema), updateFinding);
router.delete('/:auditId/findings/:findingId', requireRole(['admin']), deleteFinding);

module.exports = router;
