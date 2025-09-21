#!/bin/bash

# Pandac Store Docker Setup Script

set -e

echo "🚀 Setting up Pandac Store with Docker..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created."
else
    echo "✅ .env file exists."
fi

# Create frontend .env file if it doesn't exist
if [ ! -f pandac-store-ui/.env ]; then
    echo "📝 Creating frontend .env file from template..."
    cp pandac-store-ui/.env.example pandac-store-ui/.env
    echo "✅ Frontend .env file created."
else
    echo "✅ Frontend .env file exists."
fi

echo ""
echo "⚠️  IMPORTANT: You must update the following tokens:"
echo "   Backend (.env):"
echo "   - STRIPE_API_KEY: Replace with your Stripe secret key"
echo "   - STRIPE_PUBLISHABLE_KEY: Replace with your Stripe publishable key" 
echo "   - GIT_TOKEN: Replace with your GitHub Personal Access Token"
echo ""
echo "   Frontend (pandac-store-ui/.env):"
echo "   - VITE_STRIPE_PUBLISHABLE_KEY: Replace with your Stripe publishable key"
echo ""
echo "📖 See SECURITY.md for detailed instructions."
echo "Press Enter to continue once you've updated both .env files, or Ctrl+C to exit..."
read -r

# Build and start all services
echo "🔨 Building and starting all services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be healthy..."

# Wait for MySQL to be ready
echo "🗄️  Waiting for MySQL..."
timeout 60 bash -c 'until docker-compose exec mysql mysqladmin ping -h"localhost" --silent; do sleep 2; done'
echo "✅ MySQL is ready!"

# Wait for backend to be ready
echo "🌐 Waiting for Backend..."
timeout 120 bash -c 'until curl -f http://localhost:8080/actuator/health; do sleep 5; done'
echo "✅ Backend is ready!"

# Wait for frontend to be ready
echo "🖥️  Waiting for Frontend..."
timeout 60 bash -c 'until curl -f http://localhost:3000; do sleep 2; done'
echo "✅ Frontend is ready!"

echo ""
echo "🎉 Pandac Store is now running!"
echo ""
echo "📍 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo "   MySQL:    localhost:3306"
echo ""
echo "🛠️  Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Clean up:         docker-compose down -v --rmi all"
echo ""