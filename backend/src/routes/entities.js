const express = require('express');
const { 
  createEntity, 
  getEntity, 
  getEntitiesByOrganization, 
  updateEntity, 
  deleteEntity,
  assignUserToEntity,
  getEntityUsers
} = require('../controllers/entityController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, createEntitySchema, updateEntitySchema, assignUserSchema } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Entity CRUD routes
router.post('/', validateRequest(createEntitySchema), createEntity);
router.get('/', getEntitiesByOrganization);
router.get('/:id', getEntity);
router.put('/:id', validateRequest(updateEntitySchema), updateEntity);
router.delete('/:id', deleteEntity);

// User assignment routes
router.post('/:id/assign-user', validateRequest(assignUserSchema), assignUserToEntity);
router.get('/:id/users', getEntityUsers);

module.exports = router;
