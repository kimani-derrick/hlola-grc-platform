// Load environment variables
require('dotenv').config();

const ComplianceEventListener = require('./src/services/complianceEventListener');

async function testFreshEntity() {
  try {
    console.log('🧪 Testing ComplianceEventListener with fresh entity...');
    
    const entityId = '4e276a01-1095-4d72-a09f-83248aa501de';
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

testFreshEntity();
