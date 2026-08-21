@echo off
title MND EdgePlan-AI Reborn Launcher
color 0A

echo =======================================================================
echo    MND EDGEPLAN-AI REBORN - AKILLI URETIM PLATFORMU
echo =======================================================================
echo    Mimari  : Java Spring Boot Backend + React Frontend
echo    Surum   : 1.0.0 (Tek Tikla Calistirma Paketi)
echo =======================================================================
echo.

cd /d "%~dp0"

if not defined JAVA_HOME (
    if exist "C:\Program Files\JetBrains\PyCharm Community Edition 2024.3.1.1\jbr" (
        set "JAVA_HOME=C:\Program Files\JetBrains\PyCharm Community Edition 2024.3.1.1\jbr"
    )
)

echo [1/3] Java Spring Boot Backend Baslatiliyor (Port 8080)...
start "MND Spring Boot Backend" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo [2/3] React Vite Frontend Baslatiliyor (Port 3001)...
start "MND React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo [3/3] Tarayici Baslatiliyor (http://localhost:3001)...
ping 127.0.0.1 -n 6 >nul
start http://localhost:3001

echo.
echo =======================================================================
echo    [BASARILI] MND EdgePlan-AI Reborn Servisleri Baslatildi!
echo    - Frontend UI : http://localhost:3001
echo    - Backend API : http://localhost:8080/api/v1/status
echo =======================================================================
echo.
pause
