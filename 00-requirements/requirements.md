# Project Requirements: Task Manager Application

## Project Information
- **Project Name**: Task Manager App
- **Project ID**: TMA-001
- **Tech Lead**: Dietrich (abh)
- **Start Date**: 2025-09-19
- **Target Completion**: 4 weeks
- **Budget**: $0 (Free tier only)

## Project Overview
A web-based task management application that allows users to create, organize, and track their tasks with support for multiple projects and team collaboration. This will be a simplified version of tools like Trello or Todoist, focusing on core task management features with a clean, intuitive interface.

## Business Objectives
1. Provide users with a simple way to organize their daily tasks across multiple projects
2. Enable basic team collaboration and task sharing
3. Help users track task completion and productivity
4. Create a responsive application usable on desktop and mobile
5. Demonstrate modern web development practices
6. Test multi-agent development system effectiveness

## Target Users
- Individual users who need to manage personal tasks across multiple projects
- Small teams (2-5 people) who need basic task coordination
- Age range: 18-65
- Technical proficiency: Basic to intermediate

## Functional Requirements

### Must Have (P0)
- [ ] User authentication (register, login, logout)
- [ ] Multiple projects/lists per user
- [ ] Create tasks with title and description
- [ ] Assign tasks to projects
- [ ] Share projects with other users (basic collaboration)
- [ ] Mark tasks as complete/incomplete
- [ ] Delete tasks
- [ ] View all tasks in a list
- [ ] Filter tasks by status (all/active/completed)
- [ ] Basic task categories/tags

### Should Have (P1)
- [ ] Edit existing tasks
- [ ] Set task priority (high/medium/low)
- [ ] Set due dates for tasks
- [ ] Search tasks by title/description
- [ ] Task sorting (by date, priority, status)
- [ ] User profile management
- [ ] Project member management (add/remove users)

### Could Have (P2)
- [ ] Task notes/comments
- [ ] Subtasks/checklists
- [ ] Task archiving
- [ ] Export tasks to CSV
- [ ] Dark mode toggle
- [ ] Activity log per project

### Won't Have (This Release)
- [ ] Real-time updates (WebSockets)
- [ ] Mobile native apps
- [ ] Calendar integration
- [ ] Email notifications
- [ ] File attachments

## Non-Functional Requirements
- **Performance**: 
  - Page load time < 2 seconds
  - Task operations < 500ms response time
- **Security**: 
  - Secure password hashing (bcrypt)
  - JWT-based authentication
  - Input validation and sanitization
  - HTTPS in production (via free SSL)
- **Scalability**: 
  - Support up to 100 concurrent users (free tier limits)
  - Database optimization for 10k+ tasks
- **Availability**: 
  - 99% uptime target (best effort on free tier)
  - Proper error handling and user feedback
- **Accessibility**: 
  - WCAG 2.1 AA compliance
  - Keyboard navigation support
  - Screen reader compatibility

## Technical Constraints - FREE TIER STACK
- **Tech Stack**: 
  - Frontend: React 18+ with TypeScript, Tailwind CSS
  - Backend: Node.js with Express, TypeScript
  - Database: **PostgreSQL (local development) + Supabase (free tier - 500MB)**
  - Authentication: JWT tokens
  - File Storage: None (no file uploads to save costs)
  
- **Hosting & Services (All Free)**:
  - Frontend: **Vercel Free Tier** (unlimited bandwidth, 100GB/month)
  - Backend: **Render Free Tier** (750 hours/month) OR **Railway Free Trial**
  - Database: **Supabase Free Tier** (500MB, 2GB bandwidth/month)
  - CI/CD: **GitHub Actions Free** (2000 minutes/month for public repos)
  - SSL: **Let's Encrypt** (free, auto-provisioned by Vercel/Render)
  - Domain: **Free subdomain** from Vercel/Render (yourapp.vercel.app)
  - Monitoring: **UptimeRobot Free** (50 monitors)
  
- **Development Tools (Free)**:
  - Version Control: GitHub (free for public repos)
  - Project Management: GitHub Projects (free)
  - API Testing: Thunder Client (VS Code) or Bruno (open source)
  - Database Client: DBeaver (free) or Supabase Dashboard

- **Browser Support**: 
  - Chrome (last 2 versions)
  - Firefox (last 2 versions)
  - Safari (last 2 versions)
  - Edge (last 2 versions)

