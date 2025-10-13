const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    // Preprocess tags field if it's a string
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
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

const validateQuery = (schemaName) => {
  return (req, res, next) => {
    // Get the schema from the schemas object
    const schemas = {
      reportOverviewSchema,
      reportFrameworksSchema,
      reportControlsSchema,
      reportTasksSchema,
      reportTrendsSchema
    };
    
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        error: 'Internal error',
        message: `Schema ${schemaName} not found`
      });
    }
    
    // Preprocess dateRange if it's a string
    if (req.query.dateRange && typeof req.query.dateRange === 'string') {
      try {
        req.query.dateRange = JSON.parse(req.query.dateRange);
      } catch (e) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Invalid dateRange format. Must be valid JSON.'
        });
      }
    }
    
    const { error } = schema.validate(req.query);
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

// Task validation schemas
const createTaskSchema = Joi.object({
  controlId: Joi.string().uuid().required().messages({
    'string.guid': 'Control ID must be a valid UUID',
    'any.required': 'Control ID is required'
  }),
  title: Joi.string().min(2).max(500).required().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().optional().allow(''),
  priority: Joi.string().valid('high', 'medium', 'low').optional().default('medium').messages({
    'any.only': 'Priority must be one of: high, medium, low'
  }),
  category: Joi.string().max(100).optional().allow(''),
  assigneeId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assignee ID must be a valid UUID'
  }),
  dueDate: Joi.date().optional().allow(null),
  estimatedHours: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Estimated hours must be 0 or greater'
  })
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters'
  }),
  description: Joi.string().optional().allow(''),
  priority: Joi.string().valid('high', 'medium', 'low').optional().messages({
    'any.only': 'Priority must be one of: high, medium, low'
  }),
  category: Joi.string().max(100).optional().allow(''),
  assigneeId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assignee ID must be a valid UUID'
  }),
  dueDate: Joi.date().optional().allow(null),
  estimatedHours: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Estimated hours must be 0 or greater'
  }),
  actualHours: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Actual hours must be 0 or greater'
  }),
  progress: Joi.number().integer().min(0).max(100).optional().messages({
    'number.min': 'Progress must be between 0 and 100',
    'number.max': 'Progress must be between 0 and 100'
  }),
  evidenceAttached: Joi.boolean().optional(),
  blockers: Joi.array().items(Joi.string()).optional()
});

const updateTaskStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'blocked', 'cancelled').required().messages({
    'any.only': 'Status must be one of: pending, in-progress, completed, blocked, cancelled',
    'any.required': 'Status is required'
  }),
  progress: Joi.number().integer().min(0).max(100).optional().messages({
    'number.min': 'Progress must be between 0 and 100',
    'number.max': 'Progress must be between 0 and 100'
  }),
  actualHours: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Actual hours must be 0 or greater'
  })
});

// Document validation schemas
const uploadDocumentSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  title: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 255 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Description must not exceed 1000 characters'
  }),
  documentType: Joi.string().valid('policy', 'procedure', 'evidence', 'certificate', 'report', 'contract', 'other').required().messages({
    'any.only': 'Document type must be one of: policy, procedure, evidence, certificate, report, contract, other',
    'any.required': 'Document type is required'
  }),
  frameworkId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  controlId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Control ID must be a valid UUID'
  }),
  taskId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Task ID must be a valid UUID'
  }),
  tags: Joi.array().items(Joi.string().max(50)).optional().default([]).messages({
    'array.base': 'Tags must be an array',
    'string.max': 'Each tag must not exceed 50 characters'
  }),
  accessLevel: Joi.string().valid('public', 'internal', 'confidential', 'restricted').optional().default('internal').messages({
    'any.only': 'Access level must be one of: public, internal, confidential, restricted'
  }),
  expiryDate: Joi.date().optional().allow(null).messages({
    'date.base': 'Expiry date must be a valid date'
  })
});

