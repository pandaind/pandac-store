# Docker Setup for Pandac Store

This directory contains Docker configuration files to run the entire Pandac Store application with nginx reverse proxy architecture.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 4GB of available RAM
- Port 80 should be available (single entry point!)

## Architecture Overview

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │    │  Nginx Proxy    │    │    Backend      │    │    Database     │
│   (Browser)     │────│  (Port: 80)     │────│  (Spring Boot)  │────│     (MySQL)     │
│                 │    │                 │    │   Internal      │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                    ┌─────────────────┐
                    │   Frontend      │
                    │   (React/Nginx) │
                    │   Internal      │
                    └─────────────────┘
```

## Quick Start

1. **Clone and navigate to the project**:
   ```bash
   cd pandac-store
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env file and replace placeholder tokens with real values
   # See SECURITY.md for detailed instructions
   ```

3. **Start the application**:
   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   - **Application**: http://localhost (nginx reverse proxy)
   - **API Endpoint**: http://localhost/api/v1
   - **Database**: localhost:3306 (admin access only)

## Manual Setup

If you prefer to run commands manually:

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Build and start services**:
   ```bash
   docker-compose up --build -d
   ```

3. **Check service status**:
   ```bash
   docker-compose ps
   ```

## Services

### Nginx Reverse Proxy

- **Build**: Custom nginx configuration
- **Port**: 80 (main entry point)
- **Features**: 
  - CORS handling
  - API routing to backend
  - Static file serving for frontend
  - Production-ready headers

### MySQL Database

- **Image**: mysql:8.0
- **Port**: 3306 (internal + admin access)
- **Database**: pandac
- **Username**: app
- **Password**: password

### Spring Boot Backend

- **Build**: Multi-stage Dockerfile
- **Port**: Internal only (accessed via nginx)
- **Health Check**: /actuator/health
- **Features**: Flyway migrations, JPA validation, JWT auth

### React Frontend

- **Build**: Multi-stage Dockerfile (Node.js + Nginx)
- **Port**: Internal only (served via nginx proxy)
- **Features**: 
  - Production build with Vite
  - Centralized API configuration
  - Security headers

## Useful Commands

### Development

```bash
# Start all services
docker-compose up -d

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Restart a specific service
docker-compose restart nginx

# Rebuild a specific service
docker-compose up --build frontend

# Check service status
docker-compose ps
```

### Testing the Application

```bash
# Test nginx proxy
curl -I http://localhost

# Test API through proxy
curl http://localhost/api/v1/products

# Test API health
curl http://localhost/api/v1/actuator/health
```

### Database Operations
```bash
# Connect to MySQL
docker-compose exec mysql mysql -u app -p pandac

# Run Flyway migrations manually
docker-compose exec backend ./gradlew flywayMigrate

# View Flyway migration status
docker-compose exec backend ./gradlew flywayInfo
```

### Cleanup
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v

# Remove all images and volumes
docker-compose down -v --rmi all
```

## Environment Variables

You can customize the setup by modifying the `.env` file:

```bash
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=pandac
MYSQL_USER=app
MYSQL_PASSWORD=password

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=8080
MYSQL_PORT=3306

# Backend Configuration
SPRING_PROFILES_ACTIVE=docker
JPA_SHOW_URL=false
HIBERNATE_FORMAT_SQL=false
```

## Troubleshooting

### Services Won't Start
1. Check if ports are available:
   ```bash
   netstat -tulpn | grep -E ':(3000|8080|3306)'
   ```

2. Check Docker daemon:
   ```bash
   docker info
   ```

### Database Connection Issues
1. Wait for MySQL to fully initialize (can take 30-60 seconds)
2. Check MySQL logs:
   ```bash
   docker-compose logs mysql
   ```

### Frontend Not Loading
1. Check if backend is responding:
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. Clear browser cache and try again

### Performance Issues
1. Increase Docker memory allocation to 4GB or more
2. Use `docker system prune` to clean up unused resources

## Development Tips

1. **Live Development**: For development, you can run only the database in Docker and run backend/frontend locally:
   ```bash
   docker-compose up mysql -d
   # Then run backend and frontend locally
   ```

2. **Database Reset**: To reset the database:
   ```bash
   docker-compose down -v
   docker-compose up mysql -d
   ```

3. **Log Monitoring**: Keep logs open in a separate terminal:
   ```bash
   docker-compose logs -f
   ```

## Security Notes

- Default passwords are for development only
- Change all passwords before deploying to production
- The setup includes basic security headers and CORS configuration
- Database data is persisted in Docker volumes