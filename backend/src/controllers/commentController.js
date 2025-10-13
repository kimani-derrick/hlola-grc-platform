const Comment = require('../models/Comment');
const realtimeEventEmitter = require('../services/realtimeEventEmitter');
const logger = require('../config/logger');

const createComment = async (req, res, next) => {
  try {
    const { organizationId, userId } = req.user;
    const {
      entityId,
      taskId,
      controlId,
      frameworkId,
      parentCommentId,
      content,
      commentType = 'general',
      isInternal = false,
      isResolved = false
    } = req.body;

    logger.info('Creating comment', {
      requestId: req.id,
      organizationId: organizationId,
      userId: userId,
      taskId: taskId,
      commentType: commentType
    });

    // Validate that at least one entity reference is provided
    if (!entityId && !taskId && !controlId && !frameworkId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'At least one entity reference (entityId, taskId, controlId, or frameworkId) must be provided'
      });
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content',
        message: 'Comment content cannot be empty'
      });
    }

    const comment = await Comment.create({
      entityId,
      taskId,
      controlId,
      frameworkId,
      parentCommentId,
      authorId: userId,
      content: content.trim(),
      commentType,
      isInternal,
      isResolved
    });

    // Emit real-time event for comment creation
    realtimeEventEmitter.emitCommentCreated({
      commentId: comment.id,
      entityId: comment.entity_id,
      taskId: comment.task_id,
      controlId: comment.control_id,
      frameworkId: comment.framework_id,
      authorId: comment.author_id,
      commentType: comment.comment_type,
      content: comment.content
    });

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      comment: {
        id: comment.id,
        content: comment.content,
        commentType: comment.comment_type,
        isInternal: comment.is_internal,
        isResolved: comment.is_resolved,
        createdAt: comment.created_at,
        author: {
          id: comment.author_id,
          firstName: comment.author_first_name,
          lastName: comment.author_last_name,
          email: comment.author_email
        }
      }
    });
  } catch (error) {
    logger.error('Error creating comment', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching comment', {
      requestId: req.id,
      commentId: id,
      organizationId: organizationId
    });

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
        message: 'The requested comment does not exist or you do not have permission to access it'
      });
    }

    res.status(200).json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        commentType: comment.comment_type,
        isInternal: comment.is_internal,
        isResolved: comment.is_resolved,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        author: {
          id: comment.author_id,
          firstName: comment.author_first_name,
          lastName: comment.author_last_name,
          email: comment.author_email
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching comment', {
      requestId: req.id,
      commentId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getCommentsByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching comments for task', {
      requestId: req.id,
      taskId: taskId,
      organizationId: organizationId
    });

    const comments = await Comment.findByTaskId(taskId, organizationId);

    res.status(200).json({
      success: true,
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        commentType: comment.comment_type,
        isInternal: comment.is_internal,
        isResolved: comment.is_resolved,
        createdAt: comment.created_at_local || comment.created_at,
        updatedAt: comment.updated_at_local || comment.updated_at,
        author: {
          id: comment.author_id,
          firstName: comment.author_first_name,
          lastName: comment.author_last_name,
          email: comment.author_email
        }
      })),
      count: comments.length
    });
  } catch (error) {
    logger.error('Error fetching task comments', {
      requestId: req.id,
      taskId: req.params.taskId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getCommentsByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching comments for entity', {
      requestId: req.id,
      entityId: entityId,
      organizationId: organizationId
    });

    const comments = await Comment.findByEntityId(entityId, organizationId);

    res.status(200).json({
      success: true,
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        commentType: comment.comment_type,
        isInternal: comment.is_internal,
        isResolved: comment.is_resolved,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        author: {
          id: comment.author_id,
          firstName: comment.author_first_name,
          lastName: comment.author_last_name,
          email: comment.author_email
        }
      })),
      count: comments.length
    });
  } catch (error) {
    logger.error('Error fetching entity comments', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, userId, role } = req.user;
    const { content, commentType, isInternal, isResolved } = req.body;

    logger.info('Updating comment', {
      requestId: req.id,
      commentId: id,
      organizationId: organizationId,
      userId: userId
    });

    // Check if comment exists and user has permission
    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
        message: 'The requested comment does not exist'
      });
    }

    // Check authorization - admin, compliance_manager, or comment author
    if (role !== 'admin' && role !== 'compliance_manager' && existingComment.author_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to update this comment'
      });
    }

    const updatedComment = await Comment.update(id, {
      content,
      commentType,
      isInternal,
      isResolved
    });

    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
        message: 'The requested comment does not exist or you do not have permission to update it'
      });
    }

    // Emit real-time event for comment update
    realtimeEventEmitter.emitCommentUpdated({
      commentId: updatedComment.id,
      entityId: updatedComment.entity_id,
      taskId: updatedComment.task_id,
      controlId: updatedComment.control_id,
      frameworkId: updatedComment.framework_id,
      authorId: updatedComment.author_id,
      commentType: updatedComment.comment_type,
      content: updatedComment.content
    });

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment: {
        id: updatedComment.id,
        content: updatedComment.content,
        commentType: updatedComment.comment_type,
        isInternal: updatedComment.is_internal,
        isResolved: updatedComment.is_resolved,
        createdAt: updatedComment.created_at,
        updatedAt: updatedComment.updated_at,
        author: {
          id: updatedComment.author_id,
          firstName: updatedComment.author_first_name,
          lastName: updatedComment.author_last_name,
          email: updatedComment.author_email
        }
      }
    });
  } catch (error) {
    logger.error('Error updating comment', {
      requestId: req.id,
      commentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, userId, role } = req.user;

    logger.info('Deleting comment', {
      requestId: req.id,
      commentId: id,
      organizationId: organizationId,
      userId: userId
    });

    // Check if comment exists and user has permission
    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
        message: 'The requested comment does not exist'
      });
    }

    // Check authorization - admin, compliance_manager, or comment author
    if (role !== 'admin' && role !== 'compliance_manager' && existingComment.author_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to delete this comment'
      });
    }

    const deleted = await Comment.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
        message: 'The requested comment does not exist or you do not have permission to delete it'
      });
    }

    // Emit real-time event for comment deletion
    realtimeEventEmitter.emitCommentDeleted({
      commentId: id,
      entityId: existingComment.entity_id,
      taskId: existingComment.task_id,
      controlId: existingComment.control_id,
      frameworkId: existingComment.framework_id,
      authorId: existingComment.author_id
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting comment', {
      requestId: req.id,
      commentId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getCommentStats = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    logger.info('Fetching comment statistics', {
      requestId: req.id,
      organizationId: organizationId
    });

    const stats = await Comment.getCommentStats(organizationId);

    res.status(200).json({
      success: true,
      stats: {
        totalComments: parseInt(stats.total_comments),
        unansweredQuestions: parseInt(stats.unanswered_questions),
        updates: parseInt(stats.updates),
        recentComments: parseInt(stats.recent_comments)
      }
    });
  } catch (error) {
    logger.error('Error fetching comment statistics', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  createComment,
  getComment,
  getCommentsByTask,
  getCommentsByEntity,
  updateComment,
  deleteComment,
  getCommentStats
};
