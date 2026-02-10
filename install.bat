@echo off
echo ========================================
echo Minervaa School - Complete Setup
echo ========================================
echo.
echo This will install all dependencies for frontend and backend
echo.
pause

echo.
echo [1/2] Installing Frontend Dependencies...
echo.
call npm install

echo.
echo [2/2] Installing Backend Dependencies...
echo.
cd server
call npm install
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Configure server/.env with your email credentials
echo 2. Run start-server.bat to start the backend
echo 3. Run npm run dev to start the frontend
echo.
pause
