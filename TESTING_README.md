# GRC Platform - API Testing Guide

## Overview
This guide provides comprehensive instructions for testing all API endpoints in the GRC platform using automated test suites, manual testing procedures, and continuous integration.

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- GRC Platform server running on `http://localhost:3001`

### 2. Install Test Dependencies
```bash
cd tests
npm install
```

### 3. Run All Tests
```bash
# From project root
./run-api-tests.sh

# Or run specific categories
./run-api-tests.sh auth
./run-api-tests.sh crud
./run-api-tests.sh reports
```

## Test Structure

### Test Categories
- **Authentication Tests**: Login, logout, profile management
- **CRUD Operations**: Create, read, update, delete for all entities
- **Reports Tests**: All reporting endpoints
- **Compliance Tests**: Compliance management and monitoring
- **Error Handling**: Invalid requests, unauthorized access, validation errors

### Test Files
```
tests/
├── api.test.js              # Main test suite
├── setup.js                 # Test configuration
├── package.json             # Test dependencies
└── test-results/            # Generated reports
```

## Manual Testing

### 1. Authentication Testing
```bash
# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test profile access
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Organization Management
```bash
# Create organization
curl -X POST http://localhost:3001/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Org","industry":"Technology","country":"US"}'

# List organizations
curl -X GET http://localhost:3001/api/organizations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Framework Management
```bash
# List frameworks
curl -X GET http://localhost:3001/api/frameworks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search frameworks
curl -X GET "http://localhost:3001/api/frameworks/search?q=GDPR" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Automated Testing

### Jest Test Suite
The main test suite uses Jest with Supertest for HTTP testing:

```javascript
// Example test case
test('TC_AUTH_001: Login with valid credentials', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'admin123' })
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.token).toBeDefined();
});
```

### Test Execution Commands
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:auth
npm run test:crud
npm run test:reports
npm run test:compliance

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Test Data Management

### Test Database Setup
```bash
# Create test database
createdb grc_test

# Run migrations
npm run migrate:test

# Seed test data
npm run seed:test
```

### Test Data Cleanup
```bash
# Clean up test data
npm run cleanup:test

# Reset test database
npm run reset:test
```

## Test Cases by Endpoint

### Authentication APIs (`/api/auth`)
| Test ID | Endpoint | Method | Description | Status |
|---------|----------|--------|-------------|--------|
| TC_AUTH_001 | `/auth/login` | POST | Valid credentials | ❌ |
| TC_AUTH_002 | `/auth/login` | POST | Invalid credentials | ❌ |
| TC_AUTH_003 | `/auth/register` | POST | Valid user data | ❌ |
| TC_AUTH_004 | `/auth/logout` | POST | Valid token | ❌ |
| TC_AUTH_005 | `/auth/profile` | GET | Valid token | ❌ |

### Organization Management (`/api/organizations`)
| Test ID | Endpoint | Method | Description | Status |
|---------|----------|--------|-------------|--------|
| TC_ORG_001 | `/organizations` | POST | Create organization | ✅ |
| TC_ORG_002 | `/organizations` | GET | List organizations | ❌ |
| TC_ORG_003 | `/organizations/:id` | GET | Get organization | ❌ |
| TC_ORG_004 | `/organizations/:id` | PUT | Update organization | ❌ |
| TC_ORG_005 | `/organizations/:id` | DELETE | Delete organization | ❌ |

### Task Management (`/api/tasks`)
| Test ID | Endpoint | Method | Description | Status |
|---------|----------|--------|-------------|--------|
| TC_TASK_001 | `/tasks` | GET | List tasks | ✅ |
| TC_TASK_002 | `/tasks/all` | GET | List all tasks | ✅ |
| TC_TASK_003 | `/tasks/:id` | GET | Get task | ❌ |
| TC_TASK_004 | `/tasks` | POST | Create task | ❌ |
| TC_TASK_005 | `/tasks/:id` | PUT | Update task | ❌ |
| TC_TASK_006 | `/tasks/:id/status` | PUT | Update status | ✅ |

### Reports (`/api/reports`)
| Test ID | Endpoint | Method | Description | Status |
|---------|----------|--------|-------------|--------|
| TC_RPT_001 | `/reports/overview` | GET | Overview report | ✅ |
| TC_RPT_002 | `/reports/frameworks` | GET | Frameworks report | ✅ |
| TC_RPT_003 | `/reports/tasks` | GET | Tasks report | ✅ |
| TC_RPT_004 | `/reports/controls` | GET | Controls report | ❌ |
| TC_RPT_005 | `/reports/trends` | GET | Trends report | ❌ |

## Test Automation Scripts

### 1. Basic Test Runner
```bash
# Run the basic test automation script
node test-automation-setup.js
```

### 2. Comprehensive Test Suite
```bash
# Run all tests with detailed reporting
./run-api-tests.sh