const updateDocumentSchema = Joi.object({
  name: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 500 characters'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Description must not exceed 1000 characters'
  }),
  status: Joi.string().valid('draft', 'review', 'approved', 'rejected', 'archived').optional().messages({
    'any.only': 'Status must be one of: draft, review, approved, rejected, archived'
  }),
  isEvidence: Joi.boolean().optional()
});

const createDocumentVersionSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  title: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 255 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Description must not exceed 1000 characters'
  }),
  documentType: Joi.string().valid('policy', 'procedure', 'evidence', 'certificate', 'report', 'contract', 'other').required().messages({
    'any.only': 'Document type must be one of: policy, procedure, evidence, certificate, report, contract, other',
    'any.required': 'Document type is required'
  }),
  frameworkId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  controlId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Control ID must be a valid UUID'
  }),
  taskId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Task ID must be a valid UUID'
  }),
  tags: Joi.array().items(Joi.string().max(50)).optional().default([]).messages({
    'array.base': 'Tags must be an array',
    'string.max': 'Each tag must not exceed 50 characters'
  }),
  accessLevel: Joi.string().valid('public', 'internal', 'confidential', 'restricted').optional().default('internal').messages({
    'any.only': 'Access level must be one of: public, internal, confidential, restricted'
  }),
  expiryDate: Joi.date().optional().allow(null).messages({
    'date.base': 'Expiry date must be a valid date'
  })
});

const searchDocumentsSchema = Joi.object({
  search: Joi.string().min(1).max(100).required().messages({
    'string.min': 'Search term must be at least 1 character long',
    'string.max': 'Search term must not exceed 100 characters',
    'any.required': 'Search term is required'
  }),
  entityId: Joi.string().uuid().optional().messages({
    'string.guid': 'Entity ID must be a valid UUID'
  }),
  documentType: Joi.string().valid('policy', 'procedure', 'evidence', 'certificate', 'report', 'contract', 'other').optional().messages({
    'any.only': 'Document type must be one of: policy, procedure, evidence, certificate, report, contract, other'
  }),
  accessLevel: Joi.string().valid('public', 'internal', 'confidential', 'restricted').optional().messages({
    'any.only': 'Access level must be one of: public, internal, confidential, restricted'
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(20).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100'
  }),
  offset: Joi.number().integer().min(0).optional().default(0).messages({
    'number.min': 'Offset must be 0 or greater'
  })
});

// Audit Management Validation Schemas
const createAuditSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  frameworkId: Joi.string().uuid().required().messages({
    'string.guid': 'Framework ID must be a valid UUID',
    'any.required': 'Framework ID is required'
  }),
  auditPackageId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Audit Package ID must be a valid UUID'
  }),
  title: Joi.string().min(2).max(500).required().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  auditType: Joi.string().valid('regulatory', 'certification', 'internal').required().messages({
    'any.only': 'Audit type must be one of: regulatory, certification, internal',
    'any.required': 'Audit type is required'
  }),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low').required().messages({
    'any.only': 'Priority must be one of: critical, high, medium, low',
    'any.required': 'Priority is required'
  }),
  auditor: Joi.string().max(255).optional().allow('').messages({
    'string.max': 'Auditor must not exceed 255 characters'
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'End date must be a valid date',
    'date.min': 'End date must be after start date',
    'any.required': 'End date is required'
  }),
  progress: Joi.number().integer().min(0).max(100).optional().default(0).messages({
    'number.min': 'Progress must be at least 0',
    'number.max': 'Progress must not exceed 100'
  }),
  nextMilestone: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Next milestone must not exceed 500 characters'
  }),
  estimatedCompletion: Joi.date().optional().messages({
    'date.base': 'Estimated completion must be a valid date'
  })
});

