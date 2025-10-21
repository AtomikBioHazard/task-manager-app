/**
 * Database Seed CLI Script
 * 
 * Usage:
 *   npm run db:seed          - Seed database with sample data
 *   npm run db:seed --clear  - Clear existing seed data
 * 
 * WARNING: Only use in development/testing environments!
 */

import { Pool } from 'pg';
import { seedDatabase, clearSeedData, isSeeded } from '#database/seeds';
import type { Database } from '#database/types';

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
] as const;

function validateEnvironment(): void {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please ensure all database connection variables are set in .env file.'
    );
  }
}

const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');
const forceReseed = args.includes('--force');

async function main(): Promise<void> {
  validateEnvironment();
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  
  const db: Database = {
    query: async (text, params) => {
      return await pool.query(text, params);
    },
  };
  
  if (shouldClear) {
    const seeded = await isSeeded(db);
    
    if (!seeded) {
      await pool.end();
      return;
    }
    
    await clearSeedData(db);
    await pool.end();
    return;
  }
  
  const seeded = await isSeeded(db);
  
  if (seeded && !forceReseed) {
    await pool.end();
    throw new Error('Database already contains data. Use --force to reseed or --clear to remove existing data');
  }
  
  if (forceReseed && seeded) await clearSeedData(db);
  
  await seedDatabase(db);
  await pool.end();
}

main().catch((error: Error) => {
  throw error;
});
