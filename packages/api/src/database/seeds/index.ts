/**
 * Database Seed Data
 * 
 * Provides sample data for development and testing environments.
 * NEVER run this in production!
 */

import type { Database } from '#database/types';
import * as bcrypt from 'bcryptjs';

/**
 * Sample users for development/testing
 * Passwords are intentionally weak for development convenience
 */
const SAMPLE_USERS = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    name: 'John Doe',
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    name: 'Jane Smith',
  },
  {
    email: 'bob.wilson@example.com',
    password: 'password123',
    name: 'Bob Wilson',
  },
  {
    email: 'alice.johnson@example.com',
    password: 'password123',
    name: 'Alice Johnson',
  },
  {
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
  },
] as const;

/**
 * Sample projects
 */
const SAMPLE_PROJECTS = [
  {
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
  },
  {
    name: 'Mobile App Development',
    description: 'Build native mobile application for iOS and Android platforms',
  },
  {
    name: 'Marketing Campaign Q4',
    description: 'Launch new marketing initiatives for Q4 sales push',
  },
  {
    name: 'Database Migration',
    description: 'Migrate legacy database to PostgreSQL with zero downtime',
  },
  {
    name: 'Customer Portal',
    description: 'Self-service portal for customers to manage accounts and support tickets',
  },
] as const;

/**
 * Sample tasks with various states
 */
const SAMPLE_TASKS = [
  {
    projectIndex: 0,
    title: 'Design mockups for homepage',
    description: 'Create high-fidelity mockups using Figma with responsive layouts',
    status: 'completed' as const,
    priority: 'high' as const,
    assigneeIndex: 1,
  },
  {
    projectIndex: 0,
    title: 'Implement new navigation menu',
    description: 'Build responsive navigation with mobile hamburger menu',
    status: 'in_progress' as const,
    priority: 'high' as const,
    assigneeIndex: 0,
  },
  {
    projectIndex: 0,
    title: 'Setup CDN for assets',
    description: 'Configure CloudFlare CDN for optimized asset delivery',
    status: 'todo' as const,
    priority: 'medium' as const,
    assigneeIndex: null,
  },
  {
    projectIndex: 1,
    title: 'Setup React Native project',
    description: 'Initialize project with TypeScript and navigation',
    status: 'completed' as const,
    priority: 'high' as const,
    assigneeIndex: 0,
  },
  {
    projectIndex: 1,
    title: 'Implement authentication flow',
    description: 'Build login, registration, and forgot password screens',
    status: 'in_progress' as const,
    priority: 'high' as const,
    assigneeIndex: 2,
  },
  {
    projectIndex: 1,
    title: 'Design app icon and splash screen',
    description: 'Create app branding assets for both platforms',
    status: 'todo' as const,
    priority: 'medium' as const,
    assigneeIndex: 1,
  },
  {
    projectIndex: 1,
    title: 'Setup push notifications',
    description: 'Integrate Firebase Cloud Messaging for notifications',
    status: 'todo' as const,
    priority: 'low' as const,
    assigneeIndex: null,
  },
  {
    projectIndex: 2,
    title: 'Create email campaign templates',
    description: 'Design responsive email templates for campaign',
    status: 'in_progress' as const,
    priority: 'high' as const,
    assigneeIndex: 3,
  },
  {
    projectIndex: 2,
    title: 'Setup Google Ads campaign',
    description: 'Configure targeting and budget for Q4 campaign',
    status: 'todo' as const,
    priority: 'high' as const,
    assigneeIndex: null,
  },
  {
    projectIndex: 2,
    title: 'Prepare social media content',
    description: 'Create 30 days of social media posts',
    status: 'todo' as const,
    priority: 'medium' as const,
    assigneeIndex: 3,
  },
  {
    projectIndex: 3,
    title: 'Audit current database schema',
    description: 'Document existing schema and identify issues',
    status: 'completed' as const,
    priority: 'high' as const,
    assigneeIndex: 2,
  },
  {
    projectIndex: 3,
    title: 'Write migration scripts',
    description: 'Create comprehensive migration scripts with rollback',
    status: 'in_progress' as const,
    priority: 'high' as const,
    assigneeIndex: 2,
  },
  {
    projectIndex: 3,
    title: 'Setup replication for zero downtime',
    description: 'Configure streaming replication between old and new database',
    status: 'todo' as const,
    priority: 'high' as const,
    assigneeIndex: null,
  },
  {
    projectIndex: 4,
    title: 'Define portal requirements',
    description: 'Gather requirements from customer success team',
    status: 'completed' as const,
    priority: 'high' as const,
    assigneeIndex: 4,
  },
  {
    projectIndex: 4,
    title: 'Build account dashboard',
    description: 'Create dashboard showing account status and usage',
    status: 'todo' as const,
    priority: 'medium' as const,
    assigneeIndex: 0,
  },
  {
    projectIndex: 4,
    title: 'Implement support ticket system',
    description: 'Allow customers to create and track support tickets',
    status: 'todo' as const,
    priority: 'medium' as const,
    assigneeIndex: null,
  },
] as const;

