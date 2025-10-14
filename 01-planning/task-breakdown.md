# Task Breakdown: Task Manager Application

## Project: TMA-001 - Task Manager App
**Created By**: PM Agent  
**Date**: 2025-09-19  
**Status**: Planning - Awaiting Tech Lead Approval  
**Budget**: $0 (Free Tier Only)

---

## Executive Summary

Collaborative task management web application using 100% free-tier services. Implementation structured across 5 phases over 4 weeks, prioritizing functional completeness over polish.

**Total Estimated Effort**: 94 story points (~188 hours)  
**Estimated Timeline**: 4 weeks + 1 week buffer  
**Team Members**: Frontend Dev, Backend Dev, DevOps Engineer, QA Engineer  
**Critical Path**: Foundation → Authentication → Project Management → Task Management → Deployment

---

## Phase Overview

- **Phase 1: Foundation** (Week 1) - 18 SP: Environment, database, auth foundation
- **Phase 2: Core Backend** (Week 2) - 24 SP: Projects and tasks APIs with authorization
- **Phase 3: Frontend Core** (Week 2-3) - 30 SP: UI implementation, state management
- **Phase 4: Collaboration** (Week 3-4) - 14 SP: Project sharing, member management
- **Phase 5: Quality & Launch** (Week 4) - 8 SP: Testing, deployment, monitoring

---

## PHASE 1: FOUNDATION (Week 1 - 18 SP)

### Epic 1.1: Development Environment
**Priority**: P0 | **Business Value**: Enables all development | **Effort**: 5 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T001 | Set up monorepo structure (packages/web, packages/api, packages/shared) | DevOps | 2 SP | - | Complete: 2025-10-13 |
| T002 | Configure modern TypeScript (bundler resolution, strict mode) | DevOps | 1 SP | T001 | Not Started |
| T003 | Set up local PostgreSQL for development | DevOps | 1 SP | T001 | Not Started |
| T004 | Create Docker configuration (Dockerfiles + docker-compose.yml) | DevOps | 1 SP | T003 | Not Started |

**Acceptance Criteria**:
- Project structure: packages/web, packages/api, packages/shared
- TypeScript project references configured
- Shared package for common types
- packages/shared exports types for web and api
- Project structure matches SOPs exactly
- TypeScript uses "bundler" moduleResolution (NOT "node")
- Docker files present in docker/ folder
- README.md and .gitignore created
- All changes committed to Git

---

### Epic 1.2: Database Foundation
**Priority**: P0 | **Business Value**: Core data storage | **Effort**: 6 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T005 | Design database schema (users, projects, project_members, tasks) | Backend | 3 SP | - | Not Started |
| T006 | Create migration scripts with proper indexes | Backend | 2 SP | T005 | Not Started |
| T007 | Set up seed data for development/testing | Backend | 1 SP | T006 | Not Started |

**Acceptance Criteria**:
- Schema supports multi-project and collaboration
- All foreign keys and indexes defined
- UUID primary keys throughout
- Proper timestamps (created_at, updated_at)
- Migration scripts are reversible

---

### Epic 1.3: Authentication System
**Priority**: P0 | **Business Value**: Security foundation | **Effort**: 7 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T008 | Implement user registration with validation | Backend | 2 SP | T006 | Not Started |
| T009 | Implement login with JWT token generation | Backend | 2 SP | T006 | Not Started |
| T010 | Create authentication middleware | Backend | 2 SP | T009 | Not Started |
| T011 | Implement logout and token validation | Backend | 1 SP | T009 | Not Started |

**Acceptance Criteria**:
- Passwords hashed with bcrypt (12+ rounds)
- JWT tokens with 1-hour expiration
- Input validation on all endpoints
- Rate limiting on auth endpoints
- Proper error messages (no info leakage)

---

## PHASE 2: CORE BACKEND (Week 2 - 24 SP)

### Epic 2.1: Project Management API
**Priority**: P0 | **Business Value**: Core feature enabler | **Effort**: 12 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T012 | Create projects CRUD endpoints | Backend | 4 SP | T010 | Not Started |
| T013 | Implement project authorization (owner/member checks) | Backend | 3 SP | T012 | Not Started |
| T014 | Create endpoint to add members to projects | Backend | 3 SP | T013 | Not Started |
| T015 | Create endpoint to remove members | Backend | 2 SP | T014 | Not Started |

