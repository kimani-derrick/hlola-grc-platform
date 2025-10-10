// Load environment variables
require('dotenv').config();

const { pool } = require('./src/config/database');

async function checkTasks() {
  try {
    console.log('🔍 Checking tasks in database...');
    
    const entityId = 'fc4cc12c-7c37-4ac7-b414-06af61291615';
    const frameworkId = 'cebe2a09-c939-49de-916d-b5ccc27383e4';
    
    // Check tasks for this specific entity
    console.log('\n1. Tasks for entity:', entityId);
    const entityTasks = await pool.query(`
      SELECT t.id, t.title, t.status, t.control_id, c.title as control_title
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON c.id = ca.control_id
      JOIN entities e ON ca.entity_id = e.id
      WHERE e.id = $1
    `, [entityId]);
    
    console.log('Entity tasks count:', entityTasks.rows.length);
    entityTasks.rows.forEach(task => {
      console.log(`  - ${task.title} (${task.status})`);
    });
    
    // Check tasks for this framework
    console.log('\n2. Tasks for framework:', frameworkId);
    const frameworkTasks = await pool.query(`
      SELECT t.id, t.title, t.status, t.control_id, c.title as control_title
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      WHERE c.framework_id = $1
    `, [frameworkId]);
    
    console.log('Framework tasks count:', frameworkTasks.rows.length);
    frameworkTasks.rows.forEach(task => {
      console.log(`  - ${task.title} (${task.status})`);
    });
    
    // Check control assignments for this entity
    console.log('\n3. Control assignments for entity:', entityId);
    const controlAssignments = await pool.query(`
      SELECT ca.id, ca.control_id, ca.status, c.title as control_title
      FROM control_assignments ca
      JOIN controls c ON ca.control_id = c.id
      WHERE ca.entity_id = $1
    `, [entityId]);
    
    console.log('Control assignments count:', controlAssignments.rows.length);
    controlAssignments.rows.forEach(assignment => {
      console.log(`  - ${assignment.control_title} (${assignment.status})`);
    });
    
    // Check if tasks are linked to control assignments
    console.log('\n4. Tasks linked to control assignments:');
    const linkedTasks = await pool.query(`
      SELECT t.id, t.title, t.status, c.title as control_title, ca.status as assignment_status
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON c.id = ca.control_id
      WHERE ca.entity_id = $1
    `, [entityId]);
    
    console.log('Linked tasks count:', linkedTasks.rows.length);
    linkedTasks.rows.forEach(task => {
      console.log(`  - ${task.title} (${task.status}) - Assignment: ${task.assignment_status}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking tasks:', error.message);
  } finally {
    await pool.end();
  }
}

checkTasks();
