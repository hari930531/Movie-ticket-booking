# 📽️ Hari's Theater - Movie Ticket Booking System

A full-stack, enterprise-grade cinema ticket booking web application designed for **Hari's Theater** (Sanarapatti, Perumbalai, Pennagaram, Dharmapuri - 636811). The platform delivers real-time movie scheduling across three dedicated multiplex auditoriums, automated showtime session assignment (Morning, Afternoon, Night), interactive color-coded seating, and instant boarding-pass ticket generation with physical print support.

---

## 🏗️ Architecture Overview

```text
Patron Browser (Client)
       │
       ▼  Port 4200 (Angular Dev) / Port 80 (Nginx)
┌─────────────────────────┐          HTTP REST / JSON          ┌─────────────────────────┐
│     Angular Frontend    │ ─────────────────────────────────> │   Spring Boot Backend   │
│  (Standalone Components)│ <───────────────────────────────── │       (Port 8080)       │
└─────────────────────────┘                                    └────────────┬────────────┘
                                                                            │ JDBC / Hibernate
                                                                            ▼
                                                               ┌─────────────────────────┐
                                                               │      MySQL Database     │
                                                               │   (ticket_booking:3306) │
                                                               └─────────────────────────┘


💻 Tech Stack
​Frontend: Angular 17/18+ (Standalone Components, Signals, Reactive & Template-Driven Forms, CSS Print Media Queries)
​Backend: Spring Boot 3.x, Spring Data JPA, Spring Web MVC, Hibernate ORM, Maven
​Database: MySQL 8.0+ Community Server
​Assets: High-resolution custom movie posters stored in public/movies/

​✨ Features
​Multiplex Screen Segmentation:
​Screen 1 (Dolby Atmos 4K): Jailer 2, Leo, Vishwanath & Sons
​Screen 2 (RGB Laser Screen): The Dark Knight, Spider-Man Remastered, Bramayugam
​Screen 3 (VIP Luxe Cinema): Kudumbasthan, Kalamkaval, Ekō
​Tri-Session Showtimes:
​🌅 Morning Show: ~10:00 AM – 11:15 AM
​☀️️ Matinee Show: ~01:30 PM – 03:00 PM
​🌙 Night Show: ~06:00 PM – 07:30 PM
​Color-Coded Interactive Seating:
​🟢 Green: Seat available
​🔴 Red: Seat occupied / locked
​🟡 Gold: Selected seat
​Live Digital Clock & Date:
​Real-time ticking 12-hour AM/PM clock with live heartbeat indicator and formatted date.
​Printable Boarding Pass Ticket:
​Generates a boarding-pass layout with passenger name, mobile number, screen name, seat ID, show session, and barcode.
​Uses @media print CSS rules to isolate the ticket canvas for printing or PDF export.

#HOW TO RUN
   BACKEND:
   cd backend 
   mvn spring-boot:run
   RUNNING AT:http://localhost:8080/api/movies

   FRONTEND:
   cd frontend
   npm install
   npm start
   RUNNING AT:http://localhost:4200

make project zip
 Compress-Archive -Path "backend", "frontend", "start-app.bat" -DestinationPath "..\Hari-Theater-Complete-Project.zip" -Force  

 application.properties for localhost
  spring.datasource.url=jdbc:mysql://localhost:3306/ticket_booking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
  spring.datasource.username=root
  spring.datasource.password=Admin@123
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true
  server.port=8080

  Application.prperties for Docker
spring.datasource.url=jdbc:mysql://cinema-mysql_container:3306/ticket_booking?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


NGINX.cof frontend without Docker
server {
    listen 80;
    server_name localhost;

    # Serve Angular single-page application and static movie posters
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy API calls to the Spring Boot container
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


nginx with DOCKER
events {}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    upstream backend_service {
        server cinema-backend:8080;
    }

    server {
        listen 80;
        server_name localhost;

        # Angular SPA Bundles
        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        # Movie Posters
        location /movies/ {
            root /usr/share/nginx/html;
            try_files $uri $uri/ =404;
        }

        # Reverse Proxy API Traffic to Spring Boot Backend
        location /api/ {
            proxy_pass http://backend_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}


**DOCKER IMAGE:**
DATABASE: docker build -t cinema-sql:v1 .
BACKEND:docker build -t cinema_backend_image:1.0 .
FRONTEND:docker build -t cinema-frontend:1.0 . 
DOCKER CONTAINER:
DATABASE:docker run --name cinema-mysql_container --network cinema-net -p 3306:3306 -v C:\Users\ADMIN\Desktop\Cinema_database:/var/lib/mysql 
**cinema-sql:v1 **                        
BACKEND:docker run -d --name cinema-backend-container --network cinema-net -p 8080:8080 cinema_backend_image:1.0 
FRONTEND: docker run -d --name cinema-frontend --network cinema-net -p 80:80 cinema-frontend:1.0  
DATABASE ACCESS :docker exec -it cinema-mysql_container mysql -u root -prootpassword ticket_booking -e "SELECT * FROM bookings "








































