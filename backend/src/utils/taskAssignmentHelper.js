const { pool } = require('../config/database');
const Task = require('../models/Task');
const logger = require('../config/logger');

/**
 * Creates task assignments for all controls that are assigned to an entity
 * This creates NEW tasks for each organization instead of reusing existing ones
 * @param {string} entityId - The entity ID to create task assignments for
 * @param {string} controlId - Optional control ID to limit to specific control
 * @returns {Promise<number>} - Number of task assignments created
 */
async function createTaskAssignmentsForEntity(entityId, controlId = null) {
  try {
    // First, get the entity and its organization
    const entityResult = await pool.query(`
      SELECT e.id, e.organization_id, e.name as entity_name
      FROM entities e
      WHERE e.id = $1
    `, [entityId]);
    
    if (entityResult.rows.length === 0) {
      throw new Error(`Entity ${entityId} not found`);
    }
    
    const entity = entityResult.rows[0];
    const organizationId = entity.organization_id;
    
    logger.info('Creating task assignments for entity', {
      entityId,
      organizationId,
      entityName: entity.entity_name
    });
    
    // Get all controls assigned to this entity
    let controlQuery = `
      SELECT 
        ca.control_id,
        c.title as control_title,
        c.framework_id,
        f.name as framework_name
      FROM control_assignments ca
      JOIN controls c ON ca.control_id = c.id
      JOIN frameworks f ON c.framework_id = f.id
      WHERE ca.entity_id = $1
    `;
    
    const params = [entityId];
    
    if (controlId) {
      controlQuery += ` AND c.id = $2`;
      params.push(controlId);
    }
    
    const controlResult = await pool.query(controlQuery, params);
    const controls = controlResult.rows;
    
    logger.info(`Found ${controls.length} controls assigned to entity`, {
      entityId,
      controls: controls.map(c => ({ id: c.control_id, title: c.control_title }))
    });
    
    let totalAssignmentsCreated = 0;
    
    // For each control, assign existing base tasks to the entity
    for (const control of controls) {
      try {
        // Get only base framework tasks for this control (exclude auto-generated tasks from other orgs)
        const baseTasksResult = await pool.query(`
          SELECT t.id, t.title, t.status, t.priority, t.description
          FROM tasks t
          WHERE t.control_id = $1 AND t.auto_generated = false
        `, [control.control_id]);
        
        const baseTasks = baseTasksResult.rows;
        
        logger.info(`Found ${baseTasks.length} base tasks for control`, {
          controlId: control.control_id,
          controlTitle: control.control_title,
          baseTasks: baseTasks.map(t => ({ id: t.id, title: t.title, status: t.status }))
        });
        
        // Assign each base task to the entity
        for (const baseTask of baseTasks) {
          try {
            // Check if task assignment already exists
            const existingAssignment = await pool.query(`
              SELECT ta.id, ta.status
              FROM task_assignments ta
              WHERE ta.task_id = $1 AND ta.entity_id = $2
            `, [baseTask.id, entityId]);
            
            if (existingAssignment.rows.length > 0) {
              logger.debug('Task assignment already exists', {
                taskId: baseTask.id,
                taskTitle: baseTask.title,
                entityId,
                existingStatus: existingAssignment.rows[0].status
              });
              continue;
            }
            
            // Create task assignment for existing base task
            const assignmentResult = await pool.query(`
              INSERT INTO task_assignments (
                task_id, 
                entity_id, 
                status, 
                priority, 
                created_at, 
                updated_at
              ) VALUES ($1, $2, $3, $4, NOW(), NOW())
              ON CONFLICT (task_id, entity_id) DO NOTHING
            `, [baseTask.id, entityId, baseTask.status, baseTask.priority || 'medium']);
            
            if (assignmentResult.rowCount > 0) {
              totalAssignmentsCreated++;
              logger.info('Assigned existing base task to entity', {
                taskId: baseTask.id,
                taskTitle: baseTask.title,
                controlId: control.control_id,
                controlTitle: control.control_title,
                entityId,
                status: baseTask.status
              });
            }
          } catch (error) {
            logger.error('Error assigning base task to entity', {
              error: error.message,
              taskId: baseTask.id,
              taskTitle: baseTask.title,
              controlId: control.control_id,
              entityId
            });
            // Continue with other tasks
          }
        }
        
      } catch (error) {
        logger.error('Error creating task for control', {
          error: error.message,
          controlId: control.control_id,
          controlTitle: control.control_title,
          entityId
        });
        // Continue with other controls
      }
    }
    
    logger.info('Task assignment creation completed', {
      entityId,
      totalAssignmentsCreated,
      controlsProcessed: controls.length
    });
    
    return totalAssignmentsCreated;
    
  } catch (error) {
    console.error('Error creating task assignments for entity:', error);
    throw error;
  }
}

/**
 * Creates task assignments for all entities in an organization that have control assignments
 * @param {string} organizationId - The organization ID
 * @returns {Promise<number>} - Number of task assignments created
 */
async function createTaskAssignmentsForOrganization(organizationId) {
  try {
    // Get all entities in this organization that have control assignments
    const entitiesResult = await pool.query(`
      SELECT DISTINCT ca.entity_id
      FROM control_assignments ca
      JOIN entities e ON ca.entity_id = e.id
      WHERE e.organization_id = $1
    `, [organizationId]);
    
    const entityIds = entitiesResult.rows.map(row => row.entity_id);
    
    logger.info('Creating task assignments for organization', {
      organizationId,
      entityCount: entityIds.length
    });
    
    let totalAssignmentsCreated = 0;
    
    // Create task assignments for each entity
    for (const entityId of entityIds) {
      try {
        const assignmentsCreated = await createTaskAssignmentsForEntity(entityId);
        totalAssignmentsCreated += assignmentsCreated;
      } catch (error) {
        logger.error('Error creating task assignments for entity in organization', {
          error: error.message,
          entityId,
          organizationId
        });
        // Continue with other entities
      }
    }
    
    logger.info('Organization task assignment creation completed', {
      organizationId,
      totalAssignmentsCreated,
      entitiesProcessed: entityIds.length
    });
    
    return totalAssignmentsCreated;
    
  } catch (error) {
    logger.error('Error creating task assignments for organization:', error);
    throw error;
  }
}

/**
 * Ensures task assignments exist for a specific control assignment
 * @param {string} entityId - The entity ID
 * @param {string} controlId - The control ID
 * @returns {Promise<number>} - Number of task assignments created
 */
async function ensureTaskAssignmentsForControl(entityId, controlId) {
  return await createTaskAssignmentsForEntity(entityId, controlId);
}

module.exports = {
  createTaskAssignmentsForEntity,
  createTaskAssignmentsForOrganization,
  ensureTaskAssignmentsForControl
};
