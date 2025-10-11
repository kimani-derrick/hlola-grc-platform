#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testDashboardAPI() {
  console.log('🧪 Testing Dashboard API Integration...\n');

  try {
    // Step 1: Login to get auth token
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'testadmin@example.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log(`✅ Logged in as: ${user.firstName} ${user.lastName} (${user.role})`);
    console.log(`   Organization ID: ${user.organizationId}\n`);

    const headers = { Authorization: `Bearer ${token}` };

    // Step 2: Get user profile
    console.log('2️⃣ Getting user profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, { headers });
    console.log(`✅ Profile: ${profileResponse.data.user.email}\n`);

    // Step 3: Get entities
    console.log('3️⃣ Getting entities...');
    const entitiesResponse = await axios.get(`${API_BASE_URL}/entities`, { headers });
    const entities = entitiesResponse.data.entities || [];
    console.log(`✅ Found ${entities.length} entities:`);
    entities.forEach(entity => {
      console.log(`   - ${entity.name} (${entity.country}, ${entity.type}) - ${entity.status}`);
    });
    console.log('');

    // Step 4: Get dashboard overview
    console.log('4️⃣ Getting dashboard overview...');
    const overviewResponse = await axios.get(`${API_BASE_URL}/reports/overview`, { headers });
    const overview = overviewResponse.data.data?.overview || {};
    console.log(`✅ Overview data:`);
    console.log(`   - Total Entities: ${overview.totalEntities || 0}`);
    console.log(`   - Total Frameworks: ${overview.totalFrameworks || 0}`);
    console.log(`   - Total Tasks: ${overview.totalTasks || 0}`);
    console.log(`   - Total Controls: ${overview.totalControls || 0}`);
    console.log(`   - Total Documents: ${overview.totalDocuments || 0}`);
    console.log(`   - Critical Issues: ${overview.criticalIssues || 0}`);
    console.log(`   - Risk Exposure: ${overview.riskExposure || 0}`);
    console.log(`   - Avg Compliance Score: ${overview.avgComplianceScore || 0}%\n`);

    // Step 5: Get tasks report
    console.log('5️⃣ Getting tasks report...');
    const tasksResponse = await axios.get(`${API_BASE_URL}/reports/tasks`, { headers });
    const tasks = tasksResponse.data.data?.summary || {};
    console.log(`✅ Tasks data:`);
    console.log(`   - Total Tasks: ${tasks.totalTasks || 0}`);
    console.log(`   - Completed Tasks: ${tasks.completedTasks || 0}`);
    console.log(`   - Pending Tasks: ${tasks.pendingTasks || 0}`);
    console.log(`   - In Progress Tasks: ${tasks.inProgressTasks || 0}`);
    console.log(`   - Overdue Tasks: ${tasks.overdueTasks || 0}`);
    console.log(`   - Completion Rate: ${tasks.completionRate || 0}%\n`);

    // Step 6: Get frameworks report
    console.log('6️⃣ Getting frameworks report...');
    const frameworksResponse = await axios.get(`${API_BASE_URL}/reports/frameworks`, { headers });
    const frameworks = frameworksResponse.data.data?.summary || {};
    console.log(`✅ Frameworks data:`);
    console.log(`   - Assigned Frameworks: ${frameworks.assignedFrameworks || 0}`);
    console.log(`   - Total Available: ${frameworks.totalAvailableFrameworks || 0}`);
    console.log(`   - Coverage: ${frameworks.coveragePercentage || 0}%\n`);

    // Step 7: Get documents
    console.log('7️⃣ Getting documents...');
    const documentsResponse = await axios.get(`${API_BASE_URL}/documents`, { headers });
    const documents = documentsResponse.data.documents || [];
    console.log(`✅ Found ${documents.length} documents\n`);

    // Step 8: Get audit gaps
    console.log('8️⃣ Getting audit gaps...');
    const gapsResponse = await axios.get(`${API_BASE_URL}/audit-gaps`, { headers });
    const gaps = gapsResponse.data || [];
    console.log(`✅ Found ${gaps.length} audit gaps\n`);

    // Step 9: Test entity-specific data if we have entities
    if (entities.length > 0) {
      const firstEntity = entities[0];
      console.log(`9️⃣ Testing entity-specific data for: ${firstEntity.name}...`);
      
      // Get entity frameworks
      const entityFrameworksResponse = await axios.get(`${API_BASE_URL}/entities/${firstEntity.id}/frameworks`, { headers });
      const entityFrameworks = entityFrameworksResponse.data.frameworks || [];
      console.log(`   - Assigned Frameworks: ${entityFrameworks.length}`);
      
      // Get entity documents
      const entityDocumentsResponse = await axios.get(`${API_BASE_URL}/documents/entities/${firstEntity.id}`, { headers });
      const entityDocuments = entityDocumentsResponse.data || [];
      console.log(`   - Documents: ${entityDocuments.length}`);
    }

    console.log('\n🎉 Dashboard API integration test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - User authenticated: ✅`);
    console.log(`   - Entities loaded: ${entities.length}`);
    console.log(`   - Dashboard data available: ✅`);
    console.log(`   - All API endpoints working: ✅`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test
testDashboardAPI();
