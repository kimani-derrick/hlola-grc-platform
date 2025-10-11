/**
 * Simple API Test Suite
 * Basic tests to verify the API server is running and responding
 */

const axios = require('axios');

// Use the existing running server
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

describe('Simple API Tests', () => {
  let authToken = null;

  beforeAll(async () => {
    console.log('Setting up test environment...');
    
    // Test if server is running
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      console.log('✅ Server is running and healthy');
    } catch (error) {
      console.error('❌ Server health check failed:', error.message);
      throw error;
    }
  });

  describe('Server Health', () => {
    test('TC_HEALTH_001: Server should be running', async () => {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      expect(response.status).toBe(200);
    });
  });

  describe('Authentication APIs', () => {
    test('TC_AUTH_001: Login with valid credentials', async () => {
      const loginData = {
        email: 'testadmin@example.com',
        password: 'admin123'
      };

      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.token).toBeDefined();
      
      authToken = response.data.token;
    });

    test('TC_AUTH_002: Login with invalid credentials should fail', async () => {
      const loginData = {
        email: 'testadmin@example.com',
        password: 'wrongpassword'
      };

      try {
        await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBeDefined();
      }
    });

    test('TC_AUTH_003: Get user profile with valid token', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.user.email).toBe('testadmin@example.com');
    });
  });

  describe('Organization Management', () => {
    let organizationId = null;

    test('TC_ORG_001: Create organization', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const orgData = {
        name: `Test Organization ${Date.now()}`,
        industry: 'Technology',
        country: 'US'
      };

      const response = await axios.post(`${API_BASE_URL}/organizations`, orgData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.organization.id).toBeDefined();
      
      organizationId = response.data.organization.id;
    });

    test('TC_ORG_002: Get organizations list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/organizations`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.organizations)).toBe(true);
    });
  });

  describe('Reports APIs', () => {
    test('TC_REPORTS_001: Get overview report', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/reports/overview`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.overview).toHaveProperty('totalEntities');
      expect(response.data.data.overview).toHaveProperty('totalFrameworks');
      expect(response.data.data.overview).toHaveProperty('totalTasks');
    });

    test('TC_REPORTS_002: Get tasks report', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/reports/tasks`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.summary).toHaveProperty('totalTasks');
      expect(response.data.data.summary).toHaveProperty('completedTasks');
    });
  });

  afterAll(async () => {
    console.log('Test cleanup completed');
  });
});