**Acceptance Criteria**:
- Only project owners can delete projects
- Members can view and add tasks
- Data isolation verified (no cross-project leaks)
- All queries filter by user permissions
- Proper HTTP status codes

---

### Epic 2.2: Task Management API
**Priority**: P0 | **Business Value**: Core functionality | **Effort**: 12 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T016 | Create tasks CRUD within projects | Backend | 4 SP | T012 | Not Started |
| T017 | Implement task filtering (status, priority, assignee) | Backend | 3 SP | T016 | Not Started |
| T018 | Implement task completion toggle | Backend | 1 SP | T016 | Not Started |
| T019 | Add task assignment to project members | Backend | 2 SP | T014, T016 | Not Started |
| T020 | Create user search endpoint (by email) | Backend | 2 SP | T010 | Not Started |

**Acceptance Criteria**:
- Tasks scoped to projects only
- Assignment only to project members
- Filtering returns correct results
- Completion updates timestamp
- User search doesn't leak emails

---

## PHASE 3: FRONTEND CORE (Week 2-3 - 30 SP)

### Epic 3.1: Frontend Foundation
**Priority**: P0 | **Business Value**: UI platform | **Effort**: 6 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T021 | Set up React + TypeScript + Tailwind with Vite (lazy loading + code splitting) | Frontend | 2 SP | T001 | Not Started |
| T022 | Configure React Router for navigation | Frontend | 1 SP | T021 | Not Started |
| T023 | Create API client using native fetch (NO axios) | Frontend | 2 SP | T021 | Not Started |
| T024 | Set up Context API with modular hooks (auth, projects, tasks domains) | Frontend | 1 SP | T021 | Not Started |

**Acceptance Criteria**:
- Vite configured with lazy loading
- Code splitting for routes
- Skeleton loader components created
- Native fetch with error handling and interceptors
- Context API organized by domain (upgradable to Zustand)
- Routing structure defined
- TypeScript strict mode enabled

---

### Epic 3.2: Authentication UI
**Priority**: P0 | **Business Value**: User access | **Effort**: 8 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T025 | Create registration page with validation | Frontend | 3 SP | T022, T023 | Not Started |
| T026 | Create login page with validation | Frontend | 2 SP | T022, T023 | Not Started |
| T027 | Implement protected route wrapper | Frontend | 2 SP | T024, T026 | Not Started |
| T028 | Create user profile display | Frontend | 1 SP | T027 | Not Started |

**Acceptance Criteria**:
- Form validation before submission
- Clear error messages
- Loading states during API calls
- Protected routes redirect to login
- JWT stored securely (httpOnly consideration)

---

### Epic 3.3: Project Management UI
**Priority**: P0 | **Business Value**: Core feature | **Effort**: 8 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T029 | Create project list view | Frontend | 2 SP | T027 | Not Started |
| T030 | Create project creation modal/form | Frontend | 2 SP | T029 | Not Started |
| T031 | Create project detail view | Frontend | 2 SP | T029 | Not Started |
| T032 | Implement project edit and delete | Frontend | 2 SP | T031 | Not Started |

**Acceptance Criteria**:
- Projects displayed in cards or list
- Create form validates input
- Detail view shows tasks
- Only owners see delete button
- Responsive on mobile

---

### Epic 3.4: Task Management UI
**Priority**: P0 | **Business Value**: Core functionality | **Effort**: 8 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T033 | Create task list within project view | Frontend | 2 SP | T031 | Not Started |
| T034 | Create task creation form | Frontend | 2 SP | T033 | Not Started |
| T035 | Implement task edit functionality | Frontend | 2 SP | T033 | Not Started |
| T036 | Add task completion toggle | Frontend | 1 SP | T033 | Not Started |
| T037 | Implement task filtering UI | Frontend | 1 SP | T033 | Not Started |

**Acceptance Criteria**:
- Tasks display with status indicators
- Inline editing or modal form
- Checkbox for completion
- Filters update list immediately
- Clear empty states

---

## PHASE 4: COLLABORATION (Week 3-4 - 14 SP)

### Epic 4.1: Project Sharing
**Priority**: P1 | **Business Value**: Team collaboration | **Effort**: 8 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T038 | Create UI for inviting members (search by email) | Frontend | 3 SP | T031, T020 | Not Started |
| T039 | Create project members list view | Frontend | 2 SP | T038 | Not Started |
| T040 | Implement member removal and role management (owner/member) | Frontend | 2 SP | T039 | Not Started |
| T041 | Design permission system architecture (extendable for future roles) | Frontend | 1 SP | T040 | Not Started |

