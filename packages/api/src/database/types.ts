/**
 * Database Types and Interfaces
 * 
 * This file defines TypeScript interfaces for database operations,
 * migrations, and configuration management.
 */

import type { Pool, PoolClient } from 'pg';

/**
 * Database connection configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

/**
 * Database connection interface
 */
export interface Database {
  query<T = any>(text: string, params?: any[]): Promise<DatabaseResult<T>>;
  transaction<T>(callback: (client: DatabaseTransaction) => Promise<T>): Promise<T>;
  close(): Promise<void>;
  pool: Pool;
}

/**
 * Database transaction interface
 */
export interface DatabaseTransaction {
  query<T = any>(text: string, params?: any[]): Promise<DatabaseResult<T>>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  client: PoolClient;
}

/**
 * Database query result
 */
export interface DatabaseResult<T = any> {
  rows: T[];
  rowCount: number;
  fields?: any[];
}

/**
 * Migration interface
 */
export interface Migration {
  id: string;
  name: string;
  filename: string;
  up: (db: Database) => Promise<void>;
  down: (db: Database) => Promise<void>;
}

/**
 * Migration status tracking
 */
export interface MigrationRecord {
  id: string;
  name: string;
  filename: string;
  executed_at: Date;
  execution_time_ms: number;
  checksum: string;
}

/**
 * Migration manager interface
 */
export interface MigrationManager {
  run(): Promise<MigrationResult[]>;
  rollback(steps?: number): Promise<MigrationResult[]>;
  status(): Promise<MigrationStatus>;
  reset(): Promise<void>;
}

/**
 * Migration execution result
 */
export interface MigrationResult {
  id: string;
  name: string;
  action: 'up' | 'down';
  success: boolean;
  executionTimeMs: number;
  error?: string;
}

/**
 * Migration status information
 */
export interface MigrationStatus {
  total: number;
  executed: number;
  pending: number;
  executedMigrations: MigrationRecord[];
  pendingMigrations: string[];
}

/**
 * Seed data interface
 */
export interface SeedData {
  name: string;
  run: (db: Database) => Promise<void>;
  dependencies?: string[];
}

/**
 * Database table column definition
 */
export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: {
    table: string;
    column: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  };
}

/**
 * Database index definition
 */
export interface TableIndex {
  name: string;
  columns: string[];
  unique?: boolean;
  partial?: boolean;
  condition?: string;
}

/**
 * Database table definition
 */
export interface TableDefinition {
  name: string;
  columns: TableColumn[];
  indexes?: TableIndex[];
  constraints?: string[];
}

/**
 * Database schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingTables: string[];
  extraTables: string[];
  columnMismatches: {
    table: string;
    column: string;
    expected: string;
    actual: string;
  }[];
}

/**
 * Database health check result
 */
export interface DatabaseHealthCheck {
  connected: boolean;
  latencyMs: number;
  version: string;
  activeConnections: number;
  error?: string;
}

/**
 * Query performance metrics
 */
export interface QueryMetrics {
  query: string;
  executionTimeMs: number;
  rowsAffected: number;
  timestamp: Date;
}

/**
 * Database statistics
 */
export interface DatabaseStats {
  totalQueries: number;
  averageQueryTimeMs: number;
  slowQueries: QueryMetrics[];
  connectionPoolStats: {
    total: number;
    idle: number;
    waiting: number;
  };
}

/**
 * Migration file structure
 */
export interface MigrationFile {
  id: string;
  name: string;
  filename: string;
  path: string;
  checksum: string;
  content: string;
}

/**
 * Database environment configuration
 */
export type DatabaseEnvironment = 'development' | 'test' | 'staging' | 'production';

/**
 * Environment-specific database configuration
 */
export interface DatabaseEnvironmentConfig {
  environment: DatabaseEnvironment;
  config: DatabaseConfig;
  migrationPath: string;
  seedPath?: string;
  enableLogging?: boolean;
  enableMetrics?: boolean;
}

/**
 * Connection pool configuration
 */
export interface PoolConfig {
  min: number;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
  acquireTimeoutMillis: number;
}

/**
 * Database query builder result
 */
export interface QueryBuilder<T = any> {
  select(columns?: string[]): QueryBuilder<T>;
  from(table: string): QueryBuilder<T>;
  where(condition: string, params?: any[]): QueryBuilder<T>;
  join(table: string, condition: string): QueryBuilder<T>;
  leftJoin(table: string, condition: string): QueryBuilder<T>;
  orderBy(column: string, direction?: 'ASC' | 'DESC'): QueryBuilder<T>;
  groupBy(columns: string[]): QueryBuilder<T>;
  having(condition: string, params?: any[]): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  offset(count: number): QueryBuilder<T>;
  toSQL(): { text: string; values: any[] };
  execute(): Promise<T[]>;
  first(): Promise<T | null>;
}

/**
 * Repository base interface
 */
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filters?: Record<string, any>): Promise<number>;
}

/**
 * Paginated result interface
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * Database backup configuration
 */
export interface BackupConfig {
  outputPath: string;
  includeData?: boolean;
  includeSchema?: boolean;
  compression?: boolean;
  encryptionKey?: string;
}

/**
 * Database restore configuration
 */
export interface RestoreConfig {
  backupPath: string;
  dropExisting?: boolean;
  dataOnly?: boolean;
  schemaOnly?: boolean;
  decryptionKey?: string;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  table: string;
  recordId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Database event types
 */
export type DatabaseEvent = 
  | 'connection:open'
  | 'connection:close'
  | 'connection:error'
  | 'query:start'
  | 'query:end'
  | 'query:error'
  | 'migration:start'
  | 'migration:end'
  | 'migration:error'
  | 'transaction:start'
  | 'transaction:commit'
  | 'transaction:rollback';

/**
 * Database event listener
 */
export interface DatabaseEventListener {
  (event: DatabaseEvent, data?: any): void;
}