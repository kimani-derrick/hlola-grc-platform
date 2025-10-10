const Document = require('../models/Document');
const Entity = require('../models/Entity');
const Framework = require('../models/Framework');
const Control = require('../models/Control');
const Task = require('../models/Task');
const storageService = require('../services/storageService');
const realtimeEventEmitter = require('../services/realtimeEventEmitter');
const logger = require('../config/logger');

const uploadDocument = async (req, res, next) => {
  try {
    const { organizationId, userId } = req.user;
    const {
      entityId,
      title,
      description,
      documentType,
      frameworkId,
      controlId,
      taskId,
      tags,
      accessLevel,
      expiryDate
    } = req.body;

    logger.info('Uploading document', {
      requestId: req.id,
      organizationId: organizationId,
      entityId: entityId,
      title: title,
      documentType: documentType
    });

    // Verify entity exists and belongs to organization
    const entity = await Entity.findById(entityId);
    if (!entity || entity.organization_id !== organizationId) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found',
        message: 'The specified entity does not exist or you do not have permission to access it'
      });
    }

    // Verify framework if provided
    if (frameworkId) {
      const framework = await Framework.findById(frameworkId);
      if (!framework) {
        return res.status(404).json({
          success: false,
          error: 'Framework not found',
          message: 'The specified framework does not exist'
        });
      }
    }

    // Verify control if provided
    if (controlId) {
      const control = await Control.findById(controlId);
      if (!control) {
        return res.status(404).json({
          success: false,
          error: 'Control not found',
          message: 'The specified control does not exist'
        });
      }
    }

    // Verify task if provided
    if (taskId) {
      const task = await Task.findById(taskId, organizationId);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
          message: 'The specified task does not exist or you do not have permission to access it'
        });
      }
    }

    // Generate file path
    const filePath = storageService.generateFilePath(
      organizationId,
      entityId,
      documentType,
      req.fileMetadata.fileName
    );

    // Upload file to storage
    const uploadResult = await storageService.upload(
      {
        buffer: req.fileMetadata.buffer,
        mimetype: req.fileMetadata.mimeType,
        originalname: req.fileMetadata.originalName
      },
      filePath,
      {
        organizationId: organizationId,
        entityId: entityId,
        documentType: documentType,
        uploadedBy: userId
      }
    );

    // Create document record
    const document = await Document.create({
      entityId,
      frameworkId: frameworkId || null,
      controlId: controlId || null,
      taskId: taskId || null,
      title,
      description: description || '',
      documentType,
      filePath: uploadResult.path,
      fileSize: req.fileMetadata.fileSize,
      mimeType: req.fileMetadata.mimeType,
      uploadedBy: userId,
      isEvidence: documentType === 'evidence'
    });

    logger.info('Document uploaded successfully', {
      requestId: req.id,
      documentId: document.id,
      title: document.title,
      filePath: uploadResult.path
    });

    // Trigger compliance event listener
    try {
      const ComplianceEventListener = require('../services/complianceEventListener');
      await ComplianceEventListener.onDocumentUploaded(document);
    } catch (error) {
      logger.error('Error triggering compliance event for document upload', {
        error: error.message,
        documentId: document.id,
        entityId: document.entity_id
      });
    }

    // Emit real-time event for document upload
    realtimeEventEmitter.emitDocumentUploaded({
      documentId: document.id,
      entityId: document.entity_id,
      controlId: document.control_id,
      frameworkId: document.framework_id,
      documentType: document.document_type,
      uploadedBy: userId
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        name: document.name,
        description: document.description,
        documentType: document.document_type,
        filePath: document.file_path,
        fileSize: document.file_size,
        mimeType: document.mime_type,
        isEvidence: document.is_evidence,
        status: document.status,
        createdAt: document.created_at,
        url: uploadResult.url
      }
    });
  } catch (error) {
    logger.error('Error uploading document', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching document', {
      requestId: req.id,
      documentId: id,
      organizationId: organizationId
    });

    const document = await Document.findById(id, organizationId);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The requested document does not exist or you do not have permission to access it'
      });
    }

    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    logger.error('Error fetching document', {
      requestId: req.id,
      documentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const downloadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    logger.info('Downloading document', {
      requestId: req.id,
      documentId: id,
      organizationId: organizationId
    });

    const document = await Document.findById(id, organizationId);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The requested document does not exist or you do not have permission to access it'
      });
    }

    // Get file stream from storage
    const fileStream = await storageService.download(document.file_path);

    // Set response headers
    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
    res.setHeader('Content-Length', document.file_size);

    // Pipe file stream to response
    fileStream.pipe(res);

    logger.info('Document download initiated', {
      requestId: req.id,
      documentId: id,
      fileName: document.name
    });
  } catch (error) {
    logger.error('Error downloading document', {
      requestId: req.id,
      documentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getDocumentUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;
    const { expiresIn = 3600 } = req.query;

    logger.info('Generating document URL', {
      requestId: req.id,
      documentId: id,
      organizationId: organizationId,
      expiresIn: expiresIn
    });

    const document = await Document.findById(id, organizationId);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The requested document does not exist or you do not have permission to access it'
      });
    }

    // Generate signed URL
    const signedUrl = await storageService.getSignedUrl(document.file_path, parseInt(expiresIn));

    res.status(200).json({
      success: true,
      url: signedUrl,
      expiresIn: parseInt(expiresIn),
      document: {
        id: document.id,
        name: document.name,
        fileSize: document.file_size,
        mimeType: document.mime_type
      }
    });
  } catch (error) {
    logger.error('Error generating document URL', {
      requestId: req.id,
      documentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getAllDocuments = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const {
      limit,
      offset,
      search,
      entityId,
      frameworkId,
      controlId,
      taskId,
      documentType,
      accessLevel,
      tags
    } = req.query;

    logger.info('Fetching all documents', {
      requestId: req.id,
      organizationId: organizationId,
      filters: req.query
    });

    const filters = {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      search,
      entityId,
      frameworkId,
      controlId,
      taskId,
      documentType,
      accessLevel,
      tags: tags ? tags.split(',') : undefined
    };

    const documents = await Document.findAll(organizationId, filters);
    const total = await Document.countAll(organizationId, filters);

    res.status(200).json({
      success: true,
      documents,
      pagination: {
        total,
        limit: parseInt(limit) || null,
        offset: parseInt(offset) || null
      }
    });
  } catch (error) {
    logger.error('Error fetching all documents', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getDocumentsByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;
    const { documentType, accessLevel, search, tags, limit, offset } = req.query;

    logger.info('Fetching documents for entity', {
      requestId: req.id,
      entityId: entityId,
      organizationId: organizationId
    });

    const filters = {
      documentType,
      accessLevel,
      search,
      tags: tags ? tags.split(',') : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    };

    const documents = await Document.findByEntity(entityId, organizationId, filters);

    res.status(200).json({
      success: true,
      documents,
      count: documents.length
    });
  } catch (error) {
    logger.error('Error fetching documents for entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getDocumentsByControl = async (req, res, next) => {
  try {
    const { controlId } = req.params;
    const { organizationId } = req.user;
    const { documentType, limit } = req.query;

    logger.info('Fetching documents for control', {
      requestId: req.id,
      controlId: controlId,
      organizationId: organizationId
    });

    const filters = {
      documentType,
      limit: limit ? parseInt(limit) : undefined
    };

    const documents = await Document.findByControl(controlId, organizationId, filters);

    res.status(200).json({
      success: true,
      documents,
      count: documents.length
    });
  } catch (error) {
    logger.error('Error fetching documents for control', {
      requestId: req.id,
      controlId: req.params.controlId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getDocumentsByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { organizationId } = req.user;
    const { documentType, limit } = req.query;

    logger.info('Fetching documents for task', {
      requestId: req.id,
      taskId: taskId,
      organizationId: organizationId
    });

    const filters = {
      documentType,
      limit: limit ? parseInt(limit) : undefined
    };

    const documents = await Document.findByTask(taskId, organizationId, filters);

    res.status(200).json({
      success: true,
      documents,
      count: documents.length
    });
  } catch (error) {
    logger.error('Error fetching documents for task', {
      requestId: req.id,
      taskId: req.params.taskId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, userId, role } = req.user;
    const updates = req.body;

    logger.info('Updating document', {
      requestId: req.id,
      documentId: id,
      organizationId: organizationId,
      updates: updates
    });

    // Check if document exists and user has permission
    const existingDocument = await Document.findById(id, organizationId);
    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The requested document does not exist or you do not have permission to update it'
      });
    }

    // Check authorization - admin, compliance_manager, or document uploader
    if (role !== 'admin' && role !== 'compliance_manager' && existingDocument.uploaded_by !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to update this document'
      });
    }

    const updatedDocument = await Document.update(id, updates);

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    logger.info('Document updated successfully', {
      requestId: req.id,
      documentId: updatedDocument.id
    });

    // Emit real-time event for document update
    realtimeEventEmitter.emitDocumentUpdated({
      documentId: updatedDocument.id,
      entityId: updatedDocument.entity_id,
      controlId: updatedDocument.control_id,
      frameworkId: updatedDocument.framework_id,
      documentType: updatedDocument.document_type,
      updatedBy: userId
    });

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      document: updatedDocument
    });
  } catch (error) {
    logger.error('Error updating document', {
      requestId: req.id,
      documentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, role } = req.user;

    logger.info('Deleting document', {
      requestId: req.id,
      documentId: id,
      organizationId: organizationId
    });

    // Only admin can delete documents
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'Only administrators can delete documents'
      });
    }

    // Ensure the document belongs to the organization before deleting
    const existingDocument = await Document.findById(id, organizationId);
    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The requested document does not exist or you do not have permission to delete it'
      });
    }

    // Delete file from storage
    try {
      await storageService.delete(existingDocument.file_path);
    } catch (storageError) {
      logger.warn('Error deleting file from storage', {
        documentId: id,
        filePath: existingDocument.file_path,
        error: storageError.message
      });
      // Continue with database deletion even if storage deletion fails
    }

    const document = await Document.delete(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    logger.info('Document deleted successfully', {
      requestId: req.id,
      documentId: id
    });

    // Trigger compliance event listener
    try {
      const ComplianceEventListener = require('../services/complianceEventListener');
      await ComplianceEventListener.onDocumentDeleted(document);
    } catch (error) {
      logger.error('Error triggering compliance event for document deletion', {
        error: error.message,
        documentId: id,
        entityId: document.entity_id
      });
    }

    // Emit real-time event for document deletion
    realtimeEventEmitter.emitDocumentDeleted({
      documentId: id,
      entityId: document.entity_id,
      controlId: document.control_id,
      frameworkId: document.framework_id,
      documentType: document.document_type,
      deletedBy: userId
    });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting document', {
      requestId: req.id,
      documentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const createDocumentVersion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, userId } = req.user;
    const {
      entityId,
      title,
      description,
      documentType,
      frameworkId,
      controlId,
      taskId,
      tags,
      accessLevel,
      expiryDate
    } = req.body;

    logger.info('Creating document version', {
      requestId: req.id,
      parentDocumentId: id,
      organizationId: organizationId,
      title: title
    });

    // Check if parent document exists and user has permission
    const parentDocument = await Document.findById(id, organizationId);
    if (!parentDocument) {
      return res.status(404).json({
        success: false,
        error: 'Parent document not found',
        message: 'The parent document does not exist or you do not have permission to access it'
      });
    }

    // Generate file path for new version
    const filePath = storageService.generateFilePath(
      organizationId,
      entityId,
      documentType,
      req.fileMetadata.fileName
    );

    // Upload new file to storage
    const uploadResult = await storageService.upload(
      {
        buffer: req.fileMetadata.buffer,
        mimetype: req.fileMetadata.mimeType,
        originalname: req.fileMetadata.originalName
      },
      filePath,
      {
        organizationId: organizationId,
        entityId: entityId,
        documentType: documentType,
        uploadedBy: userId,
        parentDocumentId: id
      }
    );

    // Create new version
    const document = await Document.createVersion(id, {
      entityId,
      frameworkId: frameworkId || null,
      controlId: controlId || null,
      taskId: taskId || null,
      title,
      description: description || '',
      documentType,
      fileName: req.fileMetadata.fileName,
      filePath: uploadResult.path,
      fileSize: req.fileMetadata.fileSize,
      fileExtension: req.fileMetadata.fileExtension,
      mimeType: req.fileMetadata.mimeType,
      uploadedBy: userId,
      tags: tags || [],
      metadata: {
        storageProvider: process.env.STORAGE_PROVIDER || 'local',
        originalName: req.fileMetadata.originalName,
        uploadTimestamp: new Date().toISOString(),
        parentDocumentId: id
      },
      accessLevel: accessLevel || 'internal',
      expiryDate: expiryDate || null
    });

    logger.info('Document version created successfully', {
      requestId: req.id,
      documentId: document.id,
      parentDocumentId: id,
      version: document.version
    });

    res.status(201).json({
      success: true,
      message: 'Document version created successfully',
      document: {
        id: document.id,
        title: document.title,
        description: document.description,
        documentType: document.document_type,
        fileName: document.file_name,
        fileSize: document.file_size,
        mimeType: document.mime_type,
        version: document.version,
        isCurrentVersion: document.is_current_version,
        createdAt: document.created_at,
        url: uploadResult.url
      }
    });
  } catch (error) {
    logger.error('Error creating document version', {
      requestId: req.id,
      parentDocumentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getVersionHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching document version history', {
      requestId: req.id,
      documentId: id,
      organizationId: organizationId
    });

    const versions = await Document.getVersionHistory(id, organizationId);

    res.status(200).json({
      success: true,
      versions,
      count: versions.length
    });
  } catch (error) {
    logger.error('Error fetching document version history', {
      requestId: req.id,
      documentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const searchDocuments = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { search, entityId, documentType, accessLevel, limit, offset } = req.query;

    logger.info('Searching documents', {
      requestId: req.id,
      organizationId: organizationId,
      search: search,
      filters: req.query
    });

    const filters = {
      entityId,
      documentType,
      accessLevel,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0
    };

    const documents = await Document.search(organizationId, search, filters);

    res.status(200).json({
      success: true,
      documents,
      count: documents.length,
      search: search,
      filters: filters
    });
  } catch (error) {
    logger.error('Error searching documents', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      search: req.query.search,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocument,
  downloadDocument,
  getDocumentUrl,
  getAllDocuments,
  getDocumentsByEntity,
  getDocumentsByControl,
  getDocumentsByTask,
  updateDocument,
  deleteDocument,
  createDocumentVersion,
  getVersionHistory,
  searchDocuments
};
