# GRC Platform - API Testing Plan

## Overview
This document outlines a comprehensive testing strategy for all API endpoints in the GRC platform, including test case structure, automation approaches, and systematic testing procedures.

## Test Plan Structure

### 1. Test Categories
- **Unit Tests**: Individual endpoint functionality
- **Integration Tests**: Endpoint interactions and data flow
- **End-to-End Tests**: Complete user workflows
- **Performance Tests**: Load and stress testing
- **Security Tests**: Authentication, authorization, and data validation

### 2. Test Environment Setup
- **Base URL**: `http://localhost:3001/api`
- **Test Database**: Separate test database instance
- **Test Data**: Predefined test datasets
- **Authentication**: Test user tokens for different roles

## Test Case Structure

### Test Case Template
```yaml
test_id: "TC_001"
test_name: "Create Organization - Valid Data"
endpoint: "POST /api/organizations"
category: "CRUD Operations"
priority: "High"
prerequisites:
  - Server is running
  - Database is accessible
test_data:
  input:
    name: "Test Organization"
    industry: "Technology"
    country: "United States"
  expected_output:
    status_code: 201
    response_fields:
      - success: true
      - data.id: "uuid"
      - data.name: "Test Organization"
test_steps:
  1. Send POST request to /api/organizations
  2. Verify response status code is 201
  3. Verify response contains organization data
  4. Verify organization ID is valid UUID
  5. Verify organization name matches input
expected_result: "Organization created successfully"
cleanup:
  - Delete created organization
```

## API Endpoint Testing Matrix

### Authentication APIs (`/api/auth`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_AUTH_001 | `/api/auth/login` | POST | Valid credentials | High | ❌ |
| TC_AUTH_002 | `/api/auth/login` | POST | Invalid credentials | High | ❌ |
| TC_AUTH_003 | `/api/auth/register` | POST | Valid user data | High | ❌ |
| TC_AUTH_004 | `/api/auth/register` | POST | Duplicate email | Medium | ❌ |
| TC_AUTH_005 | `/api/auth/logout` | POST | Valid token | Medium | ❌ |
| TC_AUTH_006 | `/api/auth/profile` | GET | Valid token | Medium | ❌ |

### Organization Management (`/api/organizations`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_ORG_001 | `/api/organizations` | POST | Create organization | High | ✅ |
| TC_ORG_002 | `/api/organizations` | GET | List organizations | Medium | ❌ |
| TC_ORG_003 | `/api/organizations/:id` | GET | Get organization | Medium | ❌ |
| TC_ORG_004 | `/api/organizations/:id` | PUT | Update organization | Medium | ❌ |
| TC_ORG_005 | `/api/organizations/:id` | DELETE | Delete organization | High | ❌ |

### Entity Management (`/api/entities`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_ENT_001 | `/api/entities` | POST | Create entity | High | ❌ |
| TC_ENT_002 | `/api/entities` | GET | List entities | Medium | ❌ |
| TC_ENT_003 | `/api/entities/:id` | GET | Get entity | Medium | ❌ |
| TC_ENT_004 | `/api/entities/:id` | PUT | Update entity | Medium | ❌ |
| TC_ENT_005 | `/api/entities/:id` | DELETE | Delete entity | High | ❌ |
| TC_ENT_006 | `/api/entities/:id/assign-user` | POST | Assign user | Medium | ❌ |
| TC_ENT_007 | `/api/entities/:id/users` | GET | Get entity users | Medium | ❌ |

### Framework Management (`/api/frameworks`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_FW_001 | `/api/frameworks` | POST | Create framework | High | ❌ |
| TC_FW_002 | `/api/frameworks` | GET | List frameworks | Medium | ✅ |
| TC_FW_003 | `/api/frameworks/:id` | GET | Get framework | Medium | ❌ |
| TC_FW_004 | `/api/frameworks/:id` | PUT | Update framework | Medium | ❌ |
| TC_FW_005 | `/api/frameworks/:id` | DELETE | Delete framework | High | ❌ |
| TC_FW_006 | `/api/frameworks/grouped/category` | GET | Group by category | Low | ❌ |
| TC_FW_007 | `/api/frameworks/grouped/region` | GET | Group by region | Low | ❌ |
| TC_FW_008 | `/api/frameworks/search` | GET | Search frameworks | Medium | ❌ |
| TC_FW_009 | `/api/frameworks/category/:category` | GET | Get by category | Medium | ❌ |
| TC_FW_010 | `/api/frameworks/region/:region` | GET | Get by region | Medium | ❌ |

