# Multi-stage build for React application
# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build
ENV VITE_API_BASE_URL=/api/v1
ENV VITE_API_TIMEOUT=10000
ENV VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
ENV VITE_APP_NAME="Pandac Store"
ENV VITE_APP_VERSION=1.0.0
ENV VITE_ENABLE_ADMIN_FEATURES=true
ENV VITE_ENABLE_STRIPE_PAYMENT=true
ENV VITE_ENABLE_DEBUG_MODE=false

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check removed for simplicity

# Start nginx
CMD ["nginx", "-g", "daemon off;"]