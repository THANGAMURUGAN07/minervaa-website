@echo off
echo ========================================
echo Minervaa School - Starting Application
echo ========================================
echo.
echo Starting both Frontend and Backend...
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.
pause

start "Backend Server" cmd /k "cd server && node server.js"
timeout /t 3 /nobreak > nul
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
