// Load environment variables
require('dotenv').config();

const { pool } = require('./src/config/database');

async function checkFreshTasks() {
  try {
    console.log('🔍 Checking fresh tasks...');
    
    const entityId = '4e276a01-1095-4d72-a09f-83248aa501de';
    const organizationId = '8169fcb8-7061-42dd-8a33-332638a81861';
    
    // Check entity creation time
    console.log('\n1. Entity creation time:');
    const entityResult = await pool.query(`
      SELECT id, name, created_at
      FROM entities 
      WHERE id = $1
    `, [entityId]);
    
    console.log('Entity:', entityResult.rows[0]);
    
    // Check organization's first entity creation time
    console.log('\n2. Organization first entity creation time:');
    const firstEntityResult = await pool.query(`
      SELECT MIN(created_at) as first_entity_created_at
      FROM entities 
      WHERE organization_id = $1
    `, [organizationId]);
    
    console.log('First entity created at:', firstEntityResult.rows[0].first_entity_created_at);
    
    // Check all tasks for this entity
    console.log('\n3. All tasks for this entity:');
    const allTasksResult = await pool.query(`
      SELECT t.id, t.title, t.created_at, c.title as control_title
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON c.id = ca.control_id
      WHERE ca.entity_id = $1
      ORDER BY t.created_at ASC
    `, [entityId]);
    
    console.log('All tasks count:', allTasksResult.rows.length);
    allTasksResult.rows.forEach(task => {
      console.log(`  - ${task.title}: ${task.created_at}`);
    });
    
    // Check if tasks meet the criteria
    console.log('\n4. Tasks meeting the API criteria:');
    const criteriaResult = await pool.query(`
      SELECT COUNT(*) as task_count
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON c.id = ca.control_id
      JOIN entities e ON ca.entity_id = e.id
      WHERE e.organization_id = $1
      AND t.created_at >= (
        SELECT MIN(e2.created_at) 
        FROM entities e2 
        WHERE e2.organization_id = $1
      )
    `, [organizationId]);
    
    console.log('Tasks meeting criteria:', criteriaResult.rows[0].task_count);
    
    // Check tasks created after entity
    console.log('\n5. Tasks created after entity:');
    const afterEntityResult = await pool.query(`
      SELECT COUNT(*) as task_count
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON c.id = ca.control_id
      WHERE ca.entity_id = $1
      AND t.created_at >= $2
    `, [entityId, entityResult.rows[0].created_at]);
    
    console.log('Tasks created after entity:', afterEntityResult.rows[0].task_count);
    
  } catch (error) {
    console.error('❌ Error checking fresh tasks:', error.message);
  } finally {
    await pool.end();
  }
}

checkFreshTasks();
