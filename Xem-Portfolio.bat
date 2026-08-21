@echo off
setlocal
cd /d "%~dp0"

set PORT=3000

powershell -NoProfile -Command "(Test-NetConnection -ComputerName 127.0.0.1 -Port %PORT% -WarningAction SilentlyContinue).TcpTestSucceeded" | findstr /I "True" >nul
if %errorlevel%==0 (
    echo Server da chay san tren port %PORT%, mo trinh duyet luon...
) else (
    echo Dang khoi dong server...
    start "Portfolio Server" cmd /k "node server.js"
    timeout /t 2 /nobreak >nul
)

start "" http://localhost:%PORT%
