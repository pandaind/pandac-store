# Docker Setup for Pandac Store

This directory contains Docker configuration files to run the entire Pandac Store application locally.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 4GB of available RAM
- Ports 3000, 8080, and 3306 should be available

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

3. **Verify token configuration** (optional but recommended):
   ```bash
   ./check-tokens.sh
   ```

4. **Run the setup script**:
   ```bash
   ./setup.sh
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:3306

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

### MySQL Database
- **Image**: mysql:8.0
- **Port**: 3306
- **Database**: pandac
- **Username**: app
- **Password**: password

### Spring Boot Backend
- **Build**: Multi-stage Dockerfile
- **Port**: 8080
- **Health Check**: /actuator/health
- **Features**: Flyway migrations, JPA validation

### React Frontend
- **Build**: Multi-stage Dockerfile (Node.js + Nginx)
- **Port**: 3000
- **Features**: Production build, API proxy, security headers

## Useful Commands

### Development
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Restart a specific service
docker-compose restart backend

# Rebuild a specific service
docker-compose up --build backend
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