## Technical Architecture (Free Tier)
```
Frontend (React + TypeScript)
    ↓ REST API (HTTPS)
Backend (Express + TypeScript) on Render Free
    ↓ SQL Queries
Database (Supabase PostgreSQL Free Tier)

CI/CD: GitHub Actions (Free)
Hosting: Vercel (Frontend) + Render (Backend)
Monitoring: UptimeRobot (Free)
```

## Free Tier Limitations to Consider
1. **Render Free Tier**: Apps spin down after 15 mins inactivity (cold start ~30s)
2. **Supabase Free**: 500MB database size limit, 2GB bandwidth/month
3. **GitHub Actions**: 2000 minutes/month (sufficient for our needs)
4. **No custom domain**: Will use free subdomains
5. **No email service**: No password reset emails (manual admin reset only)

## Success Criteria
1. Users can complete the full task lifecycle (create, read, update, delete)
2. Multiple projects per user working correctly
3. Basic task sharing between users functional
4. Authentication works securely with proper session management
5. Application is responsive and works on mobile devices
6. Test coverage > 70% for both frontend and backend
7. No critical security vulnerabilities
8. Application deployed and accessible via public URL (free subdomain)
9. **All infrastructure costs: $0/month**

## Known Risks
1. **Free tier cold starts** - Impact: Medium
   - Mitigation: Keep-alive pings, set user expectations
2. **Database size limit (500MB)** - Impact: Low (for testing)
   - Mitigation: Data cleanup, archiving strategy
3. **Authentication complexity** - Impact: Medium
   - Mitigation: Use established libraries (passport.js, bcrypt)
4. **Scope creep with collaboration features** - Impact: High
   - Mitigation: MVP first, collaboration as phase 2
5. **Free tier service reliability** - Impact: Medium
   - Mitigation: Accept limitations, document workarounds

## Dependencies
- **External APIs**: None (avoiding costs)
- **Free Services**: Supabase, Vercel, Render, GitHub Actions
- **Other Projects**: None
- **Stakeholders**: Tech Lead (you), Development team (agents)

## API Endpoints (Preliminary)
```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Projects:
GET    /api/projects              (list user's projects)
POST   /api/projects              (create project)
GET    /api/projects/:id          (get project details)
PUT    /api/projects/:id          (update project)
DELETE /api/projects/:id          (delete project)
POST   /api/projects/:id/members  (add member to project)
DELETE /api/projects/:id/members/:userId (remove member)

Tasks:
GET    /api/projects/:projectId/tasks       (list tasks in project)
POST   /api/projects/:projectId/tasks       (create task)
GET    /api/tasks/:id                       (get specific task)
PUT    /api/tasks/:id                       (update task)
DELETE /api/tasks/:id                       (delete task)
PATCH  /api/tasks/:id/complete              (toggle completion)

Users:
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/search?q=email            (find users to share with)
```

## Database Schema (Updated for Multi-Project + Sharing)
```sql
users:
  - id (PK, UUID)
  - email (unique)
  - password_hash
  - name
  - created_at
  - updated_at

projects:
  - id (PK, UUID)
  - name
  - description
  - owner_id (FK -> users.id)
  - created_at
  - updated_at

project_members:
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - user_id (FK -> users.id)
  - role (owner/member)
  - created_at
  - UNIQUE(project_id, user_id)

tasks:
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - title
  - description
  - status (pending/completed)
  - priority (low/medium/high)
  - due_date
  - category
  - assigned_to (FK -> users.id, nullable)
  - created_by (FK -> users.id)
  - created_at
  - updated_at
  - completed_at
```

## Clarifications Answered
1. **Multiple task lists/projects per user?** YES - Users can create unlimited projects
2. **Task sharing between users?** YES - Basic project sharing (add members to projects)
3. **Priority: Completeness vs Polish?** COMPLETENESS - Focus on functionality first

## Cost Breakdown
- Frontend Hosting: $0/month (Vercel Free)
- Backend Hosting: $0/month (Render Free)
- Database: $0/month (Supabase Free)
- CI/CD: $0/month (GitHub Actions Free)
- Domain: $0/month (Free subdomain)
- SSL: $0/month (Auto-provisioned)
- Monitoring: $0/month (UptimeRobot Free)
- **Total Monthly Cost: $0**

---
**Status**: Requirements finalized with free-tier stack
**Budget Confirmed**: $0 - All free services
**Next Step**: Ready for PM Agent task breakdown
**Estimated Duration**: 4 weeks development + 1 week deployment/testing
