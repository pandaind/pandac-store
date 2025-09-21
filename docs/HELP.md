```shell
    docker run --name mysql-container \
               -e MYSQL_ROOT_PASSWORD=root \
               -e MYSQL_DATABASE=pandac \
               -e MYSQL_USER=app \
               -e MYSQL_PASSWORD=password \
               -p 3306:3306 \
               -d mysql:8.0
```

# Build the project
./gradlew build

# Run the application
./gradlew bootRun

# Run tests
./gradlew test

# Clean build artifacts
./gradlew clean

# Show dependencies
./gradlew dependencies

# Generate a runnable jar
./gradlew bootJar

# Generate a war file (if applicable)
./gradlew bootWar

# Check for outdated dependencies
./gradlew dependencyUpdates

# List all available tasks
./gradlew tasks