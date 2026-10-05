@echo off
title Hari's Theater - Quick Launcher
echo ========================================================
echo Starting Hari's Theater System (Backend + Frontend)
echo ========================================================

start "Spring Boot Backend" cmd /k "cd backend && mvn spring-boot:run"
start "Angular Frontend" cmd /k "cd frontend && npm start"

echo.
echo Applications are booting!
echo Frontend will be ready at: http://localhost:4200
echo Backend will be ready at:  http://localhost:8080/api/movies
echo.
pause