/**
 * Seed the database with sample data
 */
export async function seedDatabase(db: Database): Promise<void> {
  const hashedPasswords = await Promise.all(
    SAMPLE_USERS.map(user => bcrypt.hash(user.password, 12))
  );
  
  const userIds: string[] = [];
  for (let i = 0; i < SAMPLE_USERS.length; i++) {
    const user = SAMPLE_USERS[i];
    if (!user) continue;
    
    const hash = hashedPasswords[i];
    if (!hash) continue;
    
    const result = await db.query<{ id: string }>(`
      INSERT INTO users (email, password_hash, name)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [user.email, hash, user.name]);
    
    const row = result.rows[0];
    if (row) userIds.push(row.id);
  }
  
  const projectIds: string[] = [];
  for (let i = 0; i < SAMPLE_PROJECTS.length; i++) {
    const project = SAMPLE_PROJECTS[i];
    if (!project) continue;
    
    const ownerIndex = i % userIds.length;
    const ownerId = userIds[ownerIndex];
    if (!ownerId) continue;
    
    const result = await db.query<{ id: string }>(`
      INSERT INTO projects (name, description, owner_id)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [project.name, project.description, ownerId]);
    
    const row = result.rows[0];
    if (row) projectIds.push(row.id);
  }
  
  for (let projectIndex = 0; projectIndex < projectIds.length; projectIndex++) {
    const projectId = projectIds[projectIndex];
    if (!projectId) continue;
    
    const numMembers = Math.floor(Math.random() * 2) + 2;
    const memberIndices = new Set<number>();
    const ownerIndex = projectIndex % userIds.length;
    
    while (memberIndices.size < numMembers) {
      const randomIndex = Math.floor(Math.random() * userIds.length);
      if (randomIndex !== ownerIndex) memberIndices.add(randomIndex);
    }
    
    for (const memberIndex of memberIndices) {
      const userId = userIds[memberIndex];
      if (!userId) continue;
      
      await db.query(`
        INSERT INTO project_members (project_id, user_id, role)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [projectId, userId, 'member']);
    }
  }
  
  for (const task of SAMPLE_TASKS) {
    const projectId = projectIds[task.projectIndex];
    if (!projectId) continue;
    
    const assigneeId = task.assigneeIndex !== null ? userIds[task.assigneeIndex] : null;
    const creatorIndex = task.projectIndex % userIds.length;
    const createdBy = userIds[creatorIndex];
    if (!createdBy) continue;
    
    const completedAt = task.status === 'completed' ? 'NOW()' : 'NULL';
    
    await db.query(`
      INSERT INTO tasks (
        project_id,
        title,
        description,
        status,
        priority,
        assigned_to,
        created_by,
        completed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, ${completedAt})
    `, [
      projectId,
      task.title,
      task.description,
      task.status,
      task.priority,
      assigneeId,
      createdBy,
    ]);
  }
}

/**
 * Clear all seed data from database
 */
export async function clearSeedData(db: Database): Promise<void> {
  await db.query('DELETE FROM tasks');
  await db.query('DELETE FROM project_members');
  await db.query('DELETE FROM projects');
  await db.query('DELETE FROM users');
}

/**
 * Check if database has been seeded
 */
export async function isSeeded(db: Database): Promise<boolean> {
  const result = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM users');
  const row = result.rows[0];
  if (!row) return false;
  
  return parseInt(row.count) > 0;
}
