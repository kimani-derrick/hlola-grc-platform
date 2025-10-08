# GRC Platform Architecture: Full-Stack Implementation

## 🏗️ System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React UI      │    │ • Express.js    │    │ • GRC Tables    │
│ • NextAuth.js   │    │ • JWT Auth      │    │ • User Data     │
│ • API Calls     │    │ • Business Logic│    │ • Organizations │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Why This Architecture?

### **❌ What We DON'T Want:**
```
Frontend ──► Database (Direct Connection)
```
- **Security Risk:** Database credentials in frontend
- **No Business Logic:** Complex queries in React components
- **No Validation:** Data validation in UI only
- **Scalability Issues:** Database connections from every user

### **✅ What We DO Want:**
```
Frontend ──► Backend API ──► Database
```
- **Security:** Database hidden behind API
- **Business Logic:** Centralized in backend
- **Validation:** Server-side validation
- **Scalability:** Connection pooling, caching

## 📁 Project Structure

```
hlola-grc-platform/
├── frontend/                 # Next.js React App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities, auth config
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── next.config.js
│
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers
│   ├── package.json
│   └── server.js
│
└── database/                 # Database scripts
    ├── migrations/          # Schema changes
    ├── seeds/              # Sample data
    └── queries/            # Complex queries
```

## 🔐 Authentication Flow

### **1. User Login Process:**
```
1. User enters credentials in Next.js frontend
2. Frontend sends POST to /api/auth/login
3. Backend validates credentials against PostgreSQL
4. Backend creates JWT token with user data
5. Backend returns JWT to frontend
6. Frontend stores JWT in localStorage/cookies
7. Frontend includes JWT in all API requests
```

### **2. API Request Process:**
```
1. Frontend makes API call with JWT
2. Backend middleware validates JWT
3. Backend extracts user info from JWT
4. Backend checks user permissions
5. Backend executes business logic
6. Backend queries PostgreSQL
7. Backend returns data to frontend
```

## 🗄️ Database Integration

### **Current Database Structure:**
```sql
-- GRC Platform Database (hlola_grc_platform)
organizations (id, name, industry, country)
    ↓
users (id, organization_id, entity_id, email, password_hash, role)
    ↓
entities (id, organization_id, name, country, type)
    ↓
frameworks (id, name, version, status)
    ↓
controls (id, framework_id, name, status)
    ↓
tasks (id, user_id, title, status, due_date)
```

### **Authentication Tables:**
```sql
-- Add to existing users table
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Create sessions table for JWT management
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Backend API Endpoints

### **Authentication Endpoints:**
```typescript
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
POST   /api/auth/register       # User registration
POST   /api/auth/refresh        # Refresh JWT token
GET    /api/auth/me             # Get current user
```

### **User Management:**
```typescript
GET    /api/users               # List users (admin only)
GET    /api/users/:id           # Get user by ID
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

### **Organization Management:**
```typescript
GET    /api/organizations       # List organizations
POST   /api/organizations       # Create organization
GET    /api/organizations/:id   # Get organization
PUT    /api/organizations/:id   # Update organization
```

### **GRC Business Logic:**
```typescript
GET    /api/frameworks          # List compliance frameworks
GET    /api/controls            # List controls
GET    /api/tasks               # List user tasks
POST   /api/tasks               # Create task
PUT    /api/tasks/:id           # Update task
GET    /api/audit-items         # List audit items
```

## 🛠️ Technology Stack

### **Frontend (Next.js):**
- **Framework:** Next.js 14 (App Router)
- **Authentication:** NextAuth.js
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand or React Context
- **HTTP Client:** Axios or fetch API

### **Backend (Node.js):**
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** JWT + bcrypt
- **Database:** PostgreSQL with pg driver
- **Validation:** Joi or Zod
- **CORS:** cors middleware

### **Database:**
- **Primary:** PostgreSQL
- **ORM:** Prisma or raw SQL
- **Migrations:** Custom scripts or Prisma migrate

## 🔒 Security Implementation

### **JWT Token Structure:**
```typescript
{
  "userId": "uuid",
  "email": "user@company.com",
  "organizationId": "uuid",
  "role": "compliance_manager",
  "permissions": ["read:audit", "write:controls"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

### **API Security:**
- **JWT Validation:** Every API request
- **Role-Based Access:** Middleware checks permissions
- **Rate Limiting:** Prevent API abuse
- **Input Validation:** Sanitize all inputs
- **CORS Configuration:** Restrict origins

## 📊 Data Flow Examples

### **Example 1: User Login**
```
1. Frontend: POST /api/auth/login { email, password }
2. Backend: Validate credentials in PostgreSQL
3. Backend: Create JWT with user data
4. Backend: Return { token, user: { id, email, role } }
5. Frontend: Store token, redirect to dashboard
```

### **Example 2: Get User Tasks**
```
1. Frontend: GET /api/tasks (with JWT)
2. Backend: Validate JWT, extract userId
3. Backend: Query tasks WHERE user_id = userId
4. Backend: Return tasks array
5. Frontend: Display tasks in UI
```

### **Example 3: Create Audit Item**
```
1. Frontend: POST /api/audit-items { title, description }
2. Backend: Validate JWT, check permissions
3. Backend: Insert into audit_items table
4. Backend: Return created audit item
5. Frontend: Add to UI list
```

## 🚀 Implementation Steps

### **Phase 1: Backend Setup**
1. Create Node.js Express server
2. Set up PostgreSQL connection
3. Implement JWT authentication
4. Create basic API endpoints
5. Add middleware for auth/validation

### **Phase 2: Frontend Integration**
1. Set up NextAuth.js configuration
2. Create login/logout components
3. Implement API client with JWT
4. Add protected route middleware
5. Create user dashboard

### **Phase 3: GRC Features**
1. Implement organization management
2. Add framework/controls management
3. Create task management system
4. Build audit center features
5. Add reporting functionality

## 🎯 Benefits of This Architecture

### **Security:**
- Database credentials never exposed to frontend
- JWT tokens for stateless authentication
- Server-side validation and authorization

### **Scalability:**
- Backend can be scaled independently
- Database connection pooling
- Caching at API level

### **Maintainability:**
- Clear separation of concerns
- Business logic centralized in backend
- Frontend focuses on UI/UX

### **Flexibility:**
- Easy to add new API endpoints
- Frontend can be replaced (mobile app, etc.)
- Multiple frontends can use same API

## 📝 Next Steps

1. **Create backend directory structure**
2. **Set up Express.js server with PostgreSQL**
3. **Implement authentication endpoints**
4. **Create API client in frontend**
5. **Integrate with existing GRC components**

This architecture gives you a professional, scalable, and secure GRC platform!
