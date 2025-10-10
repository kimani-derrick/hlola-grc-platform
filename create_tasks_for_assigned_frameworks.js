const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';
const NEW_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNmE4ODcwZC0xNDg3LTQ1MTEtODY4Yy04MjQ4NTk3MzMxMTIiLCJlbWFpbCI6InRlc3R1c2VyM0BleGFtcGxlLmNvbSIsIm9yZ2FuaXphdGlvbklkIjoiNjRjZDM3MDctNDEzMC00YWVjLWI2ZGQtYWQ5NmE0YTA2NGJmIiwicm9sZSI6ImNvbXBsaWFuY2VfbWFuYWdlciIsImlhdCI6MTc2MDEyNTEwMSwiZXhwIjoxNzYwMjExNTAxfQ.vut9UEeB71Glgwhpw2FF0iIHDoc-8HCQRcPYlxbaC-g';

const ENTITY_ID = '3fbc1eaa-6153-448c-86e7-4de4bb60371c';
const ORGANIZATION_ID = '64cd3707-4130-4aec-b6dd-ad96a4a064bf';

// Framework IDs that are assigned
const ASSIGNED_FRAMEWORKS = [
  'ee1f994e-8081-441c-8032-58447dadc9ae', // PCI DSS
  'a8a1e219-1abb-4a58-8eca-e72da27cd65c', // HIPAA
  'f57d4627-aff7-408b-97bf-53de682dab2e', // SOC 2
  'cebe2a09-c939-49de-916d-b5ccc27383e4'  // ISO 27001
];

async function createTasksForAssignedFrameworks() {
  try {
    console.log('🚀 Starting task creation for assigned frameworks...');
    
    let totalTasksCreated = 0;
    
    for (const frameworkId of ASSIGNED_FRAMEWORKS) {
      console.log(`\n📋 Processing framework: ${frameworkId}`);
      
      // Get controls for this framework
      const controlsResponse = await axios.get(`${API_BASE}/controls?frameworkId=${frameworkId}`, {
        headers: { 'Authorization': `Bearer ${NEW_TOKEN}` }
      });
      
      const controls = controlsResponse.data.controls || [];
      console.log(`   Found ${controls.length} controls`);
      
      if (controls.length === 0) {
        console.log(`   ⚠️  No controls found for framework ${frameworkId}`);
        continue;
      }
      
      // Create tasks for each control
      for (const control of controls) {
        try {
          const taskData = {
            controlId: control.id,
            title: generateTaskTitle(control),
            description: generateTaskDescription(control),
            priority: mapPriority(control.priority),
            category: 'compliance',
            estimatedHours: estimateHours(control.priority)
          };
          
          const taskResponse = await axios.post(`${API_BASE}/tasks`, taskData, {
            headers: { 
              'Authorization': `Bearer ${NEW_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (taskResponse.data.success) {
            totalTasksCreated++;
            console.log(`   ✅ Created task: ${taskData.title}`);
          }
          
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`   ❌ Error creating task for control ${control.id}:`, error.response?.data?.message || error.message);
        }
      }
    }
    
    console.log(`\n🎉 Task creation completed! Created ${totalTasksCreated} tasks.`);
    
    // Verify tasks were created
    const tasksResponse = await axios.get(`${API_BASE}/tasks`, {
      headers: { 'Authorization': `Bearer ${NEW_TOKEN}` }
    });
    
    console.log(`\n📊 Verification: ${tasksResponse.data.tasks.length} tasks now exist in the system`);
    
  } catch (error) {
    console.error('❌ Error in task creation process:', error.message);
  }
}

function generateTaskTitle(control) {
  const frameworkName = control.framework_name || 'Compliance';
  return `${frameworkName}: ${control.title}`;
}

function generateTaskDescription(control) {
  return `${control.description}\n\n` +
         `Framework: ${control.framework_name}\n` +
         `Control ID: ${control.control_id}\n` +
         `Priority: ${control.priority}\n` +
         `Category: ${control.category}\n` +
         `Implementation Level: ${control.implementation_level || 'N/A'}\n` +
         `Legal Requirements: ${control.legal_requirements || 'N/A'}\n` +
         `Technical Requirements: ${control.technical_requirements || 'N/A'}\n` +
         `Evidence Requirements: ${control.evidence_requirements ? control.evidence_requirements.join(', ') : 'N/A'}`;
}

function mapPriority(controlPriority) {
  const priorityMap = {
    'high': 'high',
    'medium': 'medium',
    'low': 'low',
    'critical': 'high'
  };
  return priorityMap[controlPriority] || 'medium';
}

function estimateHours(priority) {
  const hourMap = {
    'high': 8,
    'medium': 4,
    'low': 2,
    'critical': 12
  };
  return hourMap[priority] || 4;
}

// Run the script
createTasksForAssignedFrameworks();
