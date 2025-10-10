const EntityFramework = require('../models/EntityFramework');
const Entity = require('../models/Entity');
const Framework = require('../models/Framework');
const realtimeEventEmitter = require('../services/realtimeEventEmitter');
const logger = require('../config/logger');

const assignFrameworkToEntity = async (req, res, next) => {
  try {
    const { entityId, frameworkId } = req.params;
    const { complianceScore, auditReadinessScore, lastAuditDate, nextAuditDate, certificationStatus, certificationExpiry, complianceDeadline } = req.body;
    const { organizationId } = req.user;

    logger.info('Assigning framework to entity', {
      requestId: req.id,
      entityId: entityId,
      frameworkId: frameworkId,
      organizationId: organizationId
    });

    // Verify entity belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    // Verify framework exists
    const framework = await Framework.findById(frameworkId);
    if (!framework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The specified framework does not exist'
      });
    }

    const assignment = await EntityFramework.assignFramework({
      entityId,
      frameworkId,
      complianceScore,
      auditReadinessScore,
      lastAuditDate,
      nextAuditDate,
      certificationStatus,
      certificationExpiry,
      complianceDeadline
    });

    logger.info('Framework assigned to entity successfully', {
      requestId: req.id,
      entityId: entityId,
      frameworkId: frameworkId
    });

    // Trigger compliance event listener
    try {
      const ComplianceEventListener = require('../services/complianceEventListener');
      await ComplianceEventListener.onFrameworkAssigned(entityId, frameworkId);
    } catch (error) {
      logger.error('Error triggering compliance event for framework assignment', {
        error: error.message,
        entityId,
        frameworkId
      });
    }

    // Emit real-time event for framework assignment
    realtimeEventEmitter.emitFrameworkAssigned({
      frameworkId: frameworkId,
      entityId: entityId,
      complianceScore: complianceScore,
      assignedBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Framework assigned to entity successfully',
      assignment
    });
  } catch (error) {
    logger.error('Error assigning framework to entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      frameworkId: req.params.frameworkId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getEntityFrameworks = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching entity frameworks', {
      requestId: req.id,
      entityId: entityId,
      organizationId: organizationId
    });

    // Verify entity belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    const frameworks = await EntityFramework.findByEntityId(entityId, organizationId);

    res.status(200).json({
      success: true,
      frameworks,
      count: frameworks.length
    });
  } catch (error) {
    logger.error('Error fetching entity frameworks', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getFrameworkEntities = async (req, res, next) => {
  try {
    const { frameworkId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching framework entities', {
      requestId: req.id,
      frameworkId: frameworkId,
      organizationId: organizationId
    });

    // Verify framework exists
    const framework = await Framework.findById(frameworkId);
    if (!framework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The specified framework does not exist'
      });
    }

    const entities = await EntityFramework.findByFrameworkId(frameworkId, organizationId);

    res.status(200).json({
      success: true,
      entities,
      count: entities.length
    });
  } catch (error) {
    logger.error('Error fetching framework entities', {
      requestId: req.id,
      frameworkId: req.params.frameworkId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateEntityFramework = async (req, res, next) => {
  try {
    const { entityId, frameworkId } = req.params;
    const updates = req.body;
    const { organizationId } = req.user;

    logger.info('Updating entity framework compliance', {
      requestId: req.id,
      entityId: entityId,
      frameworkId: frameworkId,
      organizationId: organizationId,
      updates: updates
    });

    // Verify entity belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    // Check if assignment exists
    const existingAssignment = await EntityFramework.checkAssignment(entityId, frameworkId);
    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
        message: 'The specified framework is not assigned to this entity'
      });
    }

    const updatedAssignment = await EntityFramework.updateCompliance(entityId, frameworkId, updates);

    if (!updatedAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
        message: 'The specified framework assignment does not exist'
      });
    }

    logger.info('Entity framework compliance updated successfully', {
      requestId: req.id,
      entityId: entityId,
      frameworkId: frameworkId
    });

    res.status(200).json({
      success: true,
      message: 'Entity framework compliance updated successfully',
      assignment: updatedAssignment
    });
  } catch (error) {
    logger.error('Error updating entity framework compliance', {
      requestId: req.id,
      entityId: req.params.entityId,
      frameworkId: req.params.frameworkId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const removeFrameworkFromEntity = async (req, res, next) => {
  try {
    const { entityId, frameworkId } = req.params;
    const { organizationId } = req.user;

    logger.info('Removing framework from entity', {
      requestId: req.id,
      entityId: entityId,
      frameworkId: frameworkId,
      organizationId: organizationId
    });

    // Verify entity belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    const assignment = await EntityFramework.removeFramework(entityId, frameworkId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
        message: 'The specified framework is not assigned to this entity'
      });
    }

    logger.info('Framework removed from entity successfully', {
      requestId: req.id,
      entityId: entityId,
      frameworkId: frameworkId
    });

    // Emit real-time event for framework removal
    realtimeEventEmitter.emitFrameworkRemoved({
      frameworkId: frameworkId,
      entityId: entityId,
      removedBy: req.user.userId
    });

    res.status(200).json({
      success: true,
      message: 'Framework removed from entity successfully'
    });
  } catch (error) {
    logger.error('Error removing framework from entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      frameworkId: req.params.frameworkId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getEntityComplianceOverview = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching entity compliance overview', {
      requestId: req.id,
      entityId: entityId,
      organizationId: organizationId
    });

    // Verify entity belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    const overview = await EntityFramework.getEntityComplianceOverview(entityId, organizationId);

    res.status(200).json({
      success: true,
      overview
    });
  } catch (error) {
    logger.error('Error fetching entity compliance overview', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getFrameworkComplianceOverview = async (req, res, next) => {
  try {
    const { frameworkId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching framework compliance overview', {
      requestId: req.id,
      frameworkId: frameworkId,
      organizationId: organizationId
    });

    // Verify framework exists
    const framework = await Framework.findById(frameworkId);
    if (!framework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The specified framework does not exist'
      });
    }

    const overview = await EntityFramework.getFrameworkComplianceOverview(frameworkId, organizationId);

    res.status(200).json({
      success: true,
      overview
    });
  } catch (error) {
    logger.error('Error fetching framework compliance overview', {
      requestId: req.id,
      frameworkId: req.params.frameworkId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getUpcomingAudits = async (req, res, next) => {
  try {
    const { daysAhead = 30 } = req.query;
    const { organizationId } = req.user;

    logger.info('Fetching upcoming audits', {
      requestId: req.id,
      organizationId: organizationId,
      daysAhead: daysAhead
    });

    const upcomingAudits = await EntityFramework.getUpcomingAudits(organizationId, parseInt(daysAhead));

    res.status(200).json({
      success: true,
      upcomingAudits,
      count: upcomingAudits.length,
      daysAhead: parseInt(daysAhead)
    });
  } catch (error) {
    logger.error('Error fetching upcoming audits', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getExpiringCertifications = async (req, res, next) => {
  try {
    const { daysAhead = 30 } = req.query;
    const { organizationId } = req.user;

    logger.info('Fetching expiring certifications', {
      requestId: req.id,
      organizationId: organizationId,
      daysAhead: daysAhead
    });

    const expiringCertifications = await EntityFramework.getExpiringCertifications(organizationId, parseInt(daysAhead));

    res.status(200).json({
      success: true,
      expiringCertifications,
      count: expiringCertifications.length,
      daysAhead: parseInt(daysAhead)
    });
  } catch (error) {
    logger.error('Error fetching expiring certifications', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  assignFrameworkToEntity,
  getEntityFrameworks,
  getFrameworkEntities,
  updateEntityFramework,
  removeFrameworkFromEntity,
  getEntityComplianceOverview,
  getFrameworkComplianceOverview,
  getUpcomingAudits,
  getExpiringCertifications
};
