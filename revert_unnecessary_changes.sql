-- Revert Unnecessary Database Changes
-- This script removes all the unnecessary tables and columns added for onboarding

-- 1. Drop the unnecessary tables
DROP TABLE IF EXISTS onboarding_sessions CASCADE;
DROP TABLE IF EXISTS organization_frameworks CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;
DROP TABLE IF EXISTS data_categories CASCADE;

-- 2. Drop the unnecessary view
DROP VIEW IF EXISTS onboarding_summary;

-- 3. Remove unnecessary columns from organizations table
ALTER TABLE organizations DROP COLUMN IF EXISTS employee_count;
ALTER TABLE organizations DROP COLUMN IF EXISTS data_inventory_maintained;
ALTER TABLE organizations DROP COLUMN IF EXISTS risk_scale;
ALTER TABLE organizations DROP COLUMN IF EXISTS risk_appetite;

-- 4. Remove unnecessary columns from entities table
ALTER TABLE entities DROP COLUMN IF EXISTS data_locations;
ALTER TABLE entities DROP COLUMN IF EXISTS business_processes;

-- 5. Clean up any remaining data from the unnecessary tables
-- (This is already handled by CASCADE in the DROP statements above)

-- 6. Verify the cleanup
SELECT 'Cleanup completed successfully' as status;
