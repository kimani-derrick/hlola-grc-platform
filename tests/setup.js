/**
 * Jest Test Setup
 * Global setup for API tests
 */

const axios = require('axios');

// Global test configuration
const TEST_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retries: 3
};

// Global test data
global.testData = {
  authTokens: {},
  createdResources: {
    organizations: [],
    entities: [],
    audits: [],
    documents: []
  }
};

// Global test utilities
global.testUtils = {
  async getAuthToken(role = 'admin') {
    const credentials = {
      admin: { email: 'testadmin@example.com', password: 'admin123' },
      compliance: { email: 'testadmin@example.com', password: 'admin123' } // Use admin for both for now
    };

    try {
      const response = await axios.post(`${TEST_CONFIG.baseUrl}/auth/login`, credentials[role]);
      return response.data.token;
    } catch (error) {
      throw new Error(`Failed to get auth token for role ${role}: ${error.message}`);
    }
  },

  async makeRequest(method, endpoint, data = null, token = null) {
    const config = {
      method,
      url: `${TEST_CONFIG.baseUrl}${endpoint}`,
      timeout: TEST_CONFIG.timeout,
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
  },

  async cleanupTestData() {
    console.log('Cleaning up test data...');
    
    // Clean up in reverse order of creation
    for (const auditId of global.testData.createdResources.audits) {
      try {
        await this.makeRequest('DELETE', `/audits/${auditId}`, null, global.testData.authTokens.admin);
      } catch (error) {
        console.warn(`Failed to cleanup audit ${auditId}:`, error.message);
      }
    }

    for (const entityId of global.testData.createdResources.entities) {
      try {
        await this.makeRequest('DELETE', `/entities/${entityId}`, null, global.testData.authTokens.admin);
      } catch (error) {
        console.warn(`Failed to cleanup entity ${entityId}:`, error.message);
      }
    }

    for (const orgId of global.testData.createdResources.organizations) {
      try {
        await this.makeRequest('DELETE', `/organizations/${orgId}`, null, global.testData.authTokens.admin);
      } catch (error) {
        console.warn(`Failed to cleanup organization ${orgId}:`, error.message);
      }
    }

    console.log('Test data cleanup completed');
  },

  generateTestId() {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Setup before all tests
beforeAll(async () => {
  console.log('Setting up test environment...');
  
  try {
    // Get authentication tokens
    global.testData.authTokens.admin = await global.testUtils.getAuthToken('admin');
    global.testData.authTokens.compliance = await global.testUtils.getAuthToken('compliance');
    
    console.log('✅ Test environment setup completed');
  } catch (error) {
    console.error('❌ Test environment setup failed:', error.message);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  console.log('Cleaning up test environment...');
  await global.testUtils.cleanupTestData();
  console.log('✅ Test environment cleanup completed');
});

// Setup before each test
beforeEach(() => {
  // Reset any test-specific state
});

// Cleanup after each test
afterEach(() => {
  // Clean up test-specific data if needed
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
