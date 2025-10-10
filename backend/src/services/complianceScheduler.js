const cron = require('node-cron');
const ComplianceEngine = require('./complianceEngine');
const logger = require('../config/logger');

class ComplianceScheduler {
  static isStarted = false;

  /**
   * Start the compliance scheduler with cron jobs
   */
  static start() {
    if (this.isStarted) {
      logger.warn('Compliance scheduler already started');
      return;
    }

    try {
      // Run compliance checks daily at 2 AM
      cron.schedule('0 2 * * *', async () => {
        logger.info('Running scheduled compliance checks...');
        await this.runAllComplianceChecks();
      });
      
      // Check for overdue tasks every 6 hours
      cron.schedule('0 */6 * * *', async () => {
        logger.info('Checking for overdue tasks...');
        await this.checkOverdueTasks();
      });
      
      // Run compliance checks every 12 hours for active entities
      cron.schedule('0 */12 * * *', async () => {
        logger.info('Running periodic compliance checks...');
        await this.runPeriodicComplianceChecks();
      });
      
      this.isStarted = true;
      logger.info('Compliance scheduler started successfully', {
        schedules: [
          'Daily compliance checks: 2:00 AM',
          'Overdue task checks: Every 6 hours',
          'Periodic compliance checks: Every 12 hours'
        ]
      });
    } catch (error) {
      logger.error('Error starting compliance scheduler', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Stop the compliance scheduler
   */
  static stop() {
    if (!this.isStarted) {
      logger.warn('Compliance scheduler not started');
      return;
    }

    try {
      cron.getTasks().forEach(task => {
        task.stop();
      });
      
      this.isStarted = false;
      logger.info('Compliance scheduler stopped');
    } catch (error) {
      logger.error('Error stopping compliance scheduler', {
        error: error.message
      });
    }
  }

  /**
   * Run compliance checks for all active entity-framework assignments
   */
  static async runAllComplianceChecks() {
    try {
      const startTime = Date.now();
      
      // Get all active entity-framework assignments
      const assignments = await this.getActiveAssignments();
      
      logger.info('Starting scheduled compliance checks', {
        assignmentCount: assignments.length
      });
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const assignment of assignments) {
        try {
          await ComplianceEngine.checkEntityCompliance(
            assignment.entity_id,
            assignment.framework_id
          );
          successCount++;
          
          logger.debug('Compliance check completed', {
            entityId: assignment.entity_id,
            frameworkId: assignment.framework_id
          });
        } catch (error) {
          errorCount++;
          logger.error('Error in scheduled compliance check', {
            error: error.message,
            entityId: assignment.entity_id,
            frameworkId: assignment.framework_id
          });
        }
      }
      
      const duration = Date.now() - startTime;
      
      logger.info('Scheduled compliance checks completed', {
        totalAssignments: assignments.length,
        successCount,
        errorCount,
        duration: `${duration}ms`
      });
    } catch (error) {
      logger.error('Error in scheduled compliance checks', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Run periodic compliance checks for high-priority entities
   */
  static async runPeriodicComplianceChecks() {
    try {
      const startTime = Date.now();
      
      // Get high-priority assignments (entities with recent activity)
      const assignments = await this.getHighPriorityAssignments();
      
      logger.info('Starting periodic compliance checks', {
        assignmentCount: assignments.length
      });
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const assignment of assignments) {
        try {
          await ComplianceEngine.checkEntityCompliance(
            assignment.entity_id,
            assignment.framework_id
          );
          successCount++;
        } catch (error) {
          errorCount++;
          logger.error('Error in periodic compliance check', {
            error: error.message,
            entityId: assignment.entity_id,
            frameworkId: assignment.framework_id
          });
        }
      }
      
      const duration = Date.now() - startTime;
      
      logger.info('Periodic compliance checks completed', {
        totalAssignments: assignments.length,
        successCount,
        errorCount,
        duration: `${duration}ms`
      });
    } catch (error) {
      logger.error('Error in periodic compliance checks', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Check for overdue tasks and update their status
   */
  static async checkOverdueTasks() {
    try {
      const { pool } = require('../config/database');
      
      // Update overdue tasks
      const result = await pool.query(`
        UPDATE tasks
        SET status = 'overdue'
        WHERE due_date < CURRENT_DATE
        AND status IN ('pending', 'in-progress')
        AND auto_generated = true
        RETURNING id, title, due_date
      `);
      
      if (result.rows.length > 0) {
        logger.info('Updated overdue tasks', {
          count: result.rows.length,
          taskIds: result.rows.map(r => r.id)
        });
        
        // Log details of overdue tasks
        result.rows.forEach(task => {
          logger.warn('Task marked as overdue', {
            taskId: task.id,
            title: task.title,
            dueDate: task.due_date
          });
        });
      } else {
        logger.debug('No overdue tasks found');
      }
    } catch (error) {
      logger.error('Error checking overdue tasks', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Get all active entity-framework assignments
   * @returns {Array} Array of assignment objects
   */
  static async getActiveAssignments() {
    try {
      const { pool } = require('../config/database');
      const result = await pool.query(`
        SELECT DISTINCT ef.entity_id, ef.framework_id
        FROM entity_frameworks ef
        WHERE ef.is_active = true
        ORDER BY ef.created_at DESC
      `);
      
      logger.debug('Retrieved active assignments', {
        count: result.rows.length
      });
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting active assignments', {
        error: error.message
      });
      return [];
    }
  }

  /**
   * Get high-priority entity-framework assignments
   * @returns {Array} Array of assignment objects
   */
  static async getHighPriorityAssignments() {
    try {
      const { pool } = require('../config/database');
      const result = await pool.query(`
        SELECT DISTINCT ef.entity_id, ef.framework_id
        FROM entity_frameworks ef
        WHERE ef.is_active = true
        AND (
          -- Entities with recent document uploads
          ef.entity_id IN (
            SELECT DISTINCT entity_id 
            FROM documents 
            WHERE created_at > NOW() - INTERVAL '7 days'
          )
          OR
          -- Entities with recent task activity
          ef.entity_id IN (
            SELECT DISTINCT entity_id 
            FROM tasks 
            WHERE updated_at > NOW() - INTERVAL '7 days'
          )
          OR
          -- Entities with recent audit activity
          ef.entity_id IN (
            SELECT DISTINCT entity_id 
            FROM audits 
            WHERE created_at > NOW() - INTERVAL '7 days'
          )
        )
        ORDER BY ef.created_at DESC
        LIMIT 50
      `);
      
      logger.debug('Retrieved high-priority assignments', {
        count: result.rows.length
      });
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting high-priority assignments', {
        error: error.message
      });
      return [];
    }
  }

  /**
   * Get scheduler status
   * @returns {Object} Scheduler status information
   */
  static getStatus() {
    return {
      isStarted: this.isStarted,
      activeTasks: cron.getTasks().length,
      schedules: [
        'Daily compliance checks: 0 2 * * *',
        'Overdue task checks: 0 */6 * * *',
        'Periodic compliance checks: 0 */12 * * *'
      ]
    };
  }

  /**
   * Manually trigger a compliance check for a specific entity
   * @param {string} entityId - Entity ID
   * @param {string} frameworkId - Framework ID
   */
  static async triggerManualCheck(entityId, frameworkId) {
    try {
      logger.info('Triggering manual compliance check', {
        entityId,
        frameworkId
      });
      
      const result = await ComplianceEngine.checkEntityCompliance(
        entityId,
        frameworkId
      );
      
      logger.info('Manual compliance check completed', {
        entityId,
        frameworkId,
        score: result.score,
        gaps: result.gaps.length,
        tasksGenerated: result.tasksGenerated
      });
      
      return result;
    } catch (error) {
      logger.error('Error in manual compliance check', {
        error: error.message,
        entityId,
        frameworkId
      });
      throw error;
    }
  }
}

module.exports = ComplianceScheduler;