### Control Management (`/api/controls`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_CTRL_001 | `/api/controls` | POST | Create control | High | ❌ |
| TC_CTRL_002 | `/api/controls` | GET | List controls | Medium | ❌ |
| TC_CTRL_003 | `/api/controls/:id` | GET | Get control | Medium | ❌ |
| TC_CTRL_004 | `/api/controls/:id` | PUT | Update control | Medium | ❌ |
| TC_CTRL_005 | `/api/controls/:id` | DELETE | Delete control | High | ❌ |
| TC_CTRL_006 | `/api/controls/framework/:id` | GET | Get by framework | Medium | ❌ |
| TC_CTRL_007 | `/api/controls/category/:category` | GET | Get by category | Medium | ❌ |
| TC_CTRL_008 | `/api/controls/search` | GET | Search controls | Medium | ❌ |
| TC_CTRL_009 | `/api/controls/grouped/category` | GET | Group by category | Low | ❌ |
| TC_CTRL_010 | `/api/controls/grouped/framework` | GET | Group by framework | Low | ❌ |

### Task Management (`/api/tasks`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_TASK_001 | `/api/tasks` | POST | Create task | High | ❌ |
| TC_TASK_002 | `/api/tasks` | GET | List tasks | High | ✅ |
| TC_TASK_003 | `/api/tasks/all` | GET | List all tasks | Medium | ✅ |
| TC_TASK_004 | `/api/tasks/:id` | GET | Get task | Medium | ❌ |
| TC_TASK_005 | `/api/tasks/:id` | PUT | Update task | Medium | ❌ |
| TC_TASK_006 | `/api/tasks/:id` | DELETE | Delete task | High | ❌ |
| TC_TASK_007 | `/api/tasks/:id/status` | PUT | Update status | High | ✅ |
| TC_TASK_008 | `/api/tasks/control/:id` | GET | Get by control | Medium | ❌ |
| TC_TASK_009 | `/api/tasks/user/:id` | GET | Get by user | Medium | ❌ |
| TC_TASK_010 | `/api/tasks/entity/:id` | GET | Get by entity | Medium | ❌ |
| TC_TASK_011 | `/api/tasks/stats` | GET | Get statistics | Medium | ❌ |

### Document Management (`/api/documents`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_DOC_001 | `/api/documents` | POST | Upload document | High | ✅ |
| TC_DOC_002 | `/api/documents` | GET | List documents | Medium | ❌ |
| TC_DOC_003 | `/api/documents/:id` | GET | Get document | Medium | ❌ |
| TC_DOC_004 | `/api/documents/:id/download` | GET | Download document | Medium | ❌ |
| TC_DOC_005 | `/api/documents/:id/url` | GET | Get document URL | Low | ❌ |
| TC_DOC_006 | `/api/documents/entity/:id` | GET | Get by entity | Medium | ❌ |
| TC_DOC_007 | `/api/documents/control/:id` | GET | Get by control | Medium | ❌ |
| TC_DOC_008 | `/api/documents/task/:id` | GET | Get by task | Medium | ❌ |
| TC_DOC_009 | `/api/documents/:id` | PUT | Update document | Medium | ❌ |
| TC_DOC_010 | `/api/documents/:id` | DELETE | Delete document | High | ❌ |
| TC_DOC_011 | `/api/documents/:id/version` | POST | Create version | Low | ❌ |
| TC_DOC_012 | `/api/documents/:id/versions` | GET | Get versions | Low | ❌ |
| TC_DOC_013 | `/api/documents/search` | GET | Search documents | Medium | ❌ |

