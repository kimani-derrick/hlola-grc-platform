-- Unified Database Analysis: GRC Platform + Keycloak
-- This script demonstrates how to analyze both databases together

-- ===========================================
-- GRC DATABASE ANALYSIS
-- ===========================================
\c hlola_grc_platform

SELECT '=== GRC PLATFORM DATABASE ===' as section;

-- Core GRC Tables
SELECT 'Organizations:' as table_name, COUNT(*) as record_count FROM organizations
UNION ALL
SELECT 'Users:', COUNT(*) FROM users
UNION ALL
SELECT 'Entities:', COUNT(*) FROM entities
UNION ALL
SELECT 'Frameworks:', COUNT(*) FROM frameworks
UNION ALL
SELECT 'Controls:', COUNT(*) FROM controls
UNION ALL
SELECT 'Tasks:', COUNT(*) FROM tasks
UNION ALL
SELECT 'Audit Items:', COUNT(*) FROM audit_items
UNION ALL
SELECT 'Documents:', COUNT(*) FROM documents;

-- ===========================================
-- KEYCLOAK DATABASE ANALYSIS  
-- ===========================================
\c keycloak

SELECT '=== KEYCLOAK DATABASE ===' as section;

-- Core Keycloak Tables
SELECT 'Realms:' as table_name, COUNT(*) as record_count FROM realm
UNION ALL
SELECT 'Users:', COUNT(*) FROM user_entity
UNION ALL
SELECT 'Clients:', COUNT(*) FROM client
UNION ALL
SELECT 'Roles:', COUNT(*) FROM role
UNION ALL
SELECT 'User Sessions:', COUNT(*) FROM user_session
UNION ALL
SELECT 'Client Sessions:', COUNT(*) FROM client_session
UNION ALL
SELECT 'Access Tokens:', COUNT(*) FROM access_token
UNION ALL
SELECT 'Refresh Tokens:', COUNT(*) FROM refresh_token;

-- ===========================================
-- INTEGRATION ANALYSIS
-- ===========================================
SELECT '=== INTEGRATION POINTS ===' as section;

-- Show how to link GRC users with Keycloak users
SELECT 'To integrate GRC users with Keycloak:' as integration_step
UNION ALL
SELECT '1. Map email addresses between databases'
UNION ALL
SELECT '2. Create user_id foreign key in GRC users table'
UNION ALL
SELECT '3. Use Keycloak user_id as reference in GRC platform'
UNION ALL
SELECT '4. Implement OAuth 2.0/OpenID Connect authentication'
UNION ALL
SELECT '5. Use Keycloak roles for GRC permissions';

-- ===========================================
-- SAMPLE INTEGRATION QUERIES
-- ===========================================
SELECT '=== SAMPLE INTEGRATION QUERIES ===' as section;

-- Example: How to find GRC users who have Keycloak accounts
SELECT 'Example query to find GRC users with Keycloak accounts:' as example
UNION ALL
SELECT 'SELECT u.email, u.first_name, u.last_name FROM hlola_grc_platform.users u'
UNION ALL
SELECT 'WHERE EXISTS (SELECT 1 FROM keycloak.user_entity ke WHERE ke.email = u.email);'
UNION ALL
SELECT ''
UNION ALL
SELECT 'Example query to get user permissions:'
UNION ALL
SELECT 'SELECT u.email, r.name as role FROM hlola_grc_platform.users u'
UNION ALL
SELECT 'JOIN keycloak.user_entity ke ON ke.email = u.email'
UNION ALL
SELECT 'JOIN keycloak.user_role_mapping urm ON urm.user_id = ke.id'
UNION ALL
SELECT 'JOIN keycloak.role r ON r.id = urm.role_id;';
