-- Add Comments Table Migration
-- This script creates the comments table for task and entity comments

-- 1. Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    control_id UUID REFERENCES controls(id) ON DELETE SET NULL,
    framework_id UUID REFERENCES frameworks(id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For threaded comments
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    comment_type VARCHAR(50) DEFAULT 'general', -- general, update, question, resolution
    is_internal BOOLEAN DEFAULT false, -- Internal vs external comments
    is_resolved BOOLEAN DEFAULT false, -- For question-type comments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 2. Create indexes for performance
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_comments_entity ON comments(entity_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_control ON comments(control_id);
CREATE INDEX idx_comments_framework ON comments(framework_id);
CREATE INDEX idx_comments_type ON comments(comment_type);
CREATE INDEX idx_comments_active ON comments(is_active);

-- 3. Add constraints
ALTER TABLE comments ADD CONSTRAINT chk_comments_content CHECK (LENGTH(TRIM(content)) > 0);
ALTER TABLE comments ADD CONSTRAINT chk_comments_type CHECK (comment_type IN ('general', 'update', 'question', 'resolution', 'note'));
ALTER TABLE comments ADD CONSTRAINT chk_comments_entity_task CHECK (
    (entity_id IS NOT NULL) OR (task_id IS NOT NULL) OR (control_id IS NOT NULL) OR (framework_id IS NOT NULL)
);

-- 4. Add comments for documentation
COMMENT ON TABLE comments IS 'Comments and updates for tasks, controls, frameworks, and entities';
COMMENT ON COLUMN comments.parent_comment_id IS 'Reference to parent comment for threaded discussions';
COMMENT ON COLUMN comments.comment_type IS 'Type of comment: general, update, question, resolution, note';
COMMENT ON COLUMN comments.is_internal IS 'Whether comment is internal (not visible to external auditors)';
COMMENT ON COLUMN comments.is_resolved IS 'Whether a question-type comment has been resolved';
COMMENT ON COLUMN comments.content IS 'The actual comment text content';
