/**
 * Migration: Create project_members table
 * 
 * Creates the project members junction table with:
 * - UUID primary key
 * - Foreign keys to users and projects
 * - Role enum (owner, member)
 * - Composite unique constraint
 * - Performance indexes for collaboration queries
 */

import type { Database } from '#database/types';

export async function up(db: Database): Promise<void> {
  await db.query(`
    -- Create project role enum type
    CREATE TYPE project_role AS ENUM ('owner', 'member');
    
    -- Create project_members junction table
    CREATE TABLE project_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL,
      user_id UUID NOT NULL,
      role project_role NOT NULL DEFAULT 'member',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      
      -- Foreign key constraints
      CONSTRAINT fk_project_members_project_id FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE,
      CONSTRAINT fk_project_members_user_id FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
      
      -- Unique constraint: user can only have one role per project
      CONSTRAINT uq_project_members_project_user UNIQUE (project_id, user_id)
    );
    
    -- Create composite index on project_id and user_id (already unique)
    -- This is automatically created by the unique constraint
    
    -- Create index on project_id for listing project members
    CREATE INDEX idx_project_members_project_id ON project_members(project_id);
    
    -- Create index on user_id for listing user's projects
    CREATE INDEX idx_project_members_user_id ON project_members(user_id);
    
    -- Create index on role for permission queries
    CREATE INDEX idx_project_members_role ON project_members(role);
    
    -- Create composite index for user's projects with role
    CREATE INDEX idx_project_members_user_role ON project_members(user_id, role);
    
    -- Create composite index for project members with role
    CREATE INDEX idx_project_members_project_role ON project_members(project_id, role);
    
    -- Add comments for documentation
    COMMENT ON TABLE project_members IS 'Junction table for project collaboration with role-based permissions';
    COMMENT ON COLUMN project_members.id IS 'Unique membership identifier (UUID)';
    COMMENT ON COLUMN project_members.project_id IS 'Reference to project';
    COMMENT ON COLUMN project_members.user_id IS 'Reference to user';
    COMMENT ON COLUMN project_members.role IS 'User role in project (owner, member)';
    COMMENT ON COLUMN project_members.created_at IS 'Membership creation timestamp';
    COMMENT ON COLUMN project_members.updated_at IS 'Last role/membership update timestamp';
  `);
}

export async function down(db: Database): Promise<void> {
  await db.query(`
    -- Drop project_members table and all associated indexes
    DROP TABLE IF EXISTS project_members CASCADE;
    
    -- Drop custom enum type
    DROP TYPE IF EXISTS project_role CASCADE;
  `);
}

// Migration metadata
export const migration = {
  id: '003',
  name: 'create_project_members_table',
  description: 'Creates project members junction table with role-based permissions and indexes',
  timestamp: new Date().toISOString()
};
