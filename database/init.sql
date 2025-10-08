-- Initialize GRC Platform Database
-- This script runs when the container starts for the first time

-- Create the database (if not exists)
-- Note: POSTGRES_DB environment variable already creates this

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create a simple test table to verify the database is working
CREATE TABLE IF NOT EXISTS database_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'initialized',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial status
INSERT INTO database_status (status) VALUES ('Database container initialized successfully');

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'GRC Platform Database initialized successfully!';
    RAISE NOTICE 'Database: hlola_grc_platform';
    RAISE NOTICE 'User: hlola_user';
    RAISE NOTICE 'Tables will be created from create_tables.sql';
END $$;
