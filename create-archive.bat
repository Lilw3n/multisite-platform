@echo off
echo.
echo ========================================
echo    CREATION D'ARCHIVE DE SAUVEGARDE
echo ========================================
echo.

echo [1/3] Verification du repertoire...
cd /d "C:\Users\Diddy\Site ultra poussé\multisite-platform"
if not exist "package.json" (
    echo ERREUR: Repertoire du projet non trouve !
    pause
    exit /b 1
)
echo ✓ Repertoire verifie

echo.
echo [2/3] Creation de l'archive Git...
set "archive_name=multisite-platform-backup-%date:~6,4%%date:~3,2%%date:~0,2%.zip"
git archive --format=zip --output="%archive_name%" HEAD
if %errorlevel% neq 0 (
    echo ERREUR: Echec de la creation de l'archive
    pause
    exit /b 1
)
echo ✓ Archive creee: %archive_name%

echo.
echo [3/3] Creation du bundle Git...
set "bundle_name=multisite-platform-complete-%date:~6,4%%date:~3,2%%date:~0,2%.bundle"
git bundle create "%bundle_name%" --all
if %errorlevel% neq 0 (
    echo ERREUR: Echec de la creation du bundle
    pause
    exit /b 1
)
echo ✓ Bundle cree: %bundle_name%

echo.
echo ========================================
echo    ARCHIVES CREEES AVEC SUCCES
echo ========================================
echo.
echo Fichiers crees:
echo - %archive_name% (Code source uniquement)
echo - %bundle_name% (Historique Git complet)
echo.
echo Emplacement: C:\Users\Diddy\Site ultra poussé\multisite-platform\
echo.
echo Utilisation des archives:
echo - Archive ZIP: Extraction simple du code source
echo - Bundle Git: git clone multisite-platform-complete-YYYYMMDD.bundle
echo.
pause
