-- HLOLA GRC Platform Database Schema
-- This script creates all tables from PRIVACY_HUB_DATABASE_DESIGN.md

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    size VARCHAR(50), -- small, medium, large, enterprise
    country VARCHAR(100),
    region VARCHAR(100),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 2. Entities
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    entity_type VARCHAR(50) NOT NULL, -- subsidiary, division, department, project
    country VARCHAR(100),
    region VARCHAR(100),
    industry VARCHAR(100),
    size VARCHAR(50),
    risk_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    compliance_officer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 3. Users
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

-- 4. Frameworks
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

-- 5. Framework Business Impacts
CREATE TABLE framework_business_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    penalty_amount VARCHAR(50),
    penalty_currency VARCHAR(10),
    business_benefits TEXT[],
    market_access TEXT[],
    competitive_advantage TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Controls
CREATE TABLE controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    control_id VARCHAR(100) NOT NULL, -- Framework-specific control identifier
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    priority VARCHAR(20) NOT NULL, -- high, medium, low
    implementation_level VARCHAR(50), -- basic, intermediate, advanced
    business_impact TEXT,
    technical_requirements TEXT,
    legal_requirements TEXT,
    implementation_guidance TEXT,
    testing_procedures TEXT,
    evidence_requirements TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 7. Entity Frameworks (Many-to-Many)
CREATE TABLE entity_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    compliance_score INTEGER DEFAULT 0, -- 0-100
    audit_readiness_score INTEGER DEFAULT 0, -- 0-100
    last_audit_date DATE,
    next_audit_date DATE,
    certification_status VARCHAR(50), -- certified, pending, expired, not-applicable
    certification_expiry DATE,
    compliance_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_id, framework_id)
);

-- 8. Control Assignments
CREATE TABLE control_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_team VARCHAR(100),
    status VARCHAR(50) DEFAULT 'not-started', -- not-started, in-progress, completed, needs-review
    completion_rate INTEGER DEFAULT 0, -- 0-100
    priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
    due_date DATE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_reviewed_at TIMESTAMP,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in-progress, completed, blocked, cancelled
    priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
    category VARCHAR(100),
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    completed_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    progress INTEGER DEFAULT 0, -- 0-100
    evidence_attached BOOLEAN DEFAULT false,
    blockers TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE SET NULL,
    control_id UUID REFERENCES controls(id) ON DELETE SET NULL,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    document_type VARCHAR(100), -- policy, procedure, record, evidence, template, form
    file_path VARCHAR(1000),
    file_size BIGINT,
    mime_type VARCHAR(100),
    version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft', -- draft, review, approved, rejected, archived
    is_evidence BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Task Evidence
CREATE TABLE task_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    evidence_type VARCHAR(100), -- screenshot, document, log, report, certificate
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Audit Packages
CREATE TABLE audit_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    audit_readiness_score INTEGER DEFAULT 0, -- 0-100
    last_audit_date DATE,
    next_audit_date DATE,
    certification_status VARCHAR(50), -- certified, pending, expired, not-applicable
    certification_expiry DATE,
    regulatory_requirements JSONB, -- JSON array of requirements
    requirement_status JSONB, -- JSON object mapping requirement IDs to status
    requirement_evidence JSONB, -- JSON object mapping requirement IDs to evidence
    requirement_notes JSONB, -- JSON object mapping requirement IDs to notes
    strengths TEXT[],
    recommendations TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Audit Gaps
