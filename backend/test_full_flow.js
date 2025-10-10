// Load environment variables
require('dotenv').config();

const ComplianceEventListener = require('./src/services/complianceEventListener');

async function testFullFlow() {
  try {
    console.log('🧪 Testing full onFrameworkAssigned flow...');
    
    const entityId = 'a94b9fa2-a96e-4842-9154-f26e0d25b871';
    const frameworkId = 'cebe2a09-c939-49de-916d-b5ccc27383e4';
    
    console.log('Entity ID:', entityId);
    console.log('Framework ID:', frameworkId);
    
    // Test the full onFrameworkAssigned method
    await ComplianceEventListener.onFrameworkAssigned(entityId, frameworkId);
    
    console.log('✅ Full flow test completed!');
    
  } catch (error) {
    console.error('❌ Error in full flow test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFullFlow();
