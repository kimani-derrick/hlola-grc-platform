const Task = require('../models/Task');
const Control = require('../models/Control');
const realtimeEventEmitter = require('../services/realtimeEventEmitter');
const logger = require('../config/logger');

// Helper function to get organization context for platform admin vs regular user
const getOrganizationContext = (req) => {
  if (req.platformAdmin) {
    // Platform admin has access to all data - no organization filter
    return { isPlatformAdmin: true, organizationId: null };
  } else if (req.user) {
    // Regular user - filter by their organization
    return { isPlatformAdmin: false, organizationId: req.user.organizationId };
  }
  throw new Error('No authentication context found');
};

const createTask = async (req, res, next) => {
  try {
    const { organizationId, userId } = req.user;
    const { controlId, title, description, priority, category, assigneeId, dueDate, estimatedHours } = req.body;

    logger.info('Creating task', {
      requestId: req.id,
      organizationId: organizationId,
      userId: userId,
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

    // Get user's entity ID and automatically assign task to it
    let userEntityId = null;
    try {
      const User = require('../models/User');
      const user = await User.findById(userId);
      logger.info('User lookup result', {
        requestId: req.id,
        userId: userId,
        userFound: !!user,
        userEntityId: user?.entity_id,
        userData: user
      });
      
      if (user && user.entity_id) {
        userEntityId = user.entity_id;
        try {
          const assignment = await Task.assignToEntity(task.id, user.entity_id, assigneeId, priority || 'medium', dueDate);
          logger.info('Task assigned to entity', {
            requestId: req.id,
            taskId: task.id,
            entityId: user.entity_id,
            assignment: assignment
          });
        } catch (assignError) {
          logger.error('Error assigning task to entity', {
            requestId: req.id,
            taskId: task.id,
            entityId: user.entity_id,
            error: assignError.message,
            stack: assignError.stack
          });
        }
      } else {
        logger.warn('User entity not found, task created without entity assignment', {
          requestId: req.id,
          taskId: task.id,
          userId: userId,
          userFound: !!user,
          userEntityId: user?.entity_id
        });
      }
    } catch (error) {
      logger.error('Error in user lookup or task assignment', {
        requestId: req.id,
        taskId: task.id,
        userId: userId,
        error: error.message,
        stack: error.stack
      });
    }

    logger.info('Task created successfully', {
      requestId: req.id,
      taskId: task.id,
      title: task.title
    });

    // Emit real-time event for task creation
    realtimeEventEmitter.emitTaskCreated({
      taskId: task.id,
      entityId: userEntityId,
      controlId: task.control_id,
      frameworkId: task.framework_id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assignee_id,
      createdBy: userId
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
    const { isPlatformAdmin, organizationId } = getOrganizationContext(req);
    const filters = req.query;

    logger.info('Fetching all tasks', {
      requestId: req.id,
      organizationId: organizationId,
      isPlatformAdmin: isPlatformAdmin,
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
      organizationId: req.user?.organizationId || 'platform-admin',
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getAllTasksUnassigned = async (req, res, next) => {
  try {
    const { isPlatformAdmin, organizationId } = getOrganizationContext(req);
    const filters = req.query;

    logger.info('Fetching all tasks (including unassigned)', {
      requestId: req.id,
      organizationId: organizationId,
      isPlatformAdmin: isPlatformAdmin,
      filters: filters
    });

    // Get all tasks without entity restrictions
    const tasks = await Task.findAllUnassigned(filters);
    const total = await Task.countAllUnassigned(filters);

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
    logger.error('Error fetching all tasks (unassigned)', {
      requestId: req.id,
      organizationId: req.user?.organizationId || 'platform-admin',
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getTasksByControl = async (req, res, next) => {
  try {
    const { controlId } = req.params;
    const { isActive } = req.query; // Get tab context from query param
    const { organizationId } = req.user;

    logger.info('Fetching tasks for control', {
      requestId: req.id,
      controlId: controlId,
      organizationId: organizationId,
      isActive: isActive === 'true'
    });

    let tasks;
    if (isActive === 'true') {
      // Active tab: Show assigned tasks
      tasks = await Task.findByControlId(controlId, organizationId);
    } else {
      // Library tab: Show base tasks
      tasks = await Task.findBaseTasksByControlId(controlId);
    }

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

    // Emit real-time event for task update (including assignment changes)
    const assignmentChanged = existingTask.assignee_id !== updatedTask.assignee_id;
    if (assignmentChanged) {
      realtimeEventEmitter.emitTaskAssigned({
        taskId: updatedTask.id,
        entityId: updatedTask.entity_id,
        controlId: updatedTask.control_id,
        frameworkId: updatedTask.framework_id,
        assigneeId: updatedTask.assignee_id,
        priority: updatedTask.priority,
        assignedBy: userId
      });
    }

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

    // If completing a task, check for required evidence
    if (status === 'completed') {
      const Document = require('../models/Document');
      const evidenceDocuments = await Document.findByTask(id, organizationId, { 
        documentType: 'evidence' 
      });
      
      if (evidenceDocuments.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Evidence required',
          message: 'Cannot complete task without uploading evidence. Please upload evidence documents before marking the task as completed.',
          requiredAction: 'upload_evidence'
        });
      }

      logger.info('Task completion validated with evidence', {
        requestId: req.id,
        taskId: id,
        evidenceCount: evidenceDocuments.length
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

    // Trigger compliance event listener
    try {
      const ComplianceEventListener = require('../services/complianceEventListener');
      await ComplianceEventListener.onTaskStatusUpdated(updatedTask, existingTask.status, updatedTask.status);
    } catch (error) {
      logger.error('Error triggering compliance event for task status update', {
        error: error.message,
        taskId: updatedTask.id,
        entityId: updatedTask.entity_id
      });
    }

    // Emit real-time event for task status change
    realtimeEventEmitter.emitTaskStatusChanged({
      taskId: updatedTask.id,
      entityId: updatedTask.entity_id,
      controlId: updatedTask.control_id,
      frameworkId: updatedTask.framework_id,
      oldStatus: existingTask.status,
      newStatus: updatedTask.status,
      priority: updatedTask.priority,
      assigneeId: updatedTask.assignee_id,
      updatedBy: userId
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

const getTasksByFramework = async (req, res, next) => {
  try {
    const { frameworkId } = req.params;
    const { isActive } = req.query; // Get tab context from query param
    const { organizationId } = req.user;

    logger.info('Fetching tasks by framework', {
      requestId: req.id,
      frameworkId: frameworkId,
      organizationId: organizationId,
      isActive: isActive === 'true'
    });

    let tasks;
    if (isActive === 'true') {
      // Active tab: Show assigned tasks
      tasks = await Task.findAssignedTasksByFrameworkId(frameworkId, organizationId);
    } else {
      // Library tab: Show base tasks
      tasks = await Task.findByFrameworkId(frameworkId);
    }

    logger.info('Tasks fetched by framework successfully', {
      requestId: req.id,
      frameworkId: frameworkId,
      taskCount: tasks.length,
      isActive: isActive === 'true'
    });

    res.json({
      success: true,
      tasks: tasks,
      count: tasks.length
    });
  } catch (error) {
    logger.error('Error fetching tasks by framework', {
      requestId: req.id,
      frameworkId: req.params.frameworkId,
      organizationId: req.user.organizationId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

// Admin-specific function to get all base tasks (for Admin UI content management)
const getAllTasksForAdmin = async (req, res, next) => {
  try {
    const filters = req.query;

    logger.info('Fetching all base tasks for admin', {
      requestId: req.id,
      filters: filters
    });

    // Get ALL base tasks (not assigned/unassigned, just all tasks in the system)
    const [tasks, total] = await Promise.all([
      Task.findAllForAdmin(filters), // Get all base tasks
      Task.countAllForAdmin(filters) // Get total count
    ]);

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
    logger.error('Error fetching all base tasks for admin', {
      requestId: req.id,
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
};
