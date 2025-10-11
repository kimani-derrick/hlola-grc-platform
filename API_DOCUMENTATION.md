# GRC Platform API Documentation

## Overview

The GRC (Governance, Risk, and Compliance) Platform provides a comprehensive REST API for managing organizations, users, frameworks, controls, tasks, and compliance reporting. This documentation covers all available endpoints and their usage.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## Getting Started

### 1. Create an Organization

```bash
curl -X POST http://localhost:3001/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Company Name",
    "industry": "Technology",
    "country": "South Africa"
  }'
```

### 2. Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "compliance_manager",
    "organizationId": "your-organization-id"
  }'
```

### 3. Login to Get JWT Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "admin|compliance_manager|user",
  "organizationId": "uuid"
}
```

#### POST /api/auth/login
Login and get JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

#### POST /api/auth/logout
Logout current user (requires authentication).

### Organization Management

#### GET /api/organizations
Get all organizations (requires authentication).

#### POST /api/organizations
Create a new organization (public endpoint).

**Request Body:**
```json
{
  "name": "string",
  "industry": "string",
  "country": "string"
}
```

#### GET /api/organizations/:id
Get organization by ID (requires authentication).

#### PUT /api/organizations/:id
Update organization (requires authentication).

#### DELETE /api/organizations/:id
Delete organization (requires authentication).

### Entity Management

#### GET /api/entities
Get all entities for the authenticated user's organization.

#### POST /api/entities
Create a new entity.

**Request Body:**
```json
{
  "name": "string",
  "type": "string",
  "description": "string",
  "location": "string",
  "contactEmail": "string",
  "contactPhone": "string"
}
```

#### GET /api/entities/:id
Get entity by ID.

#### PUT /api/entities/:id
Update entity.

#### DELETE /api/entities/:id
Delete entity.

### Framework Management

#### GET /api/frameworks
Get all available frameworks.

**Query Parameters:**
- `region`: Filter by region (e.g., "Africa", "Europe")
- `country`: Filter by country
- `status`: Filter by status

#### GET /api/frameworks/:id
Get framework by ID.

#### POST /api/frameworks
Create a new framework (admin only).

#### PUT /api/frameworks/:id
Update framework (admin only).

#### DELETE /api/frameworks/:id
Delete framework (admin only).

### Framework Assignment

#### POST /api/entities/:entityId/frameworks/:frameworkId
Assign a framework to an entity.

**Request Body:**
```json
{
  "complianceScore": 0,
  "auditReadinessScore": 0,
  "lastAuditDate": "2024-01-01",
  "nextAuditDate": "2024-12-31",
  "certificationStatus": "not-started|in-progress|completed|not-applicable",
  "certificationExpiry": "2024-12-31",
  "complianceDeadline": "2024-12-31"
}
```

#### GET /api/entities/:entityId/frameworks
Get all frameworks assigned to an entity.

#### DELETE /api/entities/:entityId/frameworks/:frameworkId
Remove framework assignment from entity.

### Control Management

#### GET /api/controls
Get all controls.

**Query Parameters:**
- `frameworkId`: Filter by framework ID
- `category`: Filter by category
- `priority`: Filter by priority (high, medium, low)

#### GET /api/controls/:id
Get control by ID.

#### POST /api/controls
Create a new control (admin only).

#### PUT /api/controls/:id
Update control (admin only).

#### DELETE /api/controls/:id
Delete control (admin only).

### Task Management

#### GET /api/tasks
Get all tasks for the authenticated user's organization.

**Query Parameters:**
- `entityId`: Filter by entity ID
- `status`: Filter by status (pending, in-progress, completed, blocked, cancelled)
- `priority`: Filter by priority (high, medium, low)
- `assignee`: Filter by assignee ID

#### GET /api/tasks/all
Get all tasks including unassigned ones (admin/compliance_manager only).

