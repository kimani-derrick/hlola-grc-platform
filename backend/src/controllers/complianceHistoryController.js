const ComplianceHistory = require('../models/ComplianceHistory');
const logger = require('../config/logger');

const recordEvent = async (req, res, next) => {
  try {
    const {
      entityId,
      frameworkId,
      complianceScore,
      milestone,
      eventType,
      eventDate,
      description
    } = req.body;

    // Verify entity belongs to user's organization
    const { pool } = require('../config/database');
    const entityResult = await pool.query(
      'SELECT id FROM entities WHERE id = $1 AND organization_id = $2',
      [entityId, req.user.organizationId]
    );

    if (entityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found'
      });
    }

    const historyEvent = await ComplianceHistory.create({
      entityId,
      frameworkId,
      complianceScore,
      milestone,
      eventType,
      eventDate,
      description
    });

    logger.info('Compliance history event recorded successfully', {
      requestId: req.requestId,
      historyId: historyEvent.id,
      milestone: historyEvent.milestone,
      eventType: historyEvent.event_type,
      entityId: historyEvent.entity_id,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Compliance history event recorded successfully',
      data: historyEvent
    });
  } catch (error) {
    logger.error('Error recording compliance history event', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const {
      entityId,
      frameworkId,
      eventType,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
      sortBy = 'event_date',
      sortOrder = 'DESC'
    } = req.query;

    const history = await ComplianceHistory.findAll({
      organizationId,
      entityId,
      frameworkId,
      eventType,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder
    });

    logger.info('Compliance history retrieved successfully', {
      requestId: req.requestId,
      count: history.length,
      filters: { entityId, frameworkId, eventType, startDate, endDate },
      userId: req.user.id
    });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    logger.error('Error retrieving compliance history', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const getTrend = async (req, res, next) => {
  try {
    const { entityId, frameworkId, months = 12 } = req.query;

    if (!entityId) {
      return res.status(400).json({
        success: false,
        message: 'Entity ID is required for compliance trend'
      });
    }

    // Verify entity belongs to user's organization
    const { pool } = require('../config/database');
    const entityResult = await pool.query(
      'SELECT id FROM entities WHERE id = $1 AND organization_id = $2',
      [entityId, req.user.organizationId]
    );

    if (entityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found'
      });
    }

    const trend = await ComplianceHistory.getComplianceTrend(
      entityId,
      frameworkId,
      parseInt(months)
    );

    logger.info('Compliance trend retrieved successfully', {
      requestId: req.requestId,
      entityId,
      frameworkId,
      months: parseInt(months),
      dataPoints: trend.length,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: trend
    });
  } catch (error) {
    logger.error('Error retrieving compliance trend', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      entityId: req.query.entityId,
      frameworkId: req.query.frameworkId,
      userId: req.user.id
    });
    next(error);
  }
};

const getLatestComplianceScore = async (req, res, next) => {
  try {
    const { entityId, frameworkId } = req.query;

    if (!entityId) {
      return res.status(400).json({
        success: false,
        message: 'Entity ID is required for latest compliance score'
      });
    }

    // Verify entity belongs to user's organization
    const { pool } = require('../config/database');
    const entityResult = await pool.query(
      'SELECT id FROM entities WHERE id = $1 AND organization_id = $2',
      [entityId, req.user.organizationId]
    );

    if (entityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found'
      });
    }

    const latestScore = await ComplianceHistory.getLatestComplianceScore(
      entityId,
      frameworkId
    );

    logger.info('Latest compliance score retrieved successfully', {
      requestId: req.requestId,
      entityId,
      frameworkId,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: latestScore
    });
  } catch (error) {
    logger.error('Error retrieving latest compliance score', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      entityId: req.query.entityId,
      frameworkId: req.query.frameworkId,
      userId: req.user.id
    });
    next(error);
  }
};

const getComplianceStats = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;

    const stats = await ComplianceHistory.getComplianceStats(organizationId);

    logger.info('Compliance statistics retrieved successfully', {
      requestId: req.requestId,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error retrieving compliance statistics', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

module.exports = {
  recordEvent,
  getHistory,
  getTrend,
  getLatestComplianceScore,
  getComplianceStats
};
