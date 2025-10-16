/**
 * Migration: Create tasks table
 * 
 * Creates the tasks table with:
 * - UUID primary key
 * - Multiple foreign key relationships
 * - Status and priority enums
 * - Assignment functionality
 * - Comprehensive indexes for task management queries
 */

import type { Database } from '#database/types';

export async function up(db: Database): Promise<void> {
  await db.query(`
    -- Create task status enum type
    CREATE TYPE task_status AS ENUM ('pending', 'completed');
    
    -- Create task priority enum type
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
    
    -- Create tasks table
    CREATE TABLE tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status task_status NOT NULL DEFAULT 'pending',
      priority task_priority NOT NULL DEFAULT 'medium',
      assigned_to UUID,
      created_by UUID NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      due_date TIMESTAMPTZ,
      
      -- Foreign key constraints
      CONSTRAINT fk_tasks_project_id FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE,
      CONSTRAINT fk_tasks_assigned_to FOREIGN KEY (assigned_to) 
        REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_tasks_created_by FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE CASCADE,
      
      -- Business logic constraints
      CONSTRAINT chk_tasks_completed_at CHECK (
        (status = 'completed' AND completed_at IS NOT NULL) OR 
        (status = 'pending' AND completed_at IS NULL)
      )
    );
    
    -- Create index on project_id for project's tasks queries
    CREATE INDEX idx_tasks_project_id ON tasks(project_id);
    
    -- Create index on assigned_to for user's assigned tasks
    CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
    
    -- Create index on created_by for user's created tasks
    CREATE INDEX idx_tasks_created_by ON tasks(created_by);
    
    -- Create index on status for filtering tasks
    CREATE INDEX idx_tasks_status ON tasks(status);
    
    -- Create index on priority for filtering and sorting
    CREATE INDEX idx_tasks_priority ON tasks(priority);
    
    -- Create index on created_at for ordering/pagination
    CREATE INDEX idx_tasks_created_at ON tasks(created_at);
    
    -- Create index on updated_at for sorting by recent activity
    CREATE INDEX idx_tasks_updated_at ON tasks(updated_at);
    
    -- Create index on due_date for deadline queries
    CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
    
    -- Create composite indexes for common query patterns
    CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
    CREATE INDEX idx_tasks_project_priority ON tasks(project_id, priority);
    CREATE INDEX idx_tasks_project_assigned ON tasks(project_id, assigned_to);
    CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status) WHERE assigned_to IS NOT NULL;
    CREATE INDEX idx_tasks_created_by_status ON tasks(created_by, status);
    
    -- Create index for completed tasks with completion date
    CREATE INDEX idx_tasks_completed ON tasks(completed_at) WHERE status = 'completed';
    
    -- Create index for tasks with due dates (overdue checks done at query time)
    CREATE INDEX idx_tasks_due_status ON tasks(due_date, status) 
      WHERE due_date IS NOT NULL AND status = 'pending';
    
    -- Add comments for documentation
    COMMENT ON TABLE tasks IS 'Tasks within projects with assignment and status tracking';
    COMMENT ON COLUMN tasks.id IS 'Unique task identifier (UUID)';
    COMMENT ON COLUMN tasks.project_id IS 'Reference to parent project';
    COMMENT ON COLUMN tasks.title IS 'Task title/summary';
    COMMENT ON COLUMN tasks.description IS 'Optional detailed task description';
    COMMENT ON COLUMN tasks.status IS 'Task completion status (pending, completed)';
    COMMENT ON COLUMN tasks.priority IS 'Task priority level (low, medium, high)';
    COMMENT ON COLUMN tasks.assigned_to IS 'Reference to user assigned to task (optional)';
    COMMENT ON COLUMN tasks.created_by IS 'Reference to user who created the task';
    COMMENT ON COLUMN tasks.created_at IS 'Task creation timestamp';
    COMMENT ON COLUMN tasks.updated_at IS 'Last task update timestamp';
    COMMENT ON COLUMN tasks.completed_at IS 'Task completion timestamp (set when status = completed)';
    COMMENT ON COLUMN tasks.due_date IS 'Optional task due date';
  `);
}

export async function down(db: Database): Promise<void> {
  await db.query(`
    -- Drop tasks table and all associated indexes
    DROP TABLE IF EXISTS tasks CASCADE;
    
    -- Drop custom enum types
    DROP TYPE IF EXISTS task_status CASCADE;
    DROP TYPE IF EXISTS task_priority CASCADE;
  `);
}

// Migration metadata
export const migration = {
  id: '004',
  name: 'create_tasks_table',
  description: 'Creates tasks table with status/priority enums, assignment functionality, and comprehensive indexes',
  timestamp: new Date().toISOString()
};
