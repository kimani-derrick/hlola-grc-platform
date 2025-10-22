const express = require('express');
const {
  createTask,
  createTaskForAdmin,
  getTask,
  getAllTasks,
  getAllTasksUnassigned,
  getAllTasksForAdmin,
  getTasksByControl,
  getTasksByUser,
  getTasksByEntity,
  getTasksByFramework,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} = require('../../controllers/taskController');
const { authenticatePlatformAdmin, requirePlatformAdmin } = require('../../middleware/platformAuth');
const { validateRequest, createTaskSchema, updateTaskSchema, updateTaskStatusSchema } = require('../../middleware/validation');

const router = express.Router();

// All routes require platform admin authentication
router.use(authenticatePlatformAdmin);
router.use(requirePlatformAdmin);

// Task Management
router.post('/', validateRequest(createTaskSchema), createTaskForAdmin);
router.get('/stats', getTaskStats);
router.get('/all', getAllTasksUnassigned); // Get all tasks including unassigned ones
router.get('/', getAllTasksForAdmin); // Get all tasks across frameworks for admin
router.get('/:id', getTask);
router.put('/:id', validateRequest(updateTaskSchema), updateTask);
router.put('/:id/status', validateRequest(updateTaskStatusSchema), updateTaskStatus);
router.delete('/:id', deleteTask);

// Task Queries by Related Entities
router.get('/controls/:controlId', getTasksByControl);
router.get('/users/:userId', getTasksByUser);
router.get('/entities/:entityId', getTasksByEntity);
router.get('/frameworks/:frameworkId', getTasksByFramework);

module.exports = router;
