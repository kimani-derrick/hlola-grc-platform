# Node.js Backend Development Guide

## 🎯 Overview

This guide covers developing the Node.js Express backend API for the GRC platform, connecting to our containerized PostgreSQL database.

## 🏗️ Backend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (Node.js)     │    │   (PostgreSQL)  │
│                 │    │                 │    │   (Container)   │
│ • NextAuth.js   │◄──►│ • Express API   │◄──►│ • Port 5433     │
│ • API Calls     │    │ • JWT Auth      │    │ • 21 Tables     │
│ • UI Components │    │ • Business Logic│    │ • GRC Data      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Backend Project Structure

```
backend/
├── src/
│   ├── controllers/         # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── organizationController.js
│   │   ├── frameworkController.js
│   │   ├── controlController.js
│   │   ├── taskController.js
│   │   └── auditController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/             # Database models
│   │   ├── User.js
│   │   ├── Organization.js
│   │   ├── Framework.js
│   │   ├── Control.js
│   │   └── Task.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── organizations.js
│   │   ├── frameworks.js
│   │   ├── controls.js
│   │   └── tasks.js
│   ├── services/           # Business logic
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── organizationService.js
│   │   └── frameworkService.js
│   ├── utils/              # Helper functions
│   │   ├── database.js
│   │   ├── jwt.js
│   │   ├── validation.js
│   │   └── logger.js
│   ├── config/             # Configuration
│   │   ├── database.js
│   │   └── config.js
│   └── server.js           # Main server file
├── package.json
├── Dockerfile
├── .env.example
└── README.md
```

## 🚀 Development Setup

### **Step 1: Initialize Backend Project**

```bash
cd /home/derrick/Documents/workspace/hlola-grc-platform-main/backend
npm init -y
npm install express cors helmet bcryptjs jsonwebtoken pg joi dotenv express-rate-limit
npm install -D nodemon jest
```

### **Step 2: Environment Configuration**

```bash
# Copy environment template
cp env.example .env

# Edit .env file
DB_HOST=localhost
DB_PORT=5433
DB_NAME=hlola_grc_platform
DB_USER=hlola_user
DB_PASSWORD=hlola2025
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### **Step 3: Database Connection**

```javascript
// src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
```

## 🔐 Authentication Implementation

### **JWT Authentication Flow:**

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

### **Login Endpoint:**

```javascript
// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        organizationId: user.organization_id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        organizationId: user.organization_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { login };
```

## 📊 API Endpoints Implementation

### **1. Authentication Routes**

```javascript
// src/routes/auth.js
const express = require('express');
const { login, register, logout } = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/logout', logout);

module.exports = router;
```

### **2. User Management Routes**

```javascript
// src/routes/users.js
const express = require('express');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', requireRole(['admin', 'compliance_manager']), getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', requireRole(['admin']), deleteUser);

module.exports = router;
```

### **3. Organization Routes**

```javascript
// src/routes/organizations.js
const express = require('express');
const { 
  getOrganizations, 
  getOrganizationById, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization 
} = require('../controllers/organizationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);
router.post('/', requireRole(['admin']), createOrganization);
router.put('/:id', requireRole(['admin']), updateOrganization);
router.delete('/:id', requireRole(['admin']), deleteOrganization);

module.exports = router;
```

### **4. Framework Routes**

```javascript
// src/routes/frameworks.js
const express = require('express');
const { 
  getFrameworks, 
  getFrameworkById, 
  createFramework, 
  updateFramework, 
  deleteFramework 
} = require('../controllers/frameworkController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getFrameworks);
router.get('/:id', getFrameworkById);
router.post('/', createFramework);
router.put('/:id', updateFramework);
router.delete('/:id', deleteFramework);

module.exports = router;
```

## 🗄️ Database Models

### **User Model Example:**

```javascript
// src/models/User.js
const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(userData) {
    const { organization_id, entity_id, email, first_name, last_name, role, password_hash } = userData;
    const result = await pool.query(
      'INSERT INTO users (organization_id, entity_id, email, first_name, last_name, role, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [organization_id, entity_id, email, first_name, last_name, role, password_hash]
    );
    return result.rows[0];
  }

  static async update(id, userData) {
    const { first_name, last_name, role, department, job_title } = userData;
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, role = $3, department = $4, job_title = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [first_name, last_name, role, department, job_title, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = User;
```

## 🔧 Main Server File

```javascript
// src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const organizationRoutes = require('./routes/organizations');
const frameworkRoutes = require('./routes/frameworks');
const controlRoutes = require('./routes/controls');
const taskRoutes = require('./routes/tasks');
const auditRoutes = require('./routes/audit');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'GRC Platform API'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/frameworks', frameworkRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/audit', auditRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GRC Platform API running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
```

## 🚀 Development Commands

### **Package.json Scripts:**

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js"
  }
}
```

### **Starting the Backend:**

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# With database container running
docker start hlola-grc-db
npm run dev
```

## 🧪 Testing API Endpoints

### **Using curl:**

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get users (with JWT token)
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Using Postman/Insomnia:**

1. **Import API collection**
2. **Set base URL:** `http://localhost:3001`
3. **Add JWT token** to Authorization header
4. **Test all endpoints**

## 📋 Implementation Checklist

### **Phase 1: Core Setup**
- [ ] Initialize Node.js project
- [ ] Set up database connection
- [ ] Create basic server structure
- [ ] Implement JWT authentication
- [ ] Add error handling middleware

### **Phase 2: Authentication**
- [ ] Login endpoint
- [ ] Register endpoint
- [ ] JWT token validation
- [ ] Password hashing
- [ ] Role-based access control

### **Phase 3: User Management**
- [ ] Get users
- [ ] Get user by ID
- [ ] Update user
- [ ] Delete user
- [ ] User validation

### **Phase 4: Organization Management**
- [ ] CRUD operations for organizations
- [ ] User-organization relationships
- [ ] Organization validation

### **Phase 5: GRC Features**
- [ ] Framework management
- [ ] Control management
- [ ] Task management
- [ ] Audit item management
- [ ] Document management

### **Phase 6: Advanced Features**
- [ ] Search and filtering
- [ ] Pagination
- [ ] File uploads
- [ ] Email notifications
- [ ] Audit logging

## 🎯 Next Steps

1. **Create the backend directory structure**
2. **Set up the basic Express server**
3. **Implement database connection**
4. **Create authentication endpoints**
5. **Test with the containerized database**

**Ready to start implementing the backend API?**
