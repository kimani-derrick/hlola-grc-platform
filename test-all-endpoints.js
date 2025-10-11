#!/usr/bin/env node

/**
 * Comprehensive API Endpoint Tester
 * Tests all API endpoints systematically and reports results
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';
let authToken = null;
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Test data
let testData = {
  organizationId: null,
  entityId: null,
  frameworkId: null,
  controlId: null,
  taskId: null,
  documentId: null,
  auditId: null,
  gapId: null
};

async function makeRequest(method, endpoint, data = null, headers = {}, useApiBase = true) {
  try {
    const baseUrl = useApiBase ? API_BASE_URL : 'http://localhost:3001';
    const config = {
      method,
      url: `${baseUrl}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, response };
  } catch (error) {
    return { 
      success: false, 
      error: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : error.message
    };
  }
}

async function runTest(testName, testFunction) {
  console.log(`\n🧪 Testing: ${testName}`);
  testResults.total++;
  
  try {
    const result = await testFunction();
    if (result.success) {
      console.log(`✅ PASSED: ${testName}`);
      testResults.passed++;
      testResults.details.push({ test: testName, status: 'PASSED', details: result.details || 'Success' });
    } else {
      console.log(`❌ FAILED: ${testName} - ${result.error}`);
      testResults.failed++;
      testResults.details.push({ test: testName, status: 'FAILED', error: result.error });
    }
  } catch (error) {
    console.log(`❌ ERROR: ${testName} - ${error.message}`);
    testResults.failed++;
    testResults.details.push({ test: testName, status: 'ERROR', error: error.message });
  }
}

async function testServerHealth() {
  const result = await makeRequest('GET', '/', null, {}, false); // No auth required for root, use base URL
  return {
    success: result.success && result.response?.status === 200,
    details: 'Server is running and healthy'
  };
}

async function testAuthentication() {
  // Test login
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: 'testadmin@example.com',
    password: 'admin123'
  });
  
  if (!loginResult.success) {
    return { success: false, error: 'Login failed' };
  }
  
  authToken = loginResult.response.data.token;
  
  // Test profile
  const profileResult = await makeRequest('GET', '/auth/profile', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: profileResult.success && profileResult.response?.status === 200,
    details: 'Authentication working'
  };
}

async function testOrganizations() {
  // Create organization
  const createResult = await makeRequest('POST', '/organizations', {
    name: `Test Org ${Date.now()}`,
    industry: 'Technology',
    country: 'US'
  }, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!createResult.success) {
    return { success: false, error: 'Create organization failed' };
  }
  
  testData.organizationId = createResult.response.data.organization.id;
  
  // List organizations
  const listResult = await makeRequest('GET', '/organizations', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  // Get specific organization
  const getResult = await makeRequest('GET', `/organizations/${testData.organizationId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: listResult.success && getResult.success,
    details: 'Organization CRUD working'
  };
}

async function testEntities() {
  // Create entity
  const createResult = await makeRequest('POST', '/entities', {
    name: 'Test Entity',
    description: 'Test entity',
    entityType: 'division'
  }, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!createResult.success) {
    return { success: false, error: 'Create entity failed' };
  }
  
  testData.entityId = createResult.response.data.entity.id;
  
  // List entities
  const listResult = await makeRequest('GET', '/entities', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: listResult.success,
    details: 'Entity management working'
  };
}

async function testFrameworks() {
  // List frameworks
  const listResult = await makeRequest('GET', '/frameworks', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!listResult.success || !listResult.response.data.frameworks.length) {
    return { success: false, error: 'No frameworks available' };
  }
  
  testData.frameworkId = listResult.response.data.frameworks[0].id;
  
  // Get specific framework
  const getResult = await makeRequest('GET', `/frameworks/${testData.frameworkId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: getResult.success,
    details: 'Framework management working'
  };
}

async function testFrameworkAssignment() {
  // Assign framework to entity
  const assignResult = await makeRequest('POST', `/entities/${testData.entityId}/frameworks/${testData.frameworkId}`, {
    complianceScore: 0,
    auditReadinessScore: 0,
    certificationStatus: 'not-applicable'
  }, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!assignResult.success) {
    return { success: false, error: 'Framework assignment failed' };
  }
  
  // Get entity frameworks
  const getResult = await makeRequest('GET', `/entities/${testData.entityId}/frameworks`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: getResult.success,
    details: 'Framework assignment working'
  };
}

async function testControls() {
  // List controls
  const listResult = await makeRequest('GET', '/controls', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!listResult.success) {
    return { success: false, error: 'List controls failed' };
  }
  
  if (listResult.response.data.controls.length > 0) {
    testData.controlId = listResult.response.data.controls[0].id;
  }
  
  // Get controls by framework
  const frameworkResult = await makeRequest('GET', `/controls/framework/${testData.frameworkId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: frameworkResult.success,
    details: 'Control management working'
  };
}

async function testTasks() {
  // List tasks
  const listResult = await makeRequest('GET', '/tasks', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!listResult.success) {
    return { success: false, error: 'List tasks failed' };
  }
  
  if (listResult.response.data.tasks.length > 0) {
    testData.taskId = listResult.response.data.tasks[0].id;
  }
  
  // List all tasks
  const allResult = await makeRequest('GET', '/tasks/all', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  // Get specific task if available
  let getResult = { success: true };
  if (testData.taskId) {
    getResult = await makeRequest('GET', `/tasks/${testData.taskId}`, null, {
      'Authorization': `Bearer ${authToken}`
    });
  }
  
  return {
    success: allResult.success && getResult.success,
    details: 'Task management working'
  };
}

async function testDocuments() {
  // List documents
  const listResult = await makeRequest('GET', '/documents', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!listResult.success) {
    return { success: false, error: 'List documents failed' };
  }
  
  // Get documents by entity
  const entityResult = await makeRequest('GET', `/documents/entities/${testData.entityId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: entityResult.success,
    details: 'Document management working (list functionality)'
  };
}

async function testAudits() {
  // List audits
  const auditsResult = await makeRequest('GET', '/audits', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  // List audit gaps
  const gapsResult = await makeRequest('GET', '/audit-gaps', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  return {
    success: auditsResult.success && gapsResult.success,
    details: 'Audit management working'
  };
}

async function testReports() {
  const reports = [
    '/reports/overview',
    '/reports/frameworks',
    '/reports/controls',
    '/reports/tasks',
    '/reports/insights'
  ];
  
  let allPassed = true;
  const results = [];
  
  for (const report of reports) {
    const result = await makeRequest('GET', report, null, {
      'Authorization': `Bearer ${authToken}`
    });
    
    if (!result.success) {
      allPassed = false;
      results.push(`${report}: FAILED`);
    } else {
      results.push(`${report}: PASSED`);
    }
  }
  
  return {
    success: allPassed,
    details: results.join(', ')
  };
}

async function testCompliance() {
  const complianceEndpoints = [
    '/compliance/dashboard',
    '/compliance/status',
    '/compliance/health'
  ];
  
  let allPassed = true;
  const results = [];
  
  for (const endpoint of complianceEndpoints) {
    const result = await makeRequest('GET', endpoint, null, {
      'Authorization': `Bearer ${authToken}`
    });
    
    if (!result.success) {
      allPassed = false;
      results.push(`${endpoint}: FAILED`);
    } else {
      results.push(`${endpoint}: PASSED`);
    }
  }
  
  return {
    success: allPassed,
    details: results.join(', ')
  };
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Testing');
  console.log('=====================================');
  
  // Phase 1: Basic connectivity
  await runTest('Server Health Check', testServerHealth);
  
  // Phase 2: Authentication
  await runTest('Authentication System', testAuthentication);
  
  if (!authToken) {
    console.log('\n❌ Cannot continue without authentication token');
    return;
  }
  
  // Phase 3: Core CRUD Operations
  await runTest('Organization Management', testOrganizations);
  await runTest('Entity Management', testEntities);
  await runTest('Framework Management', testFrameworks);
  await runTest('Framework Assignment', testFrameworkAssignment);
  
  // Phase 4: Business Logic
  await runTest('Control Management', testControls);
  await runTest('Task Management', testTasks);
  await runTest('Document Management', testDocuments);
  
  // Phase 5: Advanced Features
  await runTest('Audit Management', testAudits);
  await runTest('Reports System', testReports);
  await runTest('Compliance System', testCompliance);
  
  // Generate summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  console.log('\n📋 DETAILED RESULTS');
  console.log('===================');
  testResults.details.forEach((result, index) => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.test}`);
    if (result.details) {
      console.log(`   Details: ${result.details}`);
    }
    if (result.error) {
      console.log(`   Error: ${JSON.stringify(result.error)}`);
    }
  });
  
  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / testResults.total) * 100).toFixed(1) + '%'
    },
    details: testResults.details
  };
  
  const fs = require('fs');
  fs.writeFileSync('test-results.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to test-results.json');
}

// Run the tests
runAllTests().catch(console.error);
