// Load environment variables
require('dotenv').config();

const ComplianceEventListener = require('./src/services/complianceEventListener');

async function testUltraFresh() {
  try {
    console.log('🧪 Testing ComplianceEventListener with ultra fresh entity...');
    
    const entityId = 'a19049fc-ca92-4833-8839-19e5511983c4';
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

testUltraFresh();
