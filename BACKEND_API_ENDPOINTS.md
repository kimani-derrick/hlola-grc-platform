# GRC Platform Backend API Endpoints Documentation

## Overview
This document provides comprehensive documentation for all available API endpoints in the GRC Platform backend server. The API follows RESTful conventions and uses JWT authentication.

**Base URL:** `http://localhost:3001`  
**API Version:** 1.0.0

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": { ... } // Optional, contains response data
}
```

## Error Handling
Errors are returned with appropriate HTTP status codes and error details:
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": { ... } // Optional, additional error details
}
```

---

## 1. Health Check

### GET /health
**Description:** Check API server health and status  
**Authentication:** None required  
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "GRC Platform API",
  "version": "1.0.0",
  "environment": "development"
}
```

### GET /
**Description:** Get API overview and available endpoints  
**Authentication:** None required  
**Response:**
```json
{
  "message": "GRC Platform API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "organizations": "/api/organizations",
    // ... all available endpoints
  }
}
```

---

## 2. Authentication Endpoints (`/api/auth`)

### POST /api/auth/login
**Description:** Authenticate user and get JWT token  
**Authentication:** None required  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "organizationId": 1,
    "entityId": 1
  }
}
```

### POST /api/auth/register
**Description:** Register new user account  
**Authentication:** None required  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "team_member",
  "organizationId": 1,
  "entityId": 1,
  "department": "IT",
  "jobTitle": "Developer"
}
```

### POST /api/auth/logout
**Description:** Logout user (client-side token removal)  
**Authentication:** Required  
**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/profile
**Description:** Get current user profile  
**Authentication:** Required  
**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "organizationId": 1,
    "entityId": 1
  }
}
```

---

## 3. Organization Management (`/api/organizations`)

### POST /api/organizations
**Description:** Create new organization  
**Authentication:** None required (for onboarding)  
**Request Body:**
```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "country": "United States"
}
```

### GET /api/organizations
**Description:** Get all organizations  
**Authentication:** Required  
**Response:**
```json
{
  "success": true,
  "organizations": [
    {
      "id": 1,
      "name": "Acme Corp",
      "industry": "Technology",
      "country": "United States",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/organizations/:id
**Description:** Get specific organization  
**Authentication:** Required  
**Parameters:** `id` - Organization ID

### PUT /api/organizations/:id
**Description:** Update organization  
**Authentication:** Required  
**Request Body:**
```json
{
  "name": "Updated Corp",
  "industry": "Finance",
  "country": "Canada"
}
```

### DELETE /api/organizations/:id
**Description:** Delete organization  
**Authentication:** Required

---

## 4. Entity Management (`/api/entities`)

### POST /api/entities
**Description:** Create new entity  
**Authentication:** Required  
**Request Body:**
```json
{
  "name": "IT Department",
  "type": "department",
  "description": "Information Technology Department",
  "parentEntityId": null
}
```

### GET /api/entities
**Description:** Get entities by organization  
**Authentication:** Required  
**Response:**
```json
{
  "success": true,
  "entities": [
    {
      "id": 1,
      "name": "IT Department",
      "type": "department",
      "description": "Information Technology Department",
      "organizationId": 1,
      "parentEntityId": null
    }
  ]
}
```

### GET /api/entities/:id
**Description:** Get specific entity  
**Authentication:** Required

### PUT /api/entities/:id
**Description:** Update entity  
**Authentication:** Required

### DELETE /api/entities/:id
**Description:** Delete entity  
**Authentication:** Required

### POST /api/entities/:id/assign-user
**Description:** Assign user to entity  
**Authentication:** Required  
**Request Body:**
```json
{
  "userId": 1
}
```

### GET /api/entities/:id/users
**Description:** Get users assigned to entity  
**Authentication:** Required

---

## 5. Framework Management (`/api/frameworks`)

### POST /api/frameworks
**Description:** Create new framework  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "name": "ISO 27001",
  "description": "Information Security Management System",
  "category": "security",
  "region": "global",
  "version": "2022",
  "isActive": true
}
```

### GET /api/frameworks
**Description:** Get all frameworks  
**Authentication:** Required

### GET /api/frameworks/grouped/category
**Description:** Get frameworks grouped by category  
**Authentication:** Required

### GET /api/frameworks/grouped/region
**Description:** Get frameworks grouped by region  
**Authentication:** Required

### GET /api/frameworks/search
**Description:** Search frameworks  
**Authentication:** Required  
**Query Parameters:** `q` - Search query

### GET /api/frameworks/category/:category
**Description:** Get frameworks by category  
**Authentication:** Required

### GET /api/frameworks/region/:region
**Description:** Get frameworks by region  
**Authentication:** Required

### GET /api/frameworks/:id
**Description:** Get specific framework  
**Authentication:** Required

### PUT /api/frameworks/:id
**Description:** Update framework  
**Authentication:** Required (Admin only)

### DELETE /api/frameworks/:id
**Description:** Delete framework  
**Authentication:** Required (Admin only)

---

## 6. Entity-Framework Assignment (`/api/entities/:entityId/frameworks`)

### POST /api/entities/:entityId/frameworks/:frameworkId
**Description:** Assign framework to entity  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "complianceStatus": "in_progress",
  "assignedDate": "2024-01-01",
  "targetDate": "2024-12-31",
  "notes": "Initial assignment"
}
```

### GET /api/entities/:entityId/frameworks
**Description:** Get frameworks assigned to entity  
**Authentication:** Required

### GET /api/frameworks/:frameworkId/entities
**Description:** Get entities assigned to framework  
**Authentication:** Required

### PUT /api/entities/:entityId/frameworks/:frameworkId
**Description:** Update entity-framework assignment  
**Authentication:** Required (Admin, Compliance Manager)

### DELETE /api/entities/:entityId/frameworks/:frameworkId
**Description:** Remove framework from entity  
**Authentication:** Required (Admin only)

### GET /api/entities/:entityId/compliance-overview
**Description:** Get entity compliance overview  
**Authentication:** Required

### GET /api/frameworks/:frameworkId/compliance-overview
**Description:** Get framework compliance overview  
**Authentication:** Required

### GET /api/upcoming-audits
**Description:** Get upcoming audits  
**Authentication:** Required

### GET /api/expiring-certifications
**Description:** Get expiring certifications  
**Authentication:** Required

---

## 7. Control Management (`/api/controls`)

### POST /api/controls
**Description:** Create new control  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "frameworkId": 1,
  "code": "A.5.1.1",
  "title": "Information Security Policies",
  "description": "Management shall provide direction and support for information security",
  "category": "governance",
  "priority": "high",
  "isActive": true
}
```

### GET /api/controls
**Description:** Get all controls  
**Authentication:** Required

### GET /api/controls/grouped/category
**Description:** Get controls grouped by category  
**Authentication:** Required

### GET /api/controls/grouped/framework
**Description:** Get controls grouped by framework  
**Authentication:** Required

### GET /api/controls/search
**Description:** Search controls  
**Authentication:** Required

### GET /api/controls/category/:category
**Description:** Get controls by category  
**Authentication:** Required

### GET /api/controls/:id
**Description:** Get specific control  
**Authentication:** Required

### GET /api/controls/framework/:frameworkId
**Description:** Get controls by framework  
**Authentication:** Required

### PUT /api/controls/:id
**Description:** Update control  
**Authentication:** Required (Admin only)

### DELETE /api/controls/:id
**Description:** Delete control  
**Authentication:** Required (Admin only)

---

## 8. Control Assignment (`/api/entities/:entityId/controls`)

### POST /api/entities/:entityId/controls/:controlId
**Description:** Assign control to entity  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "status": "in_progress",
  "assignedDate": "2024-01-01",
  "dueDate": "2024-06-30",
  "assignedTo": 1,
  "notes": "Control assignment notes"
}
```

### GET /api/entities/:entityId/controls
**Description:** Get controls assigned to entity  
**Authentication:** Required

### GET /api/entities/:entityId/controls/stats
**Description:** Get entity control statistics  
**Authentication:** Required

### GET /api/entities/:entityId/controls/status
**Description:** Get controls by status  
**Authentication:** Required

### GET /api/entities/:entityId/controls/overdue
**Description:** Get overdue controls  
**Authentication:** Required

### GET /api/entities/:entityId/controls/upcoming
**Description:** Get upcoming controls  
**Authentication:** Required

### PUT /api/entities/:entityId/controls/:controlId
**Description:** Update control status  
**Authentication:** Required (Admin, Compliance Manager)

### DELETE /api/entities/:entityId/controls/:controlId
**Description:** Remove control from entity  
**Authentication:** Required (Admin only)

### GET /api/controls/:controlId/entities
**Description:** Get entities assigned to control  
**Authentication:** Required

---

## 9. Task Management (`/api/tasks`)

### POST /api/tasks
**Description:** Create new task  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "controlId": 1,
  "title": "Review Security Policy",
  "description": "Review and update information security policy",
  "priority": "high",
  "category": "policy",
  "assigneeId": 1,
  "dueDate": "2024-02-01",
  "estimatedHours": 8
}
```

### GET /api/tasks
**Description:** Get all tasks  
**Authentication:** Required

### GET /api/tasks/stats
**Description:** Get task statistics  
**Authentication:** Required

### GET /api/tasks/all
**Description:** Get all tasks including unassigned  
**Authentication:** Required

### GET /api/tasks/:id
**Description:** Get specific task  
**Authentication:** Required

### PUT /api/tasks/:id
**Description:** Update task  
**Authentication:** Required

### PUT /api/tasks/:id/status
**Description:** Update task status  
**Authentication:** Required  
**Request Body:**
```json
{
  "status": "completed",
  "completedAt": "2024-01-15T10:30:00.000Z",
  "notes": "Task completed successfully"
}
```

### DELETE /api/tasks/:id
**Description:** Delete task  
**Authentication:** Required (Admin only)

### GET /api/tasks/controls/:controlId
**Description:** Get tasks by control  
**Authentication:** Required

### GET /api/tasks/users/:userId
**Description:** Get tasks by user  
**Authentication:** Required

### GET /api/tasks/entities/:entityId
**Description:** Get tasks by entity  
**Authentication:** Required

---

## 10. Document Management (`/api/documents`)

### POST /api/documents
**Description:** Upload document  
**Authentication:** Required (All roles)  
**Content-Type:** `multipart/form-data`  
**Request Body:**
```json
{
  "file": "<file>",
  "entityId": 1,
  "title": "Security Policy Document",
  "description": "Information security policy document",
  "documentType": "policy",
  "frameworkId": 1,
  "controlId": 1,
  "taskId": 1,
  "tags": ["security", "policy"],
  "accessLevel": "internal",
  "expiryDate": "2025-01-01"
}
```

### GET /api/documents
**Description:** Get all documents  
**Authentication:** Required

### GET /api/documents/search
**Description:** Search documents  
**Authentication:** Required  
**Query Parameters:** `q`, `type`, `entityId`, `frameworkId`, `controlId`

### GET /api/documents/:id
**Description:** Get specific document  
**Authentication:** Required

### GET /api/documents/:id/download
**Description:** Download document  
**Authentication:** Required

### GET /api/documents/:id/url
**Description:** Get document URL  
**Authentication:** Required

### PUT /api/documents/:id
**Description:** Update document metadata  
**Authentication:** Required

### DELETE /api/documents/:id
**Description:** Delete document  
**Authentication:** Required (Admin only)

### POST /api/documents/:id/version
**Description:** Create document version  
**Authentication:** Required (All roles)  
**Content-Type:** `multipart/form-data`

### GET /api/documents/:id/versions
**Description:** Get document version history  
**Authentication:** Required

### GET /api/documents/entities/:entityId
**Description:** Get documents by entity  
**Authentication:** Required

### GET /api/documents/controls/:controlId
**Description:** Get documents by control  
**Authentication:** Required

### GET /api/documents/tasks/:taskId
**Description:** Get documents by task  
**Authentication:** Required

---

## 11. Audit Management (`/api/audits`)

### POST /api/audits
**Description:** Create new audit  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "entityId": 1,
  "frameworkId": 1,
  "title": "ISO 27001 Audit",
  "description": "Annual ISO 27001 compliance audit",
  "auditType": "internal",
  "auditorId": 1,
  "startDate": "2024-02-01",
  "endDate": "2024-02-15",
  "scope": "Information Security Management System"
}
```

### GET /api/audits
**Description:** Get all audits  
**Authentication:** Required

### GET /api/audits/stats
**Description:** Get audit statistics  
**Authentication:** Required

### GET /api/audits/:id
**Description:** Get specific audit  
**Authentication:** Required

### PUT /api/audits/:id
**Description:** Update audit  
**Authentication:** Required (Admin, Compliance Manager)

### PUT /api/audits/:id/progress
**Description:** Update audit progress  
**Authentication:** Required  
**Request Body:**
```json
{
  "progress": 75,
  "notes": "75% of audit completed"
}
```

### PUT /api/audits/:id/status
**Description:** Update audit status  
**Authentication:** Required  
**Request Body:**
```json
{
  "status": "in_progress",
  "notes": "Audit started"
}
```

### DELETE /api/audits/:id
**Description:** Delete audit  
**Authentication:** Required (Admin only)

### POST /api/audits/:id/findings
**Description:** Create audit finding  
**Authentication:** Required (Admin, Compliance Manager, Auditor)  
**Request Body:**
```json
{
  "title": "Missing Security Policy",
  "description": "Information security policy not documented",
  "severity": "high",
  "category": "governance",
  "recommendation": "Develop and implement security policy",
  "status": "open"
}
```

### GET /api/audits/:id/findings
**Description:** Get audit findings  
**Authentication:** Required

### GET /api/audits/:id/findings/stats
**Description:** Get findings statistics  
**Authentication:** Required

### PUT /api/audits/:auditId/findings/:findingId
**Description:** Update finding  
**Authentication:** Required

### DELETE /api/audits/:auditId/findings/:findingId
**Description:** Delete finding  
**Authentication:** Required (Admin only)

---

## 12. Audit Gap Management (`/api/audit-gaps`)

### POST /api/audit-gaps
**Description:** Create audit gap  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "auditId": 1,
  "controlId": 1,
  "title": "Missing Control Implementation",
  "description": "Control A.5.1.1 not implemented",
  "severity": "high",
  "status": "open",
  "assignedTo": 1,
  "dueDate": "2024-03-01"
}
```

### GET /api/audit-gaps
**Description:** Get all audit gaps  
**Authentication:** Required

### GET /api/audit-gaps/stats
**Description:** Get gap statistics  
**Authentication:** Required

### GET /api/audit-gaps/:id
**Description:** Get specific gap  
**Authentication:** Required

### PUT /api/audit-gaps/:id
**Description:** Update gap  
**Authentication:** Required

### PUT /api/audit-gaps/:id/status
**Description:** Update gap status  
**Authentication:** Required  
**Request Body:**
```json
{
  "status": "in_progress",
  "notes": "Working on implementation"
}
```

### DELETE /api/audit-gaps/:id
**Description:** Delete gap  
**Authentication:** Required (Admin only)

---

## 13. Compliance History (`/api/compliance/history`)

### POST /api/compliance/history
**Description:** Record compliance event  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "entityId": 1,
  "frameworkId": 1,
  "eventType": "compliance_check",
  "score": 85,
  "notes": "Quarterly compliance check completed"
}
```

### GET /api/compliance/history
**Description:** Get compliance history  
**Authentication:** Required

### GET /api/compliance/history/trend
**Description:** Get compliance trends  
**Authentication:** Required

### GET /api/compliance/history/latest-score
**Description:** Get latest compliance score  
**Authentication:** Required

### GET /api/compliance/history/stats
**Description:** Get compliance statistics  
**Authentication:** Required

---

## 14. Audit Timeline (`/api/audit/timeline`)

### POST /api/audit/timeline
**Description:** Create timeline event  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "entityId": 1,
  "frameworkId": 1,
  "title": "Audit Kickoff Meeting",
  "description": "Initial audit planning meeting",
  "eventType": "meeting",
  "scheduledDate": "2024-02-01T10:00:00.000Z",
  "duration": 120
}
```

### GET /api/audit/timeline
**Description:** Get timeline events  
**Authentication:** Required

### GET /api/audit/timeline/upcoming
**Description:** Get upcoming events  
**Authentication:** Required

### GET /api/audit/timeline/stats
**Description:** Get timeline statistics  
**Authentication:** Required

### PUT /api/audit/timeline/:id
**Description:** Update timeline event  
**Authentication:** Required

### DELETE /api/audit/timeline/:id
**Description:** Delete timeline event  
**Authentication:** Required (Admin only)

---

## 15. Compliance Management (`/api/compliance`)

### GET /api/compliance/dashboard
**Description:** Get compliance dashboard  
**Authentication:** Required (Admin, Compliance Manager, Auditor)  
**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "frameworks": [
      {
        "id": 1,
        "name": "ISO 27001",
        "score": 90,
        "status": "compliant"
      }
    ],
    "controls": {
      "total": 100,
      "implemented": 85,
      "inProgress": 10,
      "notStarted": 5
    }
  }
}
```

### POST /api/compliance/check
**Description:** Trigger compliance check  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "entityId": 1,
  "frameworkId": 1,
  "checkType": "full"
}
```

### POST /api/compliance/smart-audit
**Description:** Create smart audit  
**Authentication:** Required (Admin, Compliance Manager)  
**Request Body:**
```json
{
  "entityId": 1,
  "frameworkId": 1,
  "auditType": "automated",
  "scope": "all_controls"
}
```

### GET /api/compliance/trends
**Description:** Get compliance trends  
**Authentication:** Required (Admin, Compliance Manager, Auditor)

### GET /api/compliance/gaps
**Description:** Get compliance gaps  
**Authentication:** Required (Admin, Compliance Manager, Auditor)

### GET /api/compliance/status
**Description:** Get compliance engine status  
**Authentication:** Required (Admin, Compliance Manager)

### POST /api/compliance/trigger-all
**Description:** Trigger compliance checks for all assignments  
**Authentication:** Required (Admin only)

### GET /api/compliance/health
**Description:** Get compliance engine health  
**Authentication:** Required (Admin, Compliance Manager)

---

## 16. Reports (`/api/reports`)

### GET /api/reports/overview
**Description:** Get organization overview report  
**Authentication:** Required (Admin, Compliance Manager)  
**Query Parameters:** `startDate`, `endDate`, `entityId`

### GET /api/reports/frameworks
**Description:** Get frameworks report  
**Authentication:** Required (Admin, Compliance Manager)  
**Query Parameters:** `entityId`, `frameworkId`, `status`

### GET /api/reports/controls
**Description:** Get controls report  
**Authentication:** Required (Admin, Compliance Manager)  
**Query Parameters:** `entityId`, `frameworkId`, `status`, `category`

### GET /api/reports/tasks
**Description:** Get tasks report  
**Authentication:** Required (Admin, Compliance Manager)  
**Query Parameters:** `entityId`, `userId`, `status`, `priority`

### GET /api/reports/trends
**Description:** Get trends report  
**Authentication:** Required (Admin, Compliance Manager)  
**Query Parameters:** `startDate`, `endDate`, `entityId`, `frameworkId`

### GET /api/reports/insights
**Description:** Get AI-generated insights report  
**Authentication:** Required (Admin, Compliance Manager)

---

## Authentication Roles

The API supports the following user roles with different permission levels:

- **admin**: Full access to all endpoints
- **compliance_manager**: Access to compliance-related endpoints and management functions
- **entity_manager**: Access to entity-specific endpoints and assigned entities
- **team_member**: Limited access to assigned tasks and documents
- **auditor**: Access to audit-related endpoints and read-only access to compliance data

---

## Rate Limiting

Rate limiting is currently disabled for admin operations but can be enabled by uncommenting the rate limiter configuration in the server setup.

---

## File Upload

Document uploads support various file types with size limits. Files are stored in organized directory structures based on organization, entity, and document type.

---

## Real-time Events

The API supports real-time event emission for:
- Document uploads, updates, and deletions
- Task creation, status changes, completion, and assignment
- Control assignment and status changes
- Framework assignment and removal
- Entity creation and updates

---

## Error Codes

Common HTTP status codes used:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

---

## Notes

- All timestamps are in ISO 8601 format
- Pagination is supported on list endpoints (query parameters: `page`, `limit`)
- Filtering and sorting are available on most list endpoints
- The API uses PostgreSQL as the primary database
- File storage is handled by a custom storage service
- JWT tokens are used for stateless authentication

