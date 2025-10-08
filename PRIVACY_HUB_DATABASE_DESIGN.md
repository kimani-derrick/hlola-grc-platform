# Privacy Hub Database Design

## Overview
This document outlines the comprehensive database design for the Privacy Hub section of the Hlola GRC Platform. The Privacy Hub manages compliance frameworks, controls, evidence, audit readiness, and reporting across multiple African and international data protection regulations.

## Privacy Hub Features Analysis

Based on the current implementation, the Privacy Hub consists of 5 main sections:

### 1. Frameworks Management
- **Active Frameworks**: Track currently active compliance frameworks
- **Frameworks Library**: Browse available frameworks (Legal, Standards, Other)
- **Framework Details**: View framework-specific information, controls, and requirements
- **Country-specific Views**: Detailed views for each country's data protection laws
- **Framework Activation**: Add/remove frameworks from active list
- **Compliance Tracking**: Monitor progress across multiple frameworks

### 2. Controls Management
- **Control Tracking**: Monitor specific compliance tasks required by each framework
- **Status Management**: Track control status (completed, in-progress, not-started, needs-review)
- **Priority Management**: Assign and track control priorities (high, medium, low)
- **Assignment**: Assign controls to specific teams/individuals
- **Progress Tracking**: Monitor completion rates and estimated vs actual hours
- **Business Impact**: Track potential penalties and business benefits
- **Due Date Management**: Track deadlines and overdue items

### 3. Evidence & Documents Management
- **Document Repository**: Store and manage compliance evidence
- **Evidence Types**: Policy documents, procedures, screenshots, certificates, audit reports, training records, assessments
- **Version Control**: Track document versions and approval status
- **Framework Linking**: Link evidence to specific frameworks, controls, and tasks
- **Status Tracking**: Active, draft, under review, archived, expired
- **Search & Filtering**: Advanced filtering by framework, control, task, evidence type
- **Template Management**: Store and manage document templates

### 4. Audit Center
- **Audit Readiness**: Calculate and display overall audit readiness scores
- **Framework Packages**: Comprehensive audit packages for each framework
- **Gap Analysis**: Identify and track compliance gaps with severity levels
- **Evidence Repository**: Centralized evidence management for audits
- **Compliance Timeline**: Track audit history and upcoming deadlines
- **Report Generation**: Generate comprehensive audit reports
- **Regulator Metrics**: Dashboard for regulator confidence and compliance scores
- **Export Functionality**: Export audit packages in multiple formats

### 5. Reports & Analytics
- **Overview Dashboard**: High-level compliance metrics and trends
- **Framework Reports**: Detailed progress reports for each framework
- **Control Reports**: Comprehensive control implementation tracking
- **Task Reports**: Task completion and performance analytics
- **Team Performance**: Track team productivity and completion rates
- **AI Insights**: Automated recommendations and risk identification
- **Compliance Trends**: Historical compliance tracking and forecasting
- **Export & Sharing**: Generate and share compliance reports

## Database Schema Design

### Core Entities

#### 1. Organizations (Parent Company)
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    headquarters_country VARCHAR(100),
    headquarters_region VARCHAR(100),
    legal_structure VARCHAR(100), -- corporation, llc, partnership, etc.
    tax_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

#### 2. Entities (Branches/Subsidiaries/Offices)
```sql
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- branch, subsidiary, office, representative_office
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, pending_approval, closed
    address TEXT,
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    compliance_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    last_audit_date DATE,
    next_audit_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

#### 3. Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE SET NULL, -- NULL for org-level users
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- admin, compliance_manager, team_member, auditor, entity_manager
    department VARCHAR(100),
    job_title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

#### 3. Frameworks (Multi-Regional Support)
```sql
CREATE TABLE frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    region VARCHAR(100) NOT NULL, -- Africa, Europe, Asia, Americas, International, Global
    country VARCHAR(100), -- Specific country if applicable, NULL for international
    category VARCHAR(50) NOT NULL, -- Privacy, Security, Compliance, Risk, Financial, Healthcare
    type VARCHAR(50) NOT NULL, -- Legal, Standards, Industry, International
    icon VARCHAR(50),
    color VARCHAR(20),
    compliance_deadline DATE,
    priority VARCHAR(20) NOT NULL, -- high, medium, low
    risk_level VARCHAR(20) NOT NULL, -- low, medium, high, critical
    status VARCHAR(20) DEFAULT 'draft', -- active, draft, inactive, pending
    requirements_count INTEGER DEFAULT 0,
    applicable_countries TEXT[], -- Array of countries where this framework applies
    industry_scope VARCHAR(100), -- All, Financial, Healthcare, Technology, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Business Impact for frameworks
CREATE TABLE framework_business_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    penalty_amount VARCHAR(50),
    penalty_currency VARCHAR(10),
    business_benefits TEXT[],
    market_access TEXT[],
    competitive_advantages TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Entity Frameworks (Active Frameworks per Entity)
```sql
CREATE TABLE entity_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deactivated_at TIMESTAMP,
    compliance_score INTEGER DEFAULT 0,
    last_audit_date DATE,
    next_audit_date DATE,
    assigned_teams TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_id, framework_id)
);
```

#### 5. Controls
```sql
CREATE TABLE controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subtitle VARCHAR(255),
    article VARCHAR(100),
    detailed_description TEXT,
    requirements TEXT[],
    implementation_steps TEXT[],
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL, -- high, medium, low
    status VARCHAR(20) DEFAULT 'not-started', -- completed, in-progress, not-started, needs-review
    due_date DATE,
    estimated_hours INTEGER,
    business_impact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Control Assignments
```sql
CREATE TABLE control_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_team VARCHAR(100),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    completion_rate INTEGER DEFAULT 0,
    actual_hours INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'not-started',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Tasks
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in-progress, completed, overdue, blocked
    priority VARCHAR(20) NOT NULL, -- high, medium, low
    category VARCHAR(100),
    type VARCHAR(20) DEFAULT 'manual', -- manual, system, automated
    due_date DATE,
    completed_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0, -- 0-100 percentage
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_team VARCHAR(100),
    evidence_attached BOOLEAN DEFAULT false,
    blockers TEXT[],
    source VARCHAR(50) DEFAULT 'system', -- system, manual, imported
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7a. Task Comments & Activity
```sql
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    comment_type VARCHAR(20) DEFAULT 'comment', -- comment, update, status_change, assignment
    metadata JSONB, -- Additional data like old_status, new_status, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL, -- created, assigned, status_changed, completed, commented, evidence_uploaded
    description TEXT,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7b. Task Evidence
```sql
CREATE TABLE task_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL, -- screenshot, document, certificate, report, other
    description TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    review_notes TEXT
);
```

#### 8. Documents & Evidence
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- Privacy Policy, Procedure, Template, Form, Notice, Agreement, Report, Evidence
    status VARCHAR(20) DEFAULT 'draft', -- active, draft, review, archived, expired
    version VARCHAR(20) DEFAULT '1.0',
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approval_date DATE,
    expiry_date DATE,
    file_size VARCHAR(20),
    file_type VARCHAR(50),
    file_url TEXT,
    download_count INTEGER DEFAULT 0,
    is_template BOOLEAN DEFAULT false,
    is_evidence BOOLEAN DEFAULT false,
    evidence_type VARCHAR(50), -- policy, procedure, screenshot, certificate, audit-report, training-record, assessment, other
    uploaded_date DATE,
    tags TEXT[], -- Array of tags for categorization
    is_encrypted BOOLEAN DEFAULT true,
    access_level VARCHAR(20) DEFAULT 'internal', -- public, internal, confidential, restricted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8a. Document History & Versions
```sql
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(20),
    change_summary TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT false
);

