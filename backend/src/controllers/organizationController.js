const Organization = require('../models/Organization');
const logger = require('../config/logger');

const createOrganization = async (req, res, next) => {
  try {
    const { name, industry, country } = req.body;

    logger.info('Creating organization', {
      requestId: req.id,
      name: name,
      industry: industry,
      country: country
    });

    const organization = await Organization.create({ name, industry, country });

    logger.info('Organization created successfully', {
      requestId: req.id,
      organizationId: organization.id,
      name: organization.name
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    logger.error('Error creating organization', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('Fetching organization', {
      requestId: req.id,
      organizationId: id
    });

    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'The requested organization does not exist'
      });
    }

    res.status(200).json({
      success: true,
      organization
    });
  } catch (error) {
    logger.error('Error fetching organization', {
      requestId: req.id,
      organizationId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const getAllOrganizations = async (req, res, next) => {
  try {
    logger.info('Fetching all organizations', {
      requestId: req.id
    });

    const organizations = await Organization.findAll();

    res.status(200).json({
      success: true,
      organizations,
      count: organizations.length
    });
  } catch (error) {
    logger.error('Error fetching organizations', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const updateOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, industry, country } = req.body;

    logger.info('Updating organization', {
      requestId: req.id,
      organizationId: id,
      updates: { name, industry, country }
    });

    const organization = await Organization.update(id, { name, industry, country });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'The requested organization does not exist'
      });
    }

    logger.info('Organization updated successfully', {
      requestId: req.id,
      organizationId: organization.id
    });

    res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    logger.error('Error updating organization', {
      requestId: req.id,
      organizationId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

const deleteOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('Deleting organization', {
      requestId: req.id,
      organizationId: id
    });

    const organization = await Organization.delete(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'The requested organization does not exist'
      });
    }

    logger.info('Organization deleted successfully', {
      requestId: req.id,
      organizationId: id
    });

    res.status(200).json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting organization', {
      requestId: req.id,
      organizationId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  createOrganization,
  getOrganization,
  getAllOrganizations,
  updateOrganization,
  deleteOrganization
};
