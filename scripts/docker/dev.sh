#!/bin/bash

# Task Manager App - Development Docker Workflow
# Usage: ./scripts/docker/dev.sh [command]

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DOCKER_DIR="$PROJECT_ROOT/docker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Show help
show_help() {
    cat << EOF
Task Manager App - Docker Development Workflow

Usage: $0 [COMMAND]

Commands:
  up              Start all development services
  down            Stop all services
  restart         Restart all services
  rebuild         Rebuild all images and start services
  logs            Show logs for all services
  logs [service]  Show logs for specific service (postgres, api, web)
  status          Show service status
  clean           Clean up unused Docker resources
  db              Start only PostgreSQL database
  test-db         Test database connection
  shell [service] Open shell in service container
  help            Show this help

Examples:
  $0 up                    # Start all services
  $0 logs api              # Show API logs
  $0 shell api             # Open shell in API container
  $0 rebuild               # Rebuild and restart all services

EOF
}

# Change to docker directory for compose commands
cd "$DOCKER_DIR"

case "${1:-help}" in
    "up")
        info "Starting development services..."
        docker-compose up -d
        success "Development services started!"
        info "Services available at:"
        echo "  - Web: http://localhost:3000"
        echo "  - API: http://localhost:3001"
        echo "  - Database: localhost:5433"
        ;;
        
    "down")
        info "Stopping all services..."
        docker-compose down
        success "All services stopped!"
        ;;
        
    "restart")
        info "Restarting all services..."
        docker-compose restart
        success "All services restarted!"
        ;;
        
    "rebuild")
        info "Rebuilding all images and starting services..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        success "All services rebuilt and started!"
        ;;
        
    "logs")
        if [ -n "$2" ]; then
            info "Showing logs for $2..."
            docker-compose logs -f "$2"
        else
            info "Showing logs for all services..."
            docker-compose logs -f
        fi
        ;;
        
    "status")
        info "Service status:"
        docker-compose ps
        ;;
        
    "clean")
        warning "This will remove unused Docker resources..."
        read -p "Continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker system prune -f
            docker volume prune -f
            success "Docker cleanup completed!"
        fi
        ;;
        
    "db")
        info "Starting PostgreSQL database only..."
        docker-compose up -d postgres
        success "Database started!"
        info "Database available at: localhost:5433"
        ;;
        
    "test-db")
        info "Testing database connection..."
        cd "$PROJECT_ROOT"
        if docker-compose -f docker/docker-compose.yml exec postgres pg_isready -U dev_user -d task_manager_dev; then
            success "Database connection successful!"
        else
            error "Database connection failed!"
            exit 1
        fi
        ;;
        
    "shell")
        if [ -n "$2" ]; then
            info "Opening shell in $2 container..."
            docker-compose exec "$2" /bin/sh
        else
            error "Please specify a service: postgres, api, or web"
            exit 1
        fi
        ;;
        
    "help"|*)
        show_help
        ;;
esac