### Audit Management (`/api/audits`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_AUD_001 | `/api/audits` | POST | Create audit | High | ✅ |
| TC_AUD_002 | `/api/audits` | GET | List audits | Medium | ❌ |
| TC_AUD_003 | `/api/audits/:id` | GET | Get audit | Medium | ❌ |
| TC_AUD_004 | `/api/audits/:id` | PUT | Update audit | Medium | ❌ |
| TC_AUD_005 | `/api/audits/:id` | DELETE | Delete audit | High | ❌ |
| TC_AUD_006 | `/api/audits/:id/progress` | PUT | Update progress | Medium | ❌ |
| TC_AUD_007 | `/api/audits/:id/status` | PUT | Update status | Medium | ❌ |
| TC_AUD_008 | `/api/audits/stats` | GET | Get statistics | Medium | ❌ |
| TC_AUD_009 | `/api/audits/:id/findings` | POST | Create finding | Medium | ❌ |
| TC_AUD_010 | `/api/audits/:id/findings` | GET | Get findings | Medium | ❌ |
| TC_AUD_011 | `/api/audits/:id/findings/:id` | PUT | Update finding | Medium | ❌ |
| TC_AUD_012 | `/api/audits/:id/findings/:id` | DELETE | Delete finding | Medium | ❌ |
| TC_AUD_013 | `/api/audits/:id/findings/stats` | GET | Get findings stats | Low | ❌ |

### Audit Gap Management (`/api/audit-gaps`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_GAP_001 | `/api/audit-gaps` | POST | Create gap | High | ❌ |
| TC_GAP_002 | `/api/audit-gaps` | GET | List gaps | High | ✅ |
| TC_GAP_003 | `/api/audit-gaps/:id` | GET | Get gap | Medium | ❌ |
| TC_GAP_004 | `/api/audit-gaps/:id` | PUT | Update gap | Medium | ❌ |
| TC_GAP_005 | `/api/audit-gaps/:id` | DELETE | Delete gap | High | ❌ |
| TC_GAP_006 | `/api/audit-gaps/stats` | GET | Get statistics | Medium | ❌ |

### Reports (`/api/reports`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_RPT_001 | `/api/reports/overview` | GET | Overview report | High | ✅ |
| TC_RPT_002 | `/api/reports/frameworks` | GET | Frameworks report | High | ✅ |
| TC_RPT_003 | `/api/reports/controls` | GET | Controls report | High | ❌ |
| TC_RPT_004 | `/api/reports/tasks` | GET | Tasks report | High | ✅ |
| TC_RPT_005 | `/api/reports/trends` | GET | Trends report | Medium | ❌ |
| TC_RPT_006 | `/api/reports/insights` | GET | Insights report | Medium | ❌ |

### Compliance Management (`/api/compliance`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_COMP_001 | `/api/compliance/dashboard` | GET | Get dashboard | High | ❌ |
| TC_COMP_002 | `/api/compliance/check` | POST | Trigger check | High | ❌ |
| TC_COMP_003 | `/api/compliance/smart-audit` | POST | Create smart audit | Medium | ❌ |
| TC_COMP_004 | `/api/compliance/trends` | GET | Get trends | Medium | ❌ |
| TC_COMP_005 | `/api/compliance/gaps` | GET | Get gaps | Medium | ❌ |
| TC_COMP_006 | `/api/compliance/status` | GET | Get status | Medium | ❌ |
| TC_COMP_007 | `/api/compliance/trigger-all` | POST | Trigger all checks | High | ❌ |
| TC_COMP_008 | `/api/compliance/health` | GET | Get health | Medium | ❌ |

### Entity-Framework Management (`/api/entities/:id/frameworks`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_EF_001 | `/api/entities/:id/frameworks/:id` | POST | Assign framework | High | ✅ |
| TC_EF_002 | `/api/entities/:id/frameworks` | GET | List frameworks | High | ✅ |
| TC_EF_003 | `/api/entities/:id/frameworks/:id` | PUT | Update assignment | Medium | ❌ |
| TC_EF_004 | `/api/entities/:id/frameworks/:id` | DELETE | Remove framework | High | ❌ |
| TC_EF_005 | `/api/entities/:id/compliance` | GET | Get compliance | Medium | ❌ |
| TC_EF_006 | `/api/frameworks/:id/entities` | GET | Get framework entities | Medium | ❌ |
| TC_EF_007 | `/api/frameworks/:id/compliance` | GET | Get framework compliance | Medium | ❌ |
| TC_EF_008 | `/api/entities/:id/audits/upcoming` | GET | Get upcoming audits | Low | ❌ |
| TC_EF_009 | `/api/entities/:id/certifications/expiring` | GET | Get expiring certs | Low | ❌ |