**Acceptance Criteria**:
- Search finds users by email
- Owner and Member roles implemented
- Only owners can add/remove members
- Role-based permissions enforced
- Permission system designed for extensibility
- Clear role distinction in UI
- Member changes reflect immediately
- Can't remove project owner

---

### Epic 4.2: Task Assignment
**Priority**: P1 | **Business Value**: Work delegation | **Effort**: 6 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T042 | Add assignment dropdown in task form | Frontend | 2 SP | T034, T039 | Not Started |
| T043 | Display assigned user in task list | Frontend | 2 SP | T042 | Not Started |
| T044 | Add "My Tasks" filter | Frontend | 2 SP | T043 | Not Started |

**Acceptance Criteria**:
- Dropdown shows project members only
- Can unassign tasks
- "My Tasks" shows only assigned to user
- Assignment persists correctly

---

## PHASE 5: QUALITY & LAUNCH (Week 4 - 8 SP)

### Epic 5.1: Testing & Quality
**Priority**: P0 | **Business Value**: Reliability | **Effort**: 6 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T045 | Write backend tests (auth + authorization) | QA | 3 SP | T013 | Not Started |
| T046 | Write frontend smoke tests (critical paths) | QA | 2 SP | T036 | Not Started |
| T047 | Security audit (SQL injection, XSS prevention) | QA | 1 SP | T019 | Not Started |

**Acceptance Criteria**:
- Auth tests cover edge cases
- Authorization tests verify data isolation
- Frontend tests cover login → create task flow
- No critical security vulnerabilities
- Test coverage >70% for backend

---

### Epic 5.2: Deployment
**Priority**: P0 | **Business Value**: Launch readiness | **Effort**: 6 SP

| ID | Task | Assigned To | Effort | Dependencies | Status |
|----|------|-------------|--------|--------------|--------|
| T048 | Set up Supabase database | DevOps | 1 SP | T006 | Not Started |
| T049 | Configure GitHub Actions CI/CD | DevOps | 2 SP | T001 | Not Started |
| T050 | Deploy backend to Render | DevOps | 1 SP | T048, T049 | Not Started |
| T051 | Deploy frontend to Vercel | DevOps | 1 SP | T049 | Not Started |
| T052 | Configure environment variables | DevOps | 1 SP | T050, T051 | Not Started |
| T053 | Set up UptimeRobot monitoring | DevOps | 1 SP | T050 | Not Started |

**Acceptance Criteria**:
- Database migrated to Supabase
- CI runs tests on every push
- Both apps deployed and accessible
- Environment variables secured
- Monitoring pings every 14 minutes

---

## Dependencies Visualization

```
Foundation Layer:
T001 (Repo Setup) → T002 (TypeScript) → T003 (Local DB) → T004 (Docker)
                 ↓
                T021 (React Setup)

Authentication Flow:
T005 (Schema) → T006 (Migrations) → T007 (Seeds)
             ↓
          T008 (Register) → T009 (Login) → T010 (Middleware) → T011 (Logout)

Backend Core:
T010 → T012 (Projects) → T013 (Auth) → T014 (Add Members) → T015 (Remove)
                      ↓
                   T016 (Tasks) → T017 (Filters) → T018 (Complete) → T019 (Assign)
    ↓
T020 (User Search)

Frontend Core:
T021 → T022 (Router) → T023 (API Client) → T025 (Register UI) → T026 (Login UI)
    ↓                                                           ↓
T024 (State) ────────────────────────────────────→ T027 (Protected Routes)
                                                                ↓
                                                    T028 (Profile) → T029 (Projects)
                                                                   ↓
                                                    T031 (Project Detail) → T033 (Tasks)

Collaboration:
T014 + T020 → T038 (Invite UI) → T039 (Members List) → T040 (Remove) → T041 (Roles)
T016 + T039 → T042 (Assignment) → T043 (Display) → T044 (My Tasks)

Deployment:
T006 → T048 (Supabase)
T001 → T049 (CI/CD) → T050 (Backend Deploy) + T051 (Frontend Deploy) → T052 (Env Vars) → T053 (Monitoring)
```

---

## Timeline Estimate

### Week 1: Foundation
- **DevOps**: T001-T004 (environment setup)
- **Backend**: T005-T011 (database + auth)
- **Deliverable**: Working auth API, local dev environment

