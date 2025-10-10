const Entity = require('../models/Entity');
const logger = require('../config/logger');

const createEntity = async (req, res, next) => {
  try {
    const { name, description, entityType, country, region, industry, size, riskLevel, complianceOfficer } = req.body;
    const { organizationId } = req.user; // From authenticated user

    logger.info('Creating entity', {
      requestId: req.id,
      organizationId: organizationId,
      name: name,
      entityType: entityType
    });

    const entity = await Entity.create({
      organizationId,
      name,
      description,
      entityType,
      country,
      region,
      industry,
      size,
      riskLevel,
      complianceOfficer
    });

    logger.info('Entity created successfully', {
      requestId: req.id,
      entityId: entity.id,
      name: entity.name
    });

    res.status(201).json({
      success: true,
      message: 'Entity created successfully',
      entity
    });
  } catch (error) {
    logger.error('Error creating entity', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getEntity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching entity', {
      requestId: req.id,
      entityId: id,
      organizationId: organizationId
    });

    const entity = await Entity.findById(id);

    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The requested entity does not exist'
      });
    }

    // Verify entity belongs to user's organization
    if (entity.organization_id !== organizationId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You do not have permission to access this entity'
      });
    }

    res.status(200).json({
      success: true,
      entity
    });
  } catch (error) {
    logger.error('Error fetching entity', {
      requestId: req.id,
      entityId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getEntitiesByOrganization = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    logger.info('Fetching entities for organization', {
      requestId: req.id,
      organizationId: organizationId
    });

    const entities = await Entity.findByOrganizationId(organizationId);

    res.status(200).json({
      success: true,
      entities,
      count: entities.length
    });
  } catch (error) {
    logger.error('Error fetching entities', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateEntity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, role } = req.user;
    const { name, description, entityType, country, region, industry, size, riskLevel, complianceOfficer } = req.body;

    // Check if user has permission to update entities
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only administrators can update entities'
      });
    }

    logger.info('Updating entity', {
      requestId: req.id,
      entityId: id,
      organizationId: organizationId,
      updates: { name, entityType, riskLevel }
    });

    // First verify entity exists and belongs to organization
    const existingEntity = await Entity.findById(id);
    if (!existingEntity || existingEntity.organization_id !== organizationId) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The requested entity does not exist or you do not have permission to access it'
      });
    }

    const entity = await Entity.update(id, {
      name,
      description,
      entityType,
      country,
      region,
      industry,
      size,
      riskLevel,
      complianceOfficer
    });

    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The requested entity does not exist'
      });
    }

    logger.info('Entity updated successfully', {
      requestId: req.id,
      entityId: entity.id
    });

    res.status(200).json({
      success: true,
      message: 'Entity updated successfully',
      entity
    });
  } catch (error) {
    logger.error('Error updating entity', {
      requestId: req.id,
      entityId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const deleteEntity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, role } = req.user;

    // Check if user has permission to delete entities
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only administrators can delete entities'
      });
    }

    logger.info('Deleting entity', {
      requestId: req.id,
      entityId: id,
      organizationId: organizationId
    });

    // First verify entity exists and belongs to organization
    const existingEntity = await Entity.findById(id);
    if (!existingEntity || existingEntity.organization_id !== organizationId) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The requested entity does not exist or you do not have permission to access it'
      });
    }

    const entity = await Entity.delete(id);

    if (!entity) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The requested entity does not exist'
      });
    }

    logger.info('Entity deleted successfully', {
      requestId: req.id,
      entityId: id
    });

    res.status(200).json({
      success: true,
      message: 'Entity deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting entity', {
      requestId: req.id,
      entityId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const assignUserToEntity = async (req, res, next) => {
  try {
    const { id: entityId } = req.params;
    const { userId } = req.body;
    const { organizationId, role } = req.user;

    // Check if user has permission to assign users
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only administrators can assign users to entities'
      });
    }

    logger.info('Assigning user to entity', {
      requestId: req.id,
      entityId: entityId,
      userId: userId,
      organizationId: organizationId
    });

    // Verify entity exists and belongs to organization
    const entity = await Entity.findById(entityId);
    if (!entity || entity.organization_id !== organizationId) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The requested entity does not exist or you do not have permission to access it'
      });
    }

    const result = await Entity.assignUser(entityId, userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    logger.info('User assigned to entity successfully', {
      requestId: req.id,
      entityId: entityId,
      userId: userId
    });

    res.status(200).json({
      success: true,
      message: 'User assigned to entity successfully',
      assignment: result
    });
  } catch (error) {
    logger.error('Error assigning user to entity', {
      requestId: req.id,
      entityId: req.params.id,
      userId: req.body.userId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getEntityUsers = async (req, res, next) => {
  try {
    const { id: entityId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching entity users', {
      requestId: req.id,
      entityId: entityId,
      organizationId: organizationId
    });

    // Verify entity exists and belongs to organization
    const entity = await Entity.findById(entityId);
    if (!entity || entity.organization_id !== organizationId) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The requested entity does not exist or you do not have permission to access it'
      });
    }

    const users = await Entity.getUsersByEntityId(entityId);

    res.status(200).json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    logger.error('Error fetching entity users', {
      requestId: req.id,
      entityId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  createEntity,
  getEntity,
  getEntitiesByOrganization,
  updateEntity,
  deleteEntity,
  assignUserToEntity,
  getEntityUsers
};
