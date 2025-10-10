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
} = require('../controllers/controlController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, createControlSchema, updateControlSchema } = require('../middleware/validation');

const router = express.Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// Control Management
router.post('/', requireRole(['admin']), validateRequest(createControlSchema), createControl);
router.get('/', getAllControls);
router.get('/grouped/category', getControlsGroupedByCategory);
router.get('/grouped/framework', getControlsGroupedByFramework);
router.get('/search', searchControls);
router.get('/category/:category', getControlsByCategory);
router.get('/:id', getControl);
router.put('/:id', requireRole(['admin']), validateRequest(updateControlSchema), updateControl);
router.delete('/:id', requireRole(['admin']), deleteControl);

// Framework-specific controls
router.get('/framework/:frameworkId', getControlsByFramework);

module.exports = router;
