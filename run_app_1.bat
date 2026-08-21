@echo off
title EdgePlan-AI Platform Launcher
color 0A
echo ========================================================
echo   EdgePlan-AI Platformu Tek Tikla Baslatiliyor...
echo ========================================================
echo.

:: 1. Çalışma dizinini betik dosyasının olduğu klasöre ayarla
cd /d "%~dp0"

:: 2. Eğer src/edgeplan/ui/streamlit_app.py mevcut değilse alternatif proje konumlarını tara
if not exist "src\edgeplan\ui\streamlit_app.py" (
    if exist "C:\Users\Lenovo\Documents\staj projeler\EdgePlan-AI\src\edgeplan\ui\streamlit_app.py" (
        cd /d "C:\Users\Lenovo\Documents\staj projeler\EdgePlan-AI"
    ) else if exist "C:\Users\Lenovo\Desktop\staj projeler\EdgePlan-AI\src\edgeplan\ui\streamlit_app.py" (
        cd /d "C:\Users\Lenovo\Desktop\staj projeler\EdgePlan-AI"
    ) else if exist "C:\Users\Lenovo\.gemini\antigravity\scratch\edgeplan-ai-roadmap\src\edgeplan\ui\streamlit_app.py" (
        cd /d "C:\Users\Lenovo\.gemini\antigravity\scratch\edgeplan-ai-roadmap"
    )
)

set PYTHONPATH=src

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Python sisteminizde yuklu bulunamadi!
    echo Lutfen Python 3.9+ yuklu oldugundan emin olun.
    pause
    exit /b 1
)

echo [1/2] Gerekli kütüphaneler kontrol ediliyor...
python -m pip install -q streamlit ortools reportlab plotly pandas pydantic ruff

echo [2/2] Streamlit Sunucusu Başlatılıyor (http://localhost:8501)...
echo Proje Dizin Konumu: %CD%
echo.

python -m streamlit run src/edgeplan/ui/streamlit_app.py

pause
