// Load environment variables from backend directory
require('dotenv').config({ path: './backend/.env' });

const ComplianceEventListener = require('./backend/src/services/complianceEventListener');

async function testTaskCreation() {
  try {
    console.log('🧪 Testing ComplianceEventListener.copyFrameworkTasks...');
    
    const entityId = 'fc4cc12c-7c37-4ac7-b414-06af61291615';
    const frameworkId = 'cebe2a09-c939-49de-916d-b5ccc27383e4';
    
    console.log('Entity ID:', entityId);
    console.log('Framework ID:', frameworkId);
    
    // Test the copyFrameworkTasks method directly
    await ComplianceEventListener.copyFrameworkTasks(entityId, frameworkId);
    
    console.log('✅ Task creation test completed!');
    
  } catch (error) {
    console.error('❌ Error in task creation test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testTaskCreation();
