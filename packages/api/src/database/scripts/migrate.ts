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
  const requiredEnvVars = ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) throw new Error(`Missing required environment variables: ${missing.join(', ')}. Please set these in your .env file.`);

  return {
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
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
      await client.query('BEGIN');
      
      const result = await callback({
        query: client.query.bind(client),
        commit: () => client.query('COMMIT'),
        rollback: () => client.query('ROLLBACK'),
        client,
      }).catch(async (error) => {
        await client.query('ROLLBACK');
        throw error;
      });
      
      await client.query('COMMIT');
      client.release();
      return result;
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

  const config = getDatabaseConfig();
  const pool = new Pool(config);
  const db = createDatabase(pool);
  
  // Test database connection
  await db.query('SELECT NOW()');
  
  const runner = new MigrationRunner(db);
  
  const commands = {
    migrate: () => runner.runPendingMigrations(),
    up: () => runner.runPendingMigrations(),
    rollback: () => runner.rollbackMigrations(steps),
    down: () => runner.rollbackMigrations(steps),
    status: async () => {
      const status = await runner.getStatus();
      return status;
    },
    reset: () => runner.reset(),
  };
  
  const commandFn = commands[command as keyof typeof commands];
  if (!commandFn) throw new Error(`Unknown command: ${command}. Available: ${Object.keys(commands).join(', ')}`);
  
  await commandFn().catch((error) => {
    throw new Error(`Migration command '${command}' failed: ${error.message}`);
  });
  
  await db.close();
}

// Run the CLI
main().catch((error) => {
  throw new Error(`Migration CLI failed: ${error.message}`);
});
