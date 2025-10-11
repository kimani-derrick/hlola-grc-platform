#!/usr/bin/env node

/**
 * GRC Platform - Test Automation Setup Script
 * This script demonstrates how to set up and run automated API tests
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: 'http://localhost:3001/api',
  testData: {
    admin: {
      email: 'admin@example.com',
      password: 'admin123'
    },
    complianceManager: {
      email: 'compliance@example.com',
      password: 'compliance123'
    }
  },
  testResults: {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  }
};

// Test utilities
class TestRunner {
  constructor() {
    this.authTokens = {};
    this.testData = {};
  }

  async setup() {
    console.log('🚀 Setting up test environment...');
    
    // Check if server is running
    try {
      await axios.get(`${CONFIG.baseUrl.replace('/api', '')}/health`);
      console.log('✅ Server is running');
    } catch (error) {
      console.error('❌ Server is not running. Please start the server first.');
      process.exit(1);
    }

    // Get authentication tokens
    await this.getAuthTokens();
    console.log('✅ Authentication tokens obtained');
  }

  async getAuthTokens() {
    try {
      // Admin token
      const adminResponse = await axios.post(`${CONFIG.baseUrl}/auth/login`, CONFIG.testData.admin);
      this.authTokens.admin = adminResponse.data.token;

      // Compliance manager token
      const complianceResponse = await axios.post(`${CONFIG.baseUrl}/auth/login`, CONFIG.testData.complianceManager);
      this.authTokens.compliance = complianceResponse.data.token;

    } catch (error) {
      console.error('❌ Failed to get authentication tokens:', error.message);
      throw error;
    }
  }

  async runTest(testName, testFunction) {
    console.log(`\n🧪 Running test: ${testName}`);
    CONFIG.testResults.total++;

    try {
      const result = await testFunction();
      CONFIG.testResults.passed++;
      CONFIG.testResults.details.push({
        name: testName,
        status: 'PASSED',
        result: result
      });
      console.log(`✅ ${testName} - PASSED`);
      return result;
    } catch (error) {
      CONFIG.testResults.failed++;
      CONFIG.testResults.details.push({
        name: testName,
        status: 'FAILED',
        error: error.message
      });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
      throw error;
    }
  }

  async makeRequest(method, endpoint, data = null, token = null) {
    const config = {
      method,
      url: `${CONFIG.baseUrl}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    return await axios(config);
  }

  generateReport() {
    const report = {
      summary: {
        total: CONFIG.testResults.total,
        passed: CONFIG.testResults.passed,
        failed: CONFIG.testResults.failed,
        passRate: ((CONFIG.testResults.passed / CONFIG.testResults.total) * 100).toFixed(2) + '%'
      },
      details: CONFIG.testResults.details,
      timestamp: new Date().toISOString()
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Pass Rate: ${report.summary.passRate}`);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    return report;
  }
}

// Test cases
class APITests {
  constructor(testRunner) {
    this.runner = testRunner;
  }

  async testAuthLogin() {
    const response = await this.runner.makeRequest('POST', '/auth/login', CONFIG.testData.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.token) {
      throw new Error('No token in response');
    }

    return response.data;
  }

  async testGetOrganizations() {
    const response = await this.runner.makeRequest('GET', '/organizations', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    return response.data;
  }

  async testGetFrameworks() {
    const response = await this.runner.makeRequest('GET', '/frameworks', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!Array.isArray(response.data.frameworks)) {
      throw new Error('Frameworks should be an array');
    }

    return response.data;
  }

  async testGetTasks() {
    const response = await this.runner.makeRequest('GET', '/tasks', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    return response.data;
  }

  async testGetReportsOverview() {
    const response = await this.runner.makeRequest('GET', '/reports/overview', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.data) {
      throw new Error('No data in overview report');
    }

    return response.data;
  }

  async testGetReportsTasks() {
    const response = await this.runner.makeRequest('GET', '/reports/tasks', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    return response.data;
  }

  async testGetReportsFrameworks() {
    const response = await this.runner.makeRequest('GET', '/reports/frameworks', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    return response.data;
  }

  async testGetAuditGaps() {
    const response = await this.runner.makeRequest('GET', '/audit-gaps', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    return response.data;
  }

  async testGetComplianceStatus() {
    const response = await this.runner.makeRequest('GET', '/compliance/status', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    return response.data;
  }

  async testGetComplianceHealth() {
    const response = await this.runner.makeRequest('GET', '/compliance/health', null, this.runner.authTokens.admin);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    return response.data;
  }

  async testCreateOrganization() {
    const orgData = {
      name: `Test Org ${Date.now()}`,
      industry: 'Technology',
      country: 'United States'
    };

    const response = await this.runner.makeRequest('POST', '/organizations', orgData);
    
    if (response.status !== 201) {
      throw new Error(`Expected status 201, got ${response.status}`);
    }

    if (!response.data.data.id) {
      throw new Error('No organization ID in response');
    }

    // Store for cleanup
    this.runner.testData.createdOrgId = response.data.data.id;

    return response.data;
  }

  async testCreateEntity() {
    if (!this.runner.testData.createdOrgId) {
      throw new Error('No organization ID available for entity creation');
    }

    const entityData = {
      name: `Test Entity ${Date.now()}`,
      type: 'department',
      organizationId: this.runner.testData.createdOrgId
    };

    const response = await this.runner.makeRequest('POST', '/entities', entityData, this.runner.authTokens.admin);
    
    if (response.status !== 201) {
      throw new Error(`Expected status 201, got ${response.status}`);
    }

    if (!response.data.data.id) {
      throw new Error('No entity ID in response');
    }

    // Store for cleanup
    this.runner.testData.createdEntityId = response.data.data.id;

    return response.data;
  }

  async testAssignFramework() {
    if (!this.runner.testData.createdEntityId) {
      throw new Error('No entity ID available for framework assignment');
    }

    // Get a framework ID first
    const frameworksResponse = await this.runner.makeRequest('GET', '/frameworks', null, this.runner.authTokens.admin);
    const frameworkId = frameworksResponse.data.frameworks[0].id;

    const assignmentData = {
      certificationStatus: 'not-applicable',
      assignedDate: new Date().toISOString()
    };

    const response = await this.runner.makeRequest(
      'POST', 
      `/entities/${this.runner.testData.createdEntityId}/frameworks/${frameworkId}`, 
      assignmentData, 
      this.runner.authTokens.admin
    );
    
    if (response.status !== 201) {
      throw new Error(`Expected status 201, got ${response.status}`);
    }

    return response.data;
  }
}

// Main execution
async function runTests() {
  const runner = new TestRunner();
  const tests = new APITests(runner);

  try {
    await runner.setup();

    // Run authentication tests
    await runner.runTest('Authentication - Login', () => tests.testAuthLogin());

    // Run basic API tests
    await runner.runTest('Organizations - List', () => tests.testGetOrganizations());
    await runner.runTest('Frameworks - List', () => tests.testGetFrameworks());
    await runner.runTest('Tasks - List', () => tests.testGetTasks());

    // Run report tests
    await runner.runTest('Reports - Overview', () => tests.testGetReportsOverview());
    await runner.runTest('Reports - Tasks', () => tests.testGetReportsTasks());
    await runner.runTest('Reports - Frameworks', () => tests.testGetReportsFrameworks());

    // Run audit tests
    await runner.runTest('Audit Gaps - List', () => tests.testGetAuditGaps());

    // Run compliance tests
    await runner.runTest('Compliance - Status', () => tests.testGetComplianceStatus());
    await runner.runTest('Compliance - Health', () => tests.testGetComplianceHealth());

    // Run CRUD tests
    await runner.runTest('Organizations - Create', () => tests.testCreateOrganization());
    await runner.runTest('Entities - Create', () => tests.testCreateEntity());
    await runner.runTest('Entity-Framework - Assign', () => tests.testAssignFramework());

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
  } finally {
    // Generate report
    runner.generateReport();
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { TestRunner, APITests, runTests };
