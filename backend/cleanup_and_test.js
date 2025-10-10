// Load environment variables
require('dotenv').config();

const { pool } = require('./src/config/database');
const ComplianceEventListener = require('./src/services/complianceEventListener');

async function cleanupAndTest() {
  try {
    console.log('🧹 Cleaning up old tasks and testing fresh...');
    
    // First, let's clean up old tasks that are interfering
    console.log('\n1. Cleaning up old test tasks...');
    const cleanupResult = await pool.query(`
      DELETE FROM tasks 
      WHERE title LIKE '%ISO 27001%' 
      OR title LIKE '%Implement:%'
      OR title = 'Test Task'
    `);
    
    console.log(`Cleaned up ${cleanupResult.rowCount} old tasks`);
    
    // Now create a fresh organization and test
    console.log('\n2. Creating fresh organization...');
    const orgResult = await pool.query(`
      INSERT INTO organizations (id, name, industry, country, created_at, updated_at)
      VALUES (gen_random_uuid(), 'Clean Test Org', 'Technology', 'Kenya', NOW(), NOW())
      RETURNING id, name
    `);
    
    const orgId = orgResult.rows[0].id;
    console.log('Created organization:', orgResult.rows[0]);
    
    // Create entity
    console.log('\n3. Creating fresh entity...');
    const entityResult = await pool.query(`
      INSERT INTO entities (id, organization_id, name, description, entity_type, country, industry, risk_level, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, 'Main Operations', 'Default entity for main operations', 'division', 'Kenya', 'Technology', 'medium', NOW(), NOW())
      RETURNING id, name, created_at
    `, [orgId]);
    
    const entityId = entityResult.rows[0].id;
    console.log('Created entity:', entityResult.rows[0]);
    
    // Create user
    console.log('\n4. Creating fresh user...');
    const userResult = await pool.query(`
      INSERT INTO users (id, organization_id, entity_id, email, password_hash, first_name, last_name, role, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, 'cleantest@example.com', '$2a$10$dummy', 'Clean', 'Test', 'compliance_manager', NOW(), NOW())
      RETURNING id, email
    `, [orgId, entityId]);
    
    const userId = userResult.rows[0].id;
    console.log('Created user:', userResult.rows[0]);
    
    // Assign framework
    console.log('\n5. Assigning framework...');
    const frameworkId = 'cebe2a09-c939-49de-916d-b5ccc27383e4';
    const assignmentResult = await pool.query(`
      INSERT INTO entity_frameworks (id, entity_id, framework_id, compliance_score, audit_readiness_score, certification_status, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, 0, 0, 'not-applicable', NOW(), NOW())
      RETURNING id
    `, [entityId, frameworkId]);
    
    console.log('Assigned framework:', assignmentResult.rows[0].id);
    
    // Now test task creation
    console.log('\n6. Testing task creation...');
    await ComplianceEventListener.copyFrameworkTasks(entityId, frameworkId);
    
    // Check if tasks were created
    console.log('\n7. Checking created tasks...');
    const tasksResult = await pool.query(`
      SELECT t.id, t.title, t.created_at, c.title as control_title
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON t.control_id = ca.control_id
      WHERE ca.entity_id = $1
      ORDER BY t.created_at ASC
    `, [entityId]);
    
    console.log(`Created ${tasksResult.rows.length} tasks:`);
    tasksResult.rows.forEach(task => {
      console.log(`  - ${task.title}: ${task.created_at}`);
    });
    
    // Test the API query
    console.log('\n8. Testing API query...');
    const apiQueryResult = await pool.query(`
      SELECT t.*, 
             c.title as control_title, c.description as control_description,
             u1.first_name as assignee_first_name, u1.last_name as assignee_last_name
      FROM tasks t
      JOIN controls c ON t.control_id = c.id
      JOIN control_assignments ca ON c.id = ca.control_id
      JOIN entities e ON ca.entity_id = e.id
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      WHERE e.organization_id = $1
      AND t.created_at >= (
        SELECT MIN(e2.created_at) 
        FROM entities e2 
        WHERE e2.organization_id = $1
      )
    `, [orgId]);
    
    console.log(`API query returns ${apiQueryResult.rows.length} tasks`);
    
    if (apiQueryResult.rows.length > 0) {
      console.log('🎉 SUCCESS! Tasks are created and visible in API!');
    } else {
      console.log('❌ FAILED! Tasks are not visible in API');
    }
    
  } catch (error) {
    console.error('❌ Error in cleanup and test:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

cleanupAndTest();