const updateAuditSchema = Joi.object({
  title: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  auditType: Joi.string().valid('regulatory', 'certification', 'internal').optional().messages({
    'any.only': 'Audit type must be one of: regulatory, certification, internal'
  }),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low').optional().messages({
    'any.only': 'Priority must be one of: critical, high, medium, low'
  }),
  auditor: Joi.string().max(255).optional().allow('').messages({
    'string.max': 'Auditor must not exceed 255 characters'
  }),
  startDate: Joi.date().optional().messages({
    'date.base': 'Start date must be a valid date'
  }),
  endDate: Joi.date().optional().messages({
    'date.base': 'End date must be a valid date'
  }),
  nextMilestone: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Next milestone must not exceed 500 characters'
  }),
  estimatedCompletion: Joi.date().optional().messages({
    'date.base': 'Estimated completion must be a valid date'
  })
});

const updateAuditProgressSchema = Joi.object({
  progress: Joi.number().integer().min(0).max(100).required().messages({
    'number.min': 'Progress must be at least 0',
    'number.max': 'Progress must not exceed 100',
    'any.required': 'Progress is required'
  }),
  nextMilestone: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Next milestone must not exceed 500 characters'
  })
});

const updateAuditStatusSchema = Joi.object({
  status: Joi.string().valid('planning', 'in-progress', 'completed', 'overdue', 'cancelled').required().messages({
    'any.only': 'Status must be one of: planning, in-progress, completed, overdue, cancelled',
    'any.required': 'Status is required'
  })
});

const createFindingSchema = Joi.object({
  controlId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Control ID must be a valid UUID'
  }),
  findingType: Joi.string().valid('observation', 'non-conformity', 'opportunity').required().messages({
    'any.only': 'Finding type must be one of: observation, non-conformity, opportunity',
    'any.required': 'Finding type is required'
  }),
  severity: Joi.string().valid('critical', 'high', 'medium', 'low', 'info').required().messages({
    'any.only': 'Severity must be one of: critical, high, medium, low, info',
    'any.required': 'Severity is required'
  }),
  title: Joi.string().min(2).max(500).required().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  evidence: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Evidence must not exceed 2000 characters'
  }),
  recommendation: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Recommendation must not exceed 2000 characters'
  }),
  assignedTo: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assigned to must be a valid UUID'
  }),
  dueDate: Joi.date().optional().messages({
    'date.base': 'Due date must be a valid date'
  })
});

const updateFindingSchema = Joi.object({
  controlId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Control ID must be a valid UUID'
  }),
  findingType: Joi.string().valid('observation', 'non-conformity', 'opportunity').optional().messages({
    'any.only': 'Finding type must be one of: observation, non-conformity, opportunity'
  }),
  severity: Joi.string().valid('critical', 'high', 'medium', 'low', 'info').optional().messages({
    'any.only': 'Severity must be one of: critical, high, medium, low, info'
  }),
  title: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  evidence: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Evidence must not exceed 2000 characters'
  }),
  recommendation: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Recommendation must not exceed 2000 characters'
  }),
  assignedTo: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assigned to must be a valid UUID'
  }),
  dueDate: Joi.date().optional().messages({
    'date.base': 'Due date must be a valid date'
  })
});

const createGapSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  frameworkId: Joi.string().uuid().required().messages({
    'string.guid': 'Framework ID must be a valid UUID',
    'any.required': 'Framework ID is required'
  }),
  controlId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Control ID must be a valid UUID'
  }),
  title: Joi.string().min(2).max(500).required().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  category: Joi.string().valid('documentation', 'technical', 'procedural', 'evidence').required().messages({
    'any.only': 'Category must be one of: documentation, technical, procedural, evidence',
    'any.required': 'Category is required'
  }),
  severity: Joi.string().valid('critical', 'high', 'medium', 'low').required().messages({
    'any.only': 'Severity must be one of: critical, high, medium, low',
    'any.required': 'Severity is required'
  }),
  impactDescription: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Impact description must not exceed 2000 characters'
  }),
  remediationPlan: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Remediation plan must not exceed 2000 characters'
  }),
  estimatedEffort: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'Estimated effort must not exceed 100 characters'
  }),
  assignedTo: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assigned to must be a valid UUID'
  }),
  assignedTeam: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'Assigned team must not exceed 100 characters'
  }),
  dueDate: Joi.date().optional().messages({
    'date.base': 'Due date must be a valid date'
  })
});

