-- HLOLA GRC Platform Database Setup Script
-- Run this script as postgres user

-- Create the main database
CREATE DATABASE hlola_grc_platform;

-- Create application user
CREATE USER hlola_user WITH PASSWORD 'hlola2025';

-- Grant database permissions
GRANT ALL PRIVILEGES ON DATABASE hlola_grc_platform TO hlola_user;

-- Connect to the new database
\c hlola_grc_platform

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO hlola_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hlola_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hlola_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hlola_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hlola_user;

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
