const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function correctedTest() {
  console.log('🔧 Corrected API Testing\n');
  
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
  
  // Test 3: Entity Creation (without organizationId)
  console.log('\n3. Testing Entity Creation...');
  try {
    const response = await axios.post(`${API_BASE_URL}/entities`, {
      name: 'Corrected Test Entity',
      entityType: 'department',
      description: 'Corrected test entity'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Entity creation successful:', response.status);
    console.log('   Entity ID:', response.data.entity?.id);
  } catch (error) {
    console.log('❌ Entity creation failed:', error.response?.status, error.response?.data);
  }
  
  // Test 4: Framework Assignment (without assignedDate)
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
    
    // Assign framework (without assignedDate and complianceOfficer)
    const assignResponse = await axios.post(`${API_BASE_URL}/entities/${entityId}/frameworks/${frameworkId}`, {
      complianceScore: 0,
      auditReadinessScore: 0,
      certificationStatus: 'not-applicable'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Framework assignment successful:', assignResponse.status);
  } catch (error) {
    console.log('❌ Framework assignment failed:', error.response?.status, error.response?.data);
  }
  
  // Test 5: Document Upload (correct route)
  console.log('\n5. Testing Document Upload...');
  try {
    // Get the entity we just created
    const entitiesResponse = await axios.get(`${API_BASE_URL}/entities`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const entityId = entitiesResponse.data.entities?.[0]?.id;
    
    if (!entityId) {
      console.log('❌ No entities found for document upload');
      return;
    }
    
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
    form.append('entityId', entityId); // Use the entity we just created
    
    const response = await axios.post(`${API_BASE_URL}/documents`, form, { // Correct route: /documents not /documents/upload
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
  
  console.log('\n🏁 Corrected testing completed');
}

correctedTest().catch(console.error);
