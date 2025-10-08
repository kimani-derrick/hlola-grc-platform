# Database Integration Guide: GRC Platform + Keycloak

## 🗄️ Current Database Setup

### GRC Platform Database (`hlola_grc_platform`)
- **Tables:** 20 tables
- **Purpose:** Business logic, compliance data, audit trails
- **Key Tables:** organizations, users, entities, frameworks, controls, tasks, audit_items, documents

### Keycloak Database (`keycloak`)
- **Tables:** 94 tables  
- **Purpose:** Authentication, authorization, user management
- **Key Tables:** realm, user_entity, client, user_session, access_token, refresh_token

## 🔗 How to Query Both Databases

### Method 1: Separate Database Queries

```bash
# Query GRC Database
psql -U derrick -d hlola_grc_platform -c "SELECT * FROM users;"

# Query Keycloak Database  
psql -U derrick -d keycloak -c "SELECT * FROM user_entity;"
```

### Method 2: Cross-Database Analysis Script

```sql
-- GRC Database Analysis
\c hlola_grc_platform
SELECT 'GRC Users:' as info, COUNT(*) as count FROM users;

-- Keycloak Database Analysis
\c keycloak  
SELECT 'Keycloak Users:' as info, COUNT(*) as count FROM user_entity;
```

### Method 3: Application-Level Integration

```typescript
// In your Next.js application
const grcUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
const keycloakUser = await keycloakClient.users.find({ email });
```

## 🔄 Integration Strategies

### 1. **User Mapping**
```sql
-- Map GRC users to Keycloak users by email
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    ke.id as keycloak_user_id,
    ke.enabled as keycloak_enabled
FROM hlola_grc_platform.users u
LEFT JOIN keycloak.user_entity ke ON ke.email = u.email;
```

### 2. **Role-Based Access Control**
```sql
-- Get user roles from Keycloak
SELECT 
    u.email,
    r.name as role_name,
    r.description
FROM keycloak.user_entity u
JOIN keycloak.user_role_mapping urm ON urm.user_id = u.id
JOIN keycloak.role r ON r.id = urm.role_id;
```

### 3. **Session Management**
```sql
-- Active user sessions
SELECT 
    u.email,
    us.start_time,
    us.last_session_refresh,
    us.ip_address
FROM keycloak.user_entity u
JOIN keycloak.user_session us ON us.user_id = u.id
WHERE us.last_session_refresh > NOW() - INTERVAL '1 hour';
```

## 🚀 Practical Integration Examples

### Example 1: User Authentication Flow
```typescript
// 1. User logs in via Keycloak
const keycloakUser = await keycloakClient.users.find({ email });

// 2. Get GRC user data
const grcUser = await db.query(
    'SELECT * FROM users WHERE email = $1', 
    [keycloakUser.email]
);

// 3. Get user permissions
const permissions = await keycloakClient.users.listRoleMappings({
    id: keycloakUser.id
});
```

### Example 2: Role-Based Dashboard Access
```typescript
// Check if user can access audit center
const hasAuditRole = await keycloakClient.users.hasRole({
    id: keycloakUser.id,
    roleName: 'audit_manager'
});

if (hasAuditRole) {
    // Show audit center
    const auditItems = await db.query('SELECT * FROM audit_items');
}
```

### Example 3: Multi-Entity Access Control
```typescript
// Get user's accessible entities
const userEntities = await db.query(`
    SELECT e.* FROM entities e
    JOIN user_entity_access uea ON uea.entity_id = e.id
    WHERE uea.user_id = $1
`, [grcUser.id]);
```

## 📊 Database Relationship Mapping

### Key Integration Points:

1. **User Identity:** `users.email` ↔ `user_entity.email`
2. **Authentication:** Keycloak handles login/logout
3. **Authorization:** Keycloak roles control GRC feature access
4. **Session Management:** Keycloak manages user sessions
5. **Audit Trail:** GRC database stores business audit logs

### Sample Cross-Database Queries:

```sql
-- Find GRC users with Keycloak accounts
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    ke.enabled as keycloak_active
FROM hlola_grc_platform.users u
LEFT JOIN keycloak.user_entity ke ON ke.email = u.email;

-- Get user permissions across both systems
SELECT 
    u.email,
    u.role as grc_role,
    r.name as keycloak_role
FROM hlola_grc_platform.users u
LEFT JOIN keycloak.user_entity ke ON ke.email = u.email
LEFT JOIN keycloak.user_role_mapping urm ON urm.user_id = ke.id
LEFT JOIN keycloak.role r ON r.id = urm.role_id;
```

## 🛠️ Implementation Steps

### 1. **Update GRC User Table**
```sql
-- Add Keycloak user ID reference
ALTER TABLE users ADD COLUMN keycloak_user_id UUID;
CREATE INDEX idx_users_keycloak_id ON users(keycloak_user_id);
```

### 2. **Create Integration Views**
```sql
-- Create unified user view
CREATE VIEW unified_users AS
SELECT 
    u.id as grc_user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.role as grc_role,
    ke.id as keycloak_user_id,
    ke.enabled as keycloak_enabled
FROM hlola_grc_platform.users u
LEFT JOIN keycloak.user_entity ke ON ke.email = u.email;
```

### 3. **Implement Application Logic**
```typescript
// User authentication service
class AuthService {
    async authenticateUser(email: string, password: string) {
        // 1. Authenticate with Keycloak
        const keycloakUser = await this.keycloakClient.authenticate(email, password);
        
        // 2. Get GRC user data
        const grcUser = await this.getGrcUser(email);
        
        // 3. Return unified user object
        return {
            ...grcUser,
            keycloakId: keycloakUser.id,
            permissions: await this.getUserPermissions(keycloakUser.id)
        };
    }
}
```

## 🎯 Next Steps

1. **Create OAuth Client** in Keycloak for your GRC platform
2. **Set up User Federation** if needed
3. **Implement Authentication** in your Next.js app
4. **Create Role-Based Access Control** for GRC features
5. **Set up Audit Logging** across both systems

## 📝 Useful Commands

```bash
# Check both databases
psql -U derrick -d hlola_grc_platform -c "\dt"
psql -U derrick -d keycloak -c "\dt"

# Count records in both databases
psql -U derrick -d hlola_grc_platform -c "SELECT COUNT(*) FROM users;"
psql -U derrick -d keycloak -c "SELECT COUNT(*) FROM user_entity;"

# Access Keycloak Admin
# URL: http://localhost:8080/admin/
# Username: admin
# Password: admin123
```

This integration allows you to leverage Keycloak's powerful authentication and authorization capabilities while maintaining your GRC platform's business logic and data integrity.
