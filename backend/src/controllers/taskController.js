const Task = require('../models/Task');
const Control = require('../models/Control');
const logger = require('../config/logger');

const createTask = async (req, res, next) => {
  try {
    const { organizationId, userId } = req.user;
    const { controlId, title, description, priority, category, assigneeId, dueDate, estimatedHours } = req.body;

    logger.info('Creating task', {
      requestId: req.id,
      organizationId: organizationId,
      controlId: controlId,
      title: title,
      assigneeId: assigneeId
    });

    // Verify control exists and belongs to organization
    const control = await Control.findById(controlId);
    if (!control) {
      return res.status(404).json({
        success: false,
        error: 'Control not found',
        message: 'The specified control does not exist'
      });
    }

    const task = await Task.create({
      controlId,
      title,
      description,
      priority: priority || 'medium',
      category,
      assigneeId,
      dueDate,
      estimatedHours
    });

    logger.info('Task created successfully', {
      requestId: req.id,
      taskId: task.id,
      title: task.title
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    logger.error('Error creating task', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching task', {
      requestId: req.id,
      taskId: id,
      organizationId: organizationId
    });

    const task = await Task.findById(id, organizationId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: 'The requested task does not exist or you do not have permission to access it'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error fetching task', {
      requestId: req.id,
      taskId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const filters = req.query;

    logger.info('Fetching all tasks', {
      requestId: req.id,
      organizationId: organizationId,
      filters: filters
    });

    const tasks = await Task.findAll(filters, organizationId);
    const total = await Task.countAll(filters, organizationId);

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        total,
        limit: filters.limit ? parseInt(filters.limit) : null,
        offset: filters.offset ? parseInt(filters.offset) : null
      }
    });
  } catch (error) {
    logger.error('Error fetching tasks', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getTasksByControl = async (req, res, next) => {
  try {
    const { controlId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching tasks for control', {
      requestId: req.id,
      controlId: controlId,
      organizationId: organizationId
    });

    const tasks = await Task.findByControlId(controlId, organizationId);

    res.status(200).json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    logger.error('Error fetching tasks for control', {
      requestId: req.id,
      controlId: req.params.controlId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getTasksByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching tasks for user', {
      requestId: req.id,
      userId: userId,
      organizationId: organizationId
    });

    const tasks = await Task.findByUserId(userId, organizationId);

    res.status(200).json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    logger.error('Error fetching tasks for user', {
      requestId: req.id,
      userId: req.params.userId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getTasksByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { organizationId } = req.user;

    logger.info('Fetching tasks for entity', {
      requestId: req.id,
      entityId: entityId,
      organizationId: organizationId
    });

    const tasks = await Task.findByEntityId(entityId, organizationId);

    res.status(200).json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    logger.error('Error fetching tasks for entity', {
      requestId: req.id,
      entityId: req.params.entityId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, userId, role } = req.user;
    const updates = req.body;

    logger.info('Updating task', {
      requestId: req.id,
      taskId: id,
      organizationId: organizationId,
      updates: updates
    });

    // Check if task exists and user has permission
    const existingTask = await Task.findById(id, organizationId);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: 'The requested task does not exist or you do not have permission to update it'
      });
    }

    // Check authorization - admin, compliance_manager, or assigned user
    if (role !== 'admin' && role !== 'compliance_manager' && existingTask.assignee_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to update this task'
      });
    }

    const updatedTask = await Task.update(id, updates);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: 'The requested task does not exist'
      });
    }

    logger.info('Task updated successfully', {
      requestId: req.id,
      taskId: updatedTask.id
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    logger.error('Error updating task', {
      requestId: req.id,
      taskId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId, userId, role } = req.user;
    const { status, progress, actualHours } = req.body;

    logger.info('Updating task status', {
      requestId: req.id,
      taskId: id,
      organizationId: organizationId,
      status: status
    });

    // Check if task exists and user has permission
    const existingTask = await Task.findById(id, organizationId);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: 'The requested task does not exist or you do not have permission to update it'
      });
    }

    // Check authorization - admin, compliance_manager, or assigned user
    if (role !== 'admin' && role !== 'compliance_manager' && existingTask.assignee_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to update this task'
      });
    }

    const updatedTask = await Task.updateStatus(id, { status, progress, actualHours });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: 'The requested task does not exist'
      });
    }

    logger.info('Task status updated successfully', {
      requestId: req.id,
      taskId: updatedTask.id,
      status: updatedTask.status
    });

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task: updatedTask
    });
  } catch (error) {
    logger.error('Error updating task status', {
      requestId: req.id,
      taskId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    logger.info('Deleting task', {
      requestId: req.id,
      taskId: id,
      organizationId: organizationId
    });

    // Check if task exists
    const existingTask = await Task.findById(id, organizationId);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: 'The requested task does not exist or you do not have permission to delete it'
      });
    }

    const task = await Task.delete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: 'The requested task does not exist'
      });
    }

    logger.info('Task deleted successfully', {
      requestId: req.id,
      taskId: id
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting task', {
      requestId: req.id,
      taskId: req.params.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};


const getTaskStats = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const filters = req.query;

    logger.info('Fetching task statistics', {
      requestId: req.id,
      organizationId: organizationId,
      filters: filters
    });

    const stats = await Task.getTaskStats(organizationId, filters);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error('Error fetching task statistics', {
      requestId: req.id,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  createTask,
  getTask,
  getAllTasks,
  getTasksByControl,
  getTasksByUser,
  getTasksByEntity,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
};