### Control Assignment Management (`/api/control-assignments`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_CA_001 | `/api/control-assignments/entities/:id/controls/:id` | POST | Assign control | High | ❌ |
| TC_CA_002 | `/api/control-assignments/entities/:id/controls` | GET | List controls | Medium | ❌ |
| TC_CA_003 | `/api/control-assignments/entities/:id/controls/stats` | GET | Get stats | Medium | ❌ |
| TC_CA_004 | `/api/control-assignments/entities/:id/controls/status` | GET | Get by status | Medium | ❌ |
| TC_CA_005 | `/api/control-assignments/entities/:id/controls/overdue` | GET | Get overdue | Medium | ❌ |
| TC_CA_006 | `/api/control-assignments/entities/:id/controls/upcoming` | GET | Get upcoming | Medium | ❌ |
| TC_CA_007 | `/api/control-assignments/entities/:id/controls/:id` | PUT | Update status | Medium | ❌ |
| TC_CA_008 | `/api/control-assignments/entities/:id/controls/:id` | DELETE | Remove control | High | ❌ |
| TC_CA_009 | `/api/control-assignments/controls/:id/entities` | GET | Get control entities | Medium | ❌ |

### Audit Timeline Management (`/api/audit/timeline`)
| Test ID | Endpoint | Method | Test Case | Priority | Status |
|---------|----------|--------|-----------|----------|--------|
| TC_TIM_001 | `/api/audit/timeline` | POST | Create event | Medium | ❌ |
| TC_TIM_002 | `/api/audit/timeline` | GET | List events | Medium | ❌ |
| TC_TIM_003 | `/api/audit/timeline/upcoming` | GET | Get upcoming | Medium | ❌ |
| TC_TIM_004 | `/api/audit/timeline/stats` | GET | Get statistics | Low | ❌ |
| TC_TIM_005 | `/api/audit/timeline/:id` | PUT | Update event | Medium | ❌ |
| TC_TIM_006 | `/api/audit/timeline/:id` | DELETE | Delete event | Medium | ❌ |

## Test Automation Strategy

### 1. Testing Framework
- **Primary**: Jest + Supertest
- **Alternative**: Mocha + Chai + Supertest
- **Database**: Test database with migrations
- **Mocking**: Nock for external API calls

### 2. Test Structure
```
tests/
├── unit/
│   ├── auth.test.js
│   ├── organizations.test.js
│   ├── entities.test.js
│   └── ...
├── integration/
│   ├── workflows.test.js
│   ├── data-flow.test.js
│   └── ...
├── e2e/
│   ├── user-journey.test.js
│   ├── compliance-flow.test.js
│   └── ...
├── fixtures/
│   ├── test-data.json
│   ├── users.json
│   └── ...
├── helpers/
│   ├── test-setup.js
│   ├── auth-helper.js
│   └── ...
└── config/
    ├── test-config.js
    └── database.js
```

### 3. Test Data Management
- **Fixtures**: Predefined test data
- **Factories**: Dynamic test data generation
- **Cleanup**: Automatic cleanup after tests
- **Isolation**: Each test runs in isolation

### 4. Test Execution
- **Unit Tests**: Run on every commit
- **Integration Tests**: Run on pull requests
- **E2E Tests**: Run on deployment
- **Performance Tests**: Run nightly

## Test Case Implementation

### Example Test Case (Jest + Supertest)
```javascript
describe('Organization API', () => {
  let app;
  let authToken;
  let testOrgId;

  beforeAll(async () => {
    app = require('../src/server');
    authToken = await getTestAuthToken();
  });

  afterAll(async () => {
    if (testOrgId) {
      await deleteTestOrganization(testOrgId);
    }
  });

  describe('POST /api/organizations', () => {
    test('TC_ORG_001: Create organization with valid data', async () => {
      const orgData = {
        name: 'Test Organization',
        industry: 'Technology',
        country: 'United States'
      };

      const response = await request(app)
        .post('/api/organizations')
        .send(orgData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(orgData.name);
      expect(response.body.data.industry).toBe(orgData.industry);
      expect(response.body.data.country).toBe(orgData.country);

      testOrgId = response.body.data.id;
    });

    test('TC_ORG_002: Create organization with missing required fields', async () => {
      const orgData = {
        industry: 'Technology',
        country: 'United States'
      };

      const response = await request(app)
        .post('/api/organizations')
        .send(orgData)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
      expect(response.body.message).toContain('name');
    });
  });
});
```

