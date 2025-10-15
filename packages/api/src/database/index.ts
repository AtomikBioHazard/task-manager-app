/**
 * Database Module Index
 * 
 * This module exports all database-related types, interfaces, and utilities
 * for the Task Manager application.
 * 
 * @module Database
 */

// Export all database types and interfaces
export * from './types';

// Re-export PostgreSQL types for convenience
export type { Pool, PoolClient, QueryResult } from 'pg';

/**
 * Database module documentation and usage guidelines
 */
export const DATABASE_MODULE_INFO = {
  name: 'Task Manager Database Module',
  version: '1.0.0',
  description: 'Complete database abstraction layer with migration support',
  
  /**
   * File structure overview
   */
  structure: {
    'schema-design.md': 'Comprehensive database schema documentation',
    'ERD.md': 'Entity Relationship Diagram with Mermaid visualization',
    'types.ts': 'TypeScript interfaces and types for database operations',
    'index.ts': 'Module exports and documentation (this file)',
    'migrations/': 'Database migration files (to be created in T006)',
    'seeds/': 'Seed data files (to be created in T007)',
  },

  /**
   * Key design principles
   */
  principles: [
    'Multi-tenant data isolation',
    'Type-safe database operations',
    'Performance-optimized queries',
    'Secure parameterized queries',
    'Reversible migrations',
    'Comprehensive error handling',
  ],

  /**
   * Security features
   */
  security: [
    'SQL injection prevention via parameterized queries',
    'Permission-based data access',
    'User session validation',
    'Audit logging capability',
    'Encrypted sensitive data',
  ],

  /**
   * Performance features
   */
  performance: [
    'Strategic database indexing',
    'Connection pooling',
    'Query optimization',
    'Lazy loading support',
    'Caching layer ready',
  ],

  /**
   * Supported operations
   */
  operations: [
    'CRUD operations with type safety',
    'Complex joins and aggregations',
    'Transaction management',
    'Migration management',
    'Seed data management',
    'Schema validation',
    'Performance monitoring',
  ],
} as const;

/**
 * Database table names as constants
 * These match the schema design exactly
 */
export const TABLE_NAMES = {
  USERS: 'users',
  PROJECTS: 'projects', 
  PROJECT_MEMBERS: 'project_members',
  TASKS: 'tasks',
  // Future tables
  TASK_COMMENTS: 'task_comments',
  TASK_ATTACHMENTS: 'task_attachments',
  ACTIVITY_LOGS: 'activity_logs',
  MIGRATIONS: 'schema_migrations',
} as const;

/**
 * Database enum types as constants
 * These match the PostgreSQL ENUM definitions
 */
export const ENUM_TYPES = {
  PROJECT_ROLE: ['owner', 'member'] as const,
  TASK_STATUS: ['pending', 'completed'] as const,
  TASK_PRIORITY: ['low', 'medium', 'high'] as const,
} as const;

/**
 * Database field length constraints
 * These match the schema design VARCHAR limits
 */
export const FIELD_LIMITS = {
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 255,
  TITLE_MAX_LENGTH: 255,
  CATEGORY_MAX_LENGTH: 100,
  PASSWORD_HASH_LENGTH: 255,
} as const;

/**
 * Query timeout configurations (in milliseconds)
 */
export const TIMEOUTS = {
  DEFAULT_QUERY: 30000,    // 30 seconds
  MIGRATION: 300000,       // 5 minutes
  LONG_RUNNING: 600000,    // 10 minutes
  CONNECTION: 10000,       // 10 seconds
} as const;

/**
 * Connection pool configurations
 */
export const POOL_CONFIG = {
  MIN_CONNECTIONS: 2,
  MAX_CONNECTIONS: 20,
  IDLE_TIMEOUT: 30000,     // 30 seconds
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  ACQUIRE_TIMEOUT: 60000,   // 60 seconds
} as const;

/**
 * Migration configuration
 */
export const MIGRATION_CONFIG = {
  TABLE_NAME: 'schema_migrations',
  DIRECTORY: './src/database/migrations',
  PATTERN: /^\d{3}_[\w_]+\.(ts|js|sql)$/,
  BATCH_SIZE: 10,
} as const;

/**
 * Seed configuration
 */
export const SEED_CONFIG = {
  DIRECTORY: './src/database/seeds',
  PATTERN: /^[\w_]+\.(ts|js)$/,
  ENVIRONMENTS: ['development', 'test'] as const,
} as const;

/**
 * Error codes for database operations
 */
export const ERROR_CODES = {
  CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  QUERY_TIMEOUT: 'DB_QUERY_TIMEOUT',
  TRANSACTION_FAILED: 'DB_TRANSACTION_FAILED',
  MIGRATION_FAILED: 'DB_MIGRATION_FAILED',
  CONSTRAINT_VIOLATION: 'DB_CONSTRAINT_VIOLATION',
  DUPLICATE_KEY: 'DB_DUPLICATE_KEY',
  FOREIGN_KEY_VIOLATION: 'DB_FOREIGN_KEY_VIOLATION',
  NOT_NULL_VIOLATION: 'DB_NOT_NULL_VIOLATION',
  CHECK_VIOLATION: 'DB_CHECK_VIOLATION',
  INVALID_INPUT: 'DB_INVALID_INPUT',
  PERMISSION_DENIED: 'DB_PERMISSION_DENIED',
  TABLE_NOT_FOUND: 'DB_TABLE_NOT_FOUND',
  COLUMN_NOT_FOUND: 'DB_COLUMN_NOT_FOUND',
} as const;

