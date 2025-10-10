const express = require('express');
const {
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
} = require('../controllers/documentController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { 
  validateRequest, 
  uploadDocumentSchema, 
  updateDocumentSchema, 
  createDocumentVersionSchema,
  searchDocumentsSchema 
} = require('../middleware/validation');
const { uploadSingle, validateFileMetadata } = require('../middleware/upload');

const router = express.Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// Document Management Routes
router.post('/', 
  requireRole(['admin', 'compliance_manager', 'entity_manager', 'team_member']),
  uploadSingle('file'),
  validateFileMetadata,
  validateRequest(uploadDocumentSchema),
  uploadDocument
);

router.get('/', getAllDocuments);
router.get('/search', searchDocuments);
router.get('/:id', getDocument);
router.get('/:id/download', downloadDocument);
router.get('/:id/url', getDocumentUrl);
router.put('/:id', validateRequest(updateDocumentSchema), updateDocument);
router.delete('/:id', requireRole(['admin']), deleteDocument);

// Document Version Management
router.post('/:id/version',
  requireRole(['admin', 'compliance_manager', 'entity_manager', 'team_member']),
  uploadSingle('file'),
  validateFileMetadata,
  validateRequest(createDocumentVersionSchema),
  createDocumentVersion
);
router.get('/:id/versions', getVersionHistory);

// Document Queries by Related Entities
router.get('/entities/:entityId', getDocumentsByEntity);
router.get('/controls/:controlId', getDocumentsByControl);
router.get('/tasks/:taskId', getDocumentsByTask);

module.exports = router;
