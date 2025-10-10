const EventEmitter = require('events');
const logger = require('../config/logger');

/**
 * Real-time Event Emitter Service
 * 
 * This service handles real-time compliance events that trigger immediately
 * when data changes, providing instant compliance updates without waiting
 * for scheduled checks.
 */
class RealtimeEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Allow multiple listeners for different event types
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for real-time compliance checks
   */
  setupEventHandlers() {
    // Document-related events
    this.on('document.uploaded', this.handleDocumentUploaded.bind(this));
    this.on('document.updated', this.handleDocumentUpdated.bind(this));
    this.on('document.deleted', this.handleDocumentDeleted.bind(this));

    // Task-related events
    this.on('task.created', this.handleTaskCreated.bind(this));
    this.on('task.status.changed', this.handleTaskStatusChanged.bind(this));
    this.on('task.completed', this.handleTaskCompleted.bind(this));
    this.on('task.assigned', this.handleTaskAssigned.bind(this));

    // Control-related events
    this.on('control.assigned', this.handleControlAssigned.bind(this));
    this.on('control.completed', this.handleControlCompleted.bind(this));
    this.on('control.status.changed', this.handleControlStatusChanged.bind(this));

    // Framework-related events
    this.on('framework.assigned', this.handleFrameworkAssigned.bind(this));
    this.on('framework.removed', this.handleFrameworkRemoved.bind(this));

    // Entity-related events
    this.on('entity.created', this.handleEntityCreated.bind(this));
    this.on('entity.updated', this.handleEntityUpdated.bind(this));

    logger.info('Real-time event handlers initialized', {
      service: 'grc-backend',
      eventTypes: [
        'document.uploaded', 'document.updated', 'document.deleted',
        'task.created', 'task.status.changed', 'task.completed', 'task.assigned',
        'control.assigned', 'control.completed', 'control.status.changed',
        'framework.assigned', 'framework.removed',
        'entity.created', 'entity.updated'
      ]
    });
  }

  /**
   * Handle document upload event
   */
  async handleDocumentUploaded(data) {
    try {
      logger.info('Document uploaded - triggering real-time compliance check', {
        service: 'grc-backend',
        documentId: data.documentId,
        entityId: data.entityId,
        controlId: data.controlId,
        documentType: data.documentType
      });

      // Trigger compliance check for the specific entity and control
      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'document_uploaded');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'document_uploaded');
      }
    } catch (error) {
      logger.error('Error handling document upload event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle document update event
   */
  async handleDocumentUpdated(data) {
    try {
      logger.info('Document updated - triggering real-time compliance check', {
        service: 'grc-backend',
        documentId: data.documentId,
        entityId: data.entityId,
        controlId: data.controlId
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'document_updated');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'document_updated');
      }
    } catch (error) {
      logger.error('Error handling document update event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle document deletion event
   */
  async handleDocumentDeleted(data) {
    try {
      logger.info('Document deleted - triggering real-time compliance check', {
        service: 'grc-backend',
        documentId: data.documentId,
        entityId: data.entityId,
        controlId: data.controlId
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'document_deleted');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'document_deleted');
      }
    } catch (error) {
      logger.error('Error handling document deletion event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle task creation event
   */
  async handleTaskCreated(data) {
    try {
      logger.info('Task created - triggering real-time compliance check', {
        service: 'grc-backend',
        taskId: data.taskId,
        entityId: data.entityId,
        controlId: data.controlId,
        frameworkId: data.frameworkId
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'task_created');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'task_created');
      }
    } catch (error) {
      logger.error('Error handling task creation event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle task status change event
   */
  async handleTaskStatusChanged(data) {
    try {
      logger.info('Task status changed - triggering real-time compliance check', {
        service: 'grc-backend',
        taskId: data.taskId,
        entityId: data.entityId,
        controlId: data.controlId,
        oldStatus: data.oldStatus,
        newStatus: data.newStatus
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'task_status_changed');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'task_status_changed');
      }
    } catch (error) {
      logger.error('Error handling task status change event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle task completion event
   */
  async handleTaskCompleted(data) {
    try {
      logger.info('Task completed - triggering real-time compliance check', {
        service: 'grc-backend',
        taskId: data.taskId,
        entityId: data.entityId,
        controlId: data.controlId,
        frameworkId: data.frameworkId
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'task_completed');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'task_completed');
      }
    } catch (error) {
      logger.error('Error handling task completion event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle task assignment event
   */
  async handleTaskAssigned(data) {
    try {
      logger.info('Task assigned - triggering real-time compliance check', {
        service: 'grc-backend',
        taskId: data.taskId,
        entityId: data.entityId,
        controlId: data.controlId,
        assigneeId: data.assigneeId
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'task_assigned');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'task_assigned');
      }
    } catch (error) {
      logger.error('Error handling task assignment event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle control assignment event
   */
  async handleControlAssigned(data) {
    try {
      logger.info('Control assigned - triggering real-time compliance check', {
        service: 'grc-backend',
        controlId: data.controlId,
        entityId: data.entityId,
        frameworkId: data.frameworkId
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'control_assigned');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'control_assigned');
      }
    } catch (error) {
      logger.error('Error handling control assignment event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle control completion event
   */
  async handleControlCompleted(data) {
    try {
      logger.info('Control completed - triggering real-time compliance check', {
        service: 'grc-backend',
        controlId: data.controlId,
        entityId: data.entityId,
        frameworkId: data.frameworkId
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'control_completed');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'control_completed');
      }
    } catch (error) {
      logger.error('Error handling control completion event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle control status change event
   */
  async handleControlStatusChanged(data) {
    try {
      logger.info('Control status changed - triggering real-time compliance check', {
        service: 'grc-backend',
        controlId: data.controlId,
        entityId: data.entityId,
        oldStatus: data.oldStatus,
        newStatus: data.newStatus
      });

      if (data.entityId && data.controlId) {
        await this.triggerComplianceCheck(data.entityId, data.controlId, 'control_status_changed');
      } else if (data.entityId) {
        await this.triggerEntityComplianceCheck(data.entityId, 'control_status_changed');
      }
    } catch (error) {
      logger.error('Error handling control status change event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle framework assignment event
   */
  async handleFrameworkAssigned(data) {
    try {
      logger.info('Framework assigned - triggering real-time compliance check', {
        service: 'grc-backend',
        frameworkId: data.frameworkId,
        entityId: data.entityId
      });

      // This will trigger the existing framework assignment logic
      // which already includes compliance checks
      await this.triggerEntityComplianceCheck(data.entityId, 'framework_assigned');
    } catch (error) {
      logger.error('Error handling framework assignment event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle framework removal event
   */
  async handleFrameworkRemoved(data) {
    try {
      logger.info('Framework removed - triggering real-time compliance check', {
        service: 'grc-backend',
        frameworkId: data.frameworkId,
        entityId: data.entityId
      });

      await this.triggerEntityComplianceCheck(data.entityId, 'framework_removed');
    } catch (error) {
      logger.error('Error handling framework removal event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle entity creation event
   */
  async handleEntityCreated(data) {
    try {
      logger.info('Entity created - triggering real-time compliance check', {
        service: 'grc-backend',
        entityId: data.entityId,
        organizationId: data.organizationId
      });

      // New entity doesn't need immediate compliance check
      // but we can log it for monitoring
      logger.debug('New entity created, no immediate compliance check needed', {
        service: 'grc-backend',
        entityId: data.entityId
      });
    } catch (error) {
      logger.error('Error handling entity creation event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Handle entity update event
   */
  async handleEntityUpdated(data) {
    try {
      logger.info('Entity updated - triggering real-time compliance check', {
        service: 'grc-backend',
        entityId: data.entityId,
        organizationId: data.organizationId
      });

      await this.triggerEntityComplianceCheck(data.entityId, 'entity_updated');
    } catch (error) {
      logger.error('Error handling entity update event', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        data
      });
    }
  }

  /**
   * Trigger compliance check for specific entity and control
   */
  async triggerComplianceCheck(entityId, controlId, triggerEvent) {
    try {
      const ComplianceEngine = require('./complianceEngine');
      
      // Get framework ID from control
      const Control = require('../models/Control');
      const control = await Control.findById(controlId);
      
      if (!control) {
        logger.warn('Control not found for compliance check', {
          service: 'grc-backend',
          controlId,
          entityId,
          triggerEvent
        });
        return;
      }

      logger.info('Triggering real-time compliance check', {
        service: 'grc-backend',
        entityId,
        controlId,
        frameworkId: control.framework_id,
        triggerEvent
      });

      // Run compliance check for the specific framework
      await ComplianceEngine.checkEntityCompliance(entityId, control.framework_id);
      
      logger.info('Real-time compliance check completed', {
        service: 'grc-backend',
        entityId,
        controlId,
        frameworkId: control.framework_id,
        triggerEvent
      });
    } catch (error) {
      logger.error('Error triggering compliance check', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        entityId,
        controlId,
        triggerEvent
      });
    }
  }

  /**
   * Trigger compliance check for entire entity (all frameworks)
   */
  async triggerEntityComplianceCheck(entityId, triggerEvent) {
    try {
      const ComplianceEngine = require('./complianceEngine');
      
      // Get all frameworks for this entity
      const { pool } = require('../config/database');
      const result = await pool.query(`
        SELECT DISTINCT ef.framework_id
        FROM entity_frameworks ef
        WHERE ef.entity_id = $1 AND ef.is_active = true
      `, [entityId]);

      if (result.rows.length === 0) {
        logger.warn('No active frameworks found for entity', {
          service: 'grc-backend',
          entityId,
          triggerEvent
        });
        return;
      }

      logger.info('Triggering real-time compliance check for all frameworks', {
        service: 'grc-backend',
        entityId,
        frameworkCount: result.rows.length,
        triggerEvent
      });

      // Run compliance check for each framework
      for (const row of result.rows) {
        try {
          await ComplianceEngine.checkEntityCompliance(entityId, row.framework_id);
        } catch (error) {
          logger.error('Error in framework compliance check', {
            service: 'grc-backend',
            error: error.message,
            entityId,
            frameworkId: row.framework_id,
            triggerEvent
          });
        }
      }
      
      logger.info('Real-time entity compliance check completed', {
        service: 'grc-backend',
        entityId,
        frameworkCount: result.rows.length,
        triggerEvent
      });
    } catch (error) {
      logger.error('Error triggering entity compliance check', {
        service: 'grc-backend',
        error: error.message,
        stack: error.stack,
        entityId,
        triggerEvent
      });
    }
  }

  /**
   * Emit document uploaded event
   */
  emitDocumentUploaded(data) {
    this.emit('document.uploaded', data);
  }

  /**
   * Emit document updated event
   */
  emitDocumentUpdated(data) {
    this.emit('document.updated', data);
  }

  /**
   * Emit document deleted event
   */
  emitDocumentDeleted(data) {
    this.emit('document.deleted', data);
  }

  /**
   * Emit task created event
   */
  emitTaskCreated(data) {
    this.emit('task.created', data);
  }

  /**
   * Emit task status changed event
   */
  emitTaskStatusChanged(data) {
    this.emit('task.status.changed', data);
  }

  /**
   * Emit task completed event
   */
  emitTaskCompleted(data) {
    this.emit('task.completed', data);
  }

  /**
   * Emit task assigned event
   */
  emitTaskAssigned(data) {
    this.emit('task.assigned', data);
  }

  /**
   * Emit control assigned event
   */
  emitControlAssigned(data) {
    this.emit('control.assigned', data);
  }

  /**
   * Emit control completed event
   */
  emitControlCompleted(data) {
    this.emit('control.completed', data);
  }

  /**
   * Emit control status changed event
   */
  emitControlStatusChanged(data) {
    this.emit('control.status.changed', data);
  }

  /**
   * Emit framework assigned event
   */
  emitFrameworkAssigned(data) {
    this.emit('framework.assigned', data);
  }

  /**
   * Emit framework removed event
   */
  emitFrameworkRemoved(data) {
    this.emit('framework.removed', data);
  }

  /**
   * Emit entity created event
   */
  emitEntityCreated(data) {
    this.emit('entity.created', data);
  }

  /**
   * Emit entity updated event
   */
  emitEntityUpdated(data) {
    this.emit('entity.updated', data);
  }
}

// Create singleton instance
const realtimeEventEmitter = new RealtimeEventEmitter();

module.exports = realtimeEventEmitter;
