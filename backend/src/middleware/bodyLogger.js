const logger = require('../config/logger');

// Middleware to log request body for POST/PUT requests
const bodyLogger = (req, res, next) => {
  // Only log body for auth endpoints
  if ((req.method === 'POST' || req.method === 'PUT') && req.path.includes('/auth/')) {
    const body = { ...req.body };
    
    // Redact sensitive data
    if (body.password) {
      body.password = '[REDACTED]';
    }
    if (body.password_hash) {
      body.password_hash = '[REDACTED]';
    }
    if (body.passwordHash) {
      body.passwordHash = '[REDACTED]';
    }
    
    // Log the request body
    if (Object.keys(body).length > 0) {
      logger.info('Request Body', {
        requestId: req.id,
        method: req.method,
        url: req.url,
        body: body
      });
    }
  }
  
  next();
};

module.exports = bodyLogger;
