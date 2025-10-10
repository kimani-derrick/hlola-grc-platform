const AuditTimeline = require('../models/AuditTimeline');
const logger = require('../config/logger');

const createEvent = async (req, res, next) => {
  try {
    const {
      entityId,
      frameworkId,
      eventType,
      eventDate,
      eventTitle,
      description,
      status,
      relatedDocuments
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

    const timelineEvent = await AuditTimeline.create({
      entityId,
      frameworkId,
      eventType,
      eventDate,
      eventTitle,
      description,
      status,
      relatedDocuments
    });

    logger.info('Audit timeline event created successfully', {
      requestId: req.requestId,
      timelineId: timelineEvent.id,
      eventTitle: timelineEvent.event_title,
      eventType: timelineEvent.event_type,
      entityId: timelineEvent.entity_id,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Audit timeline event created successfully',
      data: timelineEvent
    });
  } catch (error) {
    logger.error('Error creating audit timeline event', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const {
      entityId,
      frameworkId,
      eventType,
      status,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
      sortBy = 'event_date',
      sortOrder = 'DESC'
    } = req.query;

    const events = await AuditTimeline.findAll({
      organizationId,
      entityId,
      frameworkId,
      eventType,
      status,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder
    });

    logger.info('Audit timeline events retrieved successfully', {
      requestId: req.requestId,
      count: events.length,
      filters: { entityId, frameworkId, eventType, status, startDate, endDate },
      userId: req.user.id
    });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    logger.error('Error retrieving audit timeline events', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const getUpcomingEvents = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { daysAhead = 30 } = req.query;

    const events = await AuditTimeline.getUpcomingEvents(
      organizationId,
      parseInt(daysAhead)
    );

    logger.info('Upcoming audit timeline events retrieved successfully', {
      requestId: req.requestId,
      count: events.length,
      daysAhead: parseInt(daysAhead),
      userId: req.user.id
    });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    logger.error('Error retrieving upcoming audit timeline events', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    // First check if event exists and belongs to user's organization
    const existingEvent = await AuditTimeline.findById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Timeline event not found'
      });
    }

    // Verify entity belongs to user's organization
    const { pool } = require('../config/database');
    const entityResult = await pool.query(
      'SELECT id FROM entities WHERE id = $1 AND organization_id = $2',
      [existingEvent.entity_id, organizationId]
    );

    if (entityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Timeline event not found'
      });
    }

    const updates = req.body;
    const updatedEvent = await AuditTimeline.update(id, updates);

    logger.info('Audit timeline event updated successfully', {
      requestId: req.requestId,
      eventId: id,
      updates: Object.keys(updates),
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit timeline event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    logger.error('Error updating audit timeline event', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      eventId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    // First check if event exists and belongs to user's organization
    const existingEvent = await AuditTimeline.findById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Timeline event not found'
      });
    }

    // Verify entity belongs to user's organization
    const { pool } = require('../config/database');
    const entityResult = await pool.query(
      'SELECT id FROM entities WHERE id = $1 AND organization_id = $2',
      [existingEvent.entity_id, organizationId]
    );

    if (entityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Timeline event not found'
      });
    }

    const deletedEvent = await AuditTimeline.delete(id);

    logger.info('Audit timeline event deleted successfully', {
      requestId: req.requestId,
      eventId: id,
      eventTitle: deletedEvent.event_title,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit timeline event deleted successfully',
      data: { id: deletedEvent.id, eventTitle: deletedEvent.event_title }
    });
  } catch (error) {
    logger.error('Error deleting audit timeline event', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      eventId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const getTimelineStats = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;

    const stats = await AuditTimeline.getTimelineStats(organizationId);

    logger.info('Audit timeline statistics retrieved successfully', {
      requestId: req.requestId,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error retrieving audit timeline statistics', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
  getTimelineStats
};
