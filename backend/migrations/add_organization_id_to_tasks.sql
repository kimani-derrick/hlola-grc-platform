-- Migration: Add organization_id to tasks table for proper organization isolation
-- This fixes the issue where tasks were shared across all organizations

-- Step 1: Add organization_id column to tasks table
ALTER TABLE tasks ADD COLUMN organization_id UUID;

-- Step 2: Create index for better performance
CREATE INDEX idx_tasks_organization_id ON tasks(organization_id);

-- Step 3: Add foreign key constraint
ALTER TABLE tasks ADD CONSTRAINT tasks_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Step 4: Populate organization_id for existing tasks
-- This maps tasks to organizations through the control_assignments -> entities relationship
UPDATE tasks 
SET organization_id = e.organization_id
FROM controls c
JOIN control_assignments ca ON c.id = ca.control_id
JOIN entities e ON ca.entity_id = e.id
WHERE tasks.control_id = c.id;

-- Step 5: Make organization_id NOT NULL after populating
ALTER TABLE tasks ALTER COLUMN organization_id SET NOT NULL;

-- Step 6: Update the Task.create method to include organization_id in INSERT
-- (This will be done in the code, not in SQL)

-- Verification query to check the migration
SELECT 
    COUNT(*) as total_tasks,
    COUNT(DISTINCT organization_id) as organizations_with_tasks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
FROM tasks;
