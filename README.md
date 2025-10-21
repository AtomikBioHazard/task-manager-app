# Task Manager Application

A collaborative task management web application built with modern technologies and deployed entirely on free-tier services.

## Project Overview

- **Project ID**: TMA-001
- **Status**: In Development
- **Budget**: $0 (Free tier only)
- **Timeline**: 4 weeks

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS
- Vite (bundler with lazy loading)
- Hosted on Vercel (free tier)

### Backend
- Node.js with Express
- TypeScript
- JWT Authentication
- Hosted on Render (free tier)

### Database
- PostgreSQL (local development)
- Supabase (production, 500MB free tier)

### DevOps
- GitHub Actions (CI/CD)
- Docker containers
- UptimeRobot monitoring

## Architecture

This is a monorepo using npm workspaces:

```
packages/
├── web/          # React frontend application
├── api/          # Express backend API
└── shared/       # Shared TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+ (for local development) OR Docker
- Git

### Installation

1. **Clone and install dependencies:**
```bash
# Install dependencies for all packages
npm install
```

2. **Set up environment variables:**
```bash
# Copy environment templates
cp .env.example .env
cp packages/api/.env.example packages/api/.env
cp packages/web/.env.example packages/web/.env

# Edit .env files with your settings
```

3. **Database Setup (Choose one method):**

#### Option A: Docker (Recommended)
```bash
# Start PostgreSQL with Docker
cd docker
docker-compose up postgres -d

# Test connection
node ../scripts/test-db-connection.js
```

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL locally (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE task_manager_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE task_manager_dev TO dev_user;
\q

# Test connection
node scripts/test-db-connection.js
```

4. **Start development servers:**
```bash
# Start all services
npm run dev

# Or start individually:
npm run dev --workspace=packages/api   # Backend only
npm run dev --workspace=packages/web   # Frontend only
```

## Database Configuration

### Environment Variables

Key database-related environment variables:

```bash
# Database connection
DATABASE_URL=postgresql://dev_user:dev_password@localhost:5433/task_manager_dev
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=task_manager_dev
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password

# Application settings
JWT_SECRET=your_super_secure_jwt_secret_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Database Features

- **Extensions**: UUID generation (`uuid-ossp`), cryptographic functions (`pgcrypto`)
- **Connection pooling**: Configurable max connections and timeout
- **Health checks**: Built-in container health monitoring
- **Initialization**: Automatic setup of extensions and permissions

### Testing Database Connection

```bash
# Test database connectivity
node scripts/test-db-connection.js

# Check Docker containers
docker-compose ps

# View database logs
docker-compose logs postgres
```

### Seed Data for Development

The project includes sample seed data for development and testing:

```bash
# Seed database with sample data
npm run db:seed

# Clear seed data
npm run db:seed:clear

# Force reseed (clears then seeds)
npm run db:seed:force
```

**Sample accounts created:**
- john.doe@example.com (password: password123)
- jane.smith@example.com (password: password123)
- bob.wilson@example.com (password: password123)
- alice.johnson@example.com (password: password123)
- demo@example.com (password: demo123)

**Sample data includes:**
- 5 users
- 5 projects (Website Redesign, Mobile App, Marketing Campaign, Database Migration, Customer Portal)
- 16 tasks with various statuses (completed, in_progress, todo)
- Project members and task assignments

**WARNING:** Only use seed data in development/testing environments!

## Development Workflow

- Feature branches: `[agent-name]/[task-id]-[description]`
- Commit format: `[TASK-ID] [Agent] Description`
- All changes go through pull requests

## Team

- **Tech Lead**: Dietrich (abh)
- **DevOps**: DevOps Agent
- **Backend**: Backend Agent  
- **Frontend**: Frontend Agent
- **QA**: QA Agent

## Project Structure

See `/01-planning/` for detailed task breakdown and technical decisions.

## Scripts

```bash
# Database
npm run db:test              # Test database connection
npm run db:migrate           # Run database migrations
npm run db:seed              # Seed development data
npm run db:seed:clear        # Clear seed data from database
npm run db:seed:force        # Force reseed (clears then seeds)

# Development
npm run dev                  # Start all services
npm run build                # Build all packages
npm run test                 # Run all tests
npm run lint                 # Lint all packages
npm run type-check           # TypeScript type checking

# Docker (Enhanced)
# Development
npm run docker:dev-up        # Start development services
npm run docker:dev-down      # Stop development services
./scripts/docker/dev.sh      # Full development workflow
./scripts/docker/dev.sh logs # View logs
./scripts/docker/dev.sh shell api # Open shell in API container

# Production
npm run docker:prod-up       # Deploy production services
npm run docker:prod-down     # Stop production services
./scripts/docker/prod.sh health # Check service health
./scripts/docker/prod.sh backup-db # Backup database

# Traditional Docker Compose
docker-compose up            # Start all services
docker-compose up postgres   # Database only
docker-compose down          # Stop all services
docker-compose logs          # View logs
```

## Docker Configuration

### Development vs Production

The project includes sophisticated Docker configurations for both environments:

**Development Features:**
- Hot reloading with volume mounts
- Development dependencies included
- Exposed ports for debugging
- Optimized for fast iteration

**Production Features:**  
- Multi-stage builds for smaller images
- Only production dependencies
- Enhanced security with non-root users
- Comprehensive health checks
- Logging configuration
- Restart policies

### Docker Compose Files

- `docker/docker-compose.yml` - Development configuration
- `docker/docker-compose.prod.yml` - Production configuration

### Multi-target Dockerfiles

Both `Dockerfile.api` and `Dockerfile.web` support multiple build targets:

```bash
# Development build
docker build --target development -f docker/Dockerfile.api .

# Production build  
docker build --target production -f docker/Dockerfile.api .
```

### Docker Network

Services communicate via a custom bridge network (`task-manager-network`) with:
- Service discovery by name
- Isolated subnet (172.20.0.0/16)
- PostgreSQL accessible via `postgres` hostname

### Volume Management

- `postgres_data`: Persistent database storage
- `api_logs`: Application logs (production)
- Development: Source code mounted for hot reloading

### Health Checks

All services include comprehensive health checks:
- PostgreSQL: `pg_isready` command
- API: HTTP health endpoint (`/health`)
- Web: HTTP availability check

### Docker Workflow Scripts

**Development**: `./scripts/docker/dev.sh`
- Start/stop services
- View logs
- Database operations
- Container shell access
- Resource cleanup

**Production**: `./scripts/docker/prod.sh`
- Deploy services
- Health monitoring
- Database backup/restore
- Rolling updates
- Service management

```

## Deployment

- **Frontend**: Vercel (auto-deploy from main)
- **Backend**: Render (auto-deploy from main)  
- **Database**: Supabase (managed PostgreSQL)
- **Monitoring**: UptimeRobot (keep-alive pings)

### Environment Setup

**Development**: Local PostgreSQL or Docker
**Production**: Supabase PostgreSQL with connection pooling

## License

MIT License - Free to use and modify.