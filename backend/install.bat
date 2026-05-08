@echo off
echo ========================================
echo   INSTALACION COMPLETA - CRIMENNET BACKEND
echo ========================================
echo.

echo [1/6] Creando entorno virtual...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: No se pudo crear el entorno virtual
    pause
    exit /b 1
)
echo Entorno virtual creado exitosamente
echo.

echo [2/6] Activando entorno virtual...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: No se pudo activar el entorno virtual
    pause
    exit /b 1
)
echo Entorno virtual activado
echo.

echo [3/6] Actualizando pip...
python -m pip install --upgrade pip
echo.

echo [4/6] Instalando dependencias...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)
echo Dependencias instaladas exitosamente
echo.

echo [5/6] Generando migraciones de base de datos...
alembic revision --autogenerate -m "Initial migration"
if %errorlevel% neq 0 (
    echo ADVERTENCIA: No se pudo generar la migracion (asegurate de configurar .env correctamente)
    echo Continuando...
)
echo.

echo [6/6] Aplicando migraciones...
alembic upgrade head
if %errorlevel% neq 0 (
    echo ADVERTENCIA: No se pudieron aplicar las migraciones
    echo Asegurate de tener PostgreSQL corriendo y la base de datos creada
    echo Continuando...
)
echo.

echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo Iniciando servidor...
echo Servidor corriendo en: http://localhost:8000
echo Documentacion Swagger: http://localhost:8000/docs
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
