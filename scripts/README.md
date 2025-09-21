# Scripts Directory

This directory contains utility scripts for setting up and managing the Pandac Store project.

## 🛠️ Available Scripts

### Setup Scripts
- **`setup.sh`** - Main setup script that builds and starts the entire application
- **`validate-setup.sh`** - Pre-setup validation to check prerequisites
- **`check-tokens.sh`** - Verify that environment tokens are properly configured

## 🚀 Usage

### First Time Setup
```bash
# 1. Validate your environment
./scripts/validate-setup.sh

# 2. Check token configuration  
./scripts/check-tokens.sh

# 3. Run the main setup
./scripts/setup.sh
```

### Development Workflow
```bash
# Quick token verification
./scripts/check-tokens.sh

# Restart the application
./scripts/setup.sh
```

## 📋 Script Details

### `setup.sh`
**Purpose**: Complete application setup and startup

**What it does**:
- Creates `.env` files from templates if missing
- Reminds you to configure tokens
- Builds and starts all Docker services
- Waits for services to be healthy
- Provides access URLs and useful commands

**Usage**: `./scripts/setup.sh`

### `validate-setup.sh`  
**Purpose**: Pre-setup environment validation

**What it checks**:
- Docker and Docker Compose installation
- Docker daemon status
- docker-compose.yml validity
- Required files existence
- Port availability
- Available disk space

**Usage**: `./scripts/validate-setup.sh`

### `check-tokens.sh`
**Purpose**: Verify environment token configuration

**What it checks**:
- Stripe API keys (backend and frontend)
- GitHub Personal Access Token
- Database passwords
- Frontend environment file

**Usage**: `./scripts/check-tokens.sh`

## 🔧 Making Scripts Executable

If you encounter permission errors, make the scripts executable:

```bash
chmod +x scripts/*.sh
```

## 📝 Script Dependencies

All scripts require:
- **Bash shell** (available on Linux/macOS, use WSL on Windows)
- **Git** (for repository operations)
- **Docker & Docker Compose** (for setup.sh)

## 🆘 Troubleshooting

### Script Permission Errors
```bash
chmod +x scripts/script-name.sh
```

### Path Issues
Run scripts from the project root:
```bash
./scripts/setup.sh          # ✅ Correct
cd scripts && ./setup.sh    # ❌ Wrong
```

### Docker Issues
If Docker-related scripts fail:
1. Check Docker is running: `docker info`
2. Check Docker Compose: `docker-compose --version`
3. Verify ports are available: `netstat -tulpn | grep -E ':(3000|8080|3306)'`

## 🔗 Related Documentation

- [Docker Setup Guide](../docs/DOCKER.md) - Detailed Docker configuration
- [Security Guide](../docs/SECURITY.md) - Environment and token setup
- [Main README](../README.md) - Project overview