CREATE TABLE document_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- created, uploaded, updated, approved, rejected, downloaded, shared, printed, archived, restored
    description TEXT,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    metadata JSONB, -- Additional data like file_size, version, etc.
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE document_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL, -- download, share, print, view, edit, comment
    activity_details JSONB, -- Additional details like share_recipients, print_settings, etc.
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8b. Document Comments & Reviews
```sql
CREATE TABLE document_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    comment_type VARCHAR(20) DEFAULT 'comment', -- comment, review, approval, rejection
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE document_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    review_status VARCHAR(20) NOT NULL, -- pending, approved, rejected, needs_changes
    review_notes TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium' -- high, medium, low
);
```

-- Link documents to frameworks, controls, and tasks
CREATE TABLE document_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    link_type VARCHAR(50) NOT NULL, -- evidence, reference, template
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. Audit Management
```sql
CREATE TABLE audit_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    compliance_score INTEGER DEFAULT 0,
    audit_readiness_score INTEGER DEFAULT 0,
    last_audit_date DATE,
    next_audit_date DATE,
    controls_implemented INTEGER DEFAULT 0,
    total_controls INTEGER DEFAULT 0,
    evidence_collected INTEGER DEFAULT 0,
    total_evidence INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    certification_status VARCHAR(20), -- certified, pending, expired, not-applicable
    certification_expiry DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_package_id UUID REFERENCES audit_packages(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- documentation, technical, procedural, evidence
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low
    title VARCHAR(255) NOT NULL,
    description TEXT,
    impact TEXT,
    remediation TEXT,
    estimated_effort VARCHAR(50),
    due_date DATE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'open', -- open, in-progress, resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evidence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_package_id UUID REFERENCES audit_packages(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending-review', -- approved, pending-review, rejected, outdated
    file_size VARCHAR(20),
    description TEXT,
    upload_date DATE,
    last_reviewed DATE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 10. Compliance History & Timeline
```sql
CREATE TABLE compliance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- achievement, audit, update, gap-closed, certification
    event_title VARCHAR(255) NOT NULL,
    description TEXT,
    compliance_score INTEGER,
    milestone VARCHAR(255),
    documents TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- audit, certification, milestone, gap-identified, gap-resolved
    status VARCHAR(20) NOT NULL, -- completed, in-progress, scheduled
    details TEXT,
    documents TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 11. Reports & Analytics
```sql
CREATE TABLE generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    report_title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- full-audit, framework-specific, executive-summary, gap-analysis
    generated_date DATE NOT NULL,
    frameworks TEXT[],
    page_count INTEGER,
    includes_evidence BOOLEAN DEFAULT false,
    format VARCHAR(20) NOT NULL, -- pdf, docx, excel
    confidence_level VARCHAR(20) NOT NULL, -- high, medium, low
    summary TEXT,
    file_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compliance_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- warning, success, info, critical
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recommendation TEXT,
    affected_items TEXT[],
    priority VARCHAR(20) NOT NULL, -- high, medium, low
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 12. Team Performance
```sql
CREATE TABLE team_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    assigned_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_completion_time DECIMAL(5,2) DEFAULT 0, -- in days
    overdue_items INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance

```sql
-- Framework indexes
CREATE INDEX idx_frameworks_region ON frameworks(region);
CREATE INDEX idx_frameworks_type ON frameworks(type);
CREATE INDEX idx_frameworks_status ON frameworks(status);

-- Control indexes
CREATE INDEX idx_controls_framework ON controls(framework_id);
CREATE INDEX idx_controls_status ON controls(status);
CREATE INDEX idx_controls_priority ON controls(priority);

-- Task indexes
CREATE INDEX idx_tasks_control ON tasks(control_id);
CREATE INDEX idx_tasks_entity ON tasks(entity_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Task comments and activity indexes
CREATE INDEX idx_task_comments_task ON task_comments(task_id);
CREATE INDEX idx_task_comments_user ON task_comments(user_id);
CREATE INDEX idx_task_activity_task ON task_activity(task_id);
CREATE INDEX idx_task_activity_user ON task_activity(user_id);
CREATE INDEX idx_task_activity_type ON task_activity(activity_type);

-- Task evidence indexes
CREATE INDEX idx_task_evidence_task ON task_evidence(task_id);
CREATE INDEX idx_task_evidence_document ON task_evidence(document_id);
CREATE INDEX idx_task_evidence_type ON task_evidence(evidence_type);

-- Document indexes
CREATE INDEX idx_documents_organization ON documents(organization_id);
CREATE INDEX idx_documents_entity ON documents(entity_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_evidence ON documents(is_evidence);
CREATE INDEX idx_documents_evidence_type ON documents(evidence_type);
CREATE INDEX idx_documents_author ON documents(author_id);
CREATE INDEX idx_documents_approver ON documents(approver_id);
CREATE INDEX idx_documents_file_type ON documents(file_type);
CREATE INDEX idx_documents_access_level ON documents(access_level);

-- Document history and versioning indexes
CREATE INDEX idx_document_versions_document ON document_versions(document_id);
CREATE INDEX idx_document_versions_current ON document_versions(is_current);
CREATE INDEX idx_document_history_document ON document_history(document_id);
CREATE INDEX idx_document_history_user ON document_history(user_id);
CREATE INDEX idx_document_history_action ON document_history(action);
CREATE INDEX idx_document_activities_document ON document_activities(document_id);
CREATE INDEX idx_document_activities_user ON document_activities(user_id);
CREATE INDEX idx_document_activities_type ON document_activities(activity_type);

-- Document comments and reviews indexes
CREATE INDEX idx_document_comments_document ON document_comments(document_id);
CREATE INDEX idx_document_comments_user ON document_comments(user_id);
CREATE INDEX idx_document_comments_type ON document_comments(comment_type);
CREATE INDEX idx_document_reviews_document ON document_reviews(document_id);
CREATE INDEX idx_document_reviews_reviewer ON document_reviews(reviewer_id);
CREATE INDEX idx_document_reviews_status ON document_reviews(review_status);

-- Audit indexes
CREATE INDEX idx_audit_packages_organization ON audit_packages(organization_id);
CREATE INDEX idx_audit_gaps_severity ON audit_gaps(severity);
CREATE INDEX idx_audit_gaps_status ON audit_gaps(status);

-- Entity indexes
CREATE INDEX idx_entities_organization ON entities(organization_id);
CREATE INDEX idx_entities_country ON entities(country);
CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_entities_status ON entities(status);

-- Framework region and type indexes
CREATE INDEX idx_frameworks_region ON frameworks(region);
CREATE INDEX idx_frameworks_country ON frameworks(country);
CREATE INDEX idx_frameworks_type ON frameworks(type);
CREATE INDEX idx_frameworks_category ON frameworks(category);
CREATE INDEX idx_frameworks_industry_scope ON frameworks(industry_scope);

-- Entity-specific indexes
CREATE INDEX idx_entity_frameworks_entity ON entity_frameworks(entity_id);
CREATE INDEX idx_control_assignments_entity ON control_assignments(entity_id);
CREATE INDEX idx_documents_entity ON documents(entity_id);
CREATE INDEX idx_audit_packages_entity ON audit_packages(entity_id);
CREATE INDEX idx_compliance_history_entity ON compliance_history(entity_id);
CREATE INDEX idx_audit_timeline_entity ON audit_timeline(entity_id);
CREATE INDEX idx_generated_reports_entity ON generated_reports(entity_id);
CREATE INDEX idx_compliance_insights_entity ON compliance_insights(entity_id);
CREATE INDEX idx_team_performance_entity ON team_performance(entity_id);

-- Performance indexes
CREATE INDEX idx_control_assignments_organization ON control_assignments(organization_id);
CREATE INDEX idx_document_links_document ON document_links(document_id);
CREATE INDEX idx_compliance_history_organization ON compliance_history(organization_id);
```

