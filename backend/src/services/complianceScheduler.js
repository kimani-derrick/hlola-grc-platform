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

    // COMPLETELY DISABLED - All compliance checks are now real-time only
    logger.info('All cron jobs permanently disabled - using real-time compliance checks only');
    this.isStarted = true;
    return;

    try {
      // Run comprehensive compliance checks daily at 2 AM
      cron.schedule('0 2 * * *', async () => {
        logger.info('Running scheduled compliance checks...');
        await this.runAllComplianceChecks();
      });
      
      // Check for overdue tasks every 30 minutes (OPTIMIZED)
      cron.schedule('*/30 * * * *', async () => {
        logger.info('Checking for overdue tasks...');
        await this.checkOverdueTasks();
      });
      
      // Run compliance checks every 4 hours for active entities (OPTIMIZED)
      cron.schedule('0 */4 * * *', async () => {
        logger.info('Running periodic compliance checks...');
        await this.runPeriodicComplianceChecks();
      });
      
      // Real-time compliance checks every 15 minutes for critical entities (OPTIMIZED)
      cron.schedule('*/15 * * * *', async () => {
        logger.info('Running real-time compliance checks...');
        await this.runRealTimeComplianceChecks();
      });
      
      this.isStarted = true;
      logger.info('Compliance scheduler started successfully', {
        schedules: [
          'Daily comprehensive checks: 2:00 AM',
          'Overdue task checks: Every 30 minutes',
          'Periodic compliance checks: Every 4 hours',
          'Real-time compliance checks: Every 15 minutes'
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
      // Get all active cron tasks and destroy them
      cron.getTasks().forEach(task => {
        task.destroy();
      });
      
      this.isStarted = false;
      logger.info('Compliance scheduler stopped successfully');
    } catch (error) {
      logger.error('Error stopping compliance scheduler', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  static getStatus() {
    return {
      isStarted: this.isStarted,
      activeTasks: cron.getTasks().length,
      schedules: this.isStarted ? [
        'Daily comprehensive checks: 2:00 AM',
        'Overdue task checks: Every 15 minutes', 
        'Periodic compliance checks: Every 2 hours',
        'Real-time compliance checks: Every 5 minutes'
      ] : []
    };
  }

  /**
   * Run all compliance checks for all entities
   */
  static async runAllComplianceChecks() {
    try {
      logger.info('Starting scheduled compliance checks');
      const startTime = Date.now();
      
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
      logger.error('Error running scheduled compliance checks', {
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
      logger.info('Starting periodic compliance checks');
      const startTime = Date.now();
      
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
      logger.error('Error running periodic compliance checks', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Run real-time compliance checks for critical entities only
   */
  static async runRealTimeComplianceChecks() {
    try {
      logger.debug('Running real-time compliance checks');
      const startTime = Date.now();
      
      // Set a timeout to prevent blocking operations
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Real-time compliance check timeout')), 30000); // 30 second timeout
      });
      
      const compliancePromise = this.executeRealTimeChecks();
      
      await Promise.race([compliancePromise, timeoutPromise]);
      
      const duration = Date.now() - startTime;
      logger.debug('Real-time compliance checks completed', {
        duration: `${duration}ms`
      });
    } catch (error) {
      if (error.message === 'Real-time compliance check timeout') {
        logger.warn('Real-time compliance checks timed out - skipping this cycle');
      } else {
        logger.error('Error running real-time compliance checks', {
          error: error.message,
          stack: error.stack
        });
      }
    }
  }

  /**
   * Execute real-time compliance checks with proper error handling
   */
  static async executeRealTimeChecks() {
    // Only check critical/high-priority entities for real-time monitoring
    const assignments = await this.getCriticalAssignments();
    
    if (assignments.length === 0) {
      logger.debug('No critical assignments found for real-time checks');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process assignments in batches to prevent blocking
    const batchSize = 5;
    for (let i = 0; i < assignments.length; i += batchSize) {
      const batch = assignments.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (assignment) => {
          try {
            await ComplianceEngine.checkEntityCompliance(
              assignment.entity_id,
              assignment.framework_id
            );
            successCount++;
          } catch (error) {
            errorCount++;
            logger.error('Error in real-time compliance check', {
              error: error.message,
              entityId: assignment.entity_id,
              frameworkId: assignment.framework_id
            });
          }
        })
      );
      
      // Small delay between batches to prevent blocking
      if (i + batchSize < assignments.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    logger.debug('Real-time compliance checks batch completed', {
      totalAssignments: assignments.length,
      successCount,
      errorCount
    });
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
        
        // TODO: Send notifications to assigned users
        // await this.notifyOverdueTasks(result.rows);
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
   */
  static async getActiveAssignments() {
    try {
      const { pool } = require('../config/database');
      
      const result = await pool.query(`
        SELECT DISTINCT ef.entity_id, ef.framework_id, ef.created_at, e.name as entity_name, f.name as framework_name
        FROM entity_frameworks ef
        JOIN entities e ON ef.entity_id = e.id
        JOIN frameworks f ON ef.framework_id = f.id
        WHERE ef.is_active = true
        ORDER BY ef.created_at DESC
      `);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting active assignments', {
        error: error.message,
        stack: error.stack
      });
      return [];
    }
  }

  /**
   * Get high-priority entity-framework assignments
   */
  static async getHighPriorityAssignments() {
    try {
      const { pool } = require('../config/database');
      
      const result = await pool.query(`
        SELECT DISTINCT ef.entity_id, ef.framework_id, ef.created_at, e.name as entity_name, f.name as framework_name
        FROM entity_frameworks ef
        JOIN entities e ON ef.entity_id = e.id
        JOIN frameworks f ON ef.framework_id = f.id
        WHERE ef.is_active = true
        ORDER BY ef.created_at DESC
        LIMIT 20
      `);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting high-priority assignments', {
        error: error.message,
        stack: error.stack
      });
      return [];
    }
  }

  /**
   * Get critical entity-framework assignments for real-time monitoring
   */
  static async getCriticalAssignments() {
    try {
      const { pool } = require('../config/database');
      
      const result = await pool.query(`
        SELECT DISTINCT ef.entity_id, ef.framework_id, ef.created_at, e.name as entity_name, f.name as framework_name
        FROM entity_frameworks ef
        JOIN entities e ON ef.entity_id = e.id
        JOIN frameworks f ON ef.framework_id = f.id
        WHERE ef.is_active = true
        ORDER BY ef.created_at DESC
        LIMIT 5
      `);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting critical assignments', {
        error: error.message,
        stack: error.stack
      });
      return [];
    }
  }

  /**
   * Trigger manual compliance check
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