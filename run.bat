@echo off
REM ============================================================
REM  PriceGuard AI — One-Click Starter (Windows)
REM ============================================================
REM  Double-click this file to install dependencies and start
REM  the full system (ML backend + dashboard frontend).
REM
REM  REQUIREMENTS:
REM    - Python 3.8+ must be installed
REM    - Download from: https://www.python.org/downloads/
REM    - IMPORTANT: Check "Add Python to PATH" during install!
REM ============================================================

echo.
echo  ===========================================================
echo    PriceGuard AI - Centralized Price Estimation System
echo    AIML-08 Hackathon Project
echo  ===========================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python is not installed or not in PATH!
    echo.
    echo  Please install Python from: https://www.python.org/downloads/
    echo  Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo  [1/2] Installing Python dependencies...
echo.
python -m pip install -r requirements.txt
echo.

if errorlevel 1 (
    echo  [ERROR] Failed to install dependencies.
    echo  Try running: python -m pip install flask numpy scikit-learn
    echo.
    pause
    exit /b 1
)

echo  [2/2] Starting PriceGuard AI server...
echo.
echo  -------------------------------------------------------
echo   Open your browser and go to: http://localhost:5000
echo  -------------------------------------------------------
echo.

python app.py

pause
