const express = require('express');
const {
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
} = require('../../controllers/controlController');
const { authenticatePlatformAdmin, requirePlatformAdmin } = require('../../middleware/platformAuth');
const { validateRequest, createControlSchema, updateControlSchema } = require('../../middleware/validation');

const router = express.Router();

// All routes require platform admin authentication
router.use(authenticatePlatformAdmin);
router.use(requirePlatformAdmin);

// Control Management
router.post('/', validateRequest(createControlSchema), createControl);
router.get('/', getAllControls);
router.get('/grouped/category', getControlsGroupedByCategory);
router.get('/grouped/framework', getControlsGroupedByFramework);
router.get('/search', searchControls);
router.get('/category/:category', getControlsByCategory);
router.get('/:id', getControl);
router.put('/:id', validateRequest(updateControlSchema), updateControl);
router.delete('/:id', deleteControl);

// Framework-specific controls
router.get('/framework/:frameworkId', getControlsByFramework);

module.exports = router;