const updateGapSchema = Joi.object({
  title: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  category: Joi.string().valid('documentation', 'technical', 'procedural', 'evidence').optional().messages({
    'any.only': 'Category must be one of: documentation, technical, procedural, evidence'
  }),
  severity: Joi.string().valid('critical', 'high', 'medium', 'low').optional().messages({
    'any.only': 'Severity must be one of: critical, high, medium, low'
  }),
  impactDescription: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Impact description must not exceed 2000 characters'
  }),
  remediationPlan: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Remediation plan must not exceed 2000 characters'
  }),
  estimatedEffort: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'Estimated effort must not exceed 100 characters'
  }),
  assignedTo: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assigned to must be a valid UUID'
  }),
  assignedTeam: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'Assigned team must not exceed 100 characters'
  }),
  dueDate: Joi.date().optional().messages({
    'date.base': 'Due date must be a valid date'
  })
});

const updateGapStatusSchema = Joi.object({
  status: Joi.string().valid('open', 'in-progress', 'resolved', 'closed').required().messages({
    'any.only': 'Status must be one of: open, in-progress, resolved, closed',
    'any.required': 'Status is required'
  })
});

const recordEventSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  frameworkId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  complianceScore: Joi.number().integer().min(0).max(100).required().messages({
    'number.min': 'Compliance score must be at least 0',
    'number.max': 'Compliance score must not exceed 100',
    'any.required': 'Compliance score is required'
  }),
  milestone: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Milestone must be at least 2 characters long',
    'string.max': 'Milestone must not exceed 255 characters',
    'any.required': 'Milestone is required'
  }),
  eventType: Joi.string().valid('achievement', 'audit', 'update', 'gap-closed').required().messages({
    'any.only': 'Event type must be one of: achievement, audit, update, gap-closed',
    'any.required': 'Event type is required'
  }),
  eventDate: Joi.date().required().messages({
    'date.base': 'Event date must be a valid date',
    'any.required': 'Event date is required'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  })
});

const createEventSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  frameworkId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  eventType: Joi.string().valid('audit', 'certification', 'milestone', 'gap-identified', 'gap-resolved').required().messages({
    'any.only': 'Event type must be one of: audit, certification, milestone, gap-identified, gap-resolved',
    'any.required': 'Event type is required'
  }),
  eventDate: Joi.date().required().messages({
    'date.base': 'Event date must be a valid date',
    'any.required': 'Event date is required'
  }),
  eventTitle: Joi.string().min(2).max(500).required().messages({
    'string.min': 'Event title must be at least 2 characters long',
    'string.max': 'Event title must not exceed 500 characters',
    'any.required': 'Event title is required'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  status: Joi.string().valid('completed', 'in-progress', 'scheduled').optional().default('completed').messages({
    'any.only': 'Status must be one of: completed, in-progress, scheduled'
  }),
  relatedDocuments: Joi.array().items(Joi.string().uuid()).optional().default([]).messages({
    'array.base': 'Related documents must be an array of UUIDs'
  })
});

const updateEventSchema = Joi.object({
  eventType: Joi.string().valid('audit', 'certification', 'milestone', 'gap-identified', 'gap-resolved').optional().messages({
    'any.only': 'Event type must be one of: audit, certification, milestone, gap-identified, gap-resolved'
  }),
  eventDate: Joi.date().optional().messages({
    'date.base': 'Event date must be a valid date'
  }),
  eventTitle: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Event title must be at least 2 characters long',
    'string.max': 'Event title must not exceed 500 characters'
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters'
  }),
  status: Joi.string().valid('completed', 'in-progress', 'scheduled').optional().messages({
    'any.only': 'Status must be one of: completed, in-progress, scheduled'
  }),
  relatedDocuments: Joi.array().items(Joi.string().uuid()).optional().messages({
    'array.base': 'Related documents must be an array of UUIDs'
  })
});

