const ComplianceEngine = require('./complianceEngine');
const logger = require('../config/logger');

class ComplianceEventListener {
  /**
   * Handle document upload event
   * @param {Object} document - Document object
   */
  static async onDocumentUploaded(document) {
    try {
      logger.info('Document upload event received', {
        documentId: document.id,
        entityId: document.entity_id,
        documentType: document.document_type,
        title: document.title
      });

      const entityId = document.entity_id;
      
      // Get all frameworks for this entity
      const frameworks = await this.getEntityFrameworks(entityId);
      
      if (frameworks.length === 0) {
        logger.debug('No frameworks found for entity, skipping compliance update', {
          entityId
        });
        return;
      }
      
      // Re-run compliance checks for each framework
      let updatedFrameworks = 0;
      for (const framework of frameworks) {
        try {
          await ComplianceEngine.checkEntityCompliance(
            entityId,
            framework.id
          );
          updatedFrameworks++;
          
          logger.debug('Compliance updated after document upload', {
            documentId: document.id,
            entityId,
            frameworkId: framework.id
          });
        } catch (error) {
          logger.error('Error updating compliance after document upload', {
            error: error.message,
            documentId: document.id,
            entityId,
            frameworkId: framework.id
          });
        }
      }
      
      logger.info('Compliance updated after document upload', {
        documentId: document.id,
        entityId,
        frameworksUpdated: updatedFrameworks,
        totalFrameworks: frameworks.length
      });
    } catch (error) {
      logger.error('Error handling document upload event', {
        error: error.message,
        stack: error.stack,
        documentId: document.id,
        entityId: document.entity_id
      });
    }
  }

  /**
   * Handle task completion event
   * @param {Object} task - Task object
   */
  static async onTaskCompleted(task) {
    try {
      logger.info('Task completion event received', {
        taskId: task.id,
        entityId: task.entity_id,
        controlId: task.control_id,
        status: task.status
      });

      const entityId = task.entity_id;
      const controlId = task.control_id;
      
      if (controlId) {
        // Get framework for this control
        const control = await this.getControlById(controlId);
        
        if (!control) {
          logger.warn('Control not found for task completion event', {
            taskId: task.id,
            controlId
          });
          return;
        }
        
        // Re-run compliance check for this framework
        await ComplianceEngine.checkEntityCompliance(
          entityId,
          control.framework_id
        );
        
        logger.info('Compliance updated after task completion', {
          taskId: task.id,
          entityId,
          controlId,
          frameworkId: control.framework_id
        });
      } else {
        // If no control ID, update all frameworks for this entity
        const frameworks = await this.getEntityFrameworks(entityId);
        
        for (const framework of frameworks) {
          try {
            await ComplianceEngine.checkEntityCompliance(
              entityId,
              framework.id
            );
          } catch (error) {
            logger.error('Error updating compliance after task completion', {
              error: error.message,
              taskId: task.id,
              entityId,
              frameworkId: framework.id
            });
          }
        }
        
        logger.info('Compliance updated after task completion (all frameworks)', {
          taskId: task.id,
          entityId,
          frameworksUpdated: frameworks.length
        });
      }
    } catch (error) {
      logger.error('Error handling task completion event', {
        error: error.message,
        stack: error.stack,
        taskId: task.id,
        entityId: task.entity_id
      });
    }
  }

  /**
   * Handle framework assignment event
   * @param {string} entityId - Entity ID
   * @param {string} frameworkId - Framework ID
   */
  static async onFrameworkAssigned(entityId, frameworkId) {
    try {
      logger.info('Framework assignment event received', {
        entityId,
        frameworkId
      });

      // Immediately run compliance check for the new framework
      await ComplianceEngine.checkEntityCompliance(entityId, frameworkId);
      
      logger.info('Initial compliance check completed after framework assignment', {
        entityId,
        frameworkId
      });
    } catch (error) {
      logger.error('Error handling framework assignment event', {
        error: error.message,
        stack: error.stack,
        entityId,
        frameworkId
      });
    }
  }