### Views for Common Queries

```sql
-- Active frameworks view
CREATE VIEW active_frameworks AS
SELECT 
    f.*,
    of.compliance_score,
    of.last_audit_date,
    of.next_audit_date
FROM frameworks f
JOIN organization_frameworks of ON f.id = of.framework_id
WHERE of.is_active = true;

-- Control progress view
CREATE VIEW control_progress AS
SELECT 
    c.*,
    f.name as framework_name,
    f.icon as framework_icon,
    ca.completion_rate,
    ca.actual_hours,
    ca.status as assignment_status,
    u.first_name || ' ' || u.last_name as assignee_name
FROM controls c
JOIN frameworks f ON c.framework_id = f.id
LEFT JOIN control_assignments ca ON c.id = ca.control_id
LEFT JOIN users u ON ca.assigned_to = u.id;

-- Evidence summary view
CREATE VIEW evidence_summary AS
SELECT 
    d.*,
    e.name as entity_name,
    e.country as entity_country,
    f.name as framework_name,
    c.title as control_title,
    t.title as task_title
FROM documents d
LEFT JOIN entities e ON d.entity_id = e.id
LEFT JOIN document_links dl ON d.id = dl.document_id
LEFT JOIN frameworks f ON dl.framework_id = f.id
LEFT JOIN controls c ON dl.control_id = c.id
LEFT JOIN tasks t ON dl.task_id = t.id
WHERE d.is_evidence = true;

-- Entity compliance overview
CREATE VIEW entity_compliance_overview AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    e.country,
    e.type as entity_type,
    e.compliance_score,
    e.risk_level,
    COUNT(ef.framework_id) as active_frameworks,
    COUNT(ca.control_id) as assigned_controls,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) as completed_controls,
    COUNT(d.id) as evidence_documents,
    e.last_audit_date,
    e.next_audit_date
FROM entities e
LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id AND ef.is_active = true
LEFT JOIN control_assignments ca ON e.id = ca.entity_id
LEFT JOIN documents d ON e.id = d.entity_id AND d.is_evidence = true
GROUP BY e.id, e.name, e.country, e.type, e.compliance_score, e.risk_level, e.last_audit_date, e.next_audit_date;

-- Cross-entity compliance comparison
CREATE VIEW cross_entity_compliance AS
SELECT 
    o.name as organization_name,
    e.country,
    e.name as entity_name,
    f.name as framework_name,
    ef.compliance_score,
    ef.last_audit_date,
    COUNT(ca.control_id) as total_controls,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) as completed_controls,
    ROUND(
        COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(ca.control_id), 0), 2
    ) as control_completion_rate
FROM organizations o
JOIN entities e ON o.id = e.organization_id
JOIN entity_frameworks ef ON e.id = ef.entity_id
JOIN frameworks f ON ef.framework_id = f.id
LEFT JOIN control_assignments ca ON e.id = ca.entity_id
WHERE ef.is_active = true
GROUP BY o.name, e.country, e.name, f.name, ef.compliance_score, ef.last_audit_date;

-- Task management views
CREATE VIEW task_details_with_progress AS
SELECT 
    t.*,
    c.title as control_title,
    c.framework_id,
    f.name as framework_name,
    f.region as framework_region,
    u.first_name || ' ' || u.last_name as assignee_name,
    u.email as assignee_email,
    COUNT(tc.id) as comment_count,
    COUNT(te.id) as evidence_count,
    MAX(tc.created_at) as last_comment_date,
    MAX(ta.created_at) as last_activity_date
FROM tasks t
JOIN controls c ON t.control_id = c.id
JOIN frameworks f ON c.framework_id = f.id
LEFT JOIN users u ON t.assignee_id = u.id
LEFT JOIN task_comments tc ON t.id = tc.task_id
LEFT JOIN task_evidence te ON t.id = te.task_id
LEFT JOIN task_activity ta ON t.id = ta.task_id
GROUP BY t.id, c.title, c.framework_id, f.name, f.region, u.first_name, u.last_name, u.email;

-- Task activity timeline
CREATE VIEW task_activity_timeline AS
SELECT 
    ta.*,
    t.title as task_title,
    c.title as control_title,
    f.name as framework_name,
    u.first_name || ' ' || u.last_name as user_name
FROM task_activity ta
JOIN tasks t ON ta.task_id = t.id
JOIN controls c ON t.control_id = c.id
JOIN frameworks f ON c.framework_id = f.id
LEFT JOIN users u ON ta.user_id = u.id
ORDER BY ta.created_at DESC;

-- Document details with full information
CREATE VIEW document_details_full AS
SELECT 
    d.*,
    o.name as organization_name,
    e.name as entity_name,
    e.country as entity_country,
    u.first_name || ' ' || u.last_name as author_name,
    u.email as author_email,
    approver.first_name || ' ' || approver.last_name as approver_name,
    approver.email as approver_email,
    COUNT(dv.id) as version_count,
    COUNT(dh.id) as history_count,
    COUNT(dc.id) as comment_count,
    MAX(dh.created_at) as last_activity_date
FROM documents d
LEFT JOIN organizations o ON d.organization_id = o.id
LEFT JOIN entities e ON d.entity_id = e.id
LEFT JOIN users u ON d.author_id = u.id
LEFT JOIN users approver ON d.approver_id = approver.id
LEFT JOIN document_versions dv ON d.id = dv.document_id
LEFT JOIN document_history dh ON d.id = dh.document_id
LEFT JOIN document_comments dc ON d.id = dc.document_id
GROUP BY d.id, o.name, e.name, e.country, u.first_name, u.last_name, u.email, approver.first_name, approver.last_name, approver.email;

-- Document history timeline
CREATE VIEW document_history_timeline AS
SELECT 
    dh.*,
    d.title as document_title,
    d.category as document_category,
    u.first_name || ' ' || u.last_name as user_name,
    u.email as user_email
FROM document_history dh
JOIN documents d ON dh.document_id = d.id
LEFT JOIN users u ON dh.user_id = u.id
ORDER BY dh.created_at DESC;

-- Document activity summary
CREATE VIEW document_activity_summary AS
SELECT 
    d.id as document_id,
    d.title as document_title,
    COUNT(da.id) as total_activities,
    COUNT(CASE WHEN da.activity_type = 'download' THEN 1 END) as download_count,
    COUNT(CASE WHEN da.activity_type = 'view' THEN 1 END) as view_count,
    COUNT(CASE WHEN da.activity_type = 'share' THEN 1 END) as share_count,
    COUNT(CASE WHEN da.activity_type = 'print' THEN 1 END) as print_count,
    MAX(da.created_at) as last_activity_date
FROM documents d
LEFT JOIN document_activities da ON d.id = da.document_id
GROUP BY d.id, d.title;

-- Dashboard stats views
CREATE VIEW dashboard_stats AS
SELECT 
    -- Framework stats
    COUNT(DISTINCT ef.framework_id) as active_frameworks,
    COUNT(DISTINCT f.id) as total_frameworks,
    ROUND(AVG(ef.compliance_score), 2) as overall_compliance,
    
    -- Control stats
    COUNT(DISTINCT ca.control_id) as total_controls,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) as completed_controls,
    COUNT(CASE WHEN ca.status = 'in-progress' THEN 1 END) as in_progress_controls,
    COUNT(CASE WHEN ca.status = 'not-started' THEN 1 END) as not_started_controls,
    ROUND(
        COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(DISTINCT ca.control_id), 0), 2
    ) as controls_completion_rate,
    
    -- Task stats
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'in-progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN t.status = 'overdue' THEN 1 END) as overdue_tasks,
    ROUND(
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(DISTINCT t.id), 0), 2
    ) as tasks_completion_rate,
    
    -- Document stats
    COUNT(DISTINCT d.id) as total_documents,
    COUNT(CASE WHEN d.is_evidence = true THEN 1 END) as evidence_documents,
    COUNT(CASE WHEN d.status = 'active' THEN 1 END) as active_documents,
    COUNT(CASE WHEN d.status = 'draft' THEN 1 END) as draft_documents,
    COUNT(CASE WHEN d.is_template = true THEN 1 END) as template_documents,
    
    -- Entity stats
    COUNT(DISTINCT e.id) as total_entities,
    COUNT(DISTINCT e.country) as countries_covered,
    COUNT(CASE WHEN e.risk_level = 'high' OR e.risk_level = 'critical' THEN 1 END) as high_risk_entities,
    
    -- Audit stats
    COUNT(DISTINCT ap.id) as audit_packages,
    COUNT(CASE WHEN ag.status = 'open' THEN 1 END) as open_gaps,
    COUNT(CASE WHEN ag.severity = 'critical' THEN 1 END) as critical_gaps,
    COUNT(CASE WHEN ag.severity = 'high' THEN 1 END) as high_gaps,
    
    -- Team performance
    COUNT(DISTINCT tp.id) as team_performance_records,
    ROUND(AVG(tp.completion_rate), 2) as avg_team_completion_rate,
    ROUND(AVG(tp.average_completion_time), 2) as avg_completion_time_days
FROM entities e
LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id AND ef.is_active = true
LEFT JOIN frameworks f ON ef.framework_id = f.id
LEFT JOIN control_assignments ca ON e.id = ca.entity_id
LEFT JOIN tasks t ON ca.control_id = t.control_id
LEFT JOIN documents d ON e.id = d.entity_id
LEFT JOIN audit_packages ap ON e.id = ap.entity_id
LEFT JOIN audit_gaps ag ON ap.id = ag.audit_package_id
LEFT JOIN team_performance tp ON e.id = tp.entity_id;

-- Entity-specific stats
CREATE VIEW entity_stats AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    e.country,
    e.type as entity_type,
    e.compliance_score,
    e.risk_level,
    
    -- Framework stats for this entity
    COUNT(DISTINCT ef.framework_id) as active_frameworks,
    ROUND(AVG(ef.compliance_score), 2) as avg_framework_compliance,
    
    -- Control stats for this entity
    COUNT(DISTINCT ca.control_id) as total_controls,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) as completed_controls,
    COUNT(CASE WHEN ca.status = 'in-progress' THEN 1 END) as in_progress_controls,
    ROUND(
        COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(DISTINCT ca.control_id), 0), 2
    ) as controls_completion_rate,
    
    -- Task stats for this entity
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'overdue' THEN 1 END) as overdue_tasks,
    
    -- Document stats for this entity
    COUNT(DISTINCT d.id) as total_documents,
    COUNT(CASE WHEN d.is_evidence = true THEN 1 END) as evidence_documents,
    COUNT(CASE WHEN d.status = 'active' THEN 1 END) as active_documents,
    
    -- Audit stats for this entity
    COUNT(DISTINCT ap.id) as audit_packages,
    COUNT(CASE WHEN ag.status = 'open' THEN 1 END) as open_gaps,
    ROUND(AVG(ap.audit_readiness_score), 2) as avg_audit_readiness
FROM entities e
LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id AND ef.is_active = true
LEFT JOIN control_assignments ca ON e.id = ca.entity_id
LEFT JOIN tasks t ON ca.control_id = t.control_id
LEFT JOIN documents d ON e.id = d.entity_id
LEFT JOIN audit_packages ap ON e.id = ap.entity_id
LEFT JOIN audit_gaps ag ON ap.id = ag.audit_package_id
GROUP BY e.id, e.name, e.country, e.type, e.compliance_score, e.risk_level;

-- Filter options views
CREATE VIEW filter_options AS
SELECT 
    'frameworks' as filter_type,
    f.id as value,
    f.name as label,
    f.region as category,
    f.type as subcategory
FROM frameworks f
WHERE f.is_active = true

UNION ALL

SELECT 
    'controls' as filter_type,
    c.id as value,
    c.title as label,
    f.name as category,
    c.category as subcategory
FROM controls c
JOIN frameworks f ON c.framework_id = f.id
WHERE f.is_active = true

UNION ALL

SELECT 
    'tasks' as filter_type,
    t.id as value,
    t.title as label,
    c.title as category,
    t.category as subcategory
FROM tasks t
JOIN controls c ON t.control_id = c.id
JOIN frameworks f ON c.framework_id = f.id
WHERE f.is_active = true

UNION ALL

SELECT 
    'document_categories' as filter_type,
    category as value,
    category as label,
    'Document Type' as category,
    NULL as subcategory
FROM (
    SELECT DISTINCT category FROM documents
) d

UNION ALL

SELECT 
    'document_status' as filter_type,
    status as value,
    status as label,
    'Document Status' as category,
    NULL as subcategory
FROM (
    SELECT DISTINCT status FROM documents
) d

UNION ALL

SELECT 
    'evidence_types' as filter_type,
    evidence_type as value,
    evidence_type as label,
    'Evidence Type' as category,
    NULL as subcategory
FROM (
    SELECT DISTINCT evidence_type FROM documents WHERE evidence_type IS NOT NULL
) d

UNION ALL

SELECT 
    'countries' as filter_type,
    country as value,
    country as label,
    'Country' as category,
    NULL as subcategory
FROM (
    SELECT DISTINCT country FROM entities
) e

UNION ALL

SELECT 
    'priorities' as filter_type,
    priority as value,
    priority as label,
    'Priority' as category,
    NULL as subcategory
FROM (
    SELECT DISTINCT priority FROM controls
    UNION
    SELECT DISTINCT priority FROM tasks
) p;
```

