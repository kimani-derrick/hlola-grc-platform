/**
 * GRC Platform - API Test Suite
 * Jest-based automated testing for all API endpoints
 */

const request = require('supertest');
const axios = require('axios');

// Use the existing running server instead of starting a new one
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

describe('GRC Platform API Tests', () => {
  let authTokens = {};
  let testData = {};

  beforeAll(async () => {
    // Setup test environment
    console.log('Setting up test environment...');
  });

  afterAll(async () => {
    // Cleanup test data
    console.log('Cleaning up test data...');
  });

  describe('Authentication APIs', () => {
    test('TC_AUTH_001: Login with valid credentials', async () => {
      const loginData = {
        email: 'admin@example.com',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      
      authTokens.admin = response.body.token;
    });

    test('TC_AUTH_002: Login with invalid credentials', async () => {
      const loginData = {
        email: 'admin@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('TC_AUTH_003: Get user profile', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('admin@example.com');
    });
  });

  describe('Organization Management', () => {
    test('TC_ORG_001: Create organization', async () => {
      const orgData = {
        name: `Test Organization ${Date.now()}`,
        industry: 'Technology',
        country: 'United States'
      };

      const response = await request(app)
        .post('/api/organizations')
        .send(orgData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe(orgData.name);
      
      testData.organizationId = response.body.data.id;
    });

    test('TC_ORG_002: Get organization', async () => {
      const response = await request(app)
        .get(`/api/organizations/${testData.organizationId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testData.organizationId);
    });

    test('TC_ORG_003: Update organization', async () => {
      const updateData = {
        name: 'Updated Organization Name',
        industry: 'Healthcare'
      };

      const response = await request(app)
        .put(`/api/organizations/${testData.organizationId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });

  describe('Entity Management', () => {
    test('TC_ENT_001: Create entity', async () => {
      const entityData = {
        name: `Test Entity ${Date.now()}`,
        type: 'department',
        organizationId: testData.organizationId
      };

      const response = await request(app)
        .post('/api/entities')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(entityData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe(entityData.name);
      
      testData.entityId = response.body.data.id;
    });

    test('TC_ENT_002: Get entity', async () => {
      const response = await request(app)
        .get(`/api/entities/${testData.entityId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testData.entityId);
    });

    test('TC_ENT_003: List entities by organization', async () => {
      const response = await request(app)
        .get('/api/entities')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Framework Management', () => {
    test('TC_FW_001: List frameworks', async () => {
      const response = await request(app)
        .get('/api/frameworks')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.frameworks)).toBe(true);
      expect(response.body.frameworks.length).toBeGreaterThan(0);
      
      testData.frameworkId = response.body.frameworks[0].id;
    });

    test('TC_FW_002: Get framework by ID', async () => {
      const response = await request(app)
        .get(`/api/frameworks/${testData.frameworkId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testData.frameworkId);
    });

    test('TC_FW_003: Search frameworks', async () => {
      const response = await request(app)
        .get('/api/frameworks/search?q=GDPR')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.frameworks)).toBe(true);
    });
  });

  describe('Task Management', () => {
    test('TC_TASK_001: List tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    test('TC_TASK_002: List all tasks (including unassigned)', async () => {
      const response = await request(app)
        .get('/api/tasks/all')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    test('TC_TASK_003: Get task statistics', async () => {
      const response = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalTasks');
      expect(response.body.data).toHaveProperty('completedTasks');
    });
  });

  describe('Document Management', () => {
    test('TC_DOC_001: List documents', async () => {
      const response = await request(app)
        .get('/api/documents')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.documents)).toBe(true);
    });

    test('TC_DOC_002: Get documents by entity', async () => {
      const response = await request(app)
        .get(`/api/documents/entity/${testData.entityId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.documents)).toBe(true);
    });
  });

  describe('Audit Management', () => {
    test('TC_AUD_001: List audit gaps', async () => {
      const response = await request(app)
        .get('/api/audit-gaps')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.gaps)).toBe(true);
    });

    test('TC_AUD_002: Get audit gap statistics', async () => {
      const response = await request(app)
        .get('/api/audit-gaps/stats')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalGaps');
      expect(response.body.data).toHaveProperty('openGaps');
    });

    test('TC_AUD_003: Create audit', async () => {
      const auditData = {
        title: `Test Audit ${Date.now()}`,
        description: 'Test audit description',
        auditType: 'regulatory',
        entityId: testData.entityId,
        frameworkId: testData.frameworkId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await request(app)
        .post('/api/audits')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(auditData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      
      testData.auditId = response.body.data.id;
    });
  });

  describe('Reports', () => {
    test('TC_RPT_001: Get overview report', async () => {
      const response = await request(app)
        .get('/api/reports/overview')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalFrameworks');
      expect(response.body.data).toHaveProperty('totalTasks');
      expect(response.body.data).toHaveProperty('complianceScore');
    });

    test('TC_RPT_002: Get frameworks report', async () => {
      const response = await request(app)
        .get('/api/reports/frameworks')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.frameworks)).toBe(true);
    });

    test('TC_RPT_003: Get tasks report', async () => {
      const response = await request(app)
        .get('/api/reports/tasks')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalTasks');
      expect(response.body.data).toHaveProperty('completedTasks');
    });

    test('TC_RPT_004: Get controls report', async () => {
      const response = await request(app)
        .get('/api/reports/controls')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalControls');
    });
  });

  describe('Compliance Management', () => {
    test('TC_COMP_001: Get compliance status', async () => {
      const response = await request(app)
        .get('/api/compliance/status')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('scheduler');
      expect(response.body.data).toHaveProperty('engine');
    });

    test('TC_COMP_002: Get compliance health', async () => {
      const response = await request(app)
        .get('/api/compliance/health')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('database');
    });

    test('TC_COMP_003: Trigger compliance check', async () => {
      const checkData = {
        entityId: testData.entityId,
        frameworkId: testData.frameworkId
      };

      const response = await request(app)
        .post('/api/compliance/check')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(checkData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Entity-Framework Management', () => {
    test('TC_EF_001: Assign framework to entity', async () => {
      const assignmentData = {
        certificationStatus: 'not-applicable',
        assignedDate: new Date().toISOString()
      };

      const response = await request(app)
        .post(`/api/entities/${testData.entityId}/frameworks/${testData.frameworkId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(assignmentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
    });

    test('TC_EF_002: Get entity frameworks', async () => {
      const response = await request(app)
        .get(`/api/entities/${testData.entityId}/frameworks`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.frameworks)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('TC_ERR_001: Handle invalid endpoint', async () => {
      const response = await request(app)
        .get('/api/invalid-endpoint')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('TC_ERR_002: Handle unauthorized access', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('TC_ERR_003: Handle invalid data', async () => {
      const response = await request(app)
        .post('/api/organizations')
        .send({}) // Missing required fields
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation error');
    });
  });
});
