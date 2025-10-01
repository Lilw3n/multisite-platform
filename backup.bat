@echo off
echo.
echo ========================================
echo    SAUVEGARDE MULTISITE-PLATFORM
echo ========================================
echo.

echo [1/4] Verification du repertoire...
cd /d "C:\Users\Diddy\Site ultra poussé\multisite-platform"
if not exist "package.json" (
    echo ERREUR: Repertoire du projet non trouve !
    pause
    exit /b 1
)
echo ✓ Repertoire verifie

echo.
echo [2/4] Ajout des fichiers modifiés...
git add .
if %errorlevel% neq 0 (
    echo ERREUR: Echec de l'ajout des fichiers
    pause
    exit /b 1
)
echo ✓ Fichiers ajoutes

echo.
echo [3/4] Creation du commit...
set "timestamp=%date% %time%"
git commit -m "Sauvegarde automatique - %timestamp%"
if %errorlevel% neq 0 (
    echo ATTENTION: Aucun changement a commiter
) else (
    echo ✓ Commit cree
)

echo.
echo [4/4] Envoi vers le repository distant...
git push origin master
if %errorlevel% neq 0 (
    echo ATTENTION: Echec de l'envoi vers le repository distant
    echo Verifiez votre connexion et la configuration du remote
) else (
    echo ✓ Sauvegarde envoyee avec succes
)

echo.
echo ========================================
echo    SAUVEGARDE TERMINEE
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Verifiez sur votre repository distant
echo 2. Testez la restauration si necessaire
echo.
pause
