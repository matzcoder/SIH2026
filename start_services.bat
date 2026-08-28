@echo off
title Start LM-Vision Services (Backend + Frontend)
echo ========================================================
echo Starting Legal Metrology Compliance System
echo ========================================================

echo [1/2] Launching FastAPI Backend on Port 5000...
start "LM-Vision Backend (Port 5000)" cmd /k "cd Backend && py -m uvicorn main:app --reload --host 0.0.0.0 --port 5000"

echo [2/2] Launching React Frontend on Port 3000...
start "LM-Vision Frontend (Port 3000)" cmd /k "cd sih-project && npm start"

echo.
echo All services launched!
echo Backend API : http://localhost:5000 (Swagger docs: http://localhost:5000/docs)
echo Frontend UI : http://localhost:3000
echo.
echo To expose via Ngrok, run start_all_tunnels.bat or:
echo   - Backend  : npx ngrok http 5000
echo   - Frontend : npx ngrok http 3000
echo ========================================================
pause
