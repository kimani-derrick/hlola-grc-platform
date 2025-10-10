const express = require('express');
const {
  createTask,
  getTask,
  getAllTasks,
  getAllTasksUnassigned,
  getTasksByControl,
  getTasksByUser,
  getTasksByEntity,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, createTaskSchema, updateTaskSchema, updateTaskStatusSchema } = require('../middleware/validation');

const router = express.Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// Task Management
router.post('/', requireRole(['admin', 'compliance_manager']), validateRequest(createTaskSchema), createTask);
router.get('/stats', getTaskStats);
router.get('/all', getAllTasksUnassigned); // Get all tasks including unassigned ones
router.get('/', getAllTasks);
router.get('/:id', getTask);
router.put('/:id', validateRequest(updateTaskSchema), updateTask);
router.put('/:id/status', validateRequest(updateTaskStatusSchema), updateTaskStatus);
router.delete('/:id', requireRole(['admin']), deleteTask);

// Task Queries by Related Entities
router.get('/controls/:controlId', getTasksByControl);
router.get('/users/:userId', getTasksByUser);
router.get('/entities/:entityId', getTasksByEntity);

module.exports = router;
