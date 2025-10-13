const { pool } = require('../config/database');
const logger = require('../config/logger');

const query = (text, params) => pool.query(text, params);

class Comment {
  static async create({
    entityId,
    taskId,
    controlId,
    frameworkId,
    parentCommentId,
    authorId,
    content,
    commentType = 'general',
    isInternal = false,
    isResolved = false
  }) {
    try {
      const result = await query(
        `INSERT INTO comments (
          entity_id, task_id, control_id, framework_id, parent_comment_id,
          author_id, content, comment_type, is_internal, is_resolved,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                  NOW() AT TIME ZONE 'Africa/Nairobi', 
                  NOW() AT TIME ZONE 'Africa/Nairobi')
        RETURNING *`,
        [
          entityId, taskId, controlId, frameworkId, parentCommentId,
          authorId, content, commentType, isInternal, isResolved
        ]
      );

      logger.info('Comment created successfully', {
        commentId: result.rows[0].id,
        taskId: taskId,
        authorId: authorId,
        commentType: commentType
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating comment', {
        error: error.message,
        stack: error.stack,
        taskId: taskId,
        authorId: authorId
      });
      throw error;
    }
  }

  static async findById(id) {
    const result = await query(
      `SELECT c.*, 
              u.first_name as author_first_name, 
              u.last_name as author_last_name,
              u.email as author_email
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       WHERE c.id = $1 AND c.is_active = true`,
      [id]
    );
    return result.rows[0];
  }

  static async findByTaskId(taskId, organizationId) {
    const result = await query(
      `SELECT c.*, 
              u.first_name as author_first_name, 
              u.last_name as author_last_name,
              u.email as author_email,
              c.created_at AT TIME ZONE 'Africa/Nairobi' as created_at_local,
              c.updated_at AT TIME ZONE 'Africa/Nairobi' as updated_at_local
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       JOIN tasks t ON c.task_id = t.id
       JOIN controls ctrl ON t.control_id = ctrl.id
       JOIN control_assignments ca ON ctrl.id = ca.control_id
       JOIN entities e ON ca.entity_id = e.id
       WHERE c.task_id = $1 AND e.organization_id = $2 AND c.is_active = true
       ORDER BY c.created_at ASC`,
      [taskId, organizationId]
    );
    return result.rows;
  }

  static async findByEntityId(entityId, organizationId) {
    const result = await query(
      `SELECT c.*, 
              u.first_name as author_first_name, 
              u.last_name as author_last_name,
              u.email as author_email
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       JOIN entities e ON c.entity_id = e.id
       WHERE c.entity_id = $1 AND e.organization_id = $2 AND c.is_active = true
       ORDER BY c.created_at ASC`,
      [entityId, organizationId]
    );
    return result.rows;
  }

  static async findByControlId(controlId, organizationId) {
    const result = await query(
      `SELECT c.*, 
              u.first_name as author_first_name, 
              u.last_name as author_last_name,
              u.email as author_email
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       JOIN controls ctrl ON c.control_id = ctrl.id
       JOIN control_assignments ca ON ctrl.id = ca.control_id
       JOIN entities e ON ca.entity_id = e.id
       WHERE c.control_id = $1 AND e.organization_id = $2 AND c.is_active = true
       ORDER BY c.created_at ASC`,
      [controlId, organizationId]
    );
    return result.rows;
  }

  static async update(id, { content, commentType, isInternal, isResolved }) {
    try {
      const result = await query(
        `UPDATE comments 
         SET content = COALESCE($2, content),
             comment_type = COALESCE($3, comment_type),
             is_internal = COALESCE($4, is_internal),
             is_resolved = COALESCE($5, is_resolved),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND is_active = true
         RETURNING *`,
        [id, content, commentType, isInternal, isResolved]
      );

      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Comment updated successfully', {
        commentId: id,
        updatedFields: { content, commentType, isInternal, isResolved }
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating comment', {
        error: error.message,
        stack: error.stack,
        commentId: id
      });
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await query(
        `UPDATE comments 
         SET is_active = false, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND is_active = true
         RETURNING id`,
        [id]
      );

      if (result.rows.length === 0) {
        return false;
      }

      logger.info('Comment deleted successfully', {
        commentId: id
      });

      return true;
    } catch (error) {
      logger.error('Error deleting comment', {
        error: error.message,
        stack: error.stack,
        commentId: id
      });
      throw error;
    }
  }

  static async getThreadedComments(parentId, organizationId) {
    const result = await query(
      `WITH RECURSIVE comment_thread AS (
         SELECT c.*, 
                u.first_name as author_first_name, 
                u.last_name as author_last_name,
                u.email as author_email,
                0 as depth
         FROM comments c
         LEFT JOIN users u ON c.author_id = u.id
         WHERE c.parent_comment_id = $1 AND c.is_active = true
         
         UNION ALL
         
         SELECT c.*, 
                u.first_name as author_first_name, 
                u.last_name as author_last_name,
                u.email as author_email,
                ct.depth + 1
         FROM comments c
         LEFT JOIN users u ON c.author_id = u.id
         JOIN comment_thread ct ON c.parent_comment_id = ct.id
         WHERE c.is_active = true
       )
       SELECT * FROM comment_thread
       ORDER BY depth, created_at ASC`,
      [parentId]
    );
    return result.rows;
  }

  static async getCommentStats(organizationId) {
    const result = await query(
      `SELECT 
         COUNT(*) as total_comments,
         COUNT(CASE WHEN comment_type = 'question' AND is_resolved = false THEN 1 END) as unanswered_questions,
         COUNT(CASE WHEN comment_type = 'update' THEN 1 END) as updates,
         COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_comments
       FROM comments c
       JOIN (
         SELECT DISTINCT e.id as entity_id
         FROM entities e
         WHERE e.organization_id = $1
       ) org_entities ON c.entity_id = org_entities.entity_id
       WHERE c.is_active = true`,
      [organizationId]
    );
    return result.rows[0];
  }
}

module.exports = Comment;
