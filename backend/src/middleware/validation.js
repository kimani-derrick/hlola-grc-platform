const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
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
};

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});

// Register validation schema
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  role: Joi.string().valid('admin', 'compliance_manager', 'team_member', 'auditor', 'entity_manager').required().messages({
    'any.only': 'Role must be one of: admin, compliance_manager, team_member, auditor, entity_manager',
    'any.required': 'Role is required'
  }),
  organizationId: Joi.string().uuid().required().messages({
    'string.guid': 'Organization ID must be a valid UUID',
    'any.required': 'Organization ID is required'
  }),
  entityId: Joi.string().uuid().optional().messages({
    'string.guid': 'Entity ID must be a valid UUID'
  }),
  department: Joi.string().max(100).optional(),
  jobTitle: Joi.string().max(100).optional()
});

// Entity validation schemas
const createEntitySchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Entity name must be at least 2 characters long',
    'string.max': 'Entity name must not exceed 255 characters',
    'any.required': 'Entity name is required'
  }),
  description: Joi.string().max(1000).optional().allow(''),
  entityType: Joi.string().valid('subsidiary', 'division', 'department', 'project').required().messages({
    'any.only': 'Entity type must be one of: subsidiary, division, department, project',
    'any.required': 'Entity type is required'
  }),
  country: Joi.string().max(100).optional().allow(''),
  region: Joi.string().max(100).optional().allow(''),
  industry: Joi.string().max(100).optional().allow(''),
  size: Joi.string().max(50).optional().allow(''),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'critical').optional().default('medium').messages({
    'any.only': 'Risk level must be one of: low, medium, high, critical'
  }),
  complianceOfficer: Joi.string().max(255).optional().allow('')
});

const updateEntitySchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  entityType: Joi.string().valid('subsidiary', 'division', 'department', 'project').optional().messages({
    'any.only': 'Entity type must be one of: subsidiary, division, department, project'
  }),
  country: Joi.string().max(100).optional().allow(''),
  region: Joi.string().max(100).optional().allow(''),
  industry: Joi.string().max(100).optional().allow(''),
  size: Joi.string().max(50).optional().allow(''),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
    'any.only': 'Risk level must be one of: low, medium, high, critical'
  }),
  complianceOfficer: Joi.string().max(255).optional().allow('')
});

const assignUserSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.guid': 'User ID must be a valid UUID',
    'any.required': 'User ID is required'
  })
});

// Framework validation schemas
const createFrameworkSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Framework name must be at least 2 characters long',
    'string.max': 'Framework name must not exceed 255 characters',
    'any.required': 'Framework name is required'
  }),
  description: Joi.string().max(1000).optional().allow(''),
  region: Joi.string().valid('Africa', 'Europe', 'Asia', 'Americas', 'International', 'Global').required().messages({
    'any.only': 'Region must be one of: Africa, Europe, Asia, Americas, International, Global',
    'any.required': 'Region is required'
  }),
  country: Joi.string().max(100).optional().allow(''),
  category: Joi.string().valid('Privacy', 'Security', 'Compliance', 'Risk', 'Financial', 'Healthcare').required().messages({
    'any.only': 'Category must be one of: Privacy, Security, Compliance, Risk, Financial, Healthcare',
    'any.required': 'Category is required'
  }),
  type: Joi.string().valid('Legal', 'Standards', 'Industry', 'International').required().messages({
    'any.only': 'Type must be one of: Legal, Standards, Industry, International',
    'any.required': 'Type is required'
  }),
  icon: Joi.string().max(50).optional().allow(''),
  color: Joi.string().max(20).optional().allow(''),
  complianceDeadline: Joi.date().optional().allow(null),
  priority: Joi.string().valid('high', 'medium', 'low').required().messages({
    'any.only': 'Priority must be one of: high, medium, low',
    'any.required': 'Priority is required'
  }),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'critical').required().messages({
    'any.only': 'Risk level must be one of: low, medium, high, critical',
    'any.required': 'Risk level is required'
  }),
  status: Joi.string().valid('active', 'draft', 'inactive', 'pending').optional().default('active').messages({
    'any.only': 'Status must be one of: active, draft, inactive, pending'
  }),
  requirementsCount: Joi.number().integer().min(0).optional().default(0),
  applicableCountries: Joi.array().items(Joi.string()).optional().default([]),
  industryScope: Joi.string().max(100).optional().allow('')
});

const updateFrameworkSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  region: Joi.string().valid('Africa', 'Europe', 'Asia', 'Americas', 'International', 'Global').optional().messages({
    'any.only': 'Region must be one of: Africa, Europe, Asia, Americas, International, Global'
  }),
  country: Joi.string().max(100).optional().allow(''),
  category: Joi.string().valid('Privacy', 'Security', 'Compliance', 'Risk', 'Financial', 'Healthcare').optional().messages({
    'any.only': 'Category must be one of: Privacy, Security, Compliance, Risk, Financial, Healthcare'
  }),
  type: Joi.string().valid('Legal', 'Standards', 'Industry', 'International').optional().messages({
    'any.only': 'Type must be one of: Legal, Standards, Industry, International'
  }),
  icon: Joi.string().max(50).optional().allow(''),
  color: Joi.string().max(20).optional().allow(''),
  complianceDeadline: Joi.date().optional().allow(null),
  priority: Joi.string().valid('high', 'medium', 'low').optional().messages({
    'any.only': 'Priority must be one of: high, medium, low'
  }),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
    'any.only': 'Risk level must be one of: low, medium, high, critical'
  }),
  status: Joi.string().valid('active', 'draft', 'inactive', 'pending').optional().messages({
    'any.only': 'Status must be one of: active, draft, inactive, pending'
  }),
  requirementsCount: Joi.number().integer().min(0).optional(),
  applicableCountries: Joi.array().items(Joi.string()).optional(),
  industryScope: Joi.string().max(100).optional().allow('')
});