## Multi-Entity, Multi-Country Architecture

### Entity Structure
The system supports organizations with multiple entities (branches, subsidiaries, offices) across different countries:

- **Organization**: Parent company (e.g., "Hlola Global Ltd")
- **Entities**: Country-specific operations (e.g., "Nairobi Branch", "Lagos Office", "Cape Town Subsidiary")
- **Frameworks**: Country-specific compliance requirements (e.g., Kenya DPA, Nigeria NDPA, South Africa POPIA)

### Entity Selection & Context
- Users can switch between entities via the entity selection dropdown
- Each entity has its own compliance tracking and framework activation
- Entity-specific data isolation while maintaining organizational oversight
- Cross-entity reporting and analytics capabilities

### Multi-Regional Compliance Support
The database design supports frameworks from any region worldwide:

#### **African Frameworks** (Current Focus)
- Kenya Data Protection Act 2019
- Nigeria Data Protection Act 2023
- South Africa POPIA
- Ghana Data Protection Act 2012
- And 30+ other African countries

#### **International Frameworks** (Already Supported)
- **European Union**: GDPR (General Data Protection Regulation)
- **United States**: CCPA, HIPAA, SOX, PCI-DSS
- **International Standards**: ISO 27001, ISO 27701, SOC 2
- **Asia-Pacific**: Various country-specific regulations
- **Global**: Industry-specific frameworks

