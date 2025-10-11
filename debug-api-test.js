const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function debugTest() {
  console.log('🔍 Debug API Testing\n');
  
  // Test 1: Server Health (root endpoint)
  console.log('1. Testing Server Health...');
  try {
    const response = await axios.get('http://localhost:3001/');
    console.log('✅ Root endpoint works:', response.status);
    console.log('   Response:', response.data.message);
  } catch (error) {
    console.log('❌ Root endpoint failed:', error.message);
  }
  
  // Test 2: Authentication
  console.log('\n2. Testing Authentication...');
  let authToken = null;
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'testadmin@example.com',
      password: 'admin123'
    });
    authToken = response.data.token;
    console.log('✅ Login successful, token length:', authToken.length);
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
    return;
  }
  
  // Test 3: Entity Creation
  console.log('\n3. Testing Entity Creation...');
  try {
    const response = await axios.post(`${API_BASE_URL}/entities`, {
      name: 'Debug Test Entity',
      entityType: 'department',
      description: 'Debug test entity',
      organizationId: '35903f74-76d2-481d-bfc2-5861f7af0608' // Use existing org
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Entity creation successful:', response.status);
    console.log('   Entity ID:', response.data.entity?.id);
  } catch (error) {
    console.log('❌ Entity creation failed:', error.response?.status, error.response?.data);
  }
  
  // Test 4: Framework Assignment
  console.log('\n4. Testing Framework Assignment...');
  try {
    // First get an entity
    const entitiesResponse = await axios.get(`${API_BASE_URL}/entities`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const entityId = entitiesResponse.data.entities?.[0]?.id;
    
    if (!entityId) {
      console.log('❌ No entities found for framework assignment');
      return;
    }
    
    // Get a framework
    const frameworksResponse = await axios.get(`${API_BASE_URL}/frameworks`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const frameworkId = frameworksResponse.data.frameworks?.[0]?.id;
    
    if (!frameworkId) {
      console.log('❌ No frameworks found for assignment');
      return;
    }
    
    // Assign framework
    const assignResponse = await axios.post(`${API_BASE_URL}/entities/${entityId}/frameworks/${frameworkId}`, {
      assignedDate: new Date().toISOString(),
      complianceOfficer: 'Test Officer'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Framework assignment successful:', assignResponse.status);
  } catch (error) {
    console.log('❌ Framework assignment failed:', error.response?.status, error.response?.data);
  }
  
  // Test 5: Document Upload
  console.log('\n5. Testing Document Upload...');
  try {
    // Create a test file
    const fs = require('fs');
    const testContent = 'This is a test document for API testing.';
    fs.writeFileSync('test-document.txt', testContent);
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream('test-document.txt'));
    form.append('title', 'Test Document');
    form.append('description', 'Test document for API testing');
    form.append('documentType', 'policy');
    form.append('entityId', '35903f74-76d2-481d-bfc2-5861f7af0608');
    
    const response = await axios.post(`${API_BASE_URL}/documents/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`
      }
    });
    console.log('✅ Document upload successful:', response.status);
    
    // Clean up
    fs.unlinkSync('test-document.txt');
  } catch (error) {
    console.log('❌ Document upload failed:', error.response?.status, error.response?.data);
  }
  
  console.log('\n🏁 Debug testing completed');
}

debugTest().catch(console.error);
