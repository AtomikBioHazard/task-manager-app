import { databaseConfig, type DatabaseConfig } from './database';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  frontendUrl: string;
  database: DatabaseConfig;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  bcrypt: {
    rounds: number;
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_here',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  database: databaseConfig,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },
};

// Validate critical configuration
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is required in production');
}

if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL is required in production');
}

export * from './database';