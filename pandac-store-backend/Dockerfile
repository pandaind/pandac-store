# Multi-stage build for Spring Boot application
# Stage 1: Build the application
FROM gradle:8.4-jdk21 AS builder

WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew gradlew.bat gradle/ gradle/
COPY build.gradle settings.gradle ./

# Copy source code
COPY src/ src/

# Build the application
RUN ./gradlew build -x test --no-daemon

# Stage 2: Create the runtime image
FROM openjdk:21-jdk-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN groupadd -r pandac && useradd -r -g pandac pandac

# Copy the built JAR from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Change ownership to non-root user
RUN chown pandac:pandac app.jar

USER pandac

# Expose the application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]