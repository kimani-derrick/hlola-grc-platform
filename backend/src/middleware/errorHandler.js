const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Log error with structured logging
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.userId,
    statusCode: err.status || 500
  });

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error.message = 'Resource already exists';
        error.status = 409;
        break;
      case '23503': // Foreign key violation
        error.message = 'Referenced resource does not exist';
        error.status = 400;
        break;
      case '23502': // Not null violation
        error.message = 'Required field is missing';
        error.status = 400;
        break;
      case '42P01': // Undefined table
        error.message = 'Database table not found';
        error.status = 500;
        break;
      default:
        error.message = 'Database error occurred';
        error.status = 500;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.status = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation error';
    error.status = 400;
  }

  // Log the response being sent
  logger.info('Error Response Sent', {
    requestId: req.id,
    statusCode: error.status,
    errorMessage: error.message,
    userId: req.user?.userId
  });

  res.status(error.status).json({
    success: false,
    error: error.message,
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

