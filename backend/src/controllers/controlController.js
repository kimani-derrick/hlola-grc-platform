const Control = require('../models/Control');
const Framework = require('../models/Framework');
const logger = require('../config/logger');

const createControl = async (req, res, next) => {
  try {
    const controlData = req.body;
    
    // Verify framework exists
    const framework = await Framework.findById(controlData.frameworkId);
    if (!framework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The specified framework does not exist'
      });
    }

    logger.info('Creating control', { 
      requestId: req.id, 
      controlData: {
        title: controlData.title,
        frameworkId: controlData.frameworkId,
        priority: controlData.priority
      }
    });

    const control = await Control.create(controlData);

    logger.info('Control created successfully', { 
      requestId: req.id, 
      controlId: control.id,
      title: control.title
    });

    res.status(201).json({
      success: true,
      message: 'Control created successfully',
      control
    });
  } catch (error) {
    logger.error('Error creating control', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getControl = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('Fetching control', { 
      requestId: req.id, 
      controlId: id 
    });

    const control = await Control.findById(id);

    if (!control) {
      return res.status(404).json({
        success: false,
        error: 'Control not found',
        message: 'The requested control does not exist'
      });
    }

    res.status(200).json({
      success: true,
      control
    });
  } catch (error) {
    logger.error('Error fetching control', {
      requestId: req.id,
      controlId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getAllControls = async (req, res, next) => {
  try {
    const { limit, offset, search, frameworkId, category, priority, implementationLevel, sortBy, sortOrder } = req.query;

    logger.info('Fetching all controls', { 
      requestId: req.id, 
      filters: { search, frameworkId, category, priority, implementationLevel }
    });

    const controls = await Control.findAll({
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      search,
      frameworkId,
      category,
      priority,
      implementationLevel,
      sortBy,
      sortOrder
    });

    const total = await Control.countAll({
      search,
      frameworkId,
      category,
      priority,
      implementationLevel
    });

    res.status(200).json({
      success: true,
      controls,
      pagination: {
        total,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : 0,
        hasMore: (limit && offset) ? (parseInt(offset) + controls.length < total) : false
      }
    });
  } catch (error) {
    logger.error('Error fetching all controls', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateControl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    logger.info('Updating control', { 
      requestId: req.id, 
      controlId: id, 
      updates: Object.keys(updates)
    });

    const updatedControl = await Control.update(id, updates);

    if (!updatedControl) {
      return res.status(404).json({
        success: false,
        error: 'Control not found',
        message: 'The requested control does not exist'
      });
    }

    logger.info('Control updated successfully', { 
      requestId: req.id, 
      controlId: updatedControl.id
    });

    res.status(200).json({
      success: true,
      message: 'Control updated successfully',
      control: updatedControl
    });
  } catch (error) {
    logger.error('Error updating control', {
      requestId: req.id,
      controlId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const deleteControl = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('Deleting control', { 
      requestId: req.id, 
      controlId: id 
    });

    const control = await Control.delete(id);

    if (!control) {
      return res.status(404).json({
        success: false,
        error: 'Control not found',
        message: 'The requested control does not exist'
      });
    }

    logger.info('Control deleted successfully', { 
      requestId: req.id, 
      controlId: id
    });

    res.status(200).json({
      success: true,
      message: 'Control deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting control', {
      requestId: req.id,
      controlId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getControlsByFramework = async (req, res, next) => {
  try {
    const { frameworkId } = req.params;

    logger.info('Fetching controls by framework', { 
      requestId: req.id, 
      frameworkId 
    });

    // Verify framework exists
    const framework = await Framework.findById(frameworkId);
    if (!framework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The specified framework does not exist'
      });
    }

    const controls = await Control.findByFrameworkId(frameworkId);

    res.status(200).json({
      success: true,
      controls,
      count: controls.length,
      framework: {
        id: framework.id,
        name: framework.name,
        region: framework.region,
        country: framework.country
      }
    });
  } catch (error) {
    logger.error('Error fetching controls by framework', {
      requestId: req.id,
      frameworkId: req.params.frameworkId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getControlsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    logger.info('Fetching controls by category', { 
      requestId: req.id, 
      category 
    });

    const controls = await Control.findByCategory(category);

    res.status(200).json({
      success: true,
      controls,
      count: controls.length,
      category
    });
  } catch (error) {
    logger.error('Error fetching controls by category', {
      requestId: req.id,
      category: req.params.category,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const searchControls = async (req, res, next) => {
  try {
    const { q, limit, offset } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search query',
        message: 'Search query must be at least 2 characters long'
      });
    }

    logger.info('Searching controls', { 
      requestId: req.id, 
      query: q, 
      limit, 
      offset 
    });

    const controls = await Control.search(q, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });

    res.status(200).json({
      success: true,
      controls,
      count: controls.length,
      query: q,
      pagination: {
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : 0
      }
    });
  } catch (error) {
    logger.error('Error searching controls', {
      requestId: req.id,
      query: req.query.q,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getControlsGroupedByCategory = async (req, res, next) => {
  try {
    logger.info('Fetching controls grouped by category', { 
      requestId: req.id 
    });

    const groupedControls = await Control.getGroupedByCategory();

    res.status(200).json({
      success: true,
      groupedControls
    });
  } catch (error) {
    logger.error('Error fetching controls grouped by category', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getControlsGroupedByFramework = async (req, res, next) => {
  try {
    logger.info('Fetching controls grouped by framework', { 
      requestId: req.id 
    });

    const groupedControls = await Control.getGroupedByFramework();

    res.status(200).json({
      success: true,
      groupedControls
    });
  } catch (error) {
    logger.error('Error fetching controls grouped by framework', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  createControl,
  getControl,
  getAllControls,
  updateControl,
  deleteControl,
  getControlsByFramework,
  getControlsByCategory,
  searchControls,
  getControlsGroupedByCategory,
  getControlsGroupedByFramework
};