#### **Framework Flexibility**
- **Region Field**: Supports any geographic region (Africa, Europe, Asia, Americas, International)
- **Type Classification**: Legal, Standards, Industry-specific, International
- **Country-Specific**: Each framework can be linked to specific countries
- **Cross-Border**: Frameworks can apply to multiple countries/regions
- **Entity Activation**: Any framework can be activated for any entity regardless of region

### Country-Specific Compliance
- Each entity operates under its country's data protection laws
- Frameworks are activated per entity, not per organization
- Controls and tasks are tracked at the entity level
- Evidence and documents are linked to specific entities
- Audit packages are generated per entity-framework combination
- **Multi-Jurisdictional**: Entities can comply with multiple frameworks simultaneously

## Data Relationships

### Primary Relationships
1. **Organizations** → **Entities** (One-to-Many)
2. **Organizations** → **Users** (One-to-Many, org-level users)
3. **Entities** → **Users** (One-to-Many, entity-specific users)
4. **Entities** → **Frameworks** (Many-to-Many via entity_frameworks)
5. **Frameworks** → **Controls** (One-to-Many)
6. **Controls** → **Tasks** (One-to-Many)
7. **Tasks** → **Task Comments** (One-to-Many)
8. **Tasks** → **Task Activity** (One-to-Many)
9. **Tasks** → **Task Evidence** (One-to-Many)
10. **Users** → **Control Assignments** (One-to-Many)
11. **Users** → **Tasks** (One-to-Many via assignee_id)
12. **Controls** → **Documents** (Many-to-Many via document_links)
13. **Entities** → **Audit Packages** (One-to-Many)
14. **Entities** → **Compliance History** (One-to-Many)

### International Framework Examples

The database design supports frameworks from any region. Here are examples of how different international frameworks would be stored:

#### **European Frameworks**
```sql
-- GDPR (General Data Protection Regulation)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'GDPR', 
    'Europe', 
    NULL, -- Applies to all EU countries
    'Privacy', 
    'Legal', 
    ARRAY['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Poland', 'Romania', 'Belgium', 'Greece', 'Czech Republic', 'Portugal', 'Sweden', 'Hungary', 'Austria', 'Belarus', 'Switzerland', 'Bulgaria', 'Serbia', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland', 'Croatia', 'Bosnia and Herzegovina', 'Albania', 'Lithuania', 'Slovenia', 'Latvia', 'Estonia', 'North Macedonia', 'Moldova', 'Luxembourg', 'Malta', 'Iceland', 'Montenegro', 'Cyprus', 'Liechtenstein', 'Andorra', 'Monaco', 'San Marino', 'Vatican City'],
    'All'
);

-- UK GDPR (Post-Brexit)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'UK GDPR', 
    'Europe', 
    'United Kingdom', 
    'Privacy', 
    'Legal', 
    ARRAY['United Kingdom'],
    'All'
);
```

#### **American Frameworks**
```sql
-- CCPA (California Consumer Privacy Act)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'CCPA', 
    'Americas', 
    'United States', 
    'Privacy', 
    'Legal', 
    ARRAY['United States'],
    'All'
);

-- HIPAA (Health Insurance Portability and Accountability Act)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'HIPAA', 
    'Americas', 
    'United States', 
    'Privacy', 
    'Legal', 
    ARRAY['United States'],
    'Healthcare'
);
```

#### **International Standards**
```sql
-- ISO 27001 (Information Security Management)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'ISO 27001', 
    'International', 
    NULL, 
    'Security', 
    'Standards', 
    ARRAY[], -- Applies globally
    'All'
);

-- ISO 27701 (Privacy Information Management)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'ISO 27701', 
    'International', 
    NULL, 
    'Privacy', 
    'Standards', 
    ARRAY[], -- Applies globally
    'All'
);
```

#### **Asian Frameworks**
```sql
-- Personal Data Protection Act (Singapore)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'PDPA Singapore', 
    'Asia', 
    'Singapore', 
    'Privacy', 
    'Legal', 
    ARRAY['Singapore'],
    'All'
);

-- Personal Information Protection Law (China)
INSERT INTO frameworks (name, region, country, category, type, applicable_countries, industry_scope) 
VALUES (
    'PIPL China', 
    'Asia', 
    'China', 
    'Privacy', 
    'Legal', 
    ARRAY['China'],
    'All'
);
```

### Key Constraints
- Each organization can have multiple entities across different countries
- Each entity can have multiple active frameworks (any region/country)
- Each framework can have multiple controls
- Each control can have multiple tasks
- Documents can be linked to multiple frameworks, controls, and tasks
- Users can be assigned to multiple controls and tasks
- Audit packages are entity-specific and framework-specific
- Entity-level data isolation with organizational oversight
- Cross-entity reporting and analytics capabilities
- **Multi-Jurisdictional Compliance**: Entities can comply with frameworks from any region simultaneously

## Data Migration Strategy

### Phase 1: Core Entities
1. Organizations and Users
2. Frameworks and Framework Types
3. Basic Control Structure

### Phase 2: Compliance Tracking
1. Control Assignments
2. Task Management
3. Document Management

### Phase 3: Audit & Reporting
1. Audit Packages
2. Gap Analysis
3. Compliance History
4. Report Generation

### Phase 4: Analytics & Insights
1. Team Performance Tracking
2. AI Insights
3. Advanced Analytics

## Security Considerations

### Data Access Control
- Row-level security based on organization_id and entity_id
- Role-based access control (RBAC) with entity-specific permissions
- Entity-level data isolation with organizational oversight
- Cross-entity access controls for compliance managers and auditors
- Audit logging for all data modifications with entity context

### Data Privacy
- Encryption at rest for sensitive data
- Secure file storage for documents
- Data retention policies
- GDPR compliance for user data

### Backup & Recovery
- Daily automated backups
- Point-in-time recovery
- Cross-region replication for disaster recovery

## Performance Optimization

### Query Optimization
- Proper indexing strategy
- Materialized views for complex reports
- Query result caching
- Pagination for large datasets

### Scalability
- Horizontal scaling with read replicas
- Partitioning for large tables
- Archive old data to cold storage
- CDN for document delivery

## Monitoring & Maintenance

### Database Monitoring
- Query performance monitoring
- Index usage analysis
- Storage utilization tracking
- Connection pool monitoring

### Data Quality
- Regular data validation
- Automated data cleanup
- Duplicate detection and removal
- Data consistency checks

## Filters and Cards Information Support

The database design fully supports all the filters and stats cards displayed throughout the Privacy Hub UI:

