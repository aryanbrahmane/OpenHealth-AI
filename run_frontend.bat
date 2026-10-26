@echo off
title OpenHealth AI - React Frontend
cd /d "%~dp0"
echo ========================================================
echo Starting OpenHealth AI React Vite Frontend (Port 5173)...
echo ========================================================
cd frontend
npm run dev
pause

