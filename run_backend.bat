@echo off
title OpenHealth AI - Backend REST Engine
cd /d "%~dp0"
echo ========================================================
echo Starting OpenHealth AI REST API (Port 5000)...
echo ========================================================

set PYTHON_EXE=C:\Users\ASUS\AppData\Local\Python\pythoncore-3.12-64\python.exe

if not exist "%PYTHON_EXE%" (
    set PYTHON_EXE=py -3.12
)

echo Using Python: %PYTHON_EXE%
cd backend
"%PYTHON_EXE%" app.py
pause

