# Database Schema Design - Task Manager App

## Overview
Multi-tenant collaborative task management system with role-based access control and data isolation. This schema is designed to support the existing TypeScript interfaces defined in the shared package.

## Design Principles
1. **Multi-tenancy**: Complete data isolation between users via permission-based access
2. **Security**: All queries filtered by user permissions, no cross-tenant data leaks
3. **Scalability**: UUID primary keys, proper indexing, optimized for growth
4. **Data Integrity**: Foreign key constraints, proper validation, referential integrity
5. **Performance**: Strategic indexes on query-heavy columns and relationships
6. **Type Consistency**: Matches existing TypeScript interfaces exactly

---

## Tables

### 1. users
Primary authentication and user profile table. Maps to `User` interface.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Purpose**: Store user accounts and authentication data
**Security**: Email unique constraint, password always hashed with bcrypt 12+ rounds
**Performance**: Email index for fast login lookups
**Type Mapping**: Directly maps to `User` interface (password_hash not exposed in interface)

---

### 2. projects
Project containers that group tasks and define collaboration boundaries. Maps to `Project` interface.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_name ON projects(name);
```

**Purpose**: Project containers with ownership model
**Security**: Owner can delete project; members can view and add tasks
**Performance**: Owner index for "my projects" queries, name index for search
**Type Mapping**: Directly maps to `Project` interface

---

### 3. project_members
Junction table managing project membership and roles. Maps to `ProjectMember` interface.

```sql
CREATE TYPE project_role AS ENUM ('owner', 'member');

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role project_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique membership (user can't be member twice)
  UNIQUE(project_id, user_id)
);

-- Indexes
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE UNIQUE INDEX idx_project_members_unique ON project_members(project_id, user_id);
```

**Purpose**: Manage who can access which projects and their permission level
**Security**: Role-based permissions, unique membership constraint
**Performance**: Composite unique index prevents duplicates, separate indexes for lookups
**Extensibility**: ENUM type allows future roles (admin, viewer, etc.)
**Type Mapping**: Maps to `ProjectMember` interface and `ProjectRole` type

---

### 4. tasks
Task items belonging to projects with assignment and status tracking. Maps to `Task` interface.

```sql
CREATE TYPE task_status AS ENUM ('pending', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'pending',
  priority task_priority,
  due_date TIMESTAMPTZ,
  category VARCHAR(100),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_category ON tasks(category);

-- Composite indexes for common query patterns
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status);
CREATE INDEX idx_tasks_project_assigned ON tasks(project_id, assigned_to);
```

**Purpose**: Task items with assignment, categorization, and status tracking
**Security**: Belongs to project (inherits project permissions via project_id)
**Performance**: Multiple indexes for filtering by various criteria
**Data Integrity**: assigned_to can be NULL if unassigned or user deleted
**Type Mapping**: Directly maps to `Task` interface, `TaskStatus` and `TaskPriority` types

---

## Relationships

### Entity Relationship Diagram
```
users (User interface)
├── projects.owner_id (1:N) - users can own multiple projects
├── project_members.user_id (1:N) - users can be members of multiple projects
├── tasks.assigned_to (1:N) - users can be assigned multiple tasks
└── tasks.created_by (1:N) - users can create multiple tasks

projects (Project interface)
├── project_members.project_id (1:N) - projects can have multiple members
└── tasks.project_id (1:N) - projects can have multiple tasks

project_members (ProjectMember interface)
├── projects (N:1) - members belong to one project per row
└── users (N:1) - members are one user per row
```

### Foreign Key Constraints
- `projects.owner_id → users.id` (CASCADE DELETE - if user deleted, their owned projects deleted)
- `project_members.project_id → projects.id` (CASCADE DELETE - if project deleted, memberships deleted)
- `project_members.user_id → users.id` (CASCADE DELETE - if user deleted, memberships deleted)
- `tasks.project_id → projects.id` (CASCADE DELETE - if project deleted, tasks deleted)
- `tasks.assigned_to → users.id` (SET NULL - if user deleted, unassign tasks)
- `tasks.created_by → users.id` (CASCADE DELETE - if user deleted, their created tasks deleted)

---

## Security & Multi-Tenancy

### Data Isolation Rules
1. **Users** can only access their own user record
2. **Projects** can only be accessed by:
   - Project owner
   - Project members (via project_members table)
3. **Tasks** can only be accessed by users who have access to the parent project
4. **Project Members** can only be viewed by users who have access to the parent project

### Query Patterns for Security
```sql
-- Get user's accessible projects (supports ProjectWithMembers interface)
SELECT p.*, 
       pm.role as user_role,
       COUNT(pm2.id) as member_count
