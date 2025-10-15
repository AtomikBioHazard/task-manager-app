/**
 * Migration: Create users table
 * 
 * Creates the foundational users table with:
 * - UUID primary key
 * - Unique email constraint
 * - Password hash storage
 * - Timestamps with proper defaults
 * - Strategic indexing for performance
 */

import type { Database } from '#database/types';

export async function up(db: Database): Promise<void> {
  await db.query(`
    -- Enable UUID extension if not already enabled
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Create users table
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ NULL
    );
    
    -- Create unique index on email for login performance
    CREATE UNIQUE INDEX idx_users_email ON users(email);
    
    -- Create partial index on non-deleted users for active user queries
    CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;
    
    -- Create index on created_at for ordering/pagination
    CREATE INDEX idx_users_created_at ON users(created_at);
    
    -- Add comment for documentation
    COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
    COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
    COMMENT ON COLUMN users.email IS 'User email address (unique, used for login)';
    COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password (12+ rounds)';
    COMMENT ON COLUMN users.name IS 'User display name';
    COMMENT ON COLUMN users.created_at IS 'Account creation timestamp';
    COMMENT ON COLUMN users.updated_at IS 'Last profile update timestamp';
    COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp (NULL = active)';
  `);
}

export async function down(db: Database): Promise<void> {
  await db.query(`
    -- Drop users table and all associated indexes
    DROP TABLE IF EXISTS users CASCADE;
    
    -- Extensions are left intact as they may be used by other tables
    -- UUID and pgcrypto extensions are commonly used
  `);
}

// Migration metadata
export const migration = {
  id: '001',
  name: 'create_users_table',
  description: 'Creates users table with UUID primary key, email uniqueness, and performance indexes',
  timestamp: '2025-10-15T00:33:00Z'
};