### Test Helper Functions
```javascript
// helpers/auth-helper.js
const request = require('supertest');
const app = require('../src/server');

async function getTestAuthToken(role = 'admin') {
  const loginData = {
    email: `test-${role}@example.com`,
    password: 'testpassword123'
  };

  const response = await request(app)
    .post('/api/auth/login')
    .send(loginData);

  return response.body.token;
}

async function createTestUser(userData) {
  const response = await request(app)
    .post('/api/auth/register')
    .send(userData);

  return response.body.data;
}

async function createTestOrganization(orgData) {
  const response = await request(app)
    .post('/api/organizations')
    .send(orgData);

  return response.body.data;
}

async function cleanupTestData() {
  // Clean up test data after tests
  await deleteTestOrganizations();
  await deleteTestUsers();
  await deleteTestEntities();
}
```

## Test Execution Plan

### Phase 1: Core CRUD Operations (Week 1)
- Authentication APIs
- Organization Management
- Entity Management
- Basic Framework Management

### Phase 2: Business Logic (Week 2)
- Task Management
- Document Management
- Control Management
- Framework Assignments

### Phase 3: Advanced Features (Week 3)
- Audit Management
- Compliance Management
- Reports
- Control Assignments

### Phase 4: Integration & E2E (Week 4)
- Complete workflows
- Data flow testing
- Performance testing
- Security testing

## Test Metrics & Reporting

### Coverage Metrics
- **API Coverage**: Percentage of endpoints tested
- **Scenario Coverage**: Percentage of test scenarios covered
- **Data Coverage**: Percentage of data combinations tested

### Quality Metrics
- **Pass Rate**: Percentage of tests passing
- **Failure Rate**: Percentage of tests failing
- **Flaky Tests**: Tests with inconsistent results

### Performance Metrics
- **Response Time**: Average API response time
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
```

### Test Commands
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Test Data Management

### Test Database Setup
```javascript
// config/test-database.js
const { Pool } = require('pg');

const testDbConfig = {
  host: process.env.TEST_DB_HOST || 'localhost',
  port: process.env.TEST_DB_PORT || 5433,
  database: process.env.TEST_DB_NAME || 'grc_test',
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'password'
};

const testPool = new Pool(testDbConfig);

async function setupTestDatabase() {
  // Run migrations
  await runMigrations();
  
  // Seed test data
  await seedTestData();
}

async function cleanupTestDatabase() {
  // Clean up test data
  await testPool.query('DELETE FROM tasks');
  await testPool.query('DELETE FROM entities');
  await testPool.query('DELETE FROM organizations');
}
```

## Security Testing

### Authentication Tests
- Valid token access
- Invalid token rejection
- Expired token handling
- Role-based access control

### Authorization Tests
- Admin-only endpoints
- Compliance manager access
- User role restrictions

### Input Validation Tests
- SQL injection prevention
- XSS prevention
- Data type validation
- Required field validation

## Performance Testing

### Load Testing
- Concurrent user simulation
- Database connection limits
- Memory usage monitoring
- Response time analysis

### Stress Testing
- High volume data processing
- System resource limits
- Error handling under load

## Test Maintenance

### Regular Updates
- Update test data monthly
- Review test cases quarterly
- Update test framework versions
- Monitor test performance

### Test Documentation
- Keep test cases documented
- Update test results regularly
- Maintain test environment setup
- Document test failures and fixes

---

**Total Test Cases**: 150+
**Estimated Completion Time**: 4 weeks
**Test Coverage Target**: 95%
**Automation Level**: 90%

This comprehensive test plan ensures systematic coverage of all API endpoints while providing a clear path to automation and continuous testing.
