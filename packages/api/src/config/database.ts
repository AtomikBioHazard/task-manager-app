export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
  connectionTimeoutMs: number;
}

export const databaseConfig: DatabaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://dev_user:dev_password@localhost:5433/task_manager_dev',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  database: process.env.POSTGRES_DB || 'task_manager_dev',
  user: process.env.POSTGRES_USER || 'dev_user',
  password: process.env.POSTGRES_PASSWORD || 'dev_password',
  ssl: process.env.NODE_ENV === 'production',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
  connectionTimeoutMs: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '10000', 10),
};