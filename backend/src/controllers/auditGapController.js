const AuditGap = require('../models/AuditGap');
const logger = require('../config/logger');

const createGap = async (req, res, next) => {
  try {
    const {
      entityId,
      frameworkId,
      controlId,
      title,
      description,
      category,
      severity,
      impactDescription,
      remediationPlan,
      estimatedEffort,
      assignedTo,
      assignedTeam,
      dueDate
    } = req.body;

    const gap = await AuditGap.create({
      entityId,
      frameworkId,
      controlId,
      title,
      description,
      category,
      severity,
      impactDescription,
      remediationPlan,
      estimatedEffort,
      assignedTo,
      assignedTeam,
      dueDate
    });

    logger.info('Audit gap created successfully', {
      requestId: req.requestId,
      gapId: gap.id,
      title: gap.title,
      severity: gap.severity,
      entityId: gap.entity_id,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Audit gap created successfully',
      data: gap
    });
  } catch (error) {
    logger.error('Error creating audit gap', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const getGap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const gap = await AuditGap.findById(id, organizationId);

    if (!gap) {
      return res.status(404).json({
        success: false,
        message: 'Audit gap not found'
      });
    }

    logger.info('Audit gap retrieved successfully', {
      requestId: req.requestId,
      gapId: id,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: gap
    });
  } catch (error) {
    logger.error('Error retrieving audit gap', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      gapId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const getAllGaps = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const {
      entityId,
      frameworkId,
      category,
      severity,
      status,
      assignedTo,
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const gaps = await AuditGap.findAll({
      organizationId,
      entityId,
      frameworkId,
      category,
      severity,
      status,
      assignedTo,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder
    });

    logger.info('Audit gaps retrieved successfully', {
      requestId: req.requestId,
      count: gaps.length,
      filters: { entityId, frameworkId, category, severity, status, assignedTo },
      userId: req.user.id
    });

    res.json({
      success: true,
      data: gaps
    });
  } catch (error) {
    logger.error('Error retrieving audit gaps', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const updateGap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    // First check if gap exists and belongs to user's organization
    const existingGap = await AuditGap.findById(id, organizationId);
    if (!existingGap) {
      return res.status(404).json({
        success: false,
        message: 'Audit gap not found'
      });
    }

    const updates = req.body;
    const updatedGap = await AuditGap.update(id, updates);

    logger.info('Audit gap updated successfully', {
      requestId: req.requestId,
      gapId: id,
      updates: Object.keys(updates),
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit gap updated successfully',
      data: updatedGap
    });
  } catch (error) {
    logger.error('Error updating audit gap', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      gapId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const deleteGap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    // First check if gap exists and belongs to user's organization
    const existingGap = await AuditGap.findById(id, organizationId);
    if (!existingGap) {
      return res.status(404).json({
        success: false,
        message: 'Audit gap not found'
      });
    }

    const deletedGap = await AuditGap.delete(id);

    logger.info('Audit gap deleted successfully', {
      requestId: req.requestId,
      gapId: id,
      title: deletedGap.title,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit gap deleted successfully',
      data: { id: deletedGap.id, title: deletedGap.title }
    });
  } catch (error) {
    logger.error('Error deleting audit gap', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      gapId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const updateGapStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const organizationId = req.user.organizationId;

    // First check if gap exists and belongs to user's organization
    const existingGap = await AuditGap.findById(id, organizationId);
    if (!existingGap) {
      return res.status(404).json({
        success: false,
        message: 'Audit gap not found'
      });
    }

    const resolvedAt = status === 'resolved' || status === 'closed' ? new Date() : null;
    const updatedGap = await AuditGap.updateStatus(id, status, resolvedAt);

    logger.info('Audit gap status updated successfully', {
      requestId: req.requestId,
      gapId: id,
      status,
      resolvedAt,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit gap status updated successfully',
      data: updatedGap
    });
  } catch (error) {
    logger.error('Error updating audit gap status', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      gapId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const getGapStats = async (req, res, next) => {
  try {
    const { entityId } = req.query;
    const organizationId = req.user.organizationId;

    if (!entityId) {
      return res.status(400).json({
        success: false,
        message: 'Entity ID is required for gap statistics'
      });
    }

    // Verify entity belongs to user's organization
    const { pool } = require('../config/database');
    const entityResult = await pool.query(
      'SELECT id FROM entities WHERE id = $1 AND organization_id = $2',
      [entityId, organizationId]
    );

    if (entityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found'
      });
    }

    const stats = await AuditGap.getGapStats(entityId);

    logger.info('Audit gap statistics retrieved successfully', {
      requestId: req.requestId,
      entityId,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error retrieving audit gap statistics', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      entityId: req.query.entityId,
      userId: req.user.id
    });
    next(error);
  }
};

module.exports = {
  createGap,
  getGap,
  getAllGaps,
  updateGap,
  deleteGap,
  updateGapStatus,
  getGapStats
};
