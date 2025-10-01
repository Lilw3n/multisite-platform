@echo off
echo ========================================
echo   Plateforme Multisite - Demarrage
echo ========================================
echo.

echo Installation des dependances...
call npm install

echo.
echo Demarrage du serveur sur le port 3008...
echo.
echo URL: http://localhost:3008
echo.
echo Compte de test:
echo Email: lilwen.song@gmail.pro.com
echo Mot de passe: Reunion2025
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npx next dev -p 3008

pause
