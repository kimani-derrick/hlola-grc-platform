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
} = require('../../controllers/frameworkController');
const { authenticatePlatformAdmin, requirePlatformAdmin } = require('../../middleware/platformAuth');
const { validateRequest, createFrameworkSchema, updateFrameworkSchema } = require('../../middleware/validation');

const router = express.Router();

// All routes require platform admin authentication
router.use(authenticatePlatformAdmin);
router.use(requirePlatformAdmin);

// Framework Management
router.post('/', validateRequest(createFrameworkSchema), createFramework);
router.get('/', getAllFrameworks);
router.get('/grouped/category', getFrameworksGroupedByCategory);
router.get('/grouped/region', getFrameworksGroupedByRegion);
router.get('/search', searchFrameworks);
router.get('/category/:category', getFrameworksByCategory);
router.get('/region/:region', getFrameworksByRegion);
router.get('/:id', getFramework);
router.put('/:id', validateRequest(updateFrameworkSchema), updateFramework);
router.delete('/:id', deleteFramework);

module.exports = router;
