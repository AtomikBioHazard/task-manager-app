#!/usr/bin/env tsx

import 'dotenv/config';
import { Pool } from 'pg';
import { MigrationRunner } from '#database/migrations/index';
import type { Database } from '#database/types';

const getDatabaseConfig = () => {
  const requiredEnvVars = ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);

  return {
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
};

const createDatabase = (pool: Pool): Database => ({
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
});

async function main() {
  const command = process.argv[2];
  if (!command) throw new Error('Command required: migrate, rollback, status, reset');
  
  const steps = process.argv[3] ? parseInt(process.argv[3]) : undefined;
  const config = getDatabaseConfig();
  const pool = new Pool(config);
  const db = createDatabase(pool);
  
  await db.query('SELECT 1');
  const runner = new MigrationRunner(db);
  
  const commands = {
    migrate: () => runner.runPendingMigrations(),
    up: () => runner.runPendingMigrations(),
    rollback: () => {
      if (!steps) throw new Error('Rollback requires number of steps');
      return runner.rollbackMigrations(steps);
    },
    down: () => {
      if (!steps) throw new Error('Rollback requires number of steps');
      return runner.rollbackMigrations(steps);
    },
    status: () => runner.getStatus(),
    reset: () => runner.reset(),
  };
  
  const commandFn = commands[command as keyof typeof commands];
  if (!commandFn) throw new Error(`Unknown command: ${command}`);
  
  await commandFn();
  await db.close();
}

main();
