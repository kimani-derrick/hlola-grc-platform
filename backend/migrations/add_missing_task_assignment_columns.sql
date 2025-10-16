-- Add missing columns to task_assignments table
-- This migration adds progress, actual_hours, estimated_hours, evidence_attached, and blockers columns

-- Add progress column (0-100 percentage)
ALTER TABLE task_assignments ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

-- Add actual_hours column (integer for hours worked)
ALTER TABLE task_assignments ADD COLUMN IF NOT EXISTS actual_hours INTEGER DEFAULT 0 CHECK (actual_hours >= 0);

-- Add estimated_hours column (integer for estimated hours)
ALTER TABLE task_assignments ADD COLUMN IF NOT EXISTS estimated_hours INTEGER DEFAULT 0 CHECK (estimated_hours >= 0);

-- Add evidence_attached column (boolean to track if evidence is attached)
ALTER TABLE task_assignments ADD COLUMN IF NOT EXISTS evidence_attached BOOLEAN DEFAULT FALSE;

-- Add blockers column (text to store blocker descriptions)
ALTER TABLE task_assignments ADD COLUMN IF NOT EXISTS blockers TEXT;

-- Add comments for the new columns
COMMENT ON COLUMN task_assignments.progress IS 'Progress percentage (0-100) for this task assignment';
COMMENT ON COLUMN task_assignments.actual_hours IS 'Actual hours worked on this task assignment';
COMMENT ON COLUMN task_assignments.estimated_hours IS 'Estimated hours for this task assignment';
COMMENT ON COLUMN task_assignments.evidence_attached IS 'Whether evidence has been attached to this task assignment';
COMMENT ON COLUMN task_assignments.blockers IS 'Description of any blockers preventing completion of this task assignment';