CREATE TABLE audit_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    control_id UUID REFERENCES controls(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- documentation, technical, procedural, evidence
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low
    status VARCHAR(50) DEFAULT 'open', -- open, in-progress, resolved, closed
    impact_description TEXT,
    remediation_plan TEXT,
    estimated_effort VARCHAR(100),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_team VARCHAR(100),
    due_date DATE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Compliance History
CREATE TABLE compliance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    compliance_score INTEGER NOT NULL, -- 0-100
    milestone VARCHAR(255),
    event_type VARCHAR(50), -- achievement, audit, update, gap-closed
    event_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Audit Timeline
CREATE TABLE audit_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- audit, certification, milestone, gap-identified, gap-resolved
    event_date DATE NOT NULL,
    event_title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed', -- completed, in-progress, scheduled
    related_documents TEXT[], -- Array of document IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Generated Reports
CREATE TABLE generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL, -- full-audit, framework-specific, executive-summary, gap-analysis
    title VARCHAR(500) NOT NULL,
    frameworks TEXT[] NOT NULL, -- Array of framework IDs
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    page_count INTEGER,
    includes_evidence BOOLEAN DEFAULT false,
    format VARCHAR(20) DEFAULT 'pdf', -- pdf, docx, excel
    file_path VARCHAR(1000),
    confidence_level VARCHAR(20) DEFAULT 'medium', -- high, medium, low
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Compliance Insights
CREATE TABLE compliance_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- warning, success, info, critical
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT,
    affected_items TEXT[], -- Array of affected framework/control/task IDs
    priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Team Performance
CREATE TABLE team_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    assigned_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    completion_rate INTEGER DEFAULT 0, -- 0-100
    average_completion_time INTEGER DEFAULT 0, -- in days
    overdue_items INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Export Options
CREATE TABLE export_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    include_executive_summary BOOLEAN DEFAULT true,
    include_framework_details BOOLEAN DEFAULT true,
    include_control_matrices BOOLEAN DEFAULT true,
    include_evidence BOOLEAN DEFAULT false,
    include_gap_analysis BOOLEAN DEFAULT true,
    include_timeline BOOLEAN DEFAULT true,
    include_recommendations BOOLEAN DEFAULT true,
    format VARCHAR(20) DEFAULT 'pdf', -- pdf, docx, excel, zip
    frameworks TEXT[], -- Array of framework IDs to include
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_entities_organization ON entities(organization_id);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_entity ON users(entity_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_frameworks_region ON frameworks(region);
CREATE INDEX idx_frameworks_category ON frameworks(category);
CREATE INDEX idx_frameworks_status ON frameworks(status);
CREATE INDEX idx_controls_framework ON controls(framework_id);
CREATE INDEX idx_controls_category ON controls(category);
CREATE INDEX idx_entity_frameworks_entity ON entity_frameworks(entity_id);
CREATE INDEX idx_entity_frameworks_framework ON entity_frameworks(framework_id);
CREATE INDEX idx_control_assignments_entity ON control_assignments(entity_id);
CREATE INDEX idx_control_assignments_control ON control_assignments(control_id);
CREATE INDEX idx_control_assignments_user ON control_assignments(assigned_to);
CREATE INDEX idx_tasks_control ON tasks(control_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_documents_entity ON documents(entity_id);
CREATE INDEX idx_documents_framework ON documents(framework_id);
CREATE INDEX idx_documents_evidence ON documents(is_evidence);
CREATE INDEX idx_audit_packages_entity ON audit_packages(entity_id);
CREATE INDEX idx_audit_gaps_entity ON audit_gaps(entity_id);
CREATE INDEX idx_audit_gaps_severity ON audit_gaps(severity);
CREATE INDEX idx_audit_gaps_status ON audit_gaps(status);
CREATE INDEX idx_compliance_history_entity ON compliance_history(entity_id);
CREATE INDEX idx_audit_timeline_entity ON audit_timeline(entity_id);
CREATE INDEX idx_generated_reports_entity ON generated_reports(entity_id);
CREATE INDEX idx_compliance_insights_entity ON compliance_insights(entity_id);
CREATE INDEX idx_team_performance_entity ON team_performance(entity_id);

-- Create views for dashboard functionality
CREATE VIEW dashboard_stats AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    COUNT(DISTINCT ef.framework_id) as active_frameworks,
    ROUND(AVG(ef.compliance_score), 2) as avg_compliance_score,
    COUNT(DISTINCT ca.control_id) as total_controls,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) as completed_controls,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'completed' THEN 1 END) as overdue_tasks,
    COUNT(CASE WHEN d.is_evidence = true THEN 1 END) as evidence_items,
    COUNT(CASE WHEN ag.status = 'open' THEN 1 END) as open_gaps,
    COUNT(CASE WHEN ag.severity = 'critical' AND ag.status = 'open' THEN 1 END) as critical_gaps
FROM entities e
LEFT JOIN entity_frameworks ef ON e.id = ef.entity_id AND ef.is_active = true
LEFT JOIN control_assignments ca ON e.id = ca.entity_id
LEFT JOIN tasks t ON ca.control_id = t.control_id
LEFT JOIN documents d ON e.id = d.entity_id
LEFT JOIN audit_gaps ag ON e.id = ag.entity_id
GROUP BY e.id, e.name;

-- Success message
SELECT 'Database schema created successfully!' as status;
