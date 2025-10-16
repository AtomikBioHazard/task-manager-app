/**
 * Database Migrations Index
 * 
 * This file registers all database migrations and provides utilities
 * for running them in the correct order.
 */

import type { Database, Migration } from '#database/types';

// Import all migration modules
import * as migration001 from '#database/migrations/001_create_users_table';
import * as migration002 from '#database/migrations/002_create_projects_table';
import * as migration003 from '#database/migrations/003_create_project_members_table';
import * as migration004 from '#database/migrations/004_create_tasks_table';

/**
 * Registered migrations in execution order
 * CRITICAL: This order must not change once deployed
 */
export const migrations: Migration[] = [
  {
    id: '001',
    name: 'create_users_table',
    filename: '001_create_users_table.ts',
    up: migration001.up,
    down: migration001.down,
  },
  {
    id: '002',
    name: 'create_projects_table',
    filename: '002_create_projects_table.ts',
    up: migration002.up,
    down: migration002.down,
  },
  {
    id: '003',
    name: 'create_project_members_table',
    filename: '003_create_project_members_table.ts',
    up: migration003.up,
    down: migration003.down,
  },
  {
    id: '004',
    name: 'create_tasks_table',
    filename: '004_create_tasks_table.ts',
    up: migration004.up,
    down: migration004.down,
  },
];

/**
 * Migration utilities and runner functions
 */
export class MigrationRunner {
  constructor(private db: Database) {}

  /**
   * Ensure the migrations tracking table exists
   */
  async ensureMigrationsTable(): Promise<void> {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW(),
        execution_time_ms INTEGER NOT NULL,
        checksum VARCHAR(255) NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_schema_migrations_executed_at 
        ON schema_migrations(executed_at);
    `);
  }

  /**
   * Get list of executed migrations
   */
  async getExecutedMigrations(): Promise<string[]> {
    const result = await this.db.query<{ id: string }>(
      'SELECT id FROM schema_migrations ORDER BY executed_at'
    );
    return result.rows.map(row => row.id);
  }

  /**
   * Get pending migrations
   */
  async getPendingMigrations(): Promise<Migration[]> {
    const executed = await this.getExecutedMigrations();
    return migrations.filter(migration => !executed.includes(migration.id));
  }

  /**
   * Run a single migration up
   */
  async runMigrationUp(migration: Migration): Promise<void> {
    const startTime = Date.now();
    
    await migration.up(this.db).catch((error) => {
      throw new Error(`Migration ${migration.id} (${migration.name}) failed: ${error.message}`);
    });
    
    const executionTime = Date.now() - startTime;
    const checksum = this.calculateChecksum(migration);
    
    await this.db.query(`
      INSERT INTO schema_migrations (id, name, filename, execution_time_ms, checksum)
      VALUES ($1, $2, $3, $4, $5)
    `, [migration.id, migration.name, migration.filename, executionTime, checksum]);
  }

  /**
   * Run a single migration down
   */
  async runMigrationDown(migration: Migration): Promise<void> {
    await migration.down(this.db).catch((error) => {
      throw new Error(`Migration rollback ${migration.id} (${migration.name}) failed: ${error.message}`);
    });
    
    await this.db.query(
      'DELETE FROM schema_migrations WHERE id = $1',
      [migration.id]
    );
  }

  /**
   * Run all pending migrations
   */
  async runPendingMigrations(): Promise<void> {
    await this.ensureMigrationsTable();
    const pending = await this.getPendingMigrations();
    if (pending.length === 0) return;
    
    for (const migration of pending) await this.runMigrationUp(migration);
  }

  /**
   * Rollback the last N migrations
   */
  async rollbackMigrations(steps: number): Promise<void> {
    const executed = await this.getExecutedMigrations();
    const toRollback = executed.slice(-steps).reverse();
    if (toRollback.length === 0) return;
    
    for (const migrationId of toRollback) {
      const migration = migrations.find(m => m.id === migrationId);
      if (migration) await this.runMigrationDown(migration);
    }
  }

  /**
   * Get migration status
   */
  async getStatus(): Promise<{
    total: number;
    executed: number;
    pending: number;
    executedList: string[];
    pendingList: string[];
  }> {
    await this.ensureMigrationsTable();
    
    const executed = await this.getExecutedMigrations();
    const pending = await this.getPendingMigrations();
    
    return {
      total: migrations.length,
      executed: executed.length,
      pending: pending.length,
      executedList: executed,
      pendingList: pending.map(m => m.id),
    };
  }

  /**
   * Reset database (rollback all migrations)
   */
  async reset(): Promise<void> {
    const executed = await this.getExecutedMigrations();
    await this.rollbackMigrations(executed.length);
  }

  /**
   * Calculate checksum for migration consistency
   */
  private calculateChecksum(migration: Migration): string {
    const content = migration.up.toString() + migration.down.toString();
    // Simple checksum - in production, use crypto.createHash
    return Buffer.from(content).toString('base64').slice(0, 32);
  }
}

/**
 * Convenience functions for common operations
 */
export async function runMigrations(db: Database): Promise<void> {
  const runner = new MigrationRunner(db);
  await runner.runPendingMigrations();
}

export async function rollbackMigrations(db: Database, steps: number): Promise<void> {
  const runner = new MigrationRunner(db);
  await runner.rollbackMigrations(steps);
}

export async function getMigrationStatus(db: Database) {
  const runner = new MigrationRunner(db);
  return await runner.getStatus();
}

export async function resetDatabase(db: Database): Promise<void> {
  const runner = new MigrationRunner(db);
  await runner.reset();
}

/**
 * Migration metadata for documentation
 */
export const MIGRATION_INFO = {
  totalMigrations: migrations.length,
  description: 'Complete database schema for Task Manager application',
  tables: ['users', 'projects', 'project_members', 'tasks'],
  features: [
    'UUID primary keys throughout',
    'Multi-tenant data isolation',
    'Role-based permissions',
    'Performance-optimized indexes',
    'Reversible migrations',
    'Business logic constraints',
  ],
} as const;
