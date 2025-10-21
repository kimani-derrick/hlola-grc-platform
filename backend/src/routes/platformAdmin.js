const express = require('express');
const router = express.Router();
const { authenticatePlatformAdmin, requirePlatformAdmin } = require('../middleware/platformAuth');
const { login, getCurrentAdmin, changePassword } = require('../controllers/platformAdminController');

// Public routes (no authentication required)
router.post('/auth/login', login);

// Protected routes (require platform admin authentication)
router.get('/auth/me', authenticatePlatformAdmin, requirePlatformAdmin, getCurrentAdmin);
router.put('/auth/change-password', authenticatePlatformAdmin, requirePlatformAdmin, changePassword);

module.exports = router;
