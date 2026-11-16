@echo off
chcp 65001 >nul
where node >nul 2>nul
if errorlevel 1 (
  start "" "%~dp0index.html"
  exit /b 0
)
node "%~dp0launch-board.js" --launch
exit /b 0