#### GET /api/tasks/:id
Get task by ID.

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "controlId": "uuid",
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed|blocked|cancelled",
  "priority": "high|medium|low",
  "category": "string",
  "assigneeId": "uuid",
  "dueDate": "2024-12-31",
  "estimatedHours": 8
}
```

#### PUT /api/tasks/:id
Update task.

#### PATCH /api/tasks/:id/status
Update task status.

**Request Body:**
```json
{
  "status": "pending|in-progress|completed|blocked|cancelled",
  "progress": 50,
  "actualHours": 4
}
```

#### DELETE /api/tasks/:id
Delete task.

#### GET /api/tasks/stats
Get task statistics.

### Document Management

#### GET /api/documents
Get all documents.

#### POST /api/documents
Upload a new document.

**Request Body:** (multipart/form-data)
- `file`: The file to upload
- `controlId`: Associated control ID
- `title`: Document title
- `description`: Document description
- `type`: Document type

#### GET /api/documents/:id
Get document by ID.

#### PUT /api/documents/:id
Update document.

#### DELETE /api/documents/:id
Delete document.

### Audit Management

#### GET /api/audits
Get all audits.

#### POST /api/audits
Create a new audit.

**Request Body:**
```json
{
  "entityId": "uuid",
  "frameworkId": "uuid",
  "auditType": "string",
  "auditDate": "2024-01-01",
  "auditor": "string",
  "findings": "string",
  "recommendations": "string"
}
```

#### GET /api/audits/:id
Get audit by ID.

#### PUT /api/audits/:id
Update audit.

#### DELETE /api/audits/:id
Delete audit.

### Reporting Endpoints

#### GET /api/reports/overview
Get compliance overview report.

**Query Parameters:**
- `dateRange`: Date range filter (JSON string)

#### GET /api/reports/frameworks
Get frameworks report.

**Query Parameters:**
- `dateRange`: Date range filter (JSON string)

#### GET /api/reports/controls
Get controls report.

**Query Parameters:**
- `frameworkId`: Filter by framework ID
- `status`: Filter by status

#### GET /api/reports/tasks
Get tasks report.

**Query Parameters:**
- `dateRange`: Date range filter (JSON string)
- `status`: Filter by task status
- `priority`: Filter by priority
- `assignee`: Filter by assignee

#### GET /api/reports/trends
Get trends report.

**Query Parameters:**
- `dateRange`: Date range filter (JSON string)
- `metric`: Specific metric to analyze

#### GET /api/reports/insights
Get insights report.

## Example Workflows

### Complete Compliance Setup

1. **Create Organization and User**
```bash
# Create organization
ORG_RESPONSE=$(curl -X POST http://localhost:3001/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Corp", "industry": "Technology", "country": "South Africa"}')

ORG_ID=$(echo $ORG_RESPONSE | jq -r '.organization.id')

# Register user
USER_RESPONSE=$(curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"admin@acme.com\", \"password\": \"password123\", \"firstName\": \"John\", \"lastName\": \"Doe\", \"role\": \"admin\", \"organizationId\": \"$ORG_ID\"}")

# Login to get token
TOKEN_RESPONSE=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@acme.com", "password": "password123"}')

TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.token')
```

2. **Create Entity**
```bash
ENTITY_RESPONSE=$(curl -X POST http://localhost:3001/api/entities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Main Office", "type": "office", "description": "Primary office location", "location": "Cape Town, South Africa", "contactEmail": "office@acme.com"}')

ENTITY_ID=$(echo $ENTITY_RESPONSE | jq -r '.entity.id')
```

3. **Get Available Frameworks**
```bash
curl -X GET http://localhost:3001/api/frameworks \
  -H "Authorization: Bearer $TOKEN"
```

4. **Assign Framework to Entity**
```bash
# Get a framework ID first (e.g., ISO 27001)
FRAMEWORK_ID="cebe2a09-c939-49de-916d-b5ccc27383e4"

curl -X POST http://localhost:3001/api/entities/$ENTITY_ID/frameworks/$FRAMEWORK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"complianceScore": 0, "auditReadinessScore": 0, "certificationStatus": "not-started"}'
```

5. **Check Generated Tasks**
```bash
curl -X GET http://localhost:3001/api/tasks?entityId=$ENTITY_ID \
  -H "Authorization: Bearer $TOKEN"
```

6. **Generate Reports**
```bash
# Overview report
curl -X GET http://localhost:3001/api/reports/overview \
  -H "Authorization: Bearer $TOKEN"

# Tasks report
curl -X GET http://localhost:3001/api/reports/tasks \
  -H "Authorization: Bearer $TOKEN"

# Frameworks report
curl -X GET http://localhost:3001/api/reports/frameworks \
  -H "Authorization: Bearer $TOKEN"
```

### Task Management Workflow

1. **Get All Tasks**
```bash
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

2. **Update Task Status**
```bash
TASK_ID="your-task-id"

curl -X PATCH http://localhost:3001/api/tasks/$TASK_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "in-progress", "progress": 25, "actualHours": 2}'
```

3. **Complete Task**
```bash
curl -X PATCH http://localhost:3001/api/tasks/$TASK_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "completed", "progress": 100, "actualHours": 8}'
```

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include details:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Rate Limiting

Rate limiting is currently disabled for admin operations but may be enabled in production environments.

## Data Integrity Features

- **Automatic Task Creation**: When frameworks are assigned to entities, tasks are automatically created for each control
- **Compliance Scoring**: Real-time compliance scoring based on task completion and evidence
- **Audit Gap Detection**: Automatic detection and tracking of compliance gaps
- **Organization Scoping**: All data is properly scoped to organizations to prevent data leakage

## Best Practices

1. **Always use HTTPS in production**
2. **Store JWT tokens securely**
3. **Implement proper error handling**
4. **Use pagination for large datasets**
5. **Validate input data before sending requests**
6. **Monitor API response times and error rates**

## Support

For API support and questions, please refer to the system logs or contact the development team.
