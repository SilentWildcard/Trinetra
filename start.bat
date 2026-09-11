@echo off
title Trinetra — Autonomous Safety Guardian
echo ===================================================
echo     TRINETRA: AUTONOMOUS SAFETY GUARDIAN
echo          Hackathon Prototype Server
echo ===================================================
echo.
echo Starting dedicated local web server on port 3000...
echo Strict Content-Type: text/html; charset=utf-8
echo Access the application at: http://localhost:3000
echo.
start http://localhost:3000
python server.py
pause
