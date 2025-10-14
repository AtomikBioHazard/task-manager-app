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
DATABASE_URL=postgresql://dev_user:dev_password@localhost:5432/task_manager_dev
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
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
npm run db:migrate           # Run database migrations (when available)
npm run db:seed              # Seed development data (when available)

# Development
npm run dev                  # Start all services
npm run build                # Build all packages
npm run test                 # Run all tests
npm run lint                 # Lint all packages
npm run type-check           # TypeScript type checking

# Docker
docker-compose up            # Start all services
docker-compose up postgres   # Database only
docker-compose down          # Stop all services
docker-compose logs          # View logs
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