/**
 * Comprehensive API Test Suite
 * Tests all major API endpoints systematically
 */

const axios = require('axios');

// Use the existing running server
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

describe('Comprehensive API Tests', () => {
  let authToken = null;
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

  beforeAll(async () => {
    console.log('Setting up comprehensive test environment...');
    
    // Test if server is running
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      console.log('✅ Server is running and healthy');
    } catch (error) {
      console.error('❌ Server health check failed:', error.message);
      throw error;
    }
  });

  describe('Phase 1: Authentication & Core Setup', () => {
    test('TC_AUTH_001: Login with valid admin credentials', async () => {
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

    test('TC_AUTH_002: Get user profile', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.user.email).toBe('testadmin@example.com');
    });
  });

  describe('Phase 2: Organization Management', () => {
    test('TC_ORG_001: Create organization', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const orgData = {
        name: `Comprehensive Test Org ${Date.now()}`,
        industry: 'Technology',
        country: 'US'
      };

      const response = await axios.post(`${API_BASE_URL}/organizations`, orgData, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.organization.id).toBeDefined();
      
      testData.organizationId = response.data.organization.id;
    });

    test('TC_ORG_002: Get organizations list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/organizations`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.organizations)).toBe(true);
    });

    test('TC_ORG_003: Get specific organization', async () => {
      if (!authToken || !testData.organizationId) {
        fail('No auth token or organization ID available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/organizations/${testData.organizationId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.organization.id).toBe(testData.organizationId);
    });
  });

  describe('Phase 3: Entity Management', () => {
    test('TC_ENT_001: Create entity', async () => {
      if (!authToken || !testData.organizationId) {
        fail('No auth token or organization ID available');
        return;
      }

      const entityData = {
        name: 'Test Entity',
        description: 'Test entity for comprehensive testing',
        entityType: 'division',
        country: 'US',
        industry: 'Technology',
        riskLevel: 'medium'
      };

      const response = await axios.post(`${API_BASE_URL}/entities`, {
        ...entityData,
        organizationId: testData.organizationId
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.entity.id).toBeDefined();
      
      testData.entityId = response.data.entity.id;
    });

    test('TC_ENT_002: Get entities list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/entities`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.entities)).toBe(true);
    });
  });

  describe('Phase 4: Framework Management', () => {
    test('TC_FW_001: Get frameworks list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/frameworks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.frameworks)).toBe(true);
      expect(response.data.frameworks.length).toBeGreaterThan(0);
      
      // Store first framework for testing
      testData.frameworkId = response.data.frameworks[0].id;
    });

    test('TC_FW_002: Get specific framework', async () => {
      if (!authToken || !testData.frameworkId) {
        fail('No auth token or framework ID available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/frameworks/${testData.frameworkId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.framework.id).toBe(testData.frameworkId);
    });

    test('TC_EF_001: Assign framework to entity', async () => {
      if (!authToken || !testData.entityId || !testData.frameworkId) {
        fail('Missing required data for framework assignment');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/entities/${testData.entityId}/frameworks/${testData.frameworkId}`,
        {
          assignedDate: new Date().toISOString(),
          complianceOfficer: 'Test Officer'
        },
        {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
    });

    test('TC_EF_002: Get entity frameworks', async () => {
      if (!authToken || !testData.entityId) {
        fail('No auth token or entity ID available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/entities/${testData.entityId}/frameworks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.frameworks)).toBe(true);
    });
  });

  describe('Phase 5: Control Management', () => {
    test('TC_CTRL_001: Get controls list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/controls`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.controls)).toBe(true);
      
      if (response.data.controls.length > 0) {
        testData.controlId = response.data.controls[0].id;
      }
    });

    test('TC_CTRL_002: Get controls by framework', async () => {
      if (!authToken || !testData.frameworkId) {
        fail('No auth token or framework ID available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/controls/framework/${testData.frameworkId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.controls)).toBe(true);
    });
  });

  describe('Phase 6: Task Management', () => {
    test('TC_TASK_001: Get tasks list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.tasks)).toBe(true);
      
      if (response.data.tasks.length > 0) {
        testData.taskId = response.data.tasks[0].id;
      }
    });

    test('TC_TASK_002: Get all tasks (including unassigned)', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/tasks/all`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.tasks)).toBe(true);
    });

    test('TC_TASK_003: Get specific task', async () => {
      if (!authToken || !testData.taskId) {
        fail('No auth token or task ID available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/tasks/${testData.taskId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.task.id).toBe(testData.taskId);
    });
  });

  describe('Phase 7: Document Management', () => {
    test('TC_DOC_001: Get documents list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.documents)).toBe(true);
    });

    test('TC_DOC_002: Get documents by entity', async () => {
      if (!authToken || !testData.entityId) {
        fail('No auth token or entity ID available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/documents/entity/${testData.entityId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.documents)).toBe(true);
    });
  });

  describe('Phase 8: Audit Management', () => {
    test('TC_AUD_001: Get audits list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/audits`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.audits)).toBe(true);
    });

    test('TC_GAP_001: Get audit gaps list', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/audit-gaps`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.gaps)).toBe(true);
    });
  });

  describe('Phase 9: Reports & Analytics', () => {
    test('TC_RPT_001: Get overview report', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/reports/overview`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.overview).toBeDefined();
    });

    test('TC_RPT_002: Get frameworks report', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/reports/frameworks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.frameworks).toBeDefined();
    });

    test('TC_RPT_003: Get controls report', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/reports/controls`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.controls).toBeDefined();
    });

    test('TC_RPT_004: Get tasks report', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/reports/tasks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.summary).toBeDefined();
    });

    test('TC_RPT_005: Get insights report', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/reports/insights`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.insights).toBeDefined();
    });
  });

  describe('Phase 10: Compliance Management', () => {
    test('TC_COMP_001: Get compliance dashboard', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/compliance/dashboard`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });

    test('TC_COMP_002: Get compliance status', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/compliance/status`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });

    test('TC_COMP_003: Get compliance health', async () => {
      if (!authToken) {
        fail('No auth token available');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/compliance/health`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });
  });

  afterAll(async () => {
    console.log('Comprehensive test cleanup completed');
  });
});
