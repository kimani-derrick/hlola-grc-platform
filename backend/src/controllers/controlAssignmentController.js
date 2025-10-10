const ControlAssignment = require('../models/ControlAssignment');
const Control = require('../models/Control');
const Entity = require('../models/Entity');
const realtimeEventEmitter = require('../services/realtimeEventEmitter');
const logger = require('../config/logger');

const assignControlToEntity = async (req, res, next) => {
  try {
    const { entityId, controlId } = req.params;
    const { organizationId } = req.user;
    const assignmentData = req.body;

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    // Verify control exists
    const control = await Control.findById(controlId);
    if (!control) {
      return res.status(404).json({
        success: false,
        error: 'Control not found',
        message: 'The specified control does not exist'
      });
    }

    logger.info('Assigning control to entity', {
      requestId: req.id,
      entityId,
      controlId,
      organizationId,
      assignmentData
    });

    const assignment = await ControlAssignment.assignToEntity({
      entityId,
      controlId,
      ...assignmentData
    });

    logger.info('Control assigned to entity successfully', {
      requestId: req.id,
      assignmentId: assignment.id
    });

    // Emit real-time event for control assignment
    realtimeEventEmitter.emitControlAssigned({
      controlId: controlId,
      entityId: entityId,
      frameworkId: control.framework_id,
      assignedBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Control assigned to entity successfully',
      assignment
    });
  } catch (error) {
    logger.error('Error assigning control to entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      controlId: req.params.controlId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getEntityControls = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    logger.info('Fetching controls for entity', {
      requestId: req.id,
      entityId,
      organizationId
    });

    const controls = await ControlAssignment.findByEntityId(entityId, organizationId);

    res.status(200).json({
      success: true,
      controls,
      count: controls.length,
      entity: {
        id: entity.id,
        name: entity.name,
        entityType: entity.entity_type
      }
    });
  } catch (error) {
    logger.error('Error fetching controls for entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getControlEntities = async (req, res, next) => {
  try {
    const { controlId } = req.params;
    const { organizationId } = req.user;

    // Verify control exists
    const control = await Control.findById(controlId);
    if (!control) {
      return res.status(404).json({
        success: false,
        error: 'Control not found',
        message: 'The specified control does not exist'
      });
    }

    logger.info('Fetching entities for control', {
      requestId: req.id,
      controlId,
      organizationId
    });

    const entities = await ControlAssignment.findByControlId(controlId, organizationId);

    res.status(200).json({
      success: true,
      entities,
      count: entities.length,
      control: {
        id: control.id,
        title: control.title,
        category: control.category
      }
    });
  } catch (error) {
    logger.error('Error fetching entities for control', {
      requestId: req.id,
      controlId: req.params.controlId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateControlStatus = async (req, res, next) => {
  try {
    const { entityId, controlId } = req.params;
    const { organizationId } = req.user;
    const statusData = req.body;

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    // Verify control assignment exists
    const existingAssignment = await ControlAssignment.findByEntityAndControl(entityId, controlId);
    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Control assignment not found',
        message: 'The specified control is not assigned to this entity'
      });
    }

    logger.info('Updating control status', {
      requestId: req.id,
      entityId,
      controlId,
      organizationId,
      statusData
    });

    const updatedAssignment = await ControlAssignment.updateStatus(entityId, controlId, statusData);

    logger.info('Control status updated successfully', {
      requestId: req.id,
      assignmentId: updatedAssignment.id
    });

    // Emit real-time event for control status change
    realtimeEventEmitter.emitControlStatusChanged({
      controlId: controlId,
      entityId: entityId,
      oldStatus: existingAssignment.status,
      newStatus: updatedAssignment.status,
      updatedBy: req.user.userId
    });

    res.status(200).json({
      success: true,
      message: 'Control status updated successfully',
      assignment: updatedAssignment
    });
  } catch (error) {
    logger.error('Error updating control status', {
      requestId: req.id,
      entityId: req.params.entityId,
      controlId: req.params.controlId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const removeControlFromEntity = async (req, res, next) => {
  try {
    const { entityId, controlId } = req.params;
    const { organizationId } = req.user;

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    logger.info('Removing control from entity', {
      requestId: req.id,
      entityId,
      controlId,
      organizationId
    });

    const assignment = await ControlAssignment.removeFromEntity(entityId, controlId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Control assignment not found',
        message: 'The specified control is not assigned to this entity'
      });
    }

    logger.info('Control removed from entity successfully', {
      requestId: req.id,
      assignmentId: assignment.id
    });

    res.status(200).json({
      success: true,
      message: 'Control removed from entity successfully'
    });
  } catch (error) {
    logger.error('Error removing control from entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      controlId: req.params.controlId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getEntityControlStats = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    logger.info('Fetching control stats for entity', {
      requestId: req.id,
      entityId,
      organizationId
    });

    const stats = await ControlAssignment.getImplementationStats(entityId, organizationId);

    res.status(200).json({
      success: true,
      stats,
      entity: {
        id: entity.id,
        name: entity.name,
        entityType: entity.entity_type
      }
    });
  } catch (error) {
    logger.error('Error fetching control stats for entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getControlsByStatus = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { status } = req.query;
    const { organizationId } = req.user;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status parameter required',
        message: 'Please specify a status filter'
      });
    }

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    logger.info('Fetching controls by status for entity', {
      requestId: req.id,
      entityId,
      status,
      organizationId
    });

    const controls = await ControlAssignment.getControlsByStatus(entityId, organizationId, status);

    res.status(200).json({
      success: true,
      controls,
      count: controls.length,
      status,
      entity: {
        id: entity.id,
        name: entity.name,
        entityType: entity.entity_type
      }
    });
  } catch (error) {
    logger.error('Error fetching controls by status for entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      status: req.query.status,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getOverdueControls = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    logger.info('Fetching overdue controls for entity', {
      requestId: req.id,
      entityId,
      organizationId
    });

    const controls = await ControlAssignment.getOverdueControls(entityId, organizationId);

    res.status(200).json({
      success: true,
      controls,
      count: controls.length,
      entity: {
        id: entity.id,
        name: entity.name,
        entityType: entity.entity_type
      }
    });
  } catch (error) {
    logger.error('Error fetching overdue controls for entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getUpcomingControls = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { days = 7 } = req.query;
    const { organizationId } = req.user;

    // Verify entity exists and belongs to the organization
    const entity = await Entity.findById(entityId, organizationId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    logger.info('Fetching upcoming controls for entity', {
      requestId: req.id,
      entityId,
      days,
      organizationId
    });

    const controls = await ControlAssignment.getUpcomingControls(entityId, organizationId, parseInt(days));

    res.status(200).json({
      success: true,
      controls,
      count: controls.length,
      days: parseInt(days),
      entity: {
        id: entity.id,
        name: entity.name,
        entityType: entity.entity_type
      }
    });
  } catch (error) {
    logger.error('Error fetching upcoming controls for entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      days: req.query.days,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  assignControlToEntity,
  getEntityControls,
  getControlEntities,
  updateControlStatus,
  removeControlFromEntity,
  getEntityControlStats,
  getControlsByStatus,
  getOverdueControls,
  getUpcomingControls
};
