# Stage 1: Build the Angular application
FROM node:22-alpine AS builder
WORKDIR /app

# Install project dependencies
COPY package*.json ./
RUN npm install

# Copy source code and public assets (including public/movies/)
COPY . .

# Build for production
RUN npm run build 

# Stage 2: Serve through Nginx
FROM nginx:alpine

# Copy compiled Angular browser artifacts to Nginx html directory
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose standard web port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]