/**
 * Standard HTTP status codes for database errors
 */
export const HTTP_STATUS_CODES = {
  [ERROR_CODES.CONNECTION_FAILED]: 503,        // Service Unavailable
  [ERROR_CODES.QUERY_TIMEOUT]: 408,           // Request Timeout
  [ERROR_CODES.TRANSACTION_FAILED]: 500,      // Internal Server Error
  [ERROR_CODES.MIGRATION_FAILED]: 500,        // Internal Server Error
  [ERROR_CODES.CONSTRAINT_VIOLATION]: 400,    // Bad Request
  [ERROR_CODES.DUPLICATE_KEY]: 409,           // Conflict
  [ERROR_CODES.FOREIGN_KEY_VIOLATION]: 400,   // Bad Request
  [ERROR_CODES.NOT_NULL_VIOLATION]: 400,      // Bad Request
  [ERROR_CODES.CHECK_VIOLATION]: 400,         // Bad Request
  [ERROR_CODES.INVALID_INPUT]: 400,           // Bad Request
  [ERROR_CODES.PERMISSION_DENIED]: 403,       // Forbidden
  [ERROR_CODES.TABLE_NOT_FOUND]: 500,         // Internal Server Error
  [ERROR_CODES.COLUMN_NOT_FOUND]: 500,        // Internal Server Error
} as const;

/**
 * Type guards for database types
 */
export const isProjectRole = (value: any): value is typeof ENUM_TYPES.PROJECT_ROLE[number] => {
  return typeof value === 'string' && ENUM_TYPES.PROJECT_ROLE.includes(value as any);
};

export const isTaskStatus = (value: any): value is typeof ENUM_TYPES.TASK_STATUS[number] => {
  return typeof value === 'string' && ENUM_TYPES.TASK_STATUS.includes(value as any);
};

export const isTaskPriority = (value: any): value is typeof ENUM_TYPES.TASK_PRIORITY[number] => {
  return typeof value === 'string' && ENUM_TYPES.TASK_PRIORITY.includes(value as any);
};

export const isDatabaseEnvironment = (value: any): value is 'development' | 'test' | 'staging' | 'production' => {
  return typeof value === 'string' && ['development', 'test', 'staging', 'production'].includes(value);
};

/**
 * Database utility functions
 */
export const DatabaseUtils = {
  /**
   * Generate a standardized table name
   */
  tableName: (name: keyof typeof TABLE_NAMES): string => TABLE_NAMES[name],

  /**
   * Generate a standardized index name
   */
  indexName: (table: string, columns: string[], unique = false): string => {
    const prefix = unique ? 'uidx' : 'idx';
    const columnList = columns.join('_');
    return `${prefix}_${table}_${columnList}`;
  },

  /**
   * Generate a standardized foreign key constraint name
   */
  foreignKeyName: (table: string, column: string, refTable: string): string => {
    return `fk_${table}_${column}_${refTable}`;
  },

  /**
   * Generate a standardized check constraint name
   */
  checkConstraintName: (table: string, constraint: string): string => {
    return `chk_${table}_${constraint}`;
  },

  /**
   * Validate UUID format
   */
  isValidUUID: (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  /**
   * Sanitize string for SQL LIKE queries
   */
  sanitizeForLike: (value: string): string => {
    return value.replace(/[%_\\]/g, '\\$&');
  },

  /**
   * Build ORDER BY clause from sort parameters
   */
  buildOrderBy: (sortBy?: string, sortDirection: 'ASC' | 'DESC' = 'ASC'): string => {
    if (!sortBy) return '';
    return `ORDER BY ${sortBy} ${sortDirection}`;
  },

  /**
   * Build LIMIT/OFFSET clause from pagination parameters
   */
  buildPagination: (page: number, pageSize: number): { limit: number; offset: number } => {
    const limit = Math.max(1, Math.min(pageSize, 100)); // Max 100 items per page
    const offset = Math.max(0, (page - 1) * limit);
    return { limit, offset };
  },
} as const;

/**
 * Database module exports summary
 */
export default {
  info: DATABASE_MODULE_INFO,
  tables: TABLE_NAMES,
  enums: ENUM_TYPES,
  limits: FIELD_LIMITS,
  timeouts: TIMEOUTS,
  pool: POOL_CONFIG,
  migrations: MIGRATION_CONFIG,
  seeds: SEED_CONFIG,
  errors: ERROR_CODES,
  httpStatus: HTTP_STATUS_CODES,
  typeGuards: { isProjectRole, isTaskStatus, isTaskPriority, isDatabaseEnvironment },
  utils: DatabaseUtils,
} as const;