const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database connection
const { testConnection } = require('./config/database');

// Import logging
const logger = require('./config/logger');
const { requestLogger, addRequestId, addResponseTime } = require('./middleware/requestLogger');
const bodyLogger = require('./middleware/bodyLogger');

// Import routes
const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organizations');
const entityRoutes = require('./routes/entities');
const frameworkRoutes = require('./routes/frameworks');
const entityFrameworkRoutes = require('./routes/entityFrameworks');
const controlRoutes = require('./routes/controls');
const controlAssignmentRoutes = require('./routes/controlAssignments');
const taskRoutes = require('./routes/tasks');
const documentRoutes = require('./routes/documents');
const auditRoutes = require('./routes/audits');
const auditGapRoutes = require('./routes/auditGaps');
const complianceHistoryRoutes = require('./routes/complianceHistory');
const auditTimelineRoutes = require('./routes/auditTimeline');
const complianceRoutes = require('./routes/compliance');
const reportRoutes = require('./routes/reports');
const commentRoutes = require('./routes/comments');
const platformAdminRoutes = require('./routes/platformAdmin');
const adminFrameworksRoutes = require('./routes/admin/adminFrameworks');
const adminControlsRoutes = require('./routes/admin/adminControls');
const adminTasksRoutes = require('./routes/admin/adminTasks');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Request ID and response time middleware (must be first)
app.use(addRequestId);
app.use(addResponseTime);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - DISABLED for admin operations
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     error: 'Too many requests',
//     message: 'Too many requests from this IP, please try again later.'
//   }
// });
// app.use(limiter);

// Body parsing middleware (must be before requestLogger)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (after body parsing)
app.use(requestLogger);

// Body logging middleware (after body parsing)
app.use(bodyLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check requested', {
    requestId: req.id,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'GRC Platform API',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/frameworks', frameworkRoutes);
app.use('/api/admin', platformAdminRoutes);
app.use('/api/admin/frameworks', adminFrameworksRoutes);
app.use('/api/admin/controls', adminControlsRoutes);
app.use('/api/admin/tasks', adminTasksRoutes);
app.use('/api', entityFrameworkRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api', controlAssignmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/audit-gaps', auditGapRoutes);
app.use('/api/compliance/history', complianceHistoryRoutes);
app.use('/api/audit/timeline', auditTimelineRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/comments', commentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GRC Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      organizations: '/api/organizations',
      entities: '/api/entities',
      frameworks: '/api/frameworks',
      adminFrameworks: '/api/admin/frameworks',
      adminControls: '/api/admin/controls',
      adminTasks: '/api/admin/tasks',
      entityFrameworks: '/api/entities/:entityId/frameworks',
      controls: '/api/controls',
      controlAssignments: '/api/entities/:entityId/controls',
      tasks: '/api/tasks',
      documents: '/api/documents',
      audits: '/api/audits',
      auditGaps: '/api/audit-gaps',
      complianceHistory: '/api/compliance/history',
      auditTimeline: '/api/audit/timeline',
      compliance: '/api/compliance',
      reports: '/api/reports',
      comments: '/api/comments',
      documentation: '/api/docs'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start compliance scheduler
    const ComplianceScheduler = require('./services/complianceScheduler');
    const realtimeEventEmitter = require('./services/realtimeEventEmitter');
    
    // Start compliance scheduler
    ComplianceScheduler.start();
    
    // Initialize real-time event emitter
    logger.info('Real-time event emitter initialized', {
      service: 'grc-backend',
      eventTypes: [
        'document.uploaded', 'document.updated', 'document.deleted',
        'task.created', 'task.status.changed', 'task.completed', 'task.assigned',
        'control.assigned', 'control.completed', 'control.status.changed',
        'framework.assigned', 'framework.removed',
        'entity.created', 'entity.updated'
      ]
    });
    logger.info('Compliance scheduler initialized');
    
    // Start the server
    app.listen(PORT, () => {
      logger.info('GRC Platform API Server Started', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        database: `${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
        healthCheck: `http://localhost:${PORT}/health`,
        authEndpoints: `http://localhost:${PORT}/api/auth`
      });
      
      console.log('🚀 GRC Platform API Server Started');
      console.log(`📊 Port: ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`🤖 Compliance Engine: Active`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;

