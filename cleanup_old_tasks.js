const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjUxZjlhYy04MmY3LTRhN2EtOGMxZC03MzhlZGEwNDljNGEiLCJlbWFpbCI6InRlc3R1c2VyMjAyNUBleGFtcGxlLmNvbSIsIm9yZ2FuaXphdGlvbklkIjoiM2QyZWMwOGYtM2EwNy00OTBlLTk3OWItZTMwN2EzYTY0YjNiIiwicm9sZSI6ImNvbXBsaWFuY2VfbWFuYWdlciIsImlhdCI6MTc2MDE3MjMxMiwiZXhwIjoxNzYwMjU4NzEyfQ.V8DlIb3cjkF06XWalchPQdZK1vxcqUmC8dKKUvpItEg';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function cleanupOldTasks() {
  try {
    console.log('🧹 Starting cleanup of old test tasks...');
    
    // Get all tasks
    const response = await axios.get(`${BASE_URL}/tasks/all`, { headers });
    const tasks = response.data.tasks;
    
    console.log(`📊 Found ${tasks.length} total tasks`);
    
    // Filter for old ISO 27001 tasks (created before today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oldTasks = tasks.filter(task => {
      const taskDate = new Date(task.created_at);
      return task.framework_name === 'ISO 27001' && taskDate < today;
    });
    
    console.log(`🗑️  Found ${oldTasks.length} old ISO 27001 tasks to delete`);
    
    // Delete old tasks
    let deletedCount = 0;
    for (const task of oldTasks) {
      try {
        await axios.delete(`${BASE_URL}/tasks/${task.id}`, { headers });
        console.log(`✅ Deleted task: ${task.title}`);
        deletedCount++;
      } catch (error) {
        console.log(`❌ Failed to delete task ${task.id}: ${error.message}`);
      }
    }
    
    console.log(`🎉 Cleanup completed! Deleted ${deletedCount} old tasks`);
    
    // Verify cleanup
    const verifyResponse = await axios.get(`${BASE_URL}/tasks/all`, { headers });
    const remainingTasks = verifyResponse.data.tasks.filter(task => 
      task.framework_name === 'ISO 27001' && new Date(task.created_at) < today
    );
    
    console.log(`✅ Verification: ${remainingTasks.length} old ISO 27001 tasks remaining`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

cleanupOldTasks();
