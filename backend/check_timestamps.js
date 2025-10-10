// Load environment variables
require('dotenv').config();

const { pool } = require('./src/config/database');

async function checkTimestamps() {
  try {
    console.log('🕐 Checking timestamps...');
    
    const entityId = 'fc4cc12c-7c37-4ac7-b414-06af61291615';
    const organizationId = '51402031-fc41-49a2-bd9e-32fa274bbb86';
    
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
    
    // Check task creation times
    console.log('\n3. Task creation times:');
    const tasksResult = await pool.query(`
      SELECT t.id, t.title, t.created_at, c.title as control_title
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON c.id = ca.control_id
      WHERE ca.entity_id = $1
      ORDER BY t.created_at ASC
      LIMIT 5
    `, [entityId]);
    
    console.log('First 5 tasks:');
    tasksResult.rows.forEach(task => {
      console.log(`  - ${task.title}: ${task.created_at}`);
    });
    
    // Check if tasks meet the criteria
    console.log('\n4. Checking if tasks meet the criteria:');
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
    
  } catch (error) {
    console.error('❌ Error checking timestamps:', error.message);
  } finally {
    await pool.end();
  }
}

checkTimestamps();
