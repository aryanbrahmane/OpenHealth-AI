@echo off
title OpenHealth AI - Full-Stack Suite Launcher
cd /d "%~dp0"
echo ===================================================================
echo     OpenHealth AI - Full-Stack Clinical Diagnostic Platform
echo ===================================================================
echo [1/3] Starting Python REST API Backend on http://localhost:5000 ...
start "OpenHealth AI - Backend Engine" cmd /k "call "%~dp0run_backend.bat""

echo [2/3] Waiting for backend initialization...
timeout /t 3 /nobreak >nul

echo [3/3] Starting React Frontend on http://localhost:5173 ...
start "OpenHealth AI - React Frontend" cmd /k "call "%~dp0run_frontend.bat""

timeout /t 2 /nobreak >nul
echo Opening OpenHealth AI in your browser...
start http://localhost:5173

echo ===================================================================
echo Both Backend (Port 5000) and Frontend (Port 5173) are active!
echo Keep this window or minimize background services as needed.
echo ===================================================================
pause