### **Stats Cards Support**

#### **1. Documents Page Stats Cards**
- **Total Evidence**: Count of evidence documents (`documents.is_evidence = true`)
- **Active Documents**: Count of active status documents (`documents.status = 'active'`)
- **Draft Documents**: Count of draft status documents (`documents.status = 'draft'`)
- **Review Documents**: Count of review status documents (`documents.status = 'review'`)
- **Templates**: Count of template documents (`documents.is_template = true`)
- **Total Documents**: Count of all documents

#### **2. Reports Page Stats Cards**
- **Active Frameworks**: Count of active frameworks with compliance < 100%
- **Total Frameworks**: Count of all frameworks
- **Overall Compliance**: Average compliance score across all frameworks
- **Tasks Progress**: Completed vs total tasks with overdue count
- **Evidence Collected**: Evidence documents collected vs total required
- **High Risk Items**: Count of high/critical risk frameworks
- **Upcoming Deadlines**: Count of frameworks with deadlines within 90 days

#### **3. Controls Page Stats Cards**
- **Completed Tasks**: Count of completed controls
- **In Progress**: Count of in-progress controls
- **Overall Progress**: Percentage of completed controls
- **Countries Covered**: Count of unique countries with controls

#### **4. Audit Center Stats Cards**
- **Audit Readiness Score**: Average audit readiness across packages
- **Open Gaps**: Count of open audit gaps
- **Critical Gaps**: Count of critical severity gaps
- **High Gaps**: Count of high severity gaps
- **Evidence Collected**: Count of evidence items collected

### **Filter Support**

#### **1. Document Filters**
- **Search Query**: Full-text search across title, description, tags, author, framework, control, task
- **Category Filter**: Document categories (Privacy Policy, Procedure, Template, Form, Notice, Agreement, Report, Evidence)
- **Status Filter**: Document status (active, draft, review, archived, expired)
- **Framework Filter**: Filter by associated frameworks
- **Control Filter**: Filter by associated controls
- **Task Filter**: Filter by associated tasks
- **Evidence Type Filter**: Filter by evidence types (policy, procedure, screenshot, certificate, etc.)
- **Evidence Only Toggle**: Show only evidence documents
- **View Mode**: Grid or list view

#### **2. Report Filters**
- **Framework Filter**: Filter by specific frameworks
- **Status Filter**: Filter by compliance status
- **Priority Filter**: Filter by priority levels (high, medium, low)
- **Category Filter**: Filter by control/task categories
- **Date Range Filter**: Filter by time periods (all, last 7 days, last 30 days, last 90 days, last year)
- **Search Query**: Full-text search across titles and descriptions

#### **3. Control Filters**
- **Search Query**: Full-text search across control titles, descriptions, and codes
- **Status Filter**: Control status (completed, in-progress, not-started, needs-review)
- **Priority Filter**: Priority levels (high, medium, low)
- **Country Filter**: Filter by country/region
- **Framework Filter**: Filter by associated frameworks

#### **4. Audit Filters**
- **Region Filter**: Filter by geographic regions
- **Framework Filter**: Filter by specific frameworks
- **Gap Severity Filter**: Filter by gap severity (critical, high, medium, low)
- **Evidence Status Filter**: Filter by evidence status (approved, pending-review, rejected, outdated)
- **Search Query**: Full-text search across gap titles and descriptions

### **Database Queries for Stats Cards**

#### **1. Document Stats Query**
```sql
-- Get document statistics for cards
SELECT 
    COUNT(*) as total_documents,
    COUNT(CASE WHEN is_evidence = true THEN 1 END) as evidence_documents,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_documents,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_documents,
    COUNT(CASE WHEN status = 'review' THEN 1 END) as review_documents,
    COUNT(CASE WHEN is_template = true THEN 1 END) as template_documents
FROM documents 
WHERE entity_id = ?;
```

#### **2. Framework Stats Query**
```sql
-- Get framework statistics for reports
SELECT 
    COUNT(DISTINCT ef.framework_id) as active_frameworks,
    COUNT(DISTINCT f.id) as total_frameworks,
    ROUND(AVG(ef.compliance_score), 2) as overall_compliance,
    COUNT(CASE WHEN ef.compliance_score < 100 THEN 1 END) as incomplete_frameworks
FROM entity_frameworks ef
JOIN frameworks f ON ef.framework_id = f.id
WHERE ef.entity_id = ? AND ef.is_active = true;
```

#### **3. Control Stats Query**
```sql
-- Get control statistics for controls page
SELECT 
    COUNT(*) as total_controls,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) as completed_controls,
    COUNT(CASE WHEN ca.status = 'in-progress' THEN 1 END) as in_progress_controls,
    ROUND(
        COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(*), 0), 2
    ) as overall_progress,
    COUNT(DISTINCT e.country) as countries_covered
FROM control_assignments ca
JOIN entities e ON ca.entity_id = e.id
WHERE ca.entity_id = ?;
```

#### **4. Task Stats Query**
```sql
-- Get task statistics for reports
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_tasks,
    ROUND(
        COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(*), 0), 2
    ) as completion_rate
FROM tasks t
JOIN control_assignments ca ON t.control_id = ca.control_id
WHERE ca.entity_id = ?;
```

### **Filter Options Queries**

#### **1. Get Filter Options**
```sql
-- Get all available filter options
SELECT * FROM filter_options 
WHERE filter_type = ? 
ORDER BY category, label;
```

#### **2. Dynamic Filter Options**
```sql
-- Get frameworks for framework filter
SELECT DISTINCT f.id, f.name, f.region, f.type
FROM frameworks f
JOIN entity_frameworks ef ON f.id = ef.framework_id
WHERE ef.entity_id = ? AND ef.is_active = true
ORDER BY f.name;

-- Get controls for control filter (filtered by framework)
SELECT DISTINCT c.id, c.title, c.category, f.name as framework_name
FROM controls c
JOIN frameworks f ON c.framework_id = f.id
JOIN entity_frameworks ef ON f.id = ef.framework_id
WHERE ef.entity_id = ? AND ef.is_active = true
AND (? IS NULL OR f.id = ?)
ORDER BY c.title;

-- Get tasks for task filter (filtered by framework and control)
SELECT DISTINCT t.id, t.title, t.category, c.title as control_title
FROM tasks t
JOIN controls c ON t.control_id = c.id
JOIN frameworks f ON c.framework_id = f.id
JOIN entity_frameworks ef ON f.id = ef.framework_id
WHERE ef.entity_id = ? AND ef.is_active = true
AND (? IS NULL OR f.id = ?)
AND (? IS NULL OR c.id = ?)
ORDER BY t.title;
```

### **UI Functionality Mapping**

| **UI Component** | **Database Support** | **Status** |
|------------------|---------------------|------------|
| Document Stats Cards | `dashboard_stats` view | ✅ Complete |
| Report Stats Cards | `dashboard_stats` view | ✅ Complete |
| Control Stats Cards | `entity_stats` view | ✅ Complete |
| Audit Stats Cards | `audit_packages` + `audit_gaps` | ✅ Complete |
| Document Filters | `filter_options` view + `documents` | ✅ Complete |
| Report Filters | `filter_options` view + aggregated data | ✅ Complete |
| Control Filters | `filter_options` view + `controls` | ✅ Complete |
| Audit Filters | `filter_options` view + `audit_gaps` | ✅ Complete |
| Search Functionality | Full-text search across multiple tables | ✅ Complete |
| Dynamic Filtering | Cascading filters with proper relationships | ✅ Complete |
| Real-time Stats | Views with proper indexing for performance | ✅ Complete |

