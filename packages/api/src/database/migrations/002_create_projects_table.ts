/**
 * Migration: Create projects table
 * 
 * Creates the projects table with:
 * - UUID primary key
 * - Foreign key relationship to users (owner)
 * - Project name and description
 * - Timestamps with proper defaults
 * - Performance indexes for user queries
 */

import type { Database } from '#database/types';

export async function up(db: Database): Promise<void> {
  await db.query(`
    -- Create projects table
    CREATE TABLE projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      owner_id UUID NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ NULL,
      
      -- Foreign key constraint to users table
      CONSTRAINT fk_projects_owner_id FOREIGN KEY (owner_id) 
        REFERENCES users(id) ON DELETE CASCADE
    );
    
    -- Create index on owner_id for user's projects queries
    CREATE INDEX idx_projects_owner_id ON projects(owner_id);
    
    -- Create partial index on non-deleted projects for active project queries
    CREATE INDEX idx_projects_active ON projects(id) WHERE deleted_at IS NULL;
    
    -- Create composite index for user's active projects
    CREATE INDEX idx_projects_owner_active ON projects(owner_id) 
      WHERE deleted_at IS NULL;
    
    -- Create index on created_at for ordering/pagination
    CREATE INDEX idx_projects_created_at ON projects(created_at);
    
    -- Create index on name for search functionality
    CREATE INDEX idx_projects_name ON projects(name);
    
    -- Add comments for documentation
    COMMENT ON TABLE projects IS 'Projects owned by users, container for tasks and collaboration';
    COMMENT ON COLUMN projects.id IS 'Unique project identifier (UUID)';
    COMMENT ON COLUMN projects.name IS 'Project display name';
    COMMENT ON COLUMN projects.description IS 'Optional project description';
    COMMENT ON COLUMN projects.owner_id IS 'Reference to user who owns this project';
    COMMENT ON COLUMN projects.created_at IS 'Project creation timestamp';
    COMMENT ON COLUMN projects.updated_at IS 'Last project update timestamp';
    COMMENT ON COLUMN projects.deleted_at IS 'Soft delete timestamp (NULL = active)';
  `);
}

export async function down(db: Database): Promise<void> {
  await db.query(`
    -- Drop projects table and all associated indexes
    DROP TABLE IF EXISTS projects CASCADE;
  `);
}

// Migration metadata
export const migration = {
  id: '002',
  name: 'create_projects_table',
  description: 'Creates projects table with owner relationship and performance indexes',
  timestamp: new Date().toISOString()
};
