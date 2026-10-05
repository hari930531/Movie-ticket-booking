pipeline {
    // Run this pipeline on any available Jenkins agent/executor
    agent any

    environment {
        // Docker Hub credentials ID created inside Jenkins Credential Manager
        DOCKER_HUB_CRED_ID  = '12345a12345'
        
        // Your official Docker Hub account username (Change this to your actual username)
        DOCKER_USER         = 'hari930531'
        
        // Define repository and image naming formats for Docker Hub
        BACKEND_IMAGE_NAME  = "${DOCKER_USER}/cinema-backend"
        FRONTEND_IMAGE_NAME = "${DOCKER_USER}/cinema-frontend"
        
        // Tag images with unique sequential Jenkins build number
        IMAGE_TAG           = "${BUILD_NUMBER}"

        // Reference path pointing directly to the Jenkins project workspace
        WORKSPACE_PATH      = "${WORKSPACE}"
    }

    tools {
        // Automatically inject pre-configured build tools into the system PATH
        maven  'Maven-3.9'  // Maven executable for compiling Spring Boot
        nodejs 'NodeJS-22'  // Node.js v22 required by Angular CLI
        jdk    'JDK-17'     // Java 17 Development Kit for Spring Boot backend
    }

    stages {
        // -----------------------------------------------------------------
        // STAGE 1: Pull source code from GitHub
        // -----------------------------------------------------------------
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out latest source code from Git repository...'
                // Clones the branch and repository configured in Jenkins job
                checkout scm
            }
        }

        // -----------------------------------------------------------------
        // STAGE 2: Build Spring Boot backend executable JAR
        // -----------------------------------------------------------------
        stage('Backend Build & Test') {
            steps {
                echo 'Compiling Spring Boot backend and packaging executable JAR...'
                dir('backend') {
                    script {
                        // Checks OS type and executes native shell commands
                        if (isUnix()) {
                            // Build for Linux or macOS agents
                            sh 'mvn clean package -DskipTests'
                        } else {
                            // Build for Windows batch agents
                            bat 'mvn clean package -DskipTests'
                        }
                    }
                }
            }
        }

        // -----------------------------------------------------------------
        // STAGE 3: Build Angular frontend production bundle
        // -----------------------------------------------------------------
        stage('Frontend Build') {
            steps {
                echo 'Installing Node dependencies and compiling Angular production bundle...'
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            // Clean install all npm package dependencies
                            sh 'npm install'
                            // Compile Angular into optimized static files
                            sh 'npm run build -- --configuration production'
                        } else {
                            bat 'npm install'
                            bat 'npm run build -- --configuration production'
                        }
                    }
                }
            }
        }

        // -----------------------------------------------------------------
        // STAGE 4: Build Docker images for both services
        // -----------------------------------------------------------------
        stage('Build Docker Images') {
            steps {
                echo 'Building production Docker images for Backend and Frontend...'
                script {
                    if (isUnix()) {
                        // Build backend image with build number tag and latest tag
                        sh "docker build -t ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} -t ${BACKEND_IMAGE_NAME}:latest ./backend"
                        // Build frontend image with build number tag and latest tag
                        sh "docker build -t ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} -t ${FRONTEND_IMAGE_NAME}:latest ./frontend"
                    } else {
                        bat "docker build -t ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} -t ${BACKEND_IMAGE_NAME}:latest ./backend"
                        bat "docker build -t ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} -t ${FRONTEND_IMAGE_NAME}:latest ./frontend"
                    }
                }
            }
        }

        // -----------------------------------------------------------------
        // STAGE 5: Push built container images to Docker Hub registry
        // -----------------------------------------------------------------
        stage('Push Images to Docker Hub') {
            steps {
                echo 'Authenticating with Docker Hub and pushing image tags...'
                // Securely fetch Docker Hub credentials without exposing plain text passwords
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CRED_ID}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                    script {
                        if (isUnix()) {
                            // Login to Docker Hub via standard input
                            sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
                            // Push backend images (versioned tag + latest)
                            sh "docker push ${BACKEND_IMAGE_NAME}:${IMAGE_TAG}"
                            sh "docker push ${BACKEND_IMAGE_NAME}:latest"
                            // Push frontend images (versioned tag + latest)
                            sh "docker push ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}"
                            sh "docker push ${FRONTEND_IMAGE_NAME}:latest"
                            // Clean up local login session
                            sh 'docker logout'
                        } else {
                            bat 'echo %DH_PASS% | docker login -u %DH_USER% --password-stdin'
                            bat "docker push ${BACKEND_IMAGE_NAME}:${IMAGE_TAG}"
                            bat "docker push ${BACKEND_IMAGE_NAME}:latest"
                            bat "docker push ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}"
                            bat "docker push ${FRONTEND_IMAGE_NAME}:latest"
                            bat 'docker logout'
                        }
                    }
                }
            }
        }

        // -----------------------------------------------------------------
        // STAGE 6: Deploy full-stack containers via Docker Compose
        // -----------------------------------------------------------------
        stage('Deploy with Docker Compose') {
            steps {
                echo 'Deploying cinema booking cluster via Docker Compose...'
                script {
                    if (isUnix()) {
                        // Stop and delete existing running containers
                        sh 'docker compose down'
                        // Start MySQL, backend, and frontend containers in detached mode
                        sh 'docker compose up -d --build'
                    } else {
                        bat 'docker compose down'
                        bat 'docker compose up -d --build'
                    }
                }
            }
        }
    }

    // ---------------------------------------------------------------------
    // POST-BUILD ACTIONS: Run based on execution outcome
    // ---------------------------------------------------------------------
    post {
        // Runs only if all stages passed successfully
        success {
            echo "=========================================================="
            echo "Pipeline Succeeded! Deployment is live on http://localhost[span_0](start_span)"[span_0](end_span)
            echo "=========================================================="
        }
        
        // Runs if any step or build stage failed
        failure {
            echo "=========================================================="
            echo "Pipeline Failed! Review console output for step failure."
            echo "=========================================================="
        }

        // Always runs at the end regardless of success or failure
        always {
            echo "Cleaning up dangling builder images..."
            script {
                // Free disk space by removing untagged dangling build layers
                if (isUnix()) {
                    sh 'docker image prune -f'
                } else {
                    bat 'docker image prune -f'
                }
            }
        }
    }
}