## Document Popup Functionality Support

The database design fully supports the document popup functionality observed in the Evidence & Documents page:

### **Document Detail Modal Features**
When clicking on a document, the popup shows three main tabs:

#### **1. Preview Tab**
- **Document Preview**: PDF, DOCX, XLSX, and other file type previews
- **File Information**: File type, size, and preview content
- **Security Notice**: Encryption and secure storage indicators

#### **2. Details Tab**
- **Document Information**: Title, description, category, version, status
- **File Details**: File type, size, download count, author, approver
- **Evidence Linkage**: Framework, control, and task associations (for evidence documents)
- **Tags**: Categorization tags for easy searching
- **Approval Status**: Approver information and approval date
- **Document Actions**: Download, Share, Print buttons
- **Metadata**: Upload date, last modified, expiry date

#### **3. History Tab**
- **Document Timeline**: Complete history of document lifecycle
- **Version History**: All document versions with change summaries
- **Activity Log**: Download, share, print, and other activities
- **Approval History**: Approval and rejection events
- **User Actions**: Who did what and when

### **Database Support for Document Popup**

#### **1. Document Data Retrieval**
```sql
-- Get complete document details for popup
SELECT 
    d.*,
    o.name as organization_name,
    e.name as entity_name,
    f.name as framework_name,
    c.title as control_title,
    t.title as task_title,
    u.first_name || ' ' || u.last_name as author_name,
    approver.first_name || ' ' || approver.last_name as approver_name
FROM documents d
LEFT JOIN organizations o ON d.organization_id = o.id
LEFT JOIN entities e ON d.entity_id = e.id
LEFT JOIN document_links dl ON d.id = dl.document_id
LEFT JOIN frameworks f ON dl.framework_id = f.id
LEFT JOIN controls c ON dl.control_id = c.id
LEFT JOIN tasks t ON dl.task_id = t.id
LEFT JOIN users u ON d.author_id = u.id
LEFT JOIN users approver ON d.approver_id = approver.id
WHERE d.id = ?;
```

#### **2. Document History Timeline**
```sql
-- Get document history for history tab
SELECT 
    dh.*,
    u.first_name || ' ' || u.last_name as user_name,
    u.email as user_email
FROM document_history dh
LEFT JOIN users u ON dh.user_id = u.id
WHERE dh.document_id = ?
ORDER BY dh.created_at DESC;
```

#### **3. Document Versions**
```sql
-- Get all versions of a document
SELECT 
    dv.*,
    u.first_name || ' ' || u.last_name as created_by_name
FROM document_versions dv
LEFT JOIN users u ON dv.created_by = u.id
WHERE dv.document_id = ?
ORDER BY dv.created_at DESC;
```

#### **4. Document Activities**
```sql
-- Get document activities (downloads, shares, prints)
SELECT 
    da.*,
    u.first_name || ' ' || u.last_name as user_name
FROM document_activities da
LEFT JOIN users u ON da.user_id = u.id
WHERE da.document_id = ?
ORDER BY da.created_at DESC;
```

#### **5. Document Comments & Reviews**
```sql
-- Get document comments and reviews
SELECT 
    dc.*,
    u.first_name || ' ' || u.last_name as user_name,
    resolver.first_name || ' ' || resolver.last_name as resolver_name
FROM document_comments dc
LEFT JOIN users u ON dc.user_id = u.id
LEFT JOIN users resolver ON dc.resolved_by = resolver.id
WHERE dc.document_id = ?
ORDER BY dc.created_at DESC;
```

### **Document Actions Support**

#### **Download Tracking**
```sql
-- Log document download
INSERT INTO document_activities (document_id, user_id, activity_type, activity_details, ip_address, user_agent)
VALUES (?, ?, 'download', '{"file_size": ?, "version": ?}', ?, ?);

-- Update download count
UPDATE documents 
SET download_count = download_count + 1, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

#### **Share Tracking**
```sql
-- Log document share
INSERT INTO document_activities (document_id, user_id, activity_type, activity_details, ip_address, user_agent)
VALUES (?, ?, 'share', '{"share_method": ?, "recipients": ?}', ?, ?);
```

#### **Print Tracking**
```sql
-- Log document print
INSERT INTO document_activities (document_id, user_id, activity_type, activity_details, ip_address, user_agent)
VALUES (?, ?, 'print', '{"print_settings": ?}', ?, ?);
```

### **UI Functionality Mapping**

| **UI Feature** | **Database Table** | **Support** |
|----------------|-------------------|-------------|
| Document Preview | `documents` + `document_versions` | ✅ Complete |
| Document Details | `documents` + `document_details_full` view | ✅ Complete |
| Evidence Linkage | `document_links` | ✅ Complete |
| Document History | `document_history` + `document_history_timeline` view | ✅ Complete |
| Version History | `document_versions` | ✅ Complete |
| Activity Tracking | `document_activities` | ✅ Complete |
| Download Tracking | `document_activities` + `documents.download_count` | ✅ Complete |
| Share Tracking | `document_activities` | ✅ Complete |
| Print Tracking | `document_activities` | ✅ Complete |
| Comments & Reviews | `document_comments` + `document_reviews` | ✅ Complete |
| Approval Workflow | `documents` + `document_history` | ✅ Complete |
| Tags & Categories | `documents.tags` + `documents.category` | ✅ Complete |

## Control Popup Functionality Support

The database design fully supports the control popup functionality observed in the UI:

### **Control Detail Modal Features**
When clicking on a control, the popup shows:
- **Control Information**: Title, description, status, priority, completion rate
- **Task List**: All tasks associated with the control
- **Task Actions**: View Details, Mark In Progress, Mark Complete, Delegate Task
- **Evidence Upload**: Collapsible section for uploading task evidence
- **Progress Tracking**: Real-time progress updates and status changes

### **Task Detail Modal Features** 
When clicking "View Details" from the task dropdown:
- **Task Information**: Title, description, type (system/manual), status, progress
- **Assignment Details**: Assignee information, due date, estimated hours
- **Evidence Management**: Upload evidence files, view attached evidence
- **Comments & Updates**: Add comments, view activity timeline
- **Progress Tracking**: Visual progress bars, completion percentage

### **Database Support for Control Popup**

#### **1. Control Data Retrieval**
```sql
-- Get control details with progress
SELECT 
    c.*,
    f.name as framework_name,
    f.region,
    ca.completion_rate,
    ca.status as assignment_status,
    u.first_name || ' ' || u.last_name as assignee_name
FROM controls c
JOIN frameworks f ON c.framework_id = f.id
LEFT JOIN control_assignments ca ON c.id = ca.control_id
LEFT JOIN users u ON ca.assigned_to = u.id
WHERE c.id = ? AND ca.entity_id = ?;
```

#### **2. Task List for Control**
```sql
-- Get all tasks for a control with progress details
SELECT 
    t.*,
    u.first_name || ' ' || u.last_name as assignee_name,
    COUNT(tc.id) as comment_count,
    COUNT(te.id) as evidence_count
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
LEFT JOIN task_comments tc ON t.id = tc.task_id
LEFT JOIN task_evidence te ON t.id = te.task_id
WHERE t.control_id = ? AND t.entity_id = ?
GROUP BY t.id, u.first_name, u.last_name
ORDER BY t.due_date, t.priority;
```

#### **3. Task Actions Support**
```sql
-- Mark task as in progress
UPDATE tasks 
SET status = 'in-progress', updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Mark task as complete
UPDATE tasks 
SET status = 'completed', progress = 100, completed_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Delegate task
UPDATE tasks 
SET assignee_id = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

