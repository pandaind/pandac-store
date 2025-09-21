# Pandac Store

A full-stack e-commerce application for plant enthusiasts, built with modern technologies and containerized for easy deployment.

## 🌱 About

Pandac Store is a complete e-commerce platform specializing in plants and gardening products. It features a React frontend, Spring Boot backend, MySQL database, and integrated payment processing with Stripe.

## 🏗️ Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React/Nginx) │────│  (Spring Boot)  │────│     (MySQL)     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚡ Quick Start

1. **Validate your environment**:

   ```bash
   ./scripts/validate-setup.sh
   ```

2. **Configure environment variables**:

   ```bash
   cp .env.example .env
   cp pandac-store-ui/.env.example pandac-store-ui/.env
   # Edit both .env files with your actual API keys
   ```

3. **Verify configuration**:

   ```bash
   ./scripts/check-tokens.sh
   ```

4. **Start the application**:

   ```bash
   ./scripts/setup.sh
   ```

5. **Access the application**:

   - **Frontend**: <http://localhost:3000>
   - **Backend API**: <http://localhost:8080>
   - **Database**: localhost:3306

## 🛠️ Tech Stack

### Frontend

- **React 19** with modern hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Stripe Elements** for payments
- **Nginx** for production serving

### Backend

- **Spring Boot 3.5** with Java 21
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **Flyway** for database migrations
- **Stripe API** for payment processing
- **MySQL** database

### DevOps

- **Docker & Docker Compose** for containerization
- **Multi-stage builds** for optimized images
- **Health checks** for service monitoring
- **Environment-based configuration**

## 📚 Documentation

- **[Docker Setup Guide](docs/DOCKER.md)** - Complete setup instructions
- **[Security Guide](docs/SECURITY.md)** - Environment variables and API keys
- **[API Documentation](docs/)** - Backend API reference
- **[Scripts Documentation](scripts/README.md)** - Utility scripts guide

## 🔧 Development

### Prerequisites

- Docker & Docker Compose
- Git
- Your favorite code editor

### Environment Setup

1. **Stripe API Keys**: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. **GitHub Token**: Create at [GitHub Settings](https://github.com/settings/tokens)
3. **Update environment files** with real values

### Common Commands

```bash
# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Stop everything
docker-compose down

# Clean rebuild
docker-compose down -v --rmi all
docker-compose up --build
```

## 🌟 Features

### Customer Features

- Product browsing and search
- Shopping cart management
- Secure checkout with Stripe
- User authentication and profiles
- Order history and tracking

### Admin Features

- Product management
- Order administration
- User management
- Discount code creation
- Sales analytics

### Technical Features

- Responsive design
- JWT-based authentication
- Database migrations
- File upload with CDN integration
- Comprehensive error handling
- Health monitoring

## 📁 Project Structure

```text
pandac-store/
├── docs/                    # 📚 Documentation
├── scripts/                 # 🛠️ Setup scripts
├── pandac-store-backend/    # 🌐 Spring Boot API
├── pandac-store-ui/         # 🖥️ React frontend
├── docker-compose.yml       # 🐳 Container orchestration
├── .env.example            # ⚙️ Environment template
└── README.md               # 📖 This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🆘 Support

- **Documentation**: Check the [docs/](docs/) directory
- **Scripts Help**: See [scripts/README.md](scripts/README.md)
- **Issues**: Open a GitHub issue
- **Security**: See [SECURITY.md](docs/SECURITY.md)

## 🚀 Deployment

For production deployment:

1. Update environment variables for production
2. Change default database passwords
3. Use production Stripe keys
4. Configure proper domain and SSL
5. Set up monitoring and backups

---

Happy gardening! 🌱
