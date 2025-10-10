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

function generateContextAwareTask(control) {
  // Generate specific task based on control type and framework
  const baseTitle = control.title;
  const framework = control.framework_name || 'Unknown Framework';
  const region = control.region || 'Unknown Region';
  const country = control.country || 'Unknown Country';
  
  // Create context-aware task title
  let taskTitle = '';
  let taskDescription = '';
  let priority = 'medium';
  let estimatedHours = 4;
  let category = 'compliance';

  // Framework-specific task generation
  if (framework === 'GDPR') {
    taskTitle = `GDPR Compliance: ${baseTitle}`;
    taskDescription = `Implement ${baseTitle} to ensure GDPR compliance.\n\n` +
      `Control ID: ${control.control_id}\n` +
      `Framework: ${framework}\n` +
      `Legal Basis: ${control.legal_provision || 'N/A'}\n` +
      `Implementation Level: ${control.implementation_level || 'Basic'}\n\n` +
      `Description: ${control.description}\n\n` +
      `Implementation Guidance: ${control.implementation_guidance || 'Follow GDPR requirements and document all processes.'}\n\n` +
      `Evidence Requirements: ${control.evidence_requirements ? control.evidence_requirements.join(', ') : 'Documentation and proof of implementation'}`;
    priority = 'high';
    estimatedHours = 8;
    category = 'gdpr-compliance';
  } 
  else if (framework === 'ISO 27001') {
    taskTitle = `ISO 27001 Implementation: ${baseTitle}`;
    taskDescription = `Implement ${baseTitle} according to ISO 27001 standards.\n\n` +
      `Control ID: ${control.control_id}\n` +
      `Framework: ${framework}\n` +
      `Control Domain: ${control.domain || 'Information Security'}\n` +
      `Implementation Level: ${control.implementation_level || 'Basic'}\n\n` +
      `Description: ${control.description}\n\n` +
      `Implementation Guidance: ${control.implementation_guidance || 'Follow ISO 27001 guidelines and establish proper controls.'}\n\n` +
      `Evidence Requirements: ${control.evidence_requirements ? control.evidence_requirements.join(', ') : 'Documentation, procedures, and evidence of implementation'}`;
    priority = 'high';
    estimatedHours = 6;
    category = 'iso-compliance';
  }
  else if (region === 'Africa' && country) {
    // African Data Protection Act
    taskTitle = `${country} Data Protection: ${baseTitle}`;
    taskDescription = `Implement ${baseTitle} to comply with ${country} Data Protection Act.\n\n` +
      `Control ID: ${control.control_id}\n` +
      `Framework: ${framework}\n` +
      `Country: ${country}\n` +
      `Region: ${region}\n` +
      `Legal Provision: ${control.legal_provision || 'N/A'}\n` +
      `Implementation Level: ${control.implementation_level || 'Basic'}\n\n` +
      `Description: ${control.description}\n\n` +
      `Implementation Guidance: ${control.implementation_guidance || `Follow ${country} data protection requirements and establish proper controls.`}\n\n` +
      `Evidence Requirements: ${control.evidence_requirements ? control.evidence_requirements.join(', ') : 'Documentation, policies, and proof of compliance'}`;
    priority = control.priority || 'medium';
    estimatedHours = 4;
    category = 'data-protection-compliance';
  }
  else {
    // Generic framework
    taskTitle = `${framework} Compliance: ${baseTitle}`;
    taskDescription = `Implement ${baseTitle} to ensure ${framework} compliance.\n\n` +
      `Control ID: ${control.control_id}\n` +
      `Framework: ${framework}\n` +
      `Region: ${region}\n` +
      `Country: ${country}\n` +
      `Implementation Level: ${control.implementation_level || 'Basic'}\n\n` +
      `Description: ${control.description}\n\n` +
      `Implementation Guidance: ${control.implementation_guidance || `Follow ${framework} requirements and establish proper controls.`}\n\n` +
      `Evidence Requirements: ${control.evidence_requirements ? control.evidence_requirements.join(', ') : 'Documentation and proof of implementation'}`;
    priority = control.priority || 'medium';
    estimatedHours = 4;
    category = 'compliance';
  }

  return {
    controlId: control.id,
    title: taskTitle,
    description: taskDescription,
    priority: priority,
    category: category,
    dueDate: '2024-12-31',
    estimatedHours: estimatedHours
  };
}

async function createTaskForControl(control) {
  const taskData = generateContextAwareTask(control);

  try {
    const response = await axios.post(`${API_BASE}/tasks`, taskData, { headers });
    return response.data.task;
  } catch (error) {
    console.error(`Error creating task for control ${control.control_id}:`, error.response?.data || error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Analyzing controls and creating context-aware tasks...\n');

  // Get all controls and tasks
  const controls = await getAllControls();
  const allTasks = await getAllTasks();
  
  console.log(`📊 Found ${controls.length} controls and ${allTasks.length} existing tasks\n`);

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

  // Group controls by framework for better organization
  const controlsByFramework = {};
  controlsWithoutTasks.forEach(control => {
    const framework = control.framework_name || 'Unknown';
    if (!controlsByFramework[framework]) {
      controlsByFramework[framework] = [];
    }
    controlsByFramework[framework].push(control);
  });

  console.log('📋 Controls without tasks by framework:');
  Object.keys(controlsByFramework).forEach(framework => {
    console.log(`  ${framework}: ${controlsByFramework[framework].length} controls`);
  });
  console.log('');

  console.log('🚀 Creating context-aware tasks for controls...\n');

  let successCount = 0;
  let errorCount = 0;
  const frameworkStats = {};

  // Process all controls without tasks
  for (let i = 0; i < controlsWithoutTasks.length; i++) {
    const control = controlsWithoutTasks[i];
    const framework = control.framework_name || 'Unknown';
    
    console.log(`[${i + 1}/${controlsWithoutTasks.length}] Creating task for: ${control.control_id} - ${control.title} (${framework})`);
    
    const task = await createTaskForControl(control);
    
    if (task) {
      console.log(`✅ Created: ${task.title}`);
      successCount++;
      
      // Track framework stats
      if (!frameworkStats[framework]) {
        frameworkStats[framework] = { success: 0, error: 0 };
      }
      frameworkStats[framework].success++;
    } else {
      console.log(`❌ Failed to create task for: ${control.control_id}`);
      errorCount++;
      
      if (!frameworkStats[framework]) {
        frameworkStats[framework] = { success: 0, error: 0 };
      }
      frameworkStats[framework].error++;
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 Final Summary:');
  console.log(`✅ Successfully created: ${successCount} tasks`);
  console.log(`❌ Failed to create: ${errorCount} tasks`);
  console.log(`📋 Total controls processed: ${controlsWithoutTasks.length}`);
  console.log(`🎯 Success rate: ${((successCount / controlsWithoutTasks.length) * 100).toFixed(1)}%`);

  console.log('\n📈 Framework Breakdown:');
  Object.keys(frameworkStats).forEach(framework => {
    const stats = frameworkStats[framework];
    const total = stats.success + stats.error;
    const successRate = ((stats.success / total) * 100).toFixed(1);
    console.log(`  ${framework}: ${stats.success}/${total} (${successRate}%)`);
  });
}

// Run the script
main().catch(console.error);
