const Framework = require('../models/Framework');
const logger = require('../config/logger');

const createFramework = async (req, res, next) => {
  try {
    const { name, description, region, country, category, type, icon, color, complianceDeadline, priority, riskLevel, status, requirementsCount, applicableCountries, industryScope, maxFineAmount, maxFineCurrency } = req.body;

    logger.info('Creating framework', {
      requestId: req.id,
      name: name,
      category: category,
      region: region
    });

    const framework = await Framework.create({
      name,
      description,
      region,
      country,
      category,
      type,
      icon,
      color,
      complianceDeadline,
      priority,
      riskLevel,
      status,
      requirementsCount,
      applicableCountries,
      industryScope,
      maxFineAmount,
      maxFineCurrency
    });

    logger.info('Framework created successfully', {
      requestId: req.id,
      frameworkId: framework.id,
      name: framework.name
    });

    res.status(201).json({
      success: true,
      message: 'Framework created successfully',
      framework
    });
  } catch (error) {
    logger.error('Error creating framework', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getFramework = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('Fetching framework', {
      requestId: req.id,
      frameworkId: id
    });

    const framework = await Framework.findById(id);

    if (!framework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The requested framework does not exist'
      });
    }

    res.status(200).json({
      success: true,
      framework
    });
  } catch (error) {
    logger.error('Error fetching framework', {
      requestId: req.id,
      frameworkId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getAllFrameworks = async (req, res, next) => {
  try {
    const { category, region, type, status, search, limit, offset } = req.query;

    logger.info('Fetching frameworks', {
      requestId: req.id,
      filters: { category, region, type, status, search, limit, offset }
    });

    const filters = {};
    if (category) filters.category = category;
    if (region) filters.region = region;
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const [frameworks, totalCount] = await Promise.all([
      Framework.findAll(filters),
      Framework.getCount(filters)
    ]);

    res.status(200).json({
      success: true,
      frameworks,
      pagination: {
        total: totalCount,
        limit: filters.limit || null,
        offset: filters.offset || 0,
        hasMore: filters.limit ? (filters.offset || 0) + frameworks.length < totalCount : false
      }
    });
  } catch (error) {
    logger.error('Error fetching frameworks', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateFramework = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    logger.info('Updating framework', {
      requestId: req.id,
      frameworkId: id,
      updates: updates
    });

    const updatedFramework = await Framework.update(id, updates);

    if (!updatedFramework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The requested framework does not exist'
      });
    }

    logger.info('Framework updated successfully', {
      requestId: req.id,
      frameworkId: updatedFramework.id
    });

    res.status(200).json({
      success: true,
      message: 'Framework updated successfully',
      framework: updatedFramework
    });
  } catch (error) {
    logger.error('Error updating framework', {
      requestId: req.id,
      frameworkId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const deleteFramework = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('Deleting framework', {
      requestId: req.id,
      frameworkId: id
    });

    const framework = await Framework.delete(id);

    if (!framework) {
      return res.status(404).json({
        success: false,
        error: 'Framework not found',
        message: 'The requested framework does not exist'
      });
    }

    logger.info('Framework deleted successfully', {
      requestId: req.id,
      frameworkId: id
    });

    res.status(200).json({
      success: true,
      message: 'Framework deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting framework', {
      requestId: req.id,
      frameworkId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getFrameworksByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    logger.info('Fetching frameworks by category', {
      requestId: req.id,
      category: category
    });

    const frameworks = await Framework.findByCategory(category);

    res.status(200).json({
      success: true,
      frameworks,
      count: frameworks.length
    });
  } catch (error) {
    logger.error('Error fetching frameworks by category', {
      requestId: req.id,
      category: req.params.category,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getFrameworksByRegion = async (req, res, next) => {
  try {
    const { region } = req.params;

    logger.info('Fetching frameworks by region', {
      requestId: req.id,
      region: region
    });

    const frameworks = await Framework.findByRegion(region);

    res.status(200).json({
      success: true,
      frameworks,
      count: frameworks.length
    });
  } catch (error) {
    logger.error('Error fetching frameworks by region', {
      requestId: req.id,
      region: req.params.region,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const searchFrameworks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query required',
        message: 'Please provide a search query parameter (q)'
      });
    }

    logger.info('Searching frameworks', {
      requestId: req.id,
      searchQuery: q
    });

    const frameworks = await Framework.search(q);

    res.status(200).json({
      success: true,
      frameworks,
      count: frameworks.length,
      query: q
    });
  } catch (error) {
    logger.error('Error searching frameworks', {
      requestId: req.id,
      searchQuery: req.query.q,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getFrameworksGroupedByCategory = async (req, res, next) => {
  try {
    logger.info('Fetching frameworks grouped by category', {
      requestId: req.id
    });

    const groupedFrameworks = await Framework.getByCategoryGrouped();

    res.status(200).json({
      success: true,
      groupedFrameworks
    });
  } catch (error) {
    logger.error('Error fetching frameworks grouped by category', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getFrameworksGroupedByRegion = async (req, res, next) => {
  try {
    logger.info('Fetching frameworks grouped by region', {
      requestId: req.id
    });

    const groupedFrameworks = await Framework.getByRegionGrouped();

    res.status(200).json({
      success: true,
      groupedFrameworks
    });
  } catch (error) {
    logger.error('Error fetching frameworks grouped by region', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  createFramework,
  getFramework,
  getAllFrameworks,
  updateFramework,
  deleteFramework,
  getFrameworksByCategory,
  getFrameworksByRegion,
  searchFrameworks,
  getFrameworksGroupedByCategory,
  getFrameworksGroupedByRegion
};