  /**
   * Handle task status update event
   * @param {Object} task - Task object
   * @param {string} oldStatus - Previous status
   * @param {string} newStatus - New status
   */
  static async onTaskStatusUpdated(task, oldStatus, newStatus) {
    try {
      logger.info('Task status update event received', {
        taskId: task.id,
        entityId: task.entity_id,
        controlId: task.control_id,
        oldStatus,
        newStatus
      });

      // Only trigger compliance update for certain status changes
      const statusChanges = ['completed', 'cancelled', 'overdue'];
      
      if (statusChanges.includes(newStatus) && newStatus !== oldStatus) {
        await this.onTaskCompleted(task);
      }
    } catch (error) {
      logger.error('Error handling task status update event', {
        error: error.message,
        stack: error.stack,
        taskId: task.id,
        oldStatus,
        newStatus
      });
    }
  }

  /**
   * Handle document deletion event
   * @param {Object} document - Document object
   */
  static async onDocumentDeleted(document) {
    try {
      logger.info('Document deletion event received', {
        documentId: document.id,
        entityId: document.entity_id,
        documentType: document.document_type
      });

      const entityId = document.entity_id;
      
      // Get all frameworks for this entity
      const frameworks = await this.getEntityFrameworks(entityId);
      
      // Re-run compliance checks for each framework
      for (const framework of frameworks) {
        try {
          await ComplianceEngine.checkEntityCompliance(
            entityId,
            framework.id
          );
        } catch (error) {
          logger.error('Error updating compliance after document deletion', {
            error: error.message,
            documentId: document.id,
            entityId,
            frameworkId: framework.id
          });
        }
      }
      
      logger.info('Compliance updated after document deletion', {
        documentId: document.id,
        entityId,
        frameworksUpdated: frameworks.length
      });
    } catch (error) {
      logger.error('Error handling document deletion event', {
        error: error.message,
        stack: error.stack,
        documentId: document.id,
        entityId: document.entity_id
      });
    }
  }

  /**
   * Handle audit gap status change event
   * @param {Object} gap - Audit gap object
   * @param {string} oldStatus - Previous status
   * @param {string} newStatus - New status
   */
  static async onAuditGapStatusChanged(gap, oldStatus, newStatus) {
    try {
      logger.info('Audit gap status change event received', {
        gapId: gap.id,
        entityId: gap.entity_id,
        frameworkId: gap.framework_id,
        oldStatus,
        newStatus
      });

      // If gap is closed, trigger compliance check to see if it should be reopened
      if (newStatus === 'closed' && oldStatus !== 'closed') {
        await ComplianceEngine.checkEntityCompliance(
          gap.entity_id,
          gap.framework_id
        );
        
        logger.info('Compliance check triggered after gap closure', {
          gapId: gap.id,
          entityId: gap.entity_id,
          frameworkId: gap.framework_id
        });
      }
    } catch (error) {
      logger.error('Error handling audit gap status change event', {
        error: error.message,
        stack: error.stack,
        gapId: gap.id,
        oldStatus,
        newStatus
      });
    }
  }

  /**
   * Get all frameworks for an entity
   * @param {string} entityId - Entity ID
   * @returns {Array} Array of framework objects
   */
  static async getEntityFrameworks(entityId) {
    try {
      const { pool } = require('../config/database');
      const result = await pool.query(`
        SELECT f.id, f.name, f.version
        FROM frameworks f
        INNER JOIN entity_frameworks ef ON f.id = ef.framework_id
        WHERE ef.entity_id = $1 AND ef.is_active = true
        ORDER BY ef.created_at DESC
      `, [entityId]);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting entity frameworks', {
        error: error.message,
        entityId
      });
      return [];
    }
  }

  /**
   * Get control by ID
   * @param {string} controlId - Control ID
   * @returns {Object} Control object
   */
  static async getControlById(controlId) {
    try {
      const { pool } = require('../config/database');
      const result = await pool.query(`
        SELECT id, title, description, framework_id, risk_level
        FROM controls
        WHERE id = $1
      `, [controlId]);
      
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting control by ID', {
        error: error.message,
        controlId
      });
      return null;
    }
  }

  /**
   * Get entity by ID
   * @param {string} entityId - Entity ID
   * @returns {Object} Entity object
   */
  static async getEntityById(entityId) {
    try {
      const { pool } = require('../config/database');
      const result = await pool.query(`
        SELECT id, name, organization_id
        FROM entities
        WHERE id = $1
      `, [entityId]);
      
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting entity by ID', {
        error: error.message,
        entityId
      });
      return null;
    }
  }
}

module.exports = ComplianceEventListener;
