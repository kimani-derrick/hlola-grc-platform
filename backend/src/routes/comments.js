const express = require('express');
const {
  createComment,
  getComment,
  getCommentsByTask,
  getCommentsByEntity,
  updateComment,
  deleteComment,
  getCommentStats
} = require('../controllers/commentController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { 
  validateRequest, 
  createCommentSchema, 
  updateCommentSchema 
} = require('../middleware/validation');

const router = express.Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// Comment Management Routes
router.post('/', 
  requireRole(['admin', 'compliance_manager', 'entity_manager', 'team_member']),
  validateRequest(createCommentSchema),
  createComment
);

router.get('/stats', getCommentStats);
router.get('/:id', getComment);
router.put('/:id', 
  requireRole(['admin', 'compliance_manager', 'entity_manager', 'team_member']),
  validateRequest(updateCommentSchema),
  updateComment
);
router.delete('/:id', 
  requireRole(['admin', 'compliance_manager', 'entity_manager', 'team_member']),
  deleteComment
);

// Comment Queries by Related Entities
router.get('/tasks/:taskId', getCommentsByTask);
router.get('/entities/:entityId', getCommentsByEntity);

module.exports = router;
