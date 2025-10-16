-- Create Missing Task Assignments
-- This migration creates task assignments for organizations that have control assignments
-- but are missing corresponding task assignments.

-- Step 1: Create task assignments for all control assignments that don't have corresponding task assignments
INSERT INTO task_assignments (
    task_id, 
    entity_id, 
    status, 
    priority, 
    created_at, 
    updated_at
)
SELECT 
    t.id AS task_id,
    ca.entity_id,
    'not-started' AS status,
    COALESCE(t.priority, 'medium') AS priority,
    NOW() AS created_at,
    NOW() AS updated_at
FROM control_assignments ca
JOIN entities e ON ca.entity_id = e.id
JOIN controls c ON ca.control_id = c.id
JOIN tasks t ON c.id = t.control_id
WHERE NOT EXISTS (
    SELECT 1 FROM task_assignments ta
    WHERE ta.task_id = t.id AND ta.entity_id = ca.entity_id
)
ON CONFLICT (task_id, entity_id) DO NOTHING;

-- Step 2: Add a comment explaining what this migration does
COMMENT ON TABLE task_assignments IS 'Links tasks to specific entities, allowing tasks to be organization-independent. This migration ensures all control assignments have corresponding task assignments.';
