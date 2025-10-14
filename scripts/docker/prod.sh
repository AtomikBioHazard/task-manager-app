#!/bin/bash

# Task Manager App - Production Docker Deployment
# Usage: ./scripts/docker/prod.sh [command]

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

# Check if .env file exists
check_env_file() {
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        error "Production .env file not found!"
        warning "Please create .env file with production settings:"
        echo "  cp .env.example .env"
        echo "  # Edit .env with production values"
        exit 1
    fi
}

# Show help
show_help() {
    cat << EOF
Task Manager App - Production Docker Deployment

Usage: $0 [COMMAND]

Commands:
  up              Deploy production services
  down            Stop all production services
  restart         Restart all production services
  rebuild         Rebuild production images and deploy
  logs            Show logs for all services
  logs [service]  Show logs for specific service
  status          Show service status
  backup-db       Backup production database
  restore-db      Restore database from backup
  health          Check service health
  update          Update and deploy latest version
  help            Show this help

Examples:
  $0 up                    # Deploy to production
  $0 logs api              # Show API logs
  $0 health                # Check all service health
  $0 backup-db             # Backup database

IMPORTANT: Make sure .env file exists with production settings!

EOF
}

# Change to docker directory for compose commands
cd "$DOCKER_DIR"

case "${1:-help}" in
    "up")
        check_env_file
        info "Deploying production services..."
        docker-compose -f docker-compose.prod.yml up -d
        success "Production services deployed!"
        info "Services should be available at your configured URLs"
        ;;
        
    "down")
        info "Stopping production services..."
        docker-compose -f docker-compose.prod.yml down
        success "Production services stopped!"
        ;;
        
    "restart")
        check_env_file
        info "Restarting production services..."
        docker-compose -f docker-compose.prod.yml restart
        success "Production services restarted!"
        ;;
        
    "rebuild")
        check_env_file
        info "Rebuilding production images and deploying..."
        docker-compose -f docker-compose.prod.yml down
        docker-compose -f docker-compose.prod.yml build --no-cache
        docker-compose -f docker-compose.prod.yml up -d
        success "Production services rebuilt and deployed!"
        ;;
        
    "logs")
        if [ -n "$2" ]; then
            info "Showing production logs for $2..."
            docker-compose -f docker-compose.prod.yml logs -f "$2"
        else
            info "Showing production logs for all services..."
            docker-compose -f docker-compose.prod.yml logs -f
        fi
        ;;
        
    "status")
        info "Production service status:"
        docker-compose -f docker-compose.prod.yml ps
        ;;
        
    "backup-db")
        info "Creating database backup..."
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U "${POSTGRES_USER:-prod_user}" -d "${POSTGRES_DB:-task_manager_prod}" > "$BACKUP_FILE"
        success "Database backup created: $BACKUP_FILE"
        ;;
        
    "restore-db")
        if [ -n "$2" ]; then
            warning "This will restore database from $2. All current data will be lost!"
            read -p "Continue? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                info "Restoring database from $2..."
                docker-compose -f docker-compose.prod.yml exec -T postgres psql -U "${POSTGRES_USER:-prod_user}" -d "${POSTGRES_DB:-task_manager_prod}" < "$2"
                success "Database restored from $2"
            fi
        else
            error "Please specify backup file: $0 restore-db backup_file.sql"
        fi
        ;;
        
    "health")
        info "Checking service health..."
        docker-compose -f docker-compose.prod.yml exec api wget --quiet --tries=1 --spider http://localhost:3001/health
        if [ $? -eq 0 ]; then
            success "API health check passed"
        else
            error "API health check failed"
        fi
        
        docker-compose -f docker-compose.prod.yml exec web wget --quiet --tries=1 --spider http://localhost:3000
        if [ $? -eq 0 ]; then
            success "Web health check passed"
        else
            error "Web health check failed"
        fi
        
        docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U "${POSTGRES_USER:-prod_user}" -d "${POSTGRES_DB:-task_manager_prod}"
        if [ $? -eq 0 ]; then
            success "Database health check passed"
        else
            error "Database health check failed"
        fi
        ;;
        
    "update")
        check_env_file
        info "Updating to latest version..."
        
        # Pull latest code (assuming this is run on production server)
        cd "$PROJECT_ROOT"
        git pull origin main
        
        # Rebuild and deploy
        cd "$DOCKER_DIR"
        docker-compose -f docker-compose.prod.yml down
        docker-compose -f docker-compose.prod.yml build --no-cache
        docker-compose -f docker-compose.prod.yml up -d
        
        success "Update completed!"
        ;;
        
    "help"|*)
        show_help
        ;;
esac