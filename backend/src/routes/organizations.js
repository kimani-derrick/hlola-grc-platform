const express = require('express');
const { 
  createOrganization, 
  getOrganization, 
  getAllOrganizations, 
  updateOrganization, 
  deleteOrganization 
} = require('../controllers/organizationController');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const createOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Organization name must be at least 2 characters long',
    'string.max': 'Organization name must not exceed 255 characters',
    'any.required': 'Organization name is required'
  }),
  industry: Joi.string().max(100).optional().allow(''),
  country: Joi.string().max(100).optional().allow('')
});

const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  industry: Joi.string().max(100).optional().allow(''),
  country: Joi.string().max(100).optional().allow('')
});

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message,
      details: error.details
    });
  }
  next();
};

// Public routes (no authentication required for organization creation during onboarding)
router.post('/', validateRequest(createOrganizationSchema), createOrganization);

// Protected routes (authentication required)
router.get('/', authenticateToken, getAllOrganizations);
router.get('/:id', authenticateToken, getOrganization);
router.put('/:id', authenticateToken, validateRequest(updateOrganizationSchema), updateOrganization);
router.delete('/:id', authenticateToken, deleteOrganization);

module.exports = router;

