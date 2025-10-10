#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4M2NlYzQxMi1hMWU3LTQzZmEtODE1NC02MDU4ZjY2MjhlZDYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJvcmdhbml6YXRpb25JZCI6ImJmYmIzMjQ3LTVmZTktNDYzZS05ZWZiLTI2NWZmOTQ3ZjE1ZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MDEyMTQ0NCwiZXhwIjoxNzYwMjA3ODQ0fQ.3UBSw6rBEakcqeU1d4qo1-dMFZopQHFLrpsDZixYOKs';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function getAllControls() {
  try {
    const response = await axios.get(`${API_BASE}/controls`, { headers });
    return response.data.frameworks || response.data.controls || [];
  } catch (error) {
    console.error('Error fetching controls:', error.message);
    return [];
  }
}

async function getAllTasks() {
  try {
    const response = await axios.get(`${API_BASE}/tasks`, { headers });
    return response.data.tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    return [];
  }
}

async function createTaskForControl(control) {
  const taskData = {
    controlId: control.id,
    title: `Implement: ${control.title}`,
    description: `${control.description}\n\nFramework: ${control.framework_name}\nRegion: ${control.region}\nCountry: ${control.country}\n\nImplementation Guidance: ${control.implementation_guidance || 'Follow the control requirements and provide evidence of compliance.'}`,
    priority: control.priority || 'medium',
    category: 'compliance',
    dueDate: '2024-12-31',
    estimatedHours: getEstimatedHours(control.priority)
  };

  try {
    const response = await axios.post(`${API_BASE}/tasks`, taskData, { headers });
    return response.data.task;
  } catch (error) {
    console.error(`Error creating task for control ${control.id}:`, error.response?.data || error.message);
    return null;
  }
}

function getEstimatedHours(priority) {
  const hoursMap = {
    'high': 8,
    'medium': 4,
    'low': 2
  };
  return hoursMap[priority] || 4;
}

async function main() {
  console.log('🔍 Analyzing controls and tasks...\n');

  // Get all controls and tasks
  const controls = await getAllControls();
  const allTasks = await getAllTasks();
  
  console.log(`📊 Found ${controls.length} controls and ${allTasks.length} total tasks\n`);

  // Get unique control IDs that have tasks
  const controlsWithTasks = new Set(allTasks.map(task => task.control_id));
  
  // Find controls without tasks
  const controlsWithoutTasks = controls.filter(control => !controlsWithTasks.has(control.id));
  
  console.log(`❌ Controls without tasks: ${controlsWithoutTasks.length}`);
  console.log(`✅ Controls with tasks: ${controls.length - controlsWithoutTasks.length}\n`);

  if (controlsWithoutTasks.length === 0) {
    console.log('🎉 All controls already have tasks!');
    return;
  }

  console.log('📋 Sample controls without tasks:');
  controlsWithoutTasks.slice(0, 10).forEach((control, index) => {
    console.log(`${index + 1}. ${control.control_id} - ${control.title} (${control.framework_name})`);
  });

  if (controlsWithoutTasks.length > 10) {
    console.log(`... and ${controlsWithoutTasks.length - 10} more controls\n`);
  }

  console.log('🚀 Creating tasks for controls without tasks...\n');

  let successCount = 0;
  let errorCount = 0;

  // Process all controls without tasks
  for (let i = 0; i < controlsWithoutTasks.length; i++) {
    const control = controlsWithoutTasks[i];
    console.log(`[${i + 1}/${controlsWithoutTasks.length}] Creating task for: ${control.control_id} - ${control.title}`);
    
    const task = await createTaskForControl(control);
    
    if (task) {
      console.log(`✅ Created task: ${task.title} (ID: ${task.id})`);
      successCount++;
    } else {
      console.log(`❌ Failed to create task for: ${control.control_id}`);
      errorCount++;
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n📊 Final Summary:');
  console.log(`✅ Successfully created: ${successCount} tasks`);
  console.log(`❌ Failed to create: ${errorCount} tasks`);
  console.log(`📋 Total controls processed: ${controlsWithoutTasks.length}`);
  console.log(`🎯 Success rate: ${((successCount / controlsWithoutTasks.length) * 100).toFixed(1)}%`);
}

// Run the script
main().catch(console.error);
