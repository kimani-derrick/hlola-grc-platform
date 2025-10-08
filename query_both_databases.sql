-- Query Both GRC and Keycloak Databases
-- This script shows how to query both databases together

-- 1. GRC Database Queries
\c hlola_grc_platform
SELECT 'GRC Database - Organizations:' as info;
SELECT COUNT(*) as organization_count FROM organizations;

SELECT 'GRC Database - Users:' as info;
SELECT COUNT(*) as user_count FROM users;

SELECT 'GRC Database - Frameworks:' as info;
SELECT COUNT(*) as framework_count FROM frameworks;

-- 2. Keycloak Database Queries
\c keycloak
SELECT 'Keycloak Database - Realms:' as info;
SELECT COUNT(*) as realm_count FROM realm;

SELECT 'Keycloak Database - Users:' as info;
SELECT COUNT(*) as keycloak_user_count FROM user_entity;

SELECT 'Keycloak Database - Clients:' as info;
SELECT COUNT(*) as client_count FROM client;

-- 3. Cross-Database Analysis
-- Note: To join data across databases, you would need to:
-- 1. Export data from one database
-- 2. Import into the other, or
-- 3. Use a database federation tool
-- 4. Create a unified database view

SELECT 'Cross-Database Analysis:' as info;
SELECT 'To join GRC users with Keycloak users, you need to:' as step1;
SELECT '1. Map user emails between databases' as step2;
SELECT '2. Create foreign key relationships' as step3;
SELECT '3. Use application-level joins' as step4;
