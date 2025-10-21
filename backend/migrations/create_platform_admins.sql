-- Create platform_admins table for Admin UI authentication
-- This table is separate from the main users table and is for platform administrators only

CREATE TABLE IF NOT EXISTS platform_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_platform_admins_email ON platform_admins(email);

-- Create index on is_active for filtering active admins
CREATE INDEX IF NOT EXISTS idx_platform_admins_is_active ON platform_admins(is_active);

-- Add comment to table
COMMENT ON TABLE platform_admins IS 'Platform administrators who manage content library (frameworks, controls, tasks)';
COMMENT ON COLUMN platform_admins.email IS 'Unique email address for platform admin login';
COMMENT ON COLUMN platform_admins.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN platform_admins.is_active IS 'Whether the admin account is active and can login';