// Smart Compliance Engine Schemas
const createSmartAuditSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  frameworkId: Joi.string().uuid().required().messages({
    'string.guid': 'Framework ID must be a valid UUID',
    'any.required': 'Framework ID is required'
  }),
  title: Joi.string().min(2).max(500).optional().messages({
    'string.min': 'Title must be at least 2 characters long',
    'string.max': 'Title must not exceed 500 characters'
  }),
  auditType: Joi.string().valid('regulatory', 'certification', 'internal').required().messages({
    'any.only': 'Audit type must be one of: regulatory, certification, internal',
    'any.required': 'Audit type is required'
  }),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low').required().messages({
    'any.only': 'Priority must be one of: critical, high, medium, low',
    'any.required': 'Priority is required'
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'End date must be a valid date',
    'date.min': 'End date must be after start date',
    'any.required': 'End date is required'
  })
});

const triggerComplianceCheckSchema = Joi.object({
  entityId: Joi.string().uuid().required().messages({
    'string.guid': 'Entity ID must be a valid UUID',
    'any.required': 'Entity ID is required'
  }),
  frameworkId: Joi.string().uuid().required().messages({
    'string.guid': 'Framework ID must be a valid UUID',
    'any.required': 'Framework ID is required'
  })
});

const complianceDashboardSchema = Joi.object({
  entityId: Joi.string().uuid().optional().messages({
    'string.guid': 'Entity ID must be a valid UUID'
  }),
  frameworkId: Joi.string().uuid().optional().messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  includeHistory: Joi.boolean().optional().messages({
    'boolean.base': 'Include history must be a boolean value'
  }),
  dateRange: Joi.object({
    startDate: Joi.date().optional().messages({
      'date.base': 'Start date must be a valid date'
    }),
    endDate: Joi.date().min(Joi.ref('startDate')).optional().messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date'
    })
  }).optional()
});

// Report validation schemas
const reportOverviewSchema = Joi.object({
  entityId: Joi.string().uuid().optional().messages({
    'string.guid': 'Entity ID must be a valid UUID'
  }),
  frameworkId: Joi.string().uuid().optional().messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  dateRange: Joi.object({
    start: Joi.date().optional().messages({
      'date.base': 'Start date must be a valid date'
    }),
    end: Joi.date().min(Joi.ref('start')).optional().messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date'
    })
  }).optional()
});

const reportFrameworksSchema = Joi.object({
  frameworkId: Joi.string().uuid().optional().messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  region: Joi.string().optional().messages({
    'string.base': 'Region must be a string'
  }),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high, critical'
  }),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
    'any.only': 'Risk level must be one of: low, medium, high, critical'
  }),
  dateRange: Joi.object({
    start: Joi.date().optional().messages({
      'date.base': 'Start date must be a valid date'
    }),
    end: Joi.date().min(Joi.ref('start')).optional().messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date'
    })
  }).optional()
});

const reportControlsSchema = Joi.object({
  frameworkId: Joi.string().uuid().optional().messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  status: Joi.string().valid('not-started', 'in-progress', 'completed', 'blocked').optional().messages({
    'any.only': 'Status must be one of: not-started, in-progress, completed, blocked'
  }),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high, critical'
  }),
  category: Joi.string().optional().messages({
    'string.base': 'Category must be a string'
  }),
  assignee: Joi.string().uuid().optional().messages({
    'string.guid': 'Assignee ID must be a valid UUID'
  })
});

