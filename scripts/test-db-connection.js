#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests PostgreSQL connection with the configured settings
 */

const { Client } = require('pg');
require('dotenv').config();

const config = {
  connectionString: process.env.DATABASE_URL || 'postgresql://dev_user:dev_password@localhost:5433/task_manager_dev',
  connectionTimeoutMillis: 10000,
};

async function testConnection() {
  const client = new Client(config);

  try {
    console.log('🔄 Testing database connection...');
    console.log(`📍 Database URL: ${config.connectionString.replace(/:[^:@]+@/, ':****@')}`);
    
    await client.connect();
    console.log('✅ Connected to database successfully!');

    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, version()');
    console.log('⏰ Database time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);

    // Test extensions
    const extensions = await client.query(`
      SELECT extname 
      FROM pg_extension 
      WHERE extname IN ('uuid-ossp', 'pgcrypto')
    `);
    console.log('🔧 Installed extensions:', extensions.rows.map(r => r.extname).join(', ') || 'none');

    console.log('🎉 Database connection test passed!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Suggestions:');
      console.error('   - Make sure PostgreSQL is running');
      console.error('   - Check if Docker containers are up: docker-compose ps');
      console.error('   - Start database: docker-compose up postgres');
    }
    
    return false;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testConnection;