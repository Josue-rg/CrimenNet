#!/bin/bash

echo "========================================"
echo "  INSTALACION AUTOMATICA - CRIMENNET BACKEND"
echo "========================================"
echo ""

echo "[1/6] Creando entorno virtual..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudo crear el entorno virtual"
    exit 1
fi
echo "Entorno virtual creado exitosamente"
echo ""

echo "[2/6] Activando entorno virtual..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudo activar el entorno virtual"
    exit 1
fi
echo "Entorno virtual activado"
echo ""

echo "[3/6] Actualizando pip..."
python -m pip install --upgrade pip
echo ""

echo "[4/6] Instalando dependencias..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudieron instalar las dependencias"
    exit 1
fi
echo "Dependencias instaladas exitosamente"
echo ""

echo "[5/6] Creando archivo .env de ejemplo..."
if [ ! -f .env ]; then
    echo "DATABASE_URL=postgresql://user:password@localhost:5432/crimennet" > .env
    echo "SECRET_KEY=tu_secret_key_super_segura_cambiala_por_una_real" >> .env
    echo "ALGORITHM=HS256" >> .env
    echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env
    echo "UPLOAD_DIR=./uploads" >> .env
    echo "Archivo .env creado exitosamente"
else
    echo "El archivo .env ya existe, no se sobrescribe"
fi
echo ""

echo "[6/6] Creando estructura de directorios..."
mkdir -p app/models app/schemas app/routes app/services app/database app/auth app/utils uploads
echo "Estructura de directorios creada"
echo ""

echo "========================================"
echo "  INSTALACION COMPLETADA EXITOSAMENTE"
echo "========================================"
echo ""
echo "Siguientes pasos:"
echo "1. Configura el archivo .env con tus credenciales de PostgreSQL"
echo "2. Asegurate de tener PostgreSQL instalado y corriendo"
echo "3. Crea la base de datos 'crimennet' en PostgreSQL"
echo "4. Ejecuta 'chmod +x init_db.sh && ./init_db.sh' para inicializar la base de datos"
echo "5. Ejecuta 'chmod +x run_dev.sh && ./run_dev.sh' para iniciar el servidor en modo desarrollo"
echo ""
