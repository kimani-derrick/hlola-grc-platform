-- Add Audits and Audit Findings Tables Migration
-- This script creates the new audits and audit_findings tables for comprehensive audit management

-- 1. Create audits table
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    audit_package_id UUID REFERENCES audit_packages(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    audit_type VARCHAR(50) NOT NULL, -- regulatory, certification, internal
    status VARCHAR(50) DEFAULT 'planning', -- planning, in-progress, completed, overdue, cancelled
    priority VARCHAR(20) NOT NULL, -- critical, high, medium, low
    auditor VARCHAR(255), -- Auditor name/organization
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    progress INTEGER DEFAULT 0, -- 0-100
    next_milestone VARCHAR(500),
    estimated_completion DATE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create audit_findings table
CREATE TABLE audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    control_id UUID REFERENCES controls(id) ON DELETE SET NULL,
    finding_type VARCHAR(50) NOT NULL, -- observation, non-conformity, opportunity
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low, info
    title VARCHAR(500) NOT NULL,
    description TEXT,
    evidence TEXT,
    recommendation TEXT,
    status VARCHAR(50) DEFAULT 'open', -- open, in-progress, resolved, closed
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes for performance
CREATE INDEX idx_audits_entity_framework ON audits(entity_id, framework_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_audit_type ON audits(audit_type);
CREATE INDEX idx_audits_priority ON audits(priority);
CREATE INDEX idx_audits_start_date ON audits(start_date);
CREATE INDEX idx_audits_end_date ON audits(end_date);
CREATE INDEX idx_audits_created_by ON audits(created_by);

CREATE INDEX idx_audit_findings_audit ON audit_findings(audit_id);
CREATE INDEX idx_audit_findings_severity ON audit_findings(severity, status);
CREATE INDEX idx_audit_findings_finding_type ON audit_findings(finding_type);
CREATE INDEX idx_audit_findings_assigned_to ON audit_findings(assigned_to);
CREATE INDEX idx_audit_findings_due_date ON audit_findings(due_date);

-- 4. Add constraints
ALTER TABLE audits ADD CONSTRAINT chk_audits_progress CHECK (progress >= 0 AND progress <= 100);
ALTER TABLE audits ADD CONSTRAINT chk_audits_audit_type CHECK (audit_type IN ('regulatory', 'certification', 'internal'));
ALTER TABLE audits ADD CONSTRAINT chk_audits_status CHECK (status IN ('planning', 'in-progress', 'completed', 'overdue', 'cancelled'));
ALTER TABLE audits ADD CONSTRAINT chk_audits_priority CHECK (priority IN ('critical', 'high', 'medium', 'low'));
ALTER TABLE audits ADD CONSTRAINT chk_audits_dates CHECK (end_date >= start_date);

ALTER TABLE audit_findings ADD CONSTRAINT chk_audit_findings_finding_type CHECK (finding_type IN ('observation', 'non-conformity', 'opportunity'));
ALTER TABLE audit_findings ADD CONSTRAINT chk_audit_findings_severity CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info'));
ALTER TABLE audit_findings ADD CONSTRAINT chk_audit_findings_status CHECK (status IN ('open', 'in-progress', 'resolved', 'closed'));

-- 5. Add comments for documentation
COMMENT ON TABLE audits IS 'Main audit records with comprehensive audit management data';
COMMENT ON TABLE audit_findings IS 'Detailed audit findings and observations linked to audits';

COMMENT ON COLUMN audits.audit_type IS 'Type of audit: regulatory, certification, or internal';
COMMENT ON COLUMN audits.status IS 'Current status of the audit: planning, in-progress, completed, overdue, cancelled';
COMMENT ON COLUMN audits.priority IS 'Priority level: critical, high, medium, low';
COMMENT ON COLUMN audits.progress IS 'Completion percentage from 0 to 100';
COMMENT ON COLUMN audits.auditor IS 'Name or organization of the auditor conducting the audit';

COMMENT ON COLUMN audit_findings.finding_type IS 'Type of finding: observation, non-conformity, or opportunity';
COMMENT ON COLUMN audit_findings.severity IS 'Severity level: critical, high, medium, low, info';
COMMENT ON COLUMN audit_findings.status IS 'Status of the finding: open, in-progress, resolved, closed';
COMMENT ON COLUMN audit_findings.evidence IS 'Evidence supporting the finding';
COMMENT ON COLUMN audit_findings.recommendation IS 'Recommended action to address the finding';