# Run specific test categories
./run-api-tests.sh auth
./run-api-tests.sh crud
./run-api-tests.sh reports
```

### 3. Custom Test Execution
```javascript
// Custom test execution
const { TestRunner, APITests } = require('./test-automation-setup');

async function runCustomTests() {
  const runner = new TestRunner();
  const tests = new APITests(runner);
  
  await runner.setup();
  
  // Run specific tests
  await runner.runTest('Custom Test', () => tests.testGetFrameworks());
  
  runner.generateReport();
}
```

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
      - run: npm run test:ci
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-reports/
```

### Test Environment Variables
```bash
# .env.test
API_BASE_URL=http://localhost:3001/api
TEST_DB_HOST=localhost
TEST_DB_PORT=5433
TEST_DB_NAME=grc_test
TEST_DB_USER=postgres
TEST_DB_PASSWORD=password
```

## Test Reporting

### Coverage Reports
- **HTML Coverage**: `coverage/lcov-report/index.html`
- **JSON Coverage**: `coverage/coverage-final.json`
- **Text Coverage**: Console output

### Test Results
- **JUnit XML**: `test-reports/*.xml`
- **JSON Results**: `test-results.json`
- **Markdown Summary**: `test-reports/test_summary_*.md`

## Performance Testing

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Run load tests
artillery run load-tests.yml
```

### Load Test Configuration
```yaml
# load-tests.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/frameworks"
          headers:
            Authorization: "Bearer {{ token }}"
```

## Security Testing

### Authentication Testing
- Valid token access
- Invalid token rejection
- Expired token handling
- Role-based access control

### Input Validation Testing
- SQL injection prevention
- XSS prevention
- Data type validation
- Required field validation

## Troubleshooting

### Common Issues

#### 1. Server Not Running
```bash
# Check if server is running
curl http://localhost:3001/health

# Start server if not running
cd backend && npm start
```

#### 2. Database Connection Issues
```bash
# Check database connection
psql -h localhost -p 5433 -U postgres -d grc_platform

# Reset test database
npm run reset:test
```

#### 3. Authentication Failures
```bash
# Check if test users exist
psql -h localhost -p 5433 -U postgres -d grc_platform -c "SELECT * FROM users;"

# Create test users if needed
npm run seed:test
```

### Debug Mode
```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test with verbose output
npm test -- --verbose --testNamePattern="Authentication"
```

## Test Maintenance

### Regular Updates
- Update test data monthly
- Review test cases quarterly
- Update test framework versions
- Monitor test performance

### Adding New Tests
1. Create test case in appropriate category
2. Add test ID to test matrix
3. Update test documentation
4. Run test to verify it works

### Test Documentation
- Keep test cases documented
- Update test results regularly
- Maintain test environment setup
- Document test failures and fixes

## Best Practices

### Test Design
- Use descriptive test names
- Test both success and failure cases
- Keep tests independent
- Use proper test data

### Test Execution
- Run tests in isolation
- Clean up test data
- Use appropriate timeouts
- Handle async operations properly

### Test Maintenance
- Regular test review
- Update test data
- Monitor test performance
- Document test changes

---

**Total Test Cases**: 150+
**Estimated Completion Time**: 4 weeks
**Test Coverage Target**: 95%
**Automation Level**: 90%

This comprehensive testing guide ensures systematic coverage of all API endpoints while providing clear instructions for both manual and automated testing approaches.
