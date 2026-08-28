@echo off
title Ngrok All Tunnels (Backend 5000 + Frontend 3000)
echo ========================================================
echo Launching Ngrok Multi-Tunnel for Hackathon Deployment
echo ========================================================
echo Checking for ngrok CLI...
where ngrok >nul 2>nul
if %errorlevel% equ 0 (
    echo Using system ngrok CLI with ngrok.yml...
    ngrok start --all --config ngrok.yml
) else (
    echo System ngrok CLI not in PATH. Launching backend tunnel via npx...
    npx -y ngrok http 5000
)
pause
