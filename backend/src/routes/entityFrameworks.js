const express = require('express');
const {
  assignFrameworkToEntity,
  getEntityFrameworks,
  getFrameworkEntities,
  updateEntityFramework,
  removeFrameworkFromEntity,
  getEntityComplianceOverview,
  getFrameworkComplianceOverview,
  getUpcomingAudits,
  getExpiringCertifications
} = require('../controllers/entityFrameworkController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, assignFrameworkSchema, updateComplianceSchema } = require('../middleware/validation');

const router = express.Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// Entity-Framework Assignment Management
router.post('/entities/:entityId/frameworks/:frameworkId', requireRole(['admin', 'compliance_manager']), validateRequest(assignFrameworkSchema), assignFrameworkToEntity);
router.get('/entities/:entityId/frameworks', getEntityFrameworks);
router.get('/frameworks/:frameworkId/entities', getFrameworkEntities);
router.put('/entities/:entityId/frameworks/:frameworkId', requireRole(['admin', 'compliance_manager']), validateRequest(updateComplianceSchema), updateEntityFramework);
router.delete('/entities/:entityId/frameworks/:frameworkId', requireRole(['admin']), removeFrameworkFromEntity);

// Compliance Overview
router.get('/entities/:entityId/compliance-overview', getEntityComplianceOverview);
router.get('/frameworks/:frameworkId/compliance-overview', getFrameworkComplianceOverview);

// Audit and Certification Management
router.get('/upcoming-audits', getUpcomingAudits);
router.get('/expiring-certifications', getExpiringCertifications);

module.exports = router;
