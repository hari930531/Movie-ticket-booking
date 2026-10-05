# Stage 1: Build the Spring Boot application using Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy dependency specifications and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy artifact from build stage
COPY --from=builder /app/target/*.jar app.jar

# Expose backend REST API port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]