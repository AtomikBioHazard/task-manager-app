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
- PostgreSQL (local development)
- Docker (optional)

### Installation
```bash
# Install dependencies for all packages
npm install

# Start development servers
npm run dev
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

## Deployment

- **Frontend**: Vercel (auto-deploy from main)
- **Backend**: Render (auto-deploy from main)
- **Database**: Supabase (managed PostgreSQL)
- **Monitoring**: UptimeRobot (keep-alive pings)

## License

MIT License - Free to use and modify.