FROM projects p 
LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = $user_id
LEFT JOIN project_members pm2 ON p.id = pm2.project_id
WHERE p.owner_id = $user_id 
   OR pm.user_id = $user_id
GROUP BY p.id, pm.role;

-- Get tasks user can access (with populated fields)
SELECT t.*, 
       u_assignee.id as assignee_id, u_assignee.email as assignee_email, u_assignee.name as assignee_name,
       u_creator.id as creator_id, u_creator.email as creator_email, u_creator.name as creator_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
LEFT JOIN users u_assignee ON t.assigned_to = u_assignee.id
LEFT JOIN users u_creator ON t.created_by = u_creator.id
WHERE p.owner_id = $user_id 
   OR EXISTS (
     SELECT 1 FROM project_members pm 
     WHERE pm.project_id = p.id AND pm.user_id = $user_id
   );

-- Check if user can access specific project
SELECT p.id,
       CASE WHEN p.owner_id = $user_id THEN 'owner'
            ELSE pm.role 
       END as user_role
FROM projects p 
LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = $user_id
WHERE p.id = $project_id 
  AND (p.owner_id = $user_id OR pm.user_id = $user_id);
```

---

## Performance Optimization

### Indexing Strategy
1. **Primary Keys**: All UUID primary keys automatically indexed
2. **Foreign Keys**: All foreign key columns indexed for JOIN performance
3. **Unique Constraints**: Email uniqueness, composite membership uniqueness
4. **Query Patterns**: Indexes on commonly filtered columns (status, priority, dates)
5. **Composite Indexes**: Multi-column indexes for common filter combinations
6. **Search Optimization**: Text indexes for title/description search when needed

### Query Performance Considerations
- **Project Access**: Composite queries across projects and project_members tables
- **Task Filtering**: Multiple filter criteria supported with dedicated indexes
- **User Search**: Email index for fast user lookup during member addition
- **Timeline Queries**: Date indexes for chronological ordering and filtering
- **Assignment Queries**: Composite indexes for project-user combinations

---

## Migration Strategy

### Migration Files Structure
```
packages/api/src/database/migrations/
├── 001_create_extensions.sql
├── 002_create_users_table.sql
├── 003_create_projects_table.sql
├── 004_create_project_members_table.sql
└── 005_create_tasks_table.sql
```

### Migration File Template
```sql
-- migrations/002_create_users_table.sql
-- UP Migration
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- DOWN Migration (for rollback)
DROP TABLE IF EXISTS users CASCADE;
```

### Reversibility
- All migrations include both UP and DOWN sections
- Down migrations drop tables in reverse dependency order
- Foreign key constraints properly handled in rollbacks
- ENUM types created/dropped appropriately
- Indexes dropped with tables automatically

---

## Type Consistency Verification

### TypeScript Interface Mapping

| TypeScript Interface | Database Table | Notes |
|---------------------|----------------|-------|
| `User` | `users` | password_hash not exposed in interface |
| `CreateUserRequest` | Used for INSERT | password gets hashed to password_hash |
| `UpdateUserRequest` | Used for UPDATE | - |
| `UserProfile` | `users` subset | Excludes sensitive data |
| `Project` | `projects` | Direct mapping |
| `ProjectMember` | `project_members` | Includes optional populated user field |
| `ProjectRole` | `project_role` ENUM | Exactly matches TypeScript union type |
| `ProjectWithMembers` | Complex query | Aggregates projects + members + role |
| `Task` | `tasks` | Includes optional populated assignee/creator fields |
| `TaskStatus` | `task_status` ENUM | Exactly matches TypeScript union type |
| `TaskPriority` | `task_priority` ENUM | Exactly matches TypeScript union type |

### Data Type Mappings
- TypeScript `string` (UUID) → PostgreSQL `UUID`
- TypeScript `string` → PostgreSQL `VARCHAR` or `TEXT`
- TypeScript `Date` → PostgreSQL `TIMESTAMPTZ`
- TypeScript `boolean` → PostgreSQL `BOOLEAN`
- TypeScript union types → PostgreSQL `ENUM`
- TypeScript `null` → PostgreSQL `NULL`

---

## Seed Data Strategy

### Development Seeds
```sql
-- Insert test users
INSERT INTO users (id, email, password_hash, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@example.com', '$2b$12$hash...', 'Admin User'),
  ('550e8400-e29b-41d4-a716-446655440001', 'user1@example.com', '$2b$12$hash...', 'Test User 1'),
  ('550e8400-e29b-41d4-a716-446655440002', 'user2@example.com', '$2b$12$hash...', 'Test User 2');

-- Insert test projects
INSERT INTO projects (id, name, description, owner_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', 'Sample Project', 'A sample project for testing', '550e8400-e29b-41d4-a716-446655440000');

-- Insert project memberships
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'member');

-- Insert sample tasks
INSERT INTO tasks (title, description, project_id, created_by, status, priority) VALUES
  ('Setup Database', 'Create and configure the database schema', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'completed', 'high'),
  ('Create API Endpoints', 'Implement REST API endpoints for tasks', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'pending', 'high');
```

---

## Security Considerations

### SQL Injection Prevention
- **NEVER** use string concatenation for queries
- **ALWAYS** use parameterized queries/prepared statements
- All user input validated before reaching database
- Use ORM/query builder that handles parameterization

### Authentication & Authorization
- Password hashing: bcrypt with 12+ rounds minimum
- JWT tokens with 1-hour expiration
- Rate limiting on authentication endpoints
- Multi-tenancy enforced at query level

### Data Protection
- No sensitive data in logs
- Foreign key constraints prevent orphaned records
- Soft deletes where business logic requires (users.deleted_at)
- Audit trails for sensitive operations

---

## Future Extensibility

### Additional Tables Ready for Extension
```sql
-- Activity/Audit Log
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  task_id UUID REFERENCES tasks(id),
  action VARCHAR(50) NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Comments
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Attachments
CREATE TABLE task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Role System Extensions
- Current: `project_role` ENUM with 'owner', 'member'
- Future: Add 'admin', 'viewer', 'contributor' roles
- Command: `ALTER TYPE project_role ADD VALUE 'admin';`
- Backward compatible with existing data

---

## Validation Rules

### Database Constraints
```sql
-- Users
ALTER TABLE users ADD CONSTRAINT chk_users_email_valid 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE users ADD CONSTRAINT chk_users_name_not_empty 
  CHECK (LENGTH(TRIM(name)) > 0);

-- Projects  
ALTER TABLE projects ADD CONSTRAINT chk_projects_name_not_empty 
  CHECK (LENGTH(TRIM(name)) > 0);

-- Tasks
ALTER TABLE tasks ADD CONSTRAINT chk_tasks_title_not_empty 
  CHECK (LENGTH(TRIM(title)) > 0);
ALTER TABLE tasks ADD CONSTRAINT chk_tasks_completed_at_logic 
  CHECK ((status = 'completed' AND completed_at IS NOT NULL) OR 
         (status = 'pending' AND completed_at IS NULL));
```

### Application-Level Validation
- Email format validation (express-validator)
- Password strength requirements (minimum 8 characters)
- Name length validation (1-255 characters)
- Project/task title validation (1-255 characters)
- Due date validation (not in the past for new tasks)

---

## Performance Benchmarks & Monitoring

### Expected Performance Characteristics
- User login: <50ms (email index lookup)
- Project list: <100ms (owner_id + membership JOIN)
- Task list: <150ms (project access + task filters)
- Task creation: <50ms (simple INSERT with FK validation)
- Task filtering: <200ms (composite index usage)

### Monitoring Queries
```sql
-- Slow query identification
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;
```

---

## Summary

This database schema provides:

✅ **Complete Multi-Tenancy** with secure data isolation patterns
✅ **Type Safety** with exact mapping to TypeScript interfaces  
✅ **High Performance** with strategic indexing for all query patterns
✅ **Data Integrity** with comprehensive foreign key constraints
✅ **Security** with permission-based access and SQL injection prevention
✅ **Scalability** with UUID keys and normalized design
✅ **Extensibility** with ENUM types and migration-ready structure
✅ **Compliance** with backend development best practices

The schema supports all requirements from task T005 while maintaining perfect alignment with the existing shared TypeScript interfaces and providing a solid foundation for tasks T006+ (migration implementation).