const express = require('express');
const {
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
} = require('../controllers/frameworkController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, createFrameworkSchema, updateFrameworkSchema } = require('../middleware/validation');

const router = express.Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// Framework Management
router.post('/', requireRole(['admin']), validateRequest(createFrameworkSchema), createFramework);
router.get('/', getAllFrameworks);
router.get('/grouped/category', getFrameworksGroupedByCategory);
router.get('/grouped/region', getFrameworksGroupedByRegion);
router.get('/search', searchFrameworks);
router.get('/category/:category', getFrameworksByCategory);
router.get('/region/:region', getFrameworksByRegion);
router.get('/:id', getFramework);
router.put('/:id', requireRole(['admin']), validateRequest(updateFrameworkSchema), updateFramework);
router.delete('/:id', requireRole(['admin']), deleteFramework);

module.exports = router;
