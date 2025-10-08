const morgan = require('morgan');
const logger = require('../config/logger');

// Custom Morgan token for request ID
morgan.token('reqId', (req) => {
  return req.id || 'unknown';
});

// Custom Morgan token for response time in ms
morgan.token('responseTime', (req, res) => {
  return res.get('X-Response-Time') || '0';
});

// Custom Morgan token for user agent
morgan.token('userAgent', (req) => {
  return req.get('User-Agent') || 'unknown';
});

// Custom Morgan token for request body (for POST/PUT requests)
morgan.token('requestBody', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    // Only log body for auth endpoints, exclude sensitive data
    if (req.path.includes('/auth/')) {
      const body = { ...req.body };
      
      if (body.password) {
        body.password = '[REDACTED]';
      }
      if (body.password_hash) {
        body.password_hash = '[REDACTED]';
      }
      if (body.passwordHash) {
        body.passwordHash = '[REDACTED]';
      }
      // Return formatted JSON or empty string if no body
      return Object.keys(body).length > 0 ? JSON.stringify(body) : '[NO_BODY]';
    }
  }
  return '';
});

// Development format with payload logging
const devFormat = ':method :url :status :response-time ms - :res[content-length] - :reqId - :userAgent - :requestBody';

// Production format (more detailed) with payload logging
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :reqId - :requestBody';

// Create Morgan middleware
const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  {
    stream: logger.stream,
    skip: (req, res) => {
      // Skip logging for health checks in production
      if (process.env.NODE_ENV === 'production' && req.url === '/health') {
        return true;
      }
      return false;
    }
  }
);

// Middleware to add request ID
const addRequestId = (req, res, next) => {
  req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.set('X-Request-ID', req.id);
  next();
};

// Middleware to add response time
const addResponseTime = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Only set header if response hasn't been sent yet
    if (!res.headersSent) {
      res.set('X-Response-Time', `${duration}ms`);
    }
  });
  next();
};

module.exports = {
  requestLogger,
  addRequestId,
  addResponseTime
};
