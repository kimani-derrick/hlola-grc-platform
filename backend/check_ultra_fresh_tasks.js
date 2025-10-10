// Load environment variables
require('dotenv').config();

const { pool } = require('./src/config/database');

async function checkUltraFreshTasks() {
  try {
    console.log('🔍 Checking ultra fresh tasks...');
    
    const entityId = 'a19049fc-ca92-4833-8839-19e5511983c4';
    const frameworkId = 'cebe2a09-c939-49de-916d-b5ccc27383e4';
    
    // Check entity creation time
    console.log('\n1. Entity creation time:');
    const entityResult = await pool.query(`
      SELECT id, name, created_at
      FROM entities 
      WHERE id = $1
    `, [entityId]);
    
    console.log('Entity:', entityResult.rows[0]);
    
    // Check control assignments for this entity
    console.log('\n2. Control assignments for this entity:');
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
    
    // Check existing tasks for this entity
    console.log('\n3. Existing tasks for this entity:');
    const existingTasks = await pool.query(`
      SELECT t.id, t.title, t.created_at, c.title as control_title
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON t.control_id = ca.control_id
      WHERE ca.entity_id = $1
      ORDER BY t.created_at ASC
    `, [entityId]);
    
    console.log('Existing tasks count:', existingTasks.rows.length);
    existingTasks.rows.forEach(task => {
      console.log(`  - ${task.title}: ${task.created_at}`);
    });
    
    // Check what the duplicate check is finding
    console.log('\n4. What duplicate check finds:');
    for (const assignment of controlAssignments.rows) {
      const duplicateCheck = await pool.query(`
        SELECT t.id, t.title FROM tasks t
        JOIN control_assignments ca ON t.control_id = ca.control_id
        WHERE t.control_id = $1 AND ca.entity_id = $2 AND t.title LIKE $3
      `, [assignment.control_id, entityId, '%ISO 27001%']);
      
      if (duplicateCheck.rows.length > 0) {
        console.log(`  Control ${assignment.control_title}:`);
        duplicateCheck.rows.forEach(task => {
          console.log(`    - ${task.title}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking ultra fresh tasks:', error.message);
  } finally {
    await pool.end();
  }
}

checkUltraFreshTasks();