const reportTasksSchema = Joi.object({
  frameworkId: Joi.string().uuid().optional().messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  controlId: Joi.string().uuid().optional().messages({
    'string.guid': 'Control ID must be a valid UUID'
  }),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'blocked', 'cancelled', 'overdue').optional().messages({
    'any.only': 'Status must be one of: pending, in-progress, completed, blocked, cancelled, overdue'
  }),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high, critical'
  }),
  assignee: Joi.string().uuid().optional().messages({
    'string.guid': 'Assignee ID must be a valid UUID'
  }),
  dateRange: Joi.object({
    start: Joi.date().optional().messages({
      'date.base': 'Start date must be a valid date'
    }),
    end: Joi.date().min(Joi.ref('start')).optional().messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date'
    })
  }).optional()
});

const reportTrendsSchema = Joi.object({
  entityId: Joi.string().uuid().optional().messages({
    'string.guid': 'Entity ID must be a valid UUID'
  }),
  frameworkId: Joi.string().uuid().optional().messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  granularity: Joi.string().valid('hourly', 'daily', 'weekly', 'monthly').optional().messages({
    'any.only': 'Granularity must be one of: hourly, daily, weekly, monthly'
  }),
  dateRange: Joi.object({
    start: Joi.date().optional().messages({
      'date.base': 'Start date must be a valid date'
    }),
    end: Joi.date().min(Joi.ref('start')).optional().messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date'
    })
  }).optional()
});

// Comment validation schemas
const createCommentSchema = Joi.object({
  entityId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Entity ID must be a valid UUID'
  }),
  taskId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Task ID must be a valid UUID'
  }),
  controlId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Control ID must be a valid UUID'
  }),
  frameworkId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Framework ID must be a valid UUID'
  }),
  parentCommentId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Parent comment ID must be a valid UUID'
  }),
  content: Joi.string().min(1).max(2000).required().messages({
    'string.min': 'Comment content must be at least 1 character long',
    'string.max': 'Comment content must not exceed 2000 characters',
    'any.required': 'Comment content is required'
  }),
  commentType: Joi.string().valid('general', 'update', 'question', 'resolution', 'note').optional().default('general').messages({
    'any.only': 'Comment type must be one of: general, update, question, resolution, note'
  }),
  isInternal: Joi.boolean().optional().default(false),
  isResolved: Joi.boolean().optional().default(false)
}).custom((value, helpers) => {
  // At least one entity reference must be provided
  if (!value.entityId && !value.taskId && !value.controlId && !value.frameworkId) {
    return helpers.error('any.custom', {
      message: 'At least one entity reference (entityId, taskId, controlId, or frameworkId) must be provided'
    });
  }
  return value;
});

const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).optional().messages({
    'string.min': 'Comment content must be at least 1 character long',
    'string.max': 'Comment content must not exceed 2000 characters'
  }),
  commentType: Joi.string().valid('general', 'update', 'question', 'resolution', 'note').optional().messages({
    'any.only': 'Comment type must be one of: general, update, question, resolution, note'
  }),
  isInternal: Joi.boolean().optional(),
  isResolved: Joi.boolean().optional()
});

module.exports = {
  validateRequest,
  validateQuery,
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
  updateControlStatusSchema,
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  uploadDocumentSchema,
  updateDocumentSchema,
  createDocumentVersionSchema,
  searchDocumentsSchema,
  // Audit Management Schemas
  createAuditSchema,
  updateAuditSchema,
  updateAuditProgressSchema,
  updateAuditStatusSchema,
  createFindingSchema,
  updateFindingSchema,
  createGapSchema,
  updateGapSchema,
  updateGapStatusSchema,
  recordEventSchema,
  createEventSchema,
  updateEventSchema,
  // Smart Compliance Engine Schemas
  createSmartAuditSchema,
  triggerComplianceCheckSchema,
  complianceDashboardSchema,
  // Report Schemas
  reportOverviewSchema,
  reportFrameworksSchema,
  reportControlsSchema,
  reportTasksSchema,
  reportTrendsSchema,
  // Comment Schemas
  createCommentSchema,
  updateCommentSchema
};