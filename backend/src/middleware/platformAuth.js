const { verifyToken } = require('../utils/jwt');
const PlatformAdmin = require('../models/PlatformAdmin');

const authenticatePlatformAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid JWT token in the Authorization header'
    });
  }

  try {
    const decoded = verifyToken(token);
    
    // Check if this is a platform admin token
    if (!decoded.isPlatformAdmin) {
      return res.status(403).json({ 
        error: 'Invalid token type',
        message: 'This endpoint requires platform admin authentication'
      });
    }

    // Verify admin still exists and is active
    const admin = await PlatformAdmin.findById(decoded.adminId);
    if (!admin) {
      return res.status(403).json({ 
        error: 'Admin not found',
        message: 'Platform admin account no longer exists or is inactive'
      });
    }

    // Add admin info to request
    req.platformAdmin = {
      id: admin.id,
      email: admin.email,
      firstName: admin.first_name,
      lastName: admin.last_name
    };

    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      message: error.message
    });
  }
};

const requirePlatformAdmin = (req, res, next) => {
  if (!req.platformAdmin) {
    return res.status(401).json({ 
      error: 'Platform admin authentication required',
      message: 'This endpoint requires platform admin privileges'
    });
  }
  next();
};

module.exports = {
  authenticatePlatformAdmin,
  requirePlatformAdmin
};