const assignFrameworkSchema = Joi.object({
  complianceScore: Joi.number().integer().min(0).max(100).optional().default(0),
  auditReadinessScore: Joi.number().integer().min(0).max(100).optional().default(0),
  lastAuditDate: Joi.date().optional().allow(null),
  nextAuditDate: Joi.date().optional().allow(null),
  certificationStatus: Joi.string().valid('certified', 'pending', 'expired', 'not-applicable').optional().default('not-applicable').messages({
    'any.only': 'Certification status must be one of: certified, pending, expired, not-applicable'
  }),
  certificationExpiry: Joi.date().optional().allow(null),
  complianceDeadline: Joi.date().optional().allow(null)
});

const updateComplianceSchema = Joi.object({
  complianceScore: Joi.number().integer().min(0).max(100).optional(),
  auditReadinessScore: Joi.number().integer().min(0).max(100).optional(),
  lastAuditDate: Joi.date().optional().allow(null),
  nextAuditDate: Joi.date().optional().allow(null),
  certificationStatus: Joi.string().valid('certified', 'pending', 'expired', 'not-applicable').optional().messages({
    'any.only': 'Certification status must be one of: certified, pending, expired, not-applicable'
  }),
  certificationExpiry: Joi.date().optional().allow(null),
  complianceDeadline: Joi.date().optional().allow(null)
});

// Control validation schemas
const createControlSchema = Joi.object({
  frameworkId: Joi.string().uuid().required().messages({
    'string.guid': 'Framework ID must be a valid UUID',
    'any.required': 'Framework ID is required'
  }),
  controlId: Joi.string().max(100).required().messages({
    'string.max': 'Control ID must not exceed 100 characters',
    'any.required': 'Control ID is required'
  }),
  title: Joi.string().min(2).max(500).required().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().optional().allow(''),
  category: Joi.string().max(100).optional().allow(''),
  subcategory: Joi.string().max(100).optional().allow(''),
  priority: Joi.string().valid('high', 'medium', 'low').required().messages({
    'any.only': 'Priority must be one of: high, medium, low',
    'any.required': 'Priority is required'
  }),
  implementationLevel: Joi.string().valid('basic', 'intermediate', 'advanced').optional().messages({
    'any.only': 'Implementation level must be one of: basic, intermediate, advanced'
  }),
  businessImpact: Joi.string().optional().allow(''),
  technicalRequirements: Joi.string().optional().allow(''),
  legalRequirements: Joi.string().optional().allow(''),
  implementationGuidance: Joi.string().optional().allow(''),
  testingProcedures: Joi.string().optional().allow(''),
  evidenceRequirements: Joi.array().items(Joi.string()).optional().default([])
});

const updateControlSchema = Joi.object({
  controlId: Joi.string().max(100).optional().messages({
    'string.max': 'Control ID must not exceed 100 characters'
  }),
  title: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters'
  }),
  description: Joi.string().optional().allow(''),
  category: Joi.string().max(100).optional().allow(''),
  subcategory: Joi.string().max(100).optional().allow(''),
  priority: Joi.string().valid('high', 'medium', 'low').optional().messages({
    'any.only': 'Priority must be one of: high, medium, low'
  }),
  implementationLevel: Joi.string().valid('basic', 'intermediate', 'advanced').optional().messages({
    'any.only': 'Implementation level must be one of: basic, intermediate, advanced'
  }),
  businessImpact: Joi.string().optional().allow(''),
  technicalRequirements: Joi.string().optional().allow(''),
  legalRequirements: Joi.string().optional().allow(''),
  implementationGuidance: Joi.string().optional().allow(''),
  testingProcedures: Joi.string().optional().allow(''),
  evidenceRequirements: Joi.array().items(Joi.string()).optional()
});

const assignControlSchema = Joi.object({
  assignedTo: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assigned user ID must be a valid UUID'
  }),
  assignedTeam: Joi.string().max(100).optional().allow(''),
  priority: Joi.string().valid('high', 'medium', 'low').optional().default('medium').messages({
    'any.only': 'Priority must be one of: high, medium, low'
  }),
  dueDate: Joi.date().optional().allow(null)
});

const updateControlStatusSchema = Joi.object({
  status: Joi.string().valid('not-started', 'in-progress', 'completed', 'needs-review').optional().messages({
    'any.only': 'Status must be one of: not-started, in-progress, completed, needs-review'
  }),
  completionRate: Joi.number().integer().min(0).max(100).optional().messages({
    'number.min': 'Completion rate must be between 0 and 100',
    'number.max': 'Completion rate must be between 0 and 100'
  }),
  reviewNotes: Joi.string().optional().allow('')
});

module.exports = {
  validateRequest,
  loginSchema,
  registerSchema,
  createEntitySchema,
  updateEntitySchema,
  assignUserSchema,
  createFrameworkSchema,
  updateFrameworkSchema,
  assignFrameworkSchema,
  updateComplianceSchema,
  createControlSchema,
  updateControlSchema,
  assignControlSchema,
  updateControlStatusSchema
};