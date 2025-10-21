# Admin UI Design Document
## Framework, Control & Task Management System

**Version:** 1.0  
**Date:** October 21, 2025  
**Technology Stack:** Next.js 15, TypeScript, React, Tailwind CSS

---

## Table of Contents
1. [Overview](#overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [UI Structure](#ui-structure)
4. [Feature Specifications](#feature-specifications)
5. [API Integration](#api-integration)
6. [File Upload Specifications](#file-upload-specifications)
7. [Data Models](#data-models)
8. [Component Architecture](#component-architecture)
9. [Implementation Plan](#implementation-plan)

---

## 1. Overview

### Purpose
The Admin UI provides a centralized interface for system administrators to manage the core compliance data structure: **Frameworks**, **Controls**, and **Tasks**. This is a content management system that operates independently of Organizations and Entities.

### Key Features
- **Framework Management**: Create, edit, delete, and bulk import frameworks
- **Control Management**: Manage controls within frameworks, including bulk operations
- **Task Management**: Create and manage tasks associated with controls
- **Bulk Import**: CSV/Excel file upload with validation and preview
- **Audit Trail**: Track all administrative actions
- **Validation**: Real-time validation for manual entry and file uploads

### Scope Limitations
- **NO Organization Management**: Cannot create, edit, or delete organizations
- **NO Entity Management**: Cannot create, edit, or delete entities
- **NO User Management**: Cannot manage users or their assignments
- **Content Only**: Manages the compliance framework content that organizations can then adopt

### Access Control
- **Route:** `/dashboard/admin`
- **Required Role:** `admin` or `super_admin`
- **Authentication:** JWT-based authentication with role verification

---

## 2. System Architecture & Separation of Concerns

### Admin UI vs Main Application

The system is designed with clear separation between content management and operational management:

#### Admin UI (Content Management)
- **Purpose**: Manages compliance framework content
- **Scope**: Frameworks, Controls, Tasks (templates only)
- **Users**: System administrators
- **Function**: Creates the "library" of compliance content

#### Main Application (Operational Management)
- **Purpose**: Manages organizational compliance operations
- **Scope**: Organizations, Entities, Users, Assignments
- **Users**: Organization users, compliance managers
- **Function**: Adopts frameworks and assigns tasks to users

### Data Flow

```
Admin UI (Content Creation)
    ↓ Creates
Frameworks, Controls, Tasks (Templates)
    ↓ Available for adoption
Main Application (Operational Use)
    ↓ Organizations adopt
Entity-Framework Assignments
    ↓ Users work on
Task Assignments & Progress
```

### Why This Separation?

1. **Content vs Operations**: Framework content is managed separately from organizational operations
2. **Security**: Admin UI has elevated permissions for content management
3. **Scalability**: Content can be created once and adopted by many organizations
4. **Maintenance**: Framework updates don't affect operational data
5. **Multi-tenancy**: Organizations can adopt frameworks without affecting other organizations

---

## 3. User Roles & Permissions

### Admin Role Capabilities
| Feature | Create | Read | Update | Delete | Bulk Import |
|---------|--------|------|--------|--------|-------------|
| Frameworks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Controls | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tasks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users | ❌ | ❌ | ❌ | ❌ | ❌ |
| Organizations | ❌ | ❌ | ❌ | ❌ | ❌ |
| Entities | ❌ | ❌ | ❌ | ❌ | ❌ |

> **Note**: The Admin UI is a **Content Management System** only. It manages the compliance framework content (Frameworks, Controls, Tasks) that organizations can then adopt and assign to their entities. It does NOT manage organizations, entities, or users.

---

## 3. UI Structure

### Main Layout
```
/dashboard/admin
├── /frameworks       - Framework management
│   ├── /[id]         - Framework details
│   ├── /[id]/controls - Controls within framework
│   └── /[id]/controls/[controlId]/tasks - Tasks within control
├── /controls         - Control management (all controls)
├── /tasks            - Task management (all tasks)
├── /bulk-import      - Bulk import operations
└── /audit-logs       - Activity audit trail
```

### Hierarchical Navigation

The admin UI supports three navigation patterns:

1. **Top-Down Navigation**: Framework → Controls → Tasks
2. **Cross-Reference Navigation**: Jump between related items
3. **Breadcrumb Navigation**: Show current location in hierarchy

#### Navigation Examples

```
Framework View:
GDPR Framework
├── Controls (12)
│   ├── A.5.1.1 - Information Security Policies
│   │   └── Tasks (3)
│   ├── A.5.1.2 - Review of Information Security Policies
│   │   └── Tasks (2)
│   └── A.5.2.1 - Information Security Awareness
│       └── Tasks (4)
└── [Add Control] [Bulk Import Controls]

Control View:
A.5.1.1 - Information Security Policies
├── Framework: GDPR
├── Tasks (3)
│   ├── Review current policy
│   ├── Update policy template
│   └── Train staff on new policy
└── [Add Task] [Edit Control] [View Framework]

Task View:
Review current policy
├── Control: A.5.1.1 - Information Security Policies
├── Framework: GDPR
├── Assignee: John Doe
├── Status: In Progress
└── [Edit Task] [View Control] [View Framework]
```

### Navigation Structure
```typescript
const adminNav = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: HomeIcon },
  { name: 'Frameworks', href: '/dashboard/admin/frameworks', icon: LayersIcon },
  { name: 'Controls', href: '/dashboard/admin/controls', icon: ShieldCheckIcon },
  { name: 'Tasks', href: '/dashboard/admin/tasks', icon: CheckSquareIcon },
  { name: 'Bulk Import', href: '/dashboard/admin/bulk-import', icon: UploadIcon },
  { name: 'Audit Logs', href: '/dashboard/admin/audit-logs', icon: ClockIcon }
];
```

---

## 4. Feature Specifications

### 4.1 Framework Management

> **Note:** Frameworks are the top-level entities that contain controls. When creating a framework, you can optionally create controls and tasks as part of the same workflow.

### 4.1.1 Framework Creation Workflow

The framework creation process supports three modes:

1. **Framework Only**: Create just the framework (empty)
2. **Framework + Controls**: Create framework with initial controls
3. **Framework + Controls + Tasks**: Create complete framework with controls and tasks

#### Hierarchical Creation UI
```
┌─────────────────────────────────────────────────────┐
│ Create New Framework                          [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: Framework Details                          │
│  [Framework form fields...]                         │
│                                                     │
│  Step 2: Add Controls (Optional)                    │
│  ☐ Add controls to this framework                   │
│  [If checked, show controls section]                │
│                                                     │
│  Step 3: Add Tasks (Optional)                       │
│  ☐ Add tasks to controls                            │
│  [If checked, show tasks section]                   │
│                                                     │
│  [Cancel]                    [Create Framework]    │
└─────────────────────────────────────────────────────┘
```

#### Manual Entry Form
**Location:** `/dashboard/admin/frameworks/new`

**Form Fields:**
```typescript
interface FrameworkFormData {
  // Basic Information
  name: string;                    // Required, max 255 chars
  description: string;             // Required, max 2000 chars
  
  // Classification
  region: string;                  // Required (Africa, Europe, Asia, etc.)
  country: string;                 // Optional
  category: string;                // Required (privacy, security, industry, etc.)
  type: string;                    // Required (regulation, standard, best-practice)
  
  // Metadata
  icon: string;                    // Optional (icon name or URL)
  color: string;                   // Optional (hex color code)
  priority: 'high' | 'medium' | 'low';  // Required
  riskLevel: 'critical' | 'high' | 'medium' | 'low';  // Required
  status: 'active' | 'draft' | 'archived';  // Required
  
  // Additional Details
  complianceDeadline?: Date;       // Optional
  requirementsCount?: number;      // Optional (auto-calculated)
  applicableCountries?: string[];  // Optional (array of country codes)
  industryScope?: string[];        // Optional (e.g., ['finance', 'healthcare'])
}
```

**Validation Rules:**
- Name: Required, unique, 3-255 characters
- Description: Required, 10-2000 characters
- Region: Required, must match predefined regions
- Category: Required, must match predefined categories
- Type: Required, must be one of allowed types
- Priority & Risk Level: Required, enum validation
- Dates: Must be valid ISO dates, compliance deadline must be future date

**UI Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Create New Framework                          [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Basic Information                                  │
│  ┌─────────────────────────────────────────┐      │
│  │ Framework Name *                         │      │
│  │ [________________________________]       │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │ Description *                            │      │
│  │ [________________________________]       │      │
│  │ [________________________________]       │      │
│  │ [________________________________]       │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  Classification                                     │
│  [Region ▼] [Country ▼] [Category ▼] [Type ▼]     │
│                                                     │
│  Settings                                           │
│  [Priority ▼] [Risk Level ▼] [Status ▼]           │
│                                                     │
│  Advanced (Optional)                                │
│  [Compliance Deadline] [Industry Scope]            │
│  [Applicable Countries (multi-select)]             │
│                                                     │
│  [Cancel]                    [Create Framework]    │
└─────────────────────────────────────────────────────┘
```

**API Calls:**
```typescript
// Create Framework
POST /api/frameworks
Content-Type: application/json
Authorization: Bearer {token}

Request Body: FrameworkFormData

Response: {
  success: true,
  message: 'Framework created successfully',
  framework: { id, name, ... }
}
```

#### Framework List View
**Location:** `/dashboard/admin/frameworks`

**Features:**
- Searchable table with pagination
- Filters: Region, Category, Type, Status
- Sort by: Name, Created Date, Priority, Risk Level
- Bulk actions: Delete, Archive, Export
- Quick edit inline
- Row actions: Edit, Delete, View Controls, Duplicate

**Table Columns:**
```typescript
const columns = [
  { key: 'name', label: 'Framework Name', sortable: true },
  { key: 'region', label: 'Region', sortable: true, filterable: true },
  { key: 'category', label: 'Category', sortable: true, filterable: true },
  { key: 'type', label: 'Type', sortable: true, filterable: true },
  { key: 'priority', label: 'Priority', sortable: true, badge: true },
  { key: 'riskLevel', label: 'Risk Level', sortable: true, badge: true },
  { key: 'status', label: 'Status', sortable: true, badge: true },
  { key: 'controlsCount', label: 'Controls', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'actions', label: 'Actions', align: 'right' }
];
```

**API Calls:**
```typescript
// List Frameworks
GET /api/frameworks?limit=50&offset=0&region=Africa&category=privacy&sortBy=name&sortOrder=asc

// Update Framework
PUT /api/frameworks/{id}

// Delete Framework
DELETE /api/frameworks/{id}

// Bulk Delete
DELETE /api/frameworks/bulk
Body: { ids: ['id1', 'id2', ...] }
```

---

### 4.2 Control Management

> **Note:** Controls belong to a specific framework. When creating a control, you must select a framework first. You can optionally create tasks for the control as part of the same workflow.

### 4.2.1 Control Creation Workflow

The control creation process supports two modes:

1. **Control Only**: Create just the control (no tasks)
2. **Control + Tasks**: Create control with initial tasks

#### Hierarchical Creation UI
```
┌─────────────────────────────────────────────────────┐
│ Create New Control                             [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: Select Framework *                         │
│  [Framework Dropdown ▼]                            │
│                                                     │
│  Step 2: Control Details                            │
│  [Control form fields...]                           │
│                                                     │
│  Step 3: Add Tasks (Optional)                       │
│  ☐ Add tasks to this control                        │
│  [If checked, show tasks section]                   │
│                                                     │
│  [Cancel]                      [Create Control]    │
└─────────────────────────────────────────────────────┘
```

#### Manual Entry Form
**Location:** `/dashboard/admin/controls/new`

**Form Fields:**
```typescript
interface ControlFormData {
  // Association
  frameworkId: string;             // Required (FK)
  
  // Identification
  code: string;                    // Required (e.g., "A.5.1.1", "GDPR-7.1")
  title: string;                   // Required
  subtitle?: string;               // Optional
  article?: string;                // Optional (e.g., "Article 7")
  
  // Description
  description: string;             // Required
  detailedDescription?: string;    // Optional (long form)
  implementationGuidance?: string; // Optional
  
  // Classification
  category: string;                // Required (governance, technical, etc.)
  subcategory?: string;            // Optional
  domain?: string;                 // Optional (IT, HR, Legal, etc.)
  
  // Priority & Risk
  priority: 'high' | 'medium' | 'low';  // Required
  riskLevel: 'critical' | 'high' | 'medium' | 'low';  // Required
  implementationLevel?: 'basic' | 'intermediate' | 'advanced';  // Optional
  
  // Compliance
  isMandatory: boolean;            // Required (default: true)
  evidenceRequired: boolean;       // Required (default: true)
  testingRequired: boolean;        // Optional
  
  // Metadata
  tags?: string[];                 // Optional
  references?: string[];           // Optional (URLs, document refs)
  relatedControls?: string[];      // Optional (control IDs)
  
  // Status
  status: 'active' | 'draft' | 'deprecated';  // Required
  effectiveDate?: Date;            // Optional
  reviewDate?: Date;               // Optional
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Create New Control                            [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Framework Selection *                              │
│  [Select Framework ▼                         ]     │
│                                                     │
│  Control Identification                             │
│  [Control Code *] [Article]                        │
│  [Title *________________________________]         │
│  [Subtitle (optional)____________________]         │
│                                                     │
│  Description *                                      │
│  [Rich Text Editor with formatting tools]          │
│                                                     │
│  Detailed Description (Optional)                    │
│  [Rich Text Editor]                                │
│                                                     │
│  Implementation Guidance (Optional)                 │
│  [Rich Text Editor]                                │
│                                                     │
│  Classification                                     │
│  [Category ▼] [Subcategory ▼] [Domain ▼]          │
│                                                     │
│  Priority & Risk                                    │
│  [Priority ▼] [Risk Level ▼] [Impl. Level ▼]      │
│                                                     │
│  Compliance Requirements                            │
│  ☑ Mandatory Control                               │
│  ☑ Evidence Required                               │
│  ☐ Testing Required                                │
│                                                     │
│  Related Information                                │
│  [Tags (comma-separated)]                          │
│  [References (one per line)]                       │
│  [Related Controls (multi-select)]                 │
│                                                     │
│  [Cancel]                       [Create Control]   │
└─────────────────────────────────────────────────────┘
```

**API Calls:**
```typescript
// Create Control
POST /api/controls
Content-Type: application/json

Request Body: ControlFormData

// List Controls by Framework
GET /api/controls/framework/{frameworkId}

// Update Control
PUT /api/controls/{id}

// Delete Control
DELETE /api/controls/{id}
```

---

### 4.3 Task Management

> **Note:** Tasks belong to a specific control, which in turn belongs to a framework. When creating a task, you must select both the framework and control first.

### 4.3.1 Task Creation Workflow

Tasks are always created within the context of a control:

1. **From Framework View**: Select framework → select control → create task
2. **From Control View**: Select control → create task
3. **Direct Creation**: Select framework → select control → create task

#### Hierarchical Selection UI
```
┌─────────────────────────────────────────────────────┐
│ Create New Task                                [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: Select Framework *                         │
│  [Framework Dropdown ▼]                            │
│  [Shows: GDPR, Kenya DPA, ISO 27001, ...]          │
│                                                     │
│  Step 2: Select Control *                           │
│  [Control Dropdown ▼] (filtered by framework)      │
│  [Shows: A.5.1.1, A.5.1.2, A.5.2.1, ...]          │
│                                                     │
│  Step 3: Task Details                               │
│  [Task form fields...]                              │
│  Note: Tasks are template content only.            │
│  User assignment happens in main app.              │
│                                                     │
│  [Cancel]                           [Create Task]   │
└─────────────────────────────────────────────────────┘
```

#### Manual Entry Form
**Location:** `/dashboard/admin/tasks/new`

> **Important**: Tasks created in the Admin UI are **template tasks** only. They define what tasks exist for a control, but do not assign them to specific users. User assignment happens when organizations adopt frameworks in the main application.

**Form Fields:**
```typescript
interface TaskFormData {
  // Association
  controlId: string;               // Required (FK)
  
  // Basic Information
  title: string;                   // Required
  description: string;             // Required
  
  // Classification
  category?: string;               // Optional (policy, technical, review, etc.)
  
  // Scheduling
  dueDate?: Date;                  // Optional
  estimatedHours?: number;         // Optional
  
  // Priority & Status
  priority: 'high' | 'medium' | 'low';  // Required
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';  // Required
  
  // Progress Tracking
  progress?: number;               // Optional (0-100)
  actualHours?: number;            // Optional
  
  // Additional
  blockers?: string;               // Optional (JSON string or text)
  evidenceAttached?: boolean;      // Optional
  
  // Metadata
  autoGenerated?: boolean;         // System field (default: false)
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Create New Task                               [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Control Selection *                                │
│  [Framework ▼]  →  [Control ▼]                     │
│                                                     │
│  Task Details                                       │
│  [Title *_____________________________]            │
│  [Description *_______________________]            │
│  [_____________________________________]            │
│                                                     │
│  Category (Optional)                                │
│  [Select Category ▼                         ]      │
│                                                     │
│  Scheduling                                         │
│  [Due Date] [Estimated Hours]                      │
│                                                     │
│  Priority & Status                                  │
│  [Priority ▼] [Status ▼]                           │
│                                                     │
│  Additional Information                             │
│  [Blockers/Notes (optional)]                       │
│                                                     │
│  [Cancel]                          [Create Task]   │
└─────────────────────────────────────────────────────┘
```

**API Calls:**
```typescript
// Create Task
POST /api/tasks
Content-Type: application/json

Request Body: TaskFormData

// List Tasks
GET /api/tasks?controlId={id}&status=pending&priority=high

// Update Task
PUT /api/tasks/{id}

// Update Task Status
PATCH /api/tasks/{id}/status

// Delete Task
DELETE /api/tasks/{id}
```

---

## 5. API Integration

### 5.1 Backend API Endpoints

#### Framework APIs
```typescript
// Create
POST /api/frameworks
Headers: { Authorization: Bearer {token} }
Body: FrameworkFormData
Response: { success: boolean, framework: Framework, message: string }

// List
GET /api/frameworks?limit=50&offset=0&region=Africa&category=privacy&search=GDPR
Response: { success: boolean, frameworks: Framework[], total: number, pagination: {...} }

// Get Single
GET /api/frameworks/{id}
Response: { success: boolean, framework: Framework }

// Update
PUT /api/frameworks/{id}
Body: Partial<FrameworkFormData>
Response: { success: boolean, framework: Framework, message: string }

// Delete
DELETE /api/frameworks/{id}
Response: { success: boolean, message: string }

// Bulk Delete
DELETE /api/frameworks/bulk
Body: { ids: string[] }
Response: { success: boolean, deleted: number, message: string }
```

#### Control APIs
```typescript
// Create
POST /api/controls
Body: ControlFormData
Response: { success: boolean, control: Control, message: string }

// List All
GET /api/controls?frameworkId={id}&category=governance&priority=high
Response: { success: boolean, controls: Control[], total: number }

// List by Framework
GET /api/controls/framework/{frameworkId}
Response: { success: boolean, controls: Control[], count: number }

// Get Single
GET /api/controls/{id}
Response: { success: boolean, control: Control }

// Update
PUT /api/controls/{id}
Body: Partial<ControlFormData>
Response: { success: boolean, control: Control, message: string }

// Delete
DELETE /api/controls/{id}
Response: { success: boolean, message: string }

// Bulk Create
POST /api/controls/bulk
Body: { controls: ControlFormData[] }
Response: { success: boolean, created: number, errors: any[], message: string }
```

#### Task APIs
```typescript
// Create
POST /api/tasks
Body: TaskFormData
Response: { success: boolean, task: Task, message: string }

// List
GET /api/tasks?controlId={id}&status=pending&assigneeId={userId}
Response: { success: boolean, tasks: Task[], count: number }

// Get Single
GET /api/tasks/{id}
Response: { success: boolean, task: Task }

// Update
PUT /api/tasks/{id}
Body: Partial<TaskFormData>
Response: { success: boolean, task: Task, message: string }

// Update Status
PATCH /api/tasks/{id}/status
Body: { status: string, progress?: number, actualHours?: number }
Response: { success: boolean, task: Task }

// Delete
DELETE /api/tasks/{id}
Response: { success: boolean, message: string }

// Bulk Create
POST /api/tasks/bulk
Body: { tasks: TaskFormData[] }
Response: { success: boolean, created: number, errors: any[], message: string }
```

### 5.2 New Hierarchical APIs (To Be Created)

#### Framework Hierarchy APIs
```typescript
// Get Framework with Controls and Tasks
GET /api/frameworks/{id}/hierarchy
Response: {
  success: boolean,
  framework: Framework,
  controls: Control[],
  tasks: Task[],
  stats: {
    controlsCount: number,
    tasksCount: number,
    completedTasks: number
  }
}

// Create Framework with Controls and Tasks (Bulk)
POST /api/frameworks/bulk-create
Body: {
  framework: FrameworkFormData,
  controls: ControlFormData[],
  tasks: TaskFormData[]
}
Response: {
  success: boolean,
  framework: Framework,
  controls: Control[],
  tasks: Task[],
  created: { frameworks: number, controls: number, tasks: number }
}
```

#### Control Hierarchy APIs
```typescript
// Get Control with Tasks
GET /api/controls/{id}/hierarchy
Response: {
  success: boolean,
  control: Control,
  framework: Framework,
  tasks: Task[],
  stats: {
    tasksCount: number,
    completedTasks: number,
    progress: number
  }
}

// Create Control with Tasks
POST /api/controls/bulk-create
Body: {
  control: ControlFormData,
  tasks: TaskFormData[]
}
Response: {
  success: boolean,
  control: Control,
  tasks: Task[],
  created: { controls: number, tasks: number }
}
```

#### Bulk Import APIs
```typescript
// Hierarchical Bulk Import
POST /api/admin/import/hierarchy
Content-Type: multipart/form-data
Body: { 
  frameworksFile: File,
  controlsFile?: File,
  tasksFile?: File,
  options: {
    skipDuplicates: boolean,
    updateExisting: boolean,
    validateOnly: boolean
  }
}
Response: {
  success: boolean,
  preview: {
    frameworks: FrameworkFormData[],
    controls: ControlFormData[],
    tasks: TaskFormData[]
  },
  validation: {
    valid: { frameworks: number, controls: number, tasks: number },
    invalid: { frameworks: number, controls: number, tasks: number },
    errors: Array<{ type: string, row: number, field: string, error: string }>
  }
}

// Confirm Hierarchical Import
POST /api/admin/import/hierarchy/confirm
Body: {
  data: {
    frameworks: FrameworkFormData[],
    controls: ControlFormData[],
    tasks: TaskFormData[]
  },
  options: {
    skipDuplicates: boolean,
    updateExisting: boolean
  }
}
Response: {
  success: boolean,
  created: { frameworks: number, controls: number, tasks: number },
  updated: { frameworks: number, controls: number, tasks: number },
  failed: { frameworks: number, controls: number, tasks: number },
  errors: any[]
}

// Template Download
GET /api/admin/templates/hierarchy
Response: ZIP file with frameworks.csv, controls.csv, tasks.csv

// Individual Templates
GET /api/admin/templates/{type}  // type: frameworks | controls | tasks
Response: CSV file download
```

#### Dependency Resolution APIs
```typescript
// Resolve Framework Dependencies
POST /api/admin/resolve/frameworks
Body: { frameworkNames: string[] }
Response: {
  success: boolean,
  resolved: Array<{ name: string, id: string }>,
  notFound: string[]
}

// Resolve Control Dependencies
POST /api/admin/resolve/controls
Body: { 
  frameworkId: string,
  controlCodes: string[]
}
Response: {
  success: boolean,
  resolved: Array<{ code: string, id: string }>,
  notFound: string[]
}

// Validate Import Dependencies
POST /api/admin/import/validate-dependencies
Body: {
  frameworks: FrameworkFormData[],
  controls: ControlFormData[],
  tasks: TaskFormData[]
}
Response: {
  success: boolean,
  valid: boolean,
  dependencies: {
    frameworks: Array<{ name: string, exists: boolean }>,
    controls: Array<{ code: string, frameworkId: string, exists: boolean }>,
    tasks: Array<{ title: string, controlId: string, exists: boolean }>
  },
  errors: string[]
}
```

---

## 6. File Upload Specifications

### 6.1 CSV Template Formats

#### Frameworks CSV Template
```csv
name,description,region,country,category,type,icon,color,priority,riskLevel,status,complianceDeadline,applicableCountries,industryScope
"GDPR","General Data Protection Regulation","Europe","EU","privacy","regulation","shield","#4F46E5","high","critical","active","2025-12-31","DE|FR|IT","finance|healthcare"
"Kenya DPA","Kenya Data Protection Act","Africa","KE","privacy","regulation","shield","#10B981","high","high","active","2026-06-30","KE","all"
```

**Field Specifications:**
- **name**: String, required, max 255 chars
- **description**: String, required, max 2000 chars
- **region**: String, required (Africa, Europe, Asia, Americas, Oceania, Global)
- **country**: String, optional (ISO country code or name)
- **category**: String, required (privacy, security, industry, governance, compliance)
- **type**: String, required (regulation, standard, best-practice, framework)
- **icon**: String, optional
- **color**: String, optional (hex color #RRGGBB)
- **priority**: String, required (high, medium, low)
- **riskLevel**: String, required (critical, high, medium, low)
- **status**: String, required (active, draft, archived)
- **complianceDeadline**: Date, optional (YYYY-MM-DD)
- **applicableCountries**: String, optional (pipe-separated: "US|CA|MX")
- **industryScope**: String, optional (pipe-separated: "finance|healthcare")

#### Controls CSV Template
```csv
frameworkId,controlId,title,subtitle,article,description,detailedDescription,category,subcategory,priority,riskLevel,isMandatory,evidenceRequired,status,tags
"framework-uuid-here","A.5.1.1","Information Security Policies","Top Management Direction","Article 5.1","Management shall provide direction...","Detailed implementation guidance...","governance","policy","high","high","true","true","active","policy|governance|management"
```

**Field Specifications:**
- **frameworkId**: UUID, required (must exist in database)
- **controlId**: String, required, unique within framework (e.g., "A.5.1.1", "GDPR-7.1")
- **title**: String, required, max 500 chars
- **subtitle**: String, optional
- **article**: String, optional (e.g., "Article 7", "Section 3.2")
- **description**: String, required, max 2000 chars
- **detailedDescription**: String, optional
- **category**: String, required
- **subcategory**: String, optional
- **priority**: String, required (high, medium, low)
- **riskLevel**: String, required (critical, high, medium, low)
- **isMandatory**: Boolean, required (true/false)
- **evidenceRequired**: Boolean, required (true/false)
- **status**: String, required (active, draft, deprecated)
- **tags**: String, optional (pipe-separated)

#### Tasks CSV Template
```csv
controlId,title,description,category,priority,status,dueDate,estimatedHours
"control-uuid-here","Review Privacy Policy","Conduct annual review of privacy policy","policy","high","pending","2025-12-31","8"
```

**Field Specifications:**
- **controlId**: UUID, required (must exist in database)
- **title**: String, required, max 500 chars
- **description**: String, required, max 2000 chars
- **category**: String, optional
- **priority**: String, required (high, medium, low)
- **status**: String, required (pending, in_progress, completed, blocked, cancelled)
- **dueDate**: Date, optional (YYYY-MM-DD)
- **estimatedHours**: Number, optional

> **Note**: Tasks created via Admin UI are **template tasks** only. They define what tasks exist for a control but are not assigned to specific users. User assignment happens when organizations adopt frameworks in the main application.

### 6.2 Bulk Import Workflow

The bulk import process respects the hierarchical relationships:

#### Hierarchical Import Options

1. **Framework-Only Import**: Import just frameworks
2. **Framework + Controls Import**: Import frameworks with their controls
3. **Complete Import**: Import frameworks, controls, and tasks together

#### Import Workflow

```
1. File Selection
   ├─ Single file (frameworks only)
   ├─ Multiple files (frameworks + controls + tasks)
   └─ Archive file (ZIP with all three)
   ↓
2. Upload & Parse
   ├─ Validate format (CSV/Excel)
   ├─ Parse rows in dependency order:
   │  ├─ Frameworks first
   │  ├─ Controls second (requires frameworkId)
   │  └─ Tasks last (requires controlId)
   └─ Basic validation
   ↓
3. Dependency Resolution
   ├─ Map framework names to IDs
   ├─ Map control codes to IDs
   ├─ Validate all foreign keys
   └─ Show dependency tree
   ↓
4. Preview & Validation
   ├─ Show parsed data in hierarchical table
   ├─ Highlight errors (red rows)
   ├─ Show warnings (yellow rows)
   ├─ Display validation summary
   └─ Allow editing invalid rows
   ↓
5. Confirmation
   ├─ Review summary by type
   ├─ Choose options:
   │  ├─ Skip duplicates
   │  ├─ Update existing
   │  └─ Create new only
   └─ Confirm import
   ↓
6. Processing (Sequential)
   ├─ Create frameworks first
   ├─ Create controls second
   ├─ Create tasks last
   ├─ Show progress bar
   ├─ Real-time status updates
   └─ Handle errors gracefully
   ↓
7. Results
   ├─ Success count by type
   ├─ Error count by type
   ├─ Download error report
   └─ View imported items in hierarchy
```

#### Multi-File Import Structure

```
frameworks.csv          # Required: Framework definitions
├── controls.csv        # Optional: Controls for frameworks
└── tasks.csv          # Optional: Tasks for controls

OR

complete-import.zip
├── frameworks.csv
├── controls.csv
└── tasks.csv
```

### 6.3 File Upload UI Component

```tsx
'use client';

import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface BulkImportProps {
  type: 'frameworks' | 'controls' | 'tasks';
  onComplete: () => void;
}

export default function BulkImport({ type, onComplete }: BulkImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch(`/api/${type}/import`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      const result = await response.json();
      setPreview(result.preview);
      setErrors(result.errors);
      setStep('preview');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    setStep('processing');
    
    try {
      const response = await fetch(`/api/${type}/import/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: preview, overwrite: false })
      });
      
      const result = await response.json();
      setStep('complete');
      onComplete();
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Upload Step */}
      {step === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-medium">Upload {type} file</p>
          <p className="mt-2 text-sm text-gray-500">CSV or Excel (XLSX) format</p>
          
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="mt-4"
          />
          
          <button
            onClick={() => downloadTemplate(type)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Download Template
          </button>
        </div>
      )}

      {/* Preview Step */}
      {step === 'preview' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Preview Import</h3>
              <p className="text-sm text-gray-500">
                {preview.length} rows • {errors.length} errors
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('upload')}>Cancel</button>
              <button 
                onClick={handleConfirmImport}
                disabled={errors.length > 0}
                className="btn-primary"
              >
                Confirm Import
              </button>
            </div>
          </div>

          {/* Error Summary */}
          {errors.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{errors.length} validation errors found</span>
              </div>
              <ul className="mt-2 text-sm text-red-700">
                {errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>Row {err.row}: {err.error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table content */}
            </table>
          </div>
        </div>
      )}

      {/* Processing & Complete steps */}
    </div>
  );
}
```

---

## 7. Data Models

### Database Schema References

The data models reflect the hierarchical relationship: **Frameworks** → **Controls** → **Tasks**

```typescript
// Framework Model (Top Level)
interface Framework {
  id: string;                      // UUID
  name: string;
  description: string;
  region: string;
  country: string | null;
  category: string;
  type: string;
  icon: string | null;
  color: string | null;
  complianceDeadline: Date | null;
  priority: 'high' | 'medium' | 'low';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'draft' | 'archived';
  requirementsCount: number | null;
  applicableCountries: string[] | null;
  industryScope: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  controls?: Control[];            // One-to-Many
  entityFrameworks?: EntityFramework[]; // Many-to-Many via entity_frameworks
}

// Control Model (Belongs to Framework)
interface Control {
  id: string;                      // UUID
  frameworkId: string;             // FK to frameworks(id)
  controlId: string;               // Framework-specific identifier (e.g., "A.5.1.1")
  title: string;
  subtitle: string | null;
  article: string | null;
  description: string;
  detailedDescription: string | null;
  implementationGuidance: string | null;
  category: string;
  subcategory: string | null;
  domain: string | null;
  priority: 'high' | 'medium' | 'low';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  implementationLevel: 'basic' | 'intermediate' | 'advanced' | null;
  isMandatory: boolean;
  evidenceRequired: boolean;
  testingRequired: boolean | null;
  tags: string[] | null;
  references: string[] | null;
  relatedControls: string[] | null;
  status: 'active' | 'draft' | 'deprecated';
  effectiveDate: Date | null;
  reviewDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  framework?: Framework;           // Many-to-One (belongs to)
  tasks?: Task[];                  // One-to-Many
  controlAssignments?: ControlAssignment[]; // Many-to-Many via control_assignments
}

// Task Model (Belongs to Control)
interface Task {
  id: string;                      // UUID
  controlId: string;               // FK to controls(id)
  title: string;
  description: string;
  category: string | null;
  assigneeId: string | null;       // FK to users(id)
  dueDate: Date | null;
  estimatedHours: number | null;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  progress: number | null;         // 0-100
  actualHours: number | null;
  blockers: string | null;
  evidenceAttached: boolean;
  autoGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  control?: Control;               // Many-to-One (belongs to)
  assignee?: User;                 // Many-to-One (assigned to)
  taskAssignments?: TaskAssignment[]; // Many-to-Many via task_assignments
}

// Supporting Models
interface EntityFramework {
  id: string;                      // UUID
  entityId: string;                // FK to entities(id)
  frameworkId: string;             // FK to frameworks(id)
  complianceScore: number;         // 0-100
  auditReadinessScore: number;     // 0-100
  lastAuditDate: Date | null;
  nextAuditDate: Date | null;
  certificationStatus: string;
  certificationExpiry: Date | null;
  complianceDeadline: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ControlAssignment {
  id: string;                      // UUID
  entityId: string;                // FK to entities(id)
  controlId: string;               // FK to controls(id)
  assignedTo: string | null;       // FK to users(id)
  assignedTeam: string | null;
  status: string;
  completionRate: number;          // 0-100
  priority: 'high' | 'medium' | 'low';
  dueDate: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  lastReviewedAt: Date | null;
  reviewNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskAssignment {
  id: string;                      // UUID
  taskId: string;                  // FK to tasks(id)
  entityId: string;                // FK to entities(id)
  assignedTo: string | null;       // FK to users(id)
  priority: 'high' | 'medium' | 'low';
  dueDate: Date | null;
  status: string;
  progress: number;                // 0-100
  actualHours: number | null;
  estimatedHours: number | null;
  evidenceAttached: boolean;
  blockers: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Database Relationships Summary

The Admin UI manages only the **Core Content Structure** (highlighted in bold):

```
Organizations (1) ──→ (N) Entities
Organizations (1) ──→ (N) Users
Entities (N) ←──→ (N) Frameworks (via entity_frameworks)
**Frameworks (1) ──→ (N) Controls**     ← Admin UI manages this
**Controls (1) ──→ (N) Tasks**           ← Admin UI manages this
Entities (N) ←──→ (N) Controls (via control_assignments)
Entities (N) ←──→ (N) Tasks (via task_assignments)
Users (1) ──→ (N) Tasks (via assignee_id)
```

### Admin UI Scope

**✅ What Admin UI Manages:**
- **Frameworks**: Create, edit, delete frameworks
- **Controls**: Create, edit, delete controls within frameworks
- **Tasks**: Create, edit, delete tasks within controls

**❌ What Admin UI Does NOT Manage:**
- **Organizations**: Cannot create or manage organizations
- **Entities**: Cannot create or manage entities
- **Users**: Cannot create or manage users
- **Assignments**: Cannot assign frameworks to entities
- **User Tasks**: Cannot assign tasks to specific users

### Key Constraints for Admin UI

1. **Framework → Controls**: `controls.framework_id` references `frameworks.id` (CASCADE DELETE)
2. **Control → Tasks**: `tasks.control_id` references `controls.id` (CASCADE DELETE)

> **Note**: The Admin UI creates the **template content** that organizations can then adopt. The actual assignment of frameworks to entities and tasks to users happens in the main application, not in the Admin UI.

---

## 8. Component Architecture

### Component Hierarchy

```
src/app/dashboard/admin/
├── layout.tsx                    # Admin layout with sidebar
├── page.tsx                      # Dashboard overview
│
├── frameworks/
│   ├── page.tsx                  # Framework list
│   ├── new/
│   │   └── page.tsx              # Create framework form
│   ├── [id]/
│   │   ├── page.tsx              # View framework
│   │   └── edit/
│   │       └── page.tsx          # Edit framework form
│   └── components/
│       ├── FrameworkForm.tsx     # Reusable form component
│       ├── FrameworkList.tsx     # Table component
│       └── FrameworkCard.tsx     # Card display
│
├── controls/
│   ├── page.tsx                  # Control list
│   ├── new/
│   │   └── page.tsx              # Create control form
│   ├── [id]/
│   │   ├── page.tsx              # View control
│   │   └── edit/
│   │       └── page.tsx          # Edit control form
│   └── components/
│       ├── ControlForm.tsx       # Reusable form component
│       ├── ControlList.tsx       # Table component
│       └── ControlDetailView.tsx # Detail display
│
├── tasks/
│   ├── page.tsx                  # Task list
│   ├── new/
│   │   └── page.tsx              # Create task form
│   ├── [id]/
│   │   ├── page.tsx              # View task
│   │   └── edit/
│   │       └── page.tsx          # Edit task form
│   └── components/
│       ├── TaskForm.tsx          # Reusable form component
│       ├── TaskList.tsx          # Table/kanban component
│       └── TaskCard.tsx          # Card display
│
├── bulk-import/
│   ├── page.tsx                  # Bulk import hub
│   └── components/
│       ├── BulkImport.tsx        # Main import component
│       ├── FileUploader.tsx      # File upload UI
│       ├── PreviewTable.tsx      # Data preview
│       └── ImportProgress.tsx    # Progress indicator
│
├── audit-logs/
│   └── page.tsx                  # Audit trail viewer
│
└── components/                   # Shared admin components
    ├── AdminSidebar.tsx
    ├── PageHeader.tsx
    ├── DataTable.tsx             # Generic table
    ├── SearchFilter.tsx          # Search/filter controls
    ├── BulkActions.tsx           # Bulk action toolbar
    └── StatusBadge.tsx           # Status indicators
```

### Shared Components

```typescript
// DataTable - Generic reusable table
interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onRowClick?: (row: T) => void;
  rowActions?: RowAction[];
  bulkActions?: BulkAction[];
}

// SearchFilter - Search and filter controls
interface SearchFilterProps {
  onSearch: (query: string) => void;
  filters: FilterConfig[];
  onFilterChange: (filters: Record<string, any>) => void;
}

// BulkActions - Bulk operation toolbar
interface BulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
  onAction: (action: string, selectedIds: string[]) => void;
}
```

---

## 9. Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create admin layout and routing
- [ ] Implement authentication guard for admin routes
- [ ] Create shared components (DataTable, SearchFilter, etc.)
- [ ] Set up API service layer for admin operations
- [ ] Create form validation utilities

### Phase 2: Framework Management (Week 2)
- [ ] Framework list view with search/filter
- [ ] Framework create form
- [ ] Framework edit form
- [ ] Framework delete with confirmation
- [ ] Framework bulk delete
- [ ] Framework export to CSV

### Phase 3: Control Management (Week 3)
- [ ] Control list view with framework filtering
- [ ] Control create form with framework selection
- [ ] Control edit form
- [ ] Control delete with dependency check
- [ ] Control bulk operations
- [ ] Related controls linking UI

### Phase 4: Task Management (Week 4)
- [ ] Task list view (table and kanban)
- [ ] Task create form with control selection
- [ ] Task edit form
- [ ] Task status update (drag-drop on kanban)
- [ ] Task assignment to users
- [ ] Task bulk operations

### Phase 5: Bulk Import (Week 5)
- [ ] CSV/Excel parser library integration
- [ ] File upload component
- [ ] Preview table with validation
- [ ] Error highlighting and correction UI
- [ ] Bulk import confirmation flow
- [ ] Progress tracking
- [ ] Template download functionality
- [ ] Error report generation

### Phase 6: Backend Bulk Import APIs (Week 5-6)
- [ ] Framework import endpoint
- [ ] Control import endpoint
- [ ] Task import endpoint
- [ ] Template generation endpoints
- [ ] Validation service
- [ ] Bulk database operations optimization

### Phase 7: Polish & Testing (Week 7)
- [ ] Audit log viewer
- [ ] Error handling and user feedback
- [ ] Loading states and optimistic updates
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Unit tests for key components
- [ ] Integration tests for workflows
- [ ] User acceptance testing

---

## 10. Technical Specifications

### Technology Stack
- **Frontend Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod validation
- **Data Tables:** TanStack Table (React Table v8)
- **File Upload:** React Dropzone
- **CSV Parsing:** PapaParse
- **Excel Parsing:** XLSX (SheetJS)
- **State Management:** React Context + Zustand (for complex state)
- **API Client:** Custom fetch wrapper with error handling
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

### Performance Considerations
- Server-side rendering for list views
- Client-side pagination for large datasets
- Debounced search
- Virtual scrolling for bulk import preview
- Optimistic UI updates
- Request caching with SWR or React Query

### Security Considerations
- Role-based access control (RBAC)
- CSRF protection
- File type validation
- File size limits (10MB for CSV/Excel)
- Input sanitization
- SQL injection prevention via parameterized queries
- Audit logging for all admin actions

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management
- ARIA labels and roles

---

## 11. Example Code Snippets

### Framework Form Component
```typescript
// src/app/dashboard/admin/frameworks/components/FrameworkForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/services/api';

const frameworkSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(2000),
  region: z.enum(['Africa', 'Europe', 'Asia', 'Americas', 'Oceania', 'Global']),
  country: z.string().optional(),
  category: z.enum(['privacy', 'security', 'industry', 'governance', 'compliance']),
  type: z.enum(['regulation', 'standard', 'best-practice', 'framework']),
  priority: z.enum(['high', 'medium', 'low']),
  riskLevel: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['active', 'draft', 'archived']),
  // ... other fields
});

type FrameworkFormData = z.infer<typeof frameworkSchema>;

export default function FrameworkForm({ 
  initialData, 
  onSuccess 
}: { 
  initialData?: Partial<FrameworkFormData>,
  onSuccess: () => void 
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FrameworkFormData>({
    resolver: zodResolver(frameworkSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: FrameworkFormData) => {
    try {
      if (initialData?.id) {
        await apiService.updateFramework(initialData.id, data);
      } else {
        await apiService.createFramework(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium">Framework Name *</label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="e.g., GDPR, ISO 27001"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description *</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Region *</label>
          <select {...register('region')} className="mt-1 block w-full rounded-md">
            <option value="">Select Region</option>
            <option value="Africa">Africa</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Americas">Americas</option>
            <option value="Oceania">Oceania</option>
            <option value="Global">Global</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Category *</label>
          <select {...register('category')} className="mt-1 block w-full rounded-md">
            <option value="">Select Category</option>
            <option value="privacy">Privacy</option>
            <option value="security">Security</option>
            <option value="industry">Industry</option>
            <option value="governance">Governance</option>
            <option value="compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* More fields... */}

      <div className="flex justify-end gap-3">
        <button type="button" className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">
          {initialData?.id ? 'Update' : 'Create'} Framework
        </button>
      </div>
    </form>
  );
}
```

### API Service Layer
```typescript
// src/services/adminApi.ts
import { apiService } from './api';

export const adminApi = {
  // Frameworks
  frameworks: {
    create: (data: FrameworkFormData) => 
      apiService.makeRequest('/frameworks', { method: 'POST', body: JSON.stringify(data) }),
    
    update: (id: string, data: Partial<FrameworkFormData>) =>
      apiService.makeRequest(`/frameworks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
    delete: (id: string) =>
      apiService.makeRequest(`/frameworks/${id}`, { method: 'DELETE' }),
    
    bulkDelete: (ids: string[]) =>
      apiService.makeRequest('/frameworks/bulk', { method: 'DELETE', body: JSON.stringify({ ids }) }),
    
    import: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiService.makeRequest('/frameworks/import', { 
        method: 'POST', 
        body: formData,
        headers: {} // Let browser set Content-Type with boundary
      });
    }
  },

  // Controls
  controls: {
    create: (data: ControlFormData) =>
      apiService.makeRequest('/controls', { method: 'POST', body: JSON.stringify(data) }),
    
    update: (id: string, data: Partial<ControlFormData>) =>
      apiService.makeRequest(`/controls/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
    delete: (id: string) =>
      apiService.makeRequest(`/controls/${id}`, { method: 'DELETE' }),
    
    bulkCreate: (controls: ControlFormData[]) =>
      apiService.makeRequest('/controls/bulk', { method: 'POST', body: JSON.stringify({ controls }) }),
    
    import: (file: File, frameworkId?: string) => {
      const formData = new FormData();
      formData.append('file', file);
      if (frameworkId) formData.append('frameworkId', frameworkId);
      return apiService.makeRequest('/controls/import', { method: 'POST', body: formData, headers: {} });
    }
  },

  // Tasks
  tasks: {
    create: (data: TaskFormData) =>
      apiService.makeRequest('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    
    update: (id: string, data: Partial<TaskFormData>) =>
      apiService.makeRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
    updateStatus: (id: string, status: string, progress?: number) =>
      apiService.makeRequest(`/tasks/${id}/status`, { 
        method: 'PATCH', 
        body: JSON.stringify({ status, progress }) 
      }),
    
    delete: (id: string) =>
      apiService.makeRequest(`/tasks/${id}`, { method: 'DELETE' }),
    
    bulkCreate: (tasks: TaskFormData[]) =>
      apiService.makeRequest('/tasks/bulk', { method: 'POST', body: JSON.stringify({ tasks }) }),
    
    import: (file: File, controlId?: string) => {
      const formData = new FormData();
      formData.append('file', file);
      if (controlId) formData.append('controlId', controlId);
      return apiService.makeRequest('/tasks/import', { method: 'POST', body: formData, headers: {} });
    }
  },

  // Templates
  downloadTemplate: (type: 'frameworks' | 'controls' | 'tasks') => {
    window.location.href = `/api/templates/${type}`;
  }
};
```

---

## Conclusion

This design document provides a comprehensive blueprint for building the Admin UI for framework, control, and task management. The implementation should follow Next.js best practices, maintain type safety with TypeScript, and ensure a smooth user experience for both manual entry and bulk import operations.

**Next Steps:**
1. Review and approve this design document
2. Create detailed wireframes/mockups if needed
3. Set up project structure and shared components
4. Begin Phase 1 implementation
5. Iterate based on user feedback