### Week 2: Core Features
- **Backend**: T012-T020 (projects + tasks APIs)
- **Frontend**: T021-T028 (foundation + auth UI)
- **Deliverable**: Backend APIs complete, auth UI working

### Week 3: UI Implementation
- **Frontend**: T029-T037 (projects + tasks UI)
- **Backend**: Support frontend integration
- **Deliverable**: Full CRUD operations in UI

### Week 4: Collaboration + Launch
- **Frontend**: T038-T044 (collaboration features)
- **QA**: T045-T047 (testing)
- **DevOps**: T048-T053 (deployment)
- **Deliverable**: Production-ready application

### Week 5: Buffer
- Bug fixes
- Performance optimization
- Documentation

---

## Risk Assessment

### HIGH RISK

#### 1. Free Tier Cold Starts (Render)
**Impact**: High - 30s delay affects UX  
**Probability**: 100%  
**Mitigation**:
- UptimeRobot ping every 14 minutes
- Loading message: "Waking up server..."
- Frontend caching where possible
**Owner**: DevOps (T053)

#### 2. Multi-Tenancy Data Isolation
**Impact**: High - Data leaks  
**Probability**: Medium  
**Mitigation**:
- Always filter by user_id/project membership
- Authorization checks on every endpoint
- Comprehensive permission tests
**Owner**: Backend (T013) + QA (T045)

#### 3. Authentication Security
**Impact**: High - Account compromise  
**Probability**: Low  
**Mitigation**:
- Bcrypt with 12+ rounds
- Rate limiting on auth endpoints
- JWT short expiration (1 hour)
- Input validation everywhere
**Owner**: Backend (T008-T011)

### MEDIUM RISK

#### 4. Database Size Limit (500MB)
**Impact**: Medium - App stops at limit  
**Probability**: Low (for MVP)  
**Mitigation**:
- Monitor database size
- Limit task description length
- Plan archiving strategy
**Owner**: Backend (T005) + DevOps (T048)

#### 5. Scope Creep
**Impact**: Medium - Timeline extension  
**Probability**: High  
**Mitigation**:
- Strict P0 focus first
- Defer P2 features to v2
- Regular Tech Lead check-ins
**Owner**: PM Agent

### LOW RISK

#### 6. GitHub Actions Minutes
**Impact**: Low - CI stops mid-month  
**Probability**: Low  
**Mitigation**:
- Optimize test suite
- Cache dependencies
- Monitor usage
**Owner**: DevOps (T049)

---

## Resource Allocation

| Agent | Tasks | Story Points | Weekly Load |
|-------|-------|--------------|-------------|
| **DevOps** | T001-T004, T048-T053 | 12 SP | W1: 5 SP, W4: 7 SP |
| **Backend** | T005-T020 | 40 SP | W1: 13 SP, W2: 24 SP, W3: 3 SP |
| **Frontend** | T021-T044 | 36 SP | W2: 6 SP, W3: 22 SP, W4: 8 SP |
| **QA** | T045-T047 | 6 SP | W4: 6 SP |

**Total**: 94 SP (~188 hours)

---

## Success Criteria

### Functional:
- [ ] Users can register, login, logout
- [ ] Users can create multiple projects
- [ ] Users can add members to projects
- [ ] Users can create, edit, delete, complete tasks
- [ ] Users can assign tasks to members
- [ ] Users can filter and search tasks
- [ ] Data isolation verified (no cross-project access)

### Technical:
- [ ] Test coverage >70% for backend
- [ ] No critical security vulnerabilities
- [ ] API response times <500ms (excluding cold starts)
- [ ] Frontend loads in <3s
- [ ] Deployed and publicly accessible

### Budget:
- [ ] Total monthly cost: $0
- [ ] All services on free tier

---

## Tech Lead Review Questions

1. **Monorepo confirmed**: npm workspaces, packages/ structure?
2. **State management**: Context API sufficient or add library?
3. **Testing depth**: Backend + smoke tests adequate?
4. **Collaboration MVP**: Just add/remove members or more?
5. **Cold start handling**: Loading message acceptable or need solution?

---

## Next Steps

1. **Tech Lead**: Review and approve this breakdown
2. **PM**: After approval, post task assignments in team communication
3. **DevOps**: Standby for T001 (repository setup)
4. **All Agents**: Review task breakdown and raise questions

---

**PM Agent Status**: Task breakdown complete - awaiting Tech Lead approval  
**Ready for Assignment**: After approval  
**Confidence Level**: High - realistic scope, well-defined tasks, manageable risks

