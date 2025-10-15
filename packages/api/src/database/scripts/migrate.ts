#!/usr/bin/env tsx

/**
 * Migration CLI Script
 * 
 * Command line interface for running database migrations
 * 
 * Usage:
 *   npm run migrate           # Run all pending migrations
 *   npm run migrate:rollback  # Rollback last migration
 *   npm run migrate:status    # Show migration status
 *   npm run migrate:reset     # Reset database (rollback all)
 */

// Load environment variables from .env file
import 'dotenv/config';

import { Pool } from 'pg';
import { MigrationRunner } from '#database/migrations/index.js';
import type { Database } from '#database/types.js';

// Database configuration from environment variables only
const getDatabaseConfig = () => {
  // Validate required environment variables
  const requiredEnvVars = ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. Please set these in your .env file.`);
  }

  const config = {
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };

  console.log(`📊 Database config: ${config.host}:${config.port}/${config.database}`);
  return config;
};

// Create database connection wrapper
const createDatabase = (pool: Pool): Database => {
  return {
    async query<T = any>(text: string, params?: any[]) {
      const result = await pool.query(text, params);
      return {
        rows: result.rows as T[],
        rowCount: result.rowCount ?? 0,
        fields: result.fields,
      };
    },
    
    async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await callback({
          query: client.query.bind(client),
          commit: () => client.query('COMMIT'),
          rollback: () => client.query('ROLLBACK'),
          client,
        });
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
    
    async close() {
      await pool.end();
    },
    
    pool,
  };
};

// Main migration CLI function
async function main() {
  const command = process.argv[2] || 'migrate';
  const steps = parseInt(process.argv[3] || '1');

  console.log(`🚀 Migration CLI - Command: ${command}`);
  
  const config = getDatabaseConfig();
  const pool = new Pool(config);
  const db = createDatabase(pool);
  
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    const runner = new MigrationRunner(db);
    
    switch (command) {
      case 'migrate':
      case 'up':
        console.log('📈 Running pending migrations...');
        await runner.runPendingMigrations();
        break;
        
      case 'rollback':
      case 'down':
        console.log(`📉 Rolling back ${steps} migration(s)...`);
        await runner.rollbackMigrations(steps);
        break;
        
      case 'status':
        console.log('📊 Checking migration status...');
        const status = await runner.getStatus();
        console.log(`
📈 Migration Status:
  Total migrations: ${status.total}
  Executed: ${status.executed}
  Pending: ${status.pending}
  
✅ Executed migrations: ${status.executedList.join(', ') || 'None'}
⏳ Pending migrations: ${status.pendingList.join(', ') || 'None'}
        `);
        break;
        
      case 'reset':
        console.log('⚠️  Resetting database (rolling back ALL migrations)...');
        console.log('This will destroy all data!');
        await runner.reset();
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log(`
📖 Available commands:
  migrate           Run all pending migrations
  rollback [steps]  Rollback N migrations (default: 1)
  status            Show migration status
  reset             Reset database (rollback all migrations)
        `);
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
    console.log('👋 Database connection closed');
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run the CLI
main().catch((error) => {
  console.error('❌ CLI failed:', error);
  process.exit(1);
});