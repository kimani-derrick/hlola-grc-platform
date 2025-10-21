const PlatformAdmin = require('../models/PlatformAdmin');
const { generateToken } = require('../utils/jwt');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await PlatformAdmin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await PlatformAdmin.verifyPassword(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const tokenPayload = {
      adminId: admin.id,
      email: admin.email,
      isPlatformAdmin: true
    };

    const token = generateToken(tokenPayload);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name
      }
    });

  } catch (error) {
    console.error('Platform admin login error:', error);
    next(error);
  }
};

const getCurrentAdmin = async (req, res, next) => {
  try {
    // Admin info is already attached by authenticatePlatformAdmin middleware
    const { id, email, firstName, lastName } = req.platformAdmin;

    res.status(200).json({
      success: true,
      admin: {
        id,
        email,
        firstName,
        lastName
      }
    });

  } catch (error) {
    console.error('Get current platform admin error:', error);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.platformAdmin;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing passwords',
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'New password must be at least 8 characters long'
      });
    }

    // Get admin with password hash
    const admin = await PlatformAdmin.findByEmail(req.platformAdmin.email);
    if (!admin) {
      return res.status(404).json({
        error: 'Admin not found',
        message: 'Platform admin account not found'
      });
    }

    // Verify current password
    const isValidCurrentPassword = await PlatformAdmin.verifyPassword(currentPassword, admin.password_hash);
    if (!isValidCurrentPassword) {
      return res.status(401).json({
        error: 'Invalid current password',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await PlatformAdmin.updatePassword(id, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change platform admin password error:', error);
    next(error);
  }
};

module.exports = {
  login,
  getCurrentAdmin,
  changePassword
};
