const express = require('express');
const { login, register, logout, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, loginSchema, registerSchema } = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', validateRequest(loginSchema), login);
router.post('/register', validateRequest(registerSchema), register);

// Protected routes (authentication required)
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;

