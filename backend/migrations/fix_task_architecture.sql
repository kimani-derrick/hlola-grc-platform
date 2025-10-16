-- Fix Task Architecture: Make tasks org-independent like controls/frameworks
-- This migration removes organization_id from tasks and creates task_assignments table

-- Step 1: Create task_assignments table (similar to control_assignments)
CREATE TABLE IF NOT EXISTS task_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_team VARCHAR(255),
    status VARCHAR(50) DEFAULT 'not-started',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_reviewed_at TIMESTAMP,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique task-entity assignments
    UNIQUE(task_id, entity_id)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_entity_id ON task_assignments(entity_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_assigned_to ON task_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_task_assignments_status ON task_assignments(status);

-- Step 3: Migrate existing tasks to task_assignments
-- For each task, create assignments for all entities that have the corresponding control assigned
INSERT INTO task_assignments (task_id, entity_id, assigned_to, status, priority, due_date, created_at, updated_at)
SELECT 
    t.id as task_id,
    ca.entity_id,
    t.assignee_id as assigned_to,
    CASE 
        WHEN t.status = 'completed' THEN 'completed'
        WHEN t.status = 'in-progress' THEN 'in-progress'
        WHEN t.status = 'pending' THEN 'not-started'
        ELSE 'not-started'
    END as status,
    t.priority,
    t.due_date,
    t.created_at,
    t.updated_at
FROM tasks t
JOIN controls c ON t.control_id = c.id
JOIN control_assignments ca ON c.id = ca.control_id
WHERE t.organization_id IS NOT NULL;

-- Step 4: Remove organization_id column from tasks table
-- Note: This will fail if there are any constraints, so we need to be careful
ALTER TABLE tasks DROP COLUMN IF EXISTS organization_id;

-- Step 5: Add any missing columns to tasks table to make it more org-independent
-- (if needed based on the current structure)

-- Step 6: Update the Task model queries to use task_assignments instead of organization_id
-- This will be done in the application code

COMMENT ON TABLE task_assignments IS 'Links tasks to entities (similar to control_assignments). Tasks are org-independent.';
COMMENT ON COLUMN task_assignments.task_id IS 'Reference to the task (org-independent)';
COMMENT ON COLUMN task_assignments.entity_id IS 'Reference to the entity (org-specific)';
COMMENT ON COLUMN task_assignments.assigned_to IS 'User assigned to this task for this entity';
COMMENT ON COLUMN task_assignments.status IS 'Status of this task assignment (not-started, in-progress, completed, etc.)';