#### **4. Task Comments & Activity**
```sql
-- Add task comment
INSERT INTO task_comments (task_id, user_id, comment, comment_type)
VALUES (?, ?, ?, 'comment');

-- Log task activity
INSERT INTO task_activity (task_id, user_id, activity_type, description, old_value, new_value)
VALUES (?, ?, 'status_changed', 'Task status updated', ?, ?);
```

#### **5. Evidence Upload & Management**
```sql
-- Upload evidence for task
INSERT INTO task_evidence (task_id, document_id, evidence_type, description, uploaded_by)
VALUES (?, ?, ?, ?, ?);

-- Update task evidence status
UPDATE tasks 
SET evidence_attached = true, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

### **UI Functionality Mapping**

| **UI Feature** | **Database Table** | **Support** |
|----------------|-------------------|-------------|
| Control Details | `controls` + `control_assignments` | ✅ Complete |
| Task List | `tasks` | ✅ Complete |
| Task Progress | `tasks.progress` | ✅ Complete |
| Task Comments | `task_comments` | ✅ Complete |
| Task Activity | `task_activity` | ✅ Complete |
| Evidence Upload | `task_evidence` + `documents` | ✅ Complete |
| Task Actions | `tasks` updates + `task_activity` | ✅ Complete |
| Progress Tracking | `tasks` + `task_activity` | ✅ Complete |

## Common Query Patterns

### Entity-Specific Queries
```sql
-- Get all active frameworks for a specific entity
SELECT f.*, ef.compliance_score, ef.last_audit_date
FROM frameworks f
JOIN entity_frameworks ef ON f.id = ef.framework_id
WHERE ef.entity_id = ? AND ef.is_active = true;

-- Get compliance progress for an entity across all frameworks
SELECT 
    e.name as entity_name,
    e.country,
    COUNT(ef.framework_id) as active_frameworks,
    AVG(ef.compliance_score) as avg_compliance_score,
    COUNT(ca.control_id) as total_controls,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) as completed_controls
FROM entities e
LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id AND ef.is_active = true
LEFT JOIN control_assignments ca ON e.id = ca.entity_id
WHERE e.id = ?
GROUP BY e.id, e.name, e.country;

-- Get evidence documents for a specific entity and framework
SELECT d.*, f.name as framework_name, c.title as control_title
FROM documents d
JOIN document_links dl ON d.id = dl.document_id
JOIN frameworks f ON dl.framework_id = f.id
LEFT JOIN controls c ON dl.control_id = c.id
WHERE d.entity_id = ? AND dl.framework_id = ? AND d.is_evidence = true;
```

### Cross-Entity Queries
```sql
-- Get compliance overview across all entities in an organization
SELECT 
    e.country,
    e.name as entity_name,
    COUNT(ef.framework_id) as active_frameworks,
    AVG(ef.compliance_score) as avg_compliance_score,
    e.risk_level
FROM entities e
LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id AND ef.is_active = true
WHERE e.organization_id = ?
GROUP BY e.id, e.country, e.name, e.risk_level
ORDER BY e.country, e.name;

-- Get audit readiness across all entities
SELECT 
    e.country,
    e.name as entity_name,
    ap.audit_readiness_score,
    ap.last_audit_date,
    ap.next_audit_date,
    COUNT(ag.id) as open_gaps
FROM entities e
LEFT JOIN audit_packages ap ON e.id = ap.entity_id
LEFT JOIN audit_gaps ag ON ap.id = ag.audit_package_id AND ag.status = 'open'
WHERE e.organization_id = ?
GROUP BY e.id, e.country, e.name, ap.audit_readiness_score, ap.last_audit_date, ap.next_audit_date;

-- Get frameworks by region
SELECT * FROM frameworks WHERE region = 'Europe' ORDER BY name;
SELECT * FROM frameworks WHERE region = 'International' ORDER BY name;
SELECT * FROM frameworks WHERE region = 'Asia' ORDER BY name;

-- Get frameworks applicable to a specific country
SELECT * FROM frameworks 
WHERE country = 'United States' 
   OR 'United States' = ANY(applicable_countries)
   OR region = 'International'
ORDER BY name;

-- Get industry-specific frameworks
SELECT * FROM frameworks 
WHERE industry_scope = 'Healthcare' 
   OR industry_scope = 'All'
ORDER BY region, name;

-- Get legal vs standards frameworks
SELECT * FROM frameworks WHERE type = 'Legal' ORDER BY region, name;
SELECT * FROM frameworks WHERE type = 'Standards' ORDER BY region, name;

-- Cross-jurisdictional compliance for an entity
SELECT 
    f.name as framework_name,
    f.region,
    f.country,
    f.type,
    ef.compliance_score,
    ef.is_active
FROM frameworks f
JOIN entity_frameworks ef ON f.id = ef.framework_id
WHERE ef.entity_id = ?
ORDER BY f.region, f.name;
```

### Multi-Jurisdictional Compliance Scenarios

#### **Scenario 1: Global Company with Regional Entities**
- **Organization**: "TechCorp Global Ltd" (Headquarters: United States)
- **Entities**: 
  - "TechCorp Europe" (Germany) → GDPR + ISO 27001
  - "TechCorp Africa" (Kenya) → Kenya DPA + ISO 27001
  - "TechCorp Asia" (Singapore) → PDPA Singapore + ISO 27001
  - "TechCorp Americas" (USA) → CCPA + HIPAA + SOX

#### **Scenario 2: African Company Expanding Internationally**
- **Organization**: "AfriTech Solutions" (Headquarters: Nigeria)
- **Entities**:
  - "AfriTech Nigeria" → Nigeria NDPA + ISO 27001
  - "AfriTech Kenya" → Kenya DPA + ISO 27001
  - "AfriTech Europe" → GDPR + ISO 27001
  - "AfriTech USA" → CCPA + SOX

#### **Scenario 3: Industry-Specific Compliance**
- **Healthcare Entity**: Must comply with HIPAA (USA) + GDPR (Europe) + local health data laws
- **Financial Entity**: Must comply with SOX (USA) + PCI-DSS (Global) + local banking regulations
- **Technology Entity**: Must comply with CCPA (USA) + GDPR (Europe) + local privacy laws

### Data Access Patterns
1. **Entity Context Switching**: Users can switch between entities, and all queries are filtered by the selected entity
2. **Organizational Oversight**: Compliance managers can view data across all entities
3. **Country-Specific Compliance**: Each entity operates under its country's data protection laws
4. **Cross-Entity Reporting**: Generate reports that span multiple entities for organizational insights
5. **Entity-Specific Audits**: Audit packages are generated per entity-framework combination
6. **Multi-Jurisdictional Views**: Entities can view compliance across multiple frameworks simultaneously
7. **Cross-Border Data Transfer**: Track data flows between entities under different jurisdictions

This database design provides a comprehensive foundation for the Privacy Hub's functionality while maintaining scalability, security, and performance requirements for multi-entity, multi-country organizations.
