const Audit = require('../models/Audit');
const AuditFinding = require('../models/AuditFinding');
const logger = require('../config/logger');

// Audit Management Handlers
const createAudit = async (req, res, next) => {
  try {
    const {
      entityId,
      frameworkId,
      auditPackageId,
      title,
      description,
      auditType,
      priority,
      auditor,
      startDate,
      endDate,
      progress,
      nextMilestone,
      estimatedCompletion
    } = req.body;

    const audit = await Audit.create({
      entityId,
      frameworkId,
      auditPackageId,
      title,
      description,
      auditType,
      priority,
      auditor,
      startDate,
      endDate,
      progress,
      nextMilestone,
      estimatedCompletion,
      createdBy: req.user.id
    });

    logger.info('Audit created successfully', {
      requestId: req.requestId,
      auditId: audit.id,
      title: audit.title,
      auditType: audit.audit_type,
      entityId: audit.entity_id,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Audit created successfully',
      data: audit
    });
  } catch (error) {
    logger.error('Error creating audit', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const getAudit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const audit = await Audit.getAuditWithFindings(id, organizationId);

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    logger.info('Audit retrieved successfully', {
      requestId: req.requestId,
      auditId: id,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: audit
    });
  } catch (error) {
    logger.error('Error retrieving audit', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const getAllAudits = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const {
      entityId,
      frameworkId,
      status,
      auditType,
      priority,
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const audits = await Audit.findAll({
      organizationId,
      entityId,
      frameworkId,
      status,
      auditType,
      priority,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder
    });

    const totalCount = await Audit.countAll({
      organizationId,
      entityId,
      frameworkId,
      status,
      auditType,
      priority
    });

    logger.info('Audits retrieved successfully', {
      requestId: req.requestId,
      count: audits.length,
      totalCount,
      filters: { entityId, frameworkId, status, auditType, priority },
      userId: req.user.id
    });

    res.json({
      success: true,
      data: audits,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + audits.length < totalCount
      }
    });
  } catch (error) {
    logger.error('Error retrieving audits', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

const updateAudit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(id, organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const updates = req.body;
    const updatedAudit = await Audit.update(id, updates);

    logger.info('Audit updated successfully', {
      requestId: req.requestId,
      auditId: id,
      updates: Object.keys(updates),
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit updated successfully',
      data: updatedAudit
    });
  } catch (error) {
    logger.error('Error updating audit', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const deleteAudit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(id, organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const deletedAudit = await Audit.delete(id);

    logger.info('Audit deleted successfully', {
      requestId: req.requestId,
      auditId: id,
      title: deletedAudit.title,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit deleted successfully',
      data: { id: deletedAudit.id, title: deletedAudit.title }
    });
  } catch (error) {
    logger.error('Error deleting audit', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const updateAuditProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress, nextMilestone } = req.body;
    const organizationId = req.user.organizationId;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(id, organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const updatedAudit = await Audit.updateProgress(id, progress, nextMilestone);

    logger.info('Audit progress updated successfully', {
      requestId: req.requestId,
      auditId: id,
      progress,
      nextMilestone,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit progress updated successfully',
      data: updatedAudit
    });
  } catch (error) {
    logger.error('Error updating audit progress', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const updateAuditStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const organizationId = req.user.organizationId;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(id, organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const updatedAudit = await Audit.updateStatus(id, status);

    logger.info('Audit status updated successfully', {
      requestId: req.requestId,
      auditId: id,
      status,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit status updated successfully',
      data: updatedAudit
    });
  } catch (error) {
    logger.error('Error updating audit status', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const getAuditStats = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;

    const stats = await Audit.getAuditStats(organizationId);

    logger.info('Audit statistics retrieved successfully', {
      requestId: req.requestId,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error retrieving audit statistics', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      userId: req.user.id
    });
    next(error);
  }
};

// Audit Findings Management Handlers
const createFinding = async (req, res, next) => {
  try {
    const { id: auditId } = req.params;
    const {
      controlId,
      findingType,
      severity,
      title,
      description,
      evidence,
      recommendation,
      assignedTo,
      dueDate
    } = req.body;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(auditId, req.user.organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const finding = await AuditFinding.create({
      auditId,
      controlId,
      findingType,
      severity,
      title,
      description,
      evidence,
      recommendation,
      assignedTo,
      dueDate
    });

    logger.info('Audit finding created successfully', {
      requestId: req.requestId,
      findingId: finding.id,
      auditId,
      title: finding.title,
      severity: finding.severity,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Audit finding created successfully',
      data: finding
    });
  } catch (error) {
    logger.error('Error creating audit finding', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const getFindings = async (req, res, next) => {
  try {
    const { id: auditId } = req.params;
    const { severity, status, assignedTo, findingType, limit, offset, sortBy, sortOrder } = req.query;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(auditId, req.user.organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const findings = await AuditFinding.findAll({
      auditId,
      severity,
      status,
      assignedTo,
      findingType,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'DESC'
    });

    logger.info('Audit findings retrieved successfully', {
      requestId: req.requestId,
      auditId,
      count: findings.length,
      filters: { severity, status, assignedTo, findingType },
      userId: req.user.id
    });

    res.json({
      success: true,
      data: findings
    });
  } catch (error) {
    logger.error('Error retrieving audit findings', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

const updateFinding = async (req, res, next) => {
  try {
    const { auditId, findingId } = req.params;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(auditId, req.user.organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    // Check if finding exists and belongs to the audit
    const existingFinding = await AuditFinding.findById(findingId);
    if (!existingFinding || existingFinding.audit_id !== auditId) {
      return res.status(404).json({
        success: false,
        message: 'Finding not found'
      });
    }

    const updates = req.body;
    const updatedFinding = await AuditFinding.update(findingId, updates);

    logger.info('Audit finding updated successfully', {
      requestId: req.requestId,
      findingId,
      auditId,
      updates: Object.keys(updates),
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit finding updated successfully',
      data: updatedFinding
    });
  } catch (error) {
    logger.error('Error updating audit finding', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      findingId: req.params.findingId,
      auditId: req.params.auditId,
      userId: req.user.id
    });
    next(error);
  }
};

const deleteFinding = async (req, res, next) => {
  try {
    const { auditId, findingId } = req.params;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(auditId, req.user.organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    // Check if finding exists and belongs to the audit
    const existingFinding = await AuditFinding.findById(findingId);
    if (!existingFinding || existingFinding.audit_id !== auditId) {
      return res.status(404).json({
        success: false,
        message: 'Finding not found'
      });
    }

    const deletedFinding = await AuditFinding.delete(findingId);

    logger.info('Audit finding deleted successfully', {
      requestId: req.requestId,
      findingId,
      auditId,
      title: deletedFinding.title,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Audit finding deleted successfully',
      data: { id: deletedFinding.id, title: deletedFinding.title }
    });
  } catch (error) {
    logger.error('Error deleting audit finding', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      findingId: req.params.findingId,
      auditId: req.params.auditId,
      userId: req.user.id
    });
    next(error);
  }
};

const getFindingsStats = async (req, res, next) => {
  try {
    const { id: auditId } = req.params;

    // First check if audit exists and belongs to user's organization
    const existingAudit = await Audit.findById(auditId, req.user.organizationId);
    if (!existingAudit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const stats = await AuditFinding.getFindingsStats(auditId);

    logger.info('Audit findings statistics retrieved successfully', {
      requestId: req.requestId,
      auditId,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error retrieving audit findings statistics', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
      auditId: req.params.id,
      userId: req.user.id
    });
    next(error);
  }
};

module.exports = {
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
};
