# BACKEND - CrimenNet

## 📋 DESCRIPCIÓN
Backend del sistema web de investigaciones criminales CrimenNet. API RESTful construida con FastAPI para gestionar casos, sospechosos, evidencias, interrogatorios y líneas de tiempo, con autenticación JWT y base de datos PostgreSQL.

## 🛠️ TECNOLOGÍAS

### Stack Principal
- **FastAPI (Python)** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens

### Herramientas Clave
- **SQLAlchemy** - ORM para base de datos
- **Pydantic** - Validación de datos
- **JWT** - JSON Web Tokens para auth
- **Alembic** - Migraciones de base de datos
- **Uvicorn** - Servidor ASGI
- **pg8000** - Driver PostgreSQL puro Python (sin compilación)

### 📁 CASOS
**Campos:**
- id (UUID, primary key)
- título (String)
- descripción (Text)
- estado (Enum: abierto, cerrado, en_investigacion)
- prioridad (Enum: baja, media, alta, critica)
- fecha (DateTime)
- detective_asignado (String)
- ubicación (String)

**CRUD:**
- ✅ Crear caso
- ✅ Ver caso (por ID)
- ✅ Editar caso
- ✅ Eliminar caso
- ✅ Listar todos los casos

### 👤 SOSPECHOSOS
**Campos:**
- id (UUID, primary key)
- nombre (String)
- edad (Integer)
- foto (String - URL)
- descripción (Text)
- nivel_peligro (Enum: bajo, medio, alto, extremo)
- estado (Enum: buscado, capturado, liberado, fallecido)

**CRUD:**
- ✅ Crear sospechoso
- ✅ Ver sospechoso (por ID)
- ✅ Editar sospechoso
- ✅ Eliminar sospechoso
- ✅ Listar todos los sospechosos
- ✅ Listar sospechosos por caso

### 🔍 EVIDENCIAS
**Campos:**
- id (UUID, primary key)
- nombre (String)
- tipo (Enum: foto, video, documento, arma, adn, huella)
- imagen (String - URL)
- descripción (Text)
- fecha (DateTime)
- ubicación (String)
- caso_id (UUID, foreign key → casos)

**CRUD:**
- ✅ Crear evidencia
- ✅ Ver evidencia (por ID)
- ✅ Editar evidencia
- ✅ Eliminar evidencia
- ✅ Listar evidencias por caso

### 🎤 INTERROGATORIOS
**Campos:**
- id (UUID, primary key)
- sospechoso_id (UUID, foreign key → sospechosos)
- detective (String)
- transcripción (Text)
- fecha (DateTime)
- resultado (Enum: confeso, niego, inconcluso)

**CRUD:**
- ✅ Crear interrogatorio
- ✅ Ver interrogatorio (por ID)
- ✅ Editar interrogatorio
- ✅ Eliminar interrogatorio
- ✅ Listar interrogatorios por sospechoso

### 🕒 LÍNEA DE TIEMPO
**Eventos del caso:**
- crimen
- hallazgo
- interrogatorio
- movimiento sospechoso

**Campos:**
- id (UUID, primary key)
- caso_id (UUID, foreign key → casos)
- tipo (Enum: crimen, hallazgo, interrogatorio, movimiento)
- descripcion (Text)
- fecha (DateTime)
- ubicación (String)

**CRUD:**
- ✅ Crear evento
- ✅ Ver evento (por ID)
- ✅ Editar evento
- ✅ Eliminar evento
- ✅ Listar eventos por caso

## 🔗 RELACIONES ENTRE TABLAS

| Relación | Tipo |
|----------|------|
| Caso → Evidencias | 1:N |
| Caso → Sospechosos | N:M (tabla intermedia) |
| Sospechoso → Interrogatorios | 1:N |
| Caso → Timeline | 1:N |

### Tabla Intermedia: Caso_Sospechosos
- caso_id (UUID, foreign key → casos)
- sospechoso_id (UUID, foreign key → sospechosos)
- fecha_asignacion (DateTime)
- rol (String)

## 📂 ESTRUCTURA DE DIRECTORIOS

```
app/
 ├── models/         # Modelos SQLAlchemy
 ├── schemas/        # Schemas Pydantic
 ├── routes/         # Endpoints API
 ├── services/       # Lógica de negocio
 ├── database/       # Configuración DB
 ├── auth/           # Autenticación JWT
 ├── utils/          # Utilidades
 └── main.py         # Entry point
```

## 🔐 AUTENTICACIÓN

### JWT Implementation
- **POST /auth/login** - Iniciar sesión, retorna JWT
- **POST /auth/refresh** - Refrescar token expirado
- **POST /auth/logout** - Cerrar sesión (blacklist token)

### Roles
- **detective** - Acceso a casos asignados
- **administrador** - Acceso completo al sistema

### Middleware
- Verificar JWT en cada ruta protegida
- Validar roles según endpoint
- Manejar expiración de tokens

## 🖼️ SISTEMA DE ARCHIVOS

### Subida de Imágenes
- Endpoint para subir fotos de sospechosos
- Endpoint para subir evidencias
- Endpoint para subir escenas del crimen
- Almacenamiento en sistema local o cloud (S3)

### Formatos Soportados
- Imágenes: JPG, PNG, WEBP
- Videos: MP4, WEBM
- Documentos: PDF

## 🚀 APIs ENDPOINTS

### Autenticación
```
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
```

### Casos
```
GET    /cases              - Listar todos
GET    /cases/{id}         - Obtener uno
POST   /cases              - Crear
PUT    /cases/{id}         - Actualizar
DELETE /cases/{id}         - Eliminar
GET    /cases/{id}/suspects - Sospechosos del caso
```

### Sospechosos
```
GET    /suspects           - Listar todos
GET    /suspects/{id}      - Obtener uno
POST   /suspects           - Crear
PUT    /suspects/{id}      - Actualizar
DELETE /suspects/{id}      - Eliminar
```

### Evidencias
```
POST   /evidence           - Crear
GET    /evidence/{id}      - Obtener una
GET    /evidence/case/{case_id} - Por caso
PUT    /evidence/{id}      - Actualizar
DELETE /evidence/{id}      - Eliminar
```

### Interrogatorios
```
POST   /interrogations     - Crear
GET    /interrogations/{id} - Obtener uno
GET    /interrogations/suspect/{suspect_id} - Por sospechoso
PUT    /interrogations/{id} - Actualizar
DELETE /interrogations/{id} - Eliminar
```

### Timeline
```
POST   /timeline           - Crear evento
GET    /timeline/case/{case_id} - Eventos del caso
PUT    /timeline/{id}      - Actualizar
DELETE /timeline/{id}      - Eliminar
```

### Archivos
```
POST   /upload/image       - Subir imagen
POST   /upload/evidence    - Subir evidencia
GET    /files/{filename}   - Obtener archivo
```

## 🗄️ MODELOS SQL ALCHEMY

### Modelo de Caso
```python
from sqlalchemy import Column, String, Text, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text)
    estado = Column(SQLEnum('abierto', 'cerrado', 'en_investigacion', name='estado_enum'))
    prioridad = Column(SQLEnum('baja', 'media', 'alta', 'critica', name='prioridad_enum'))
    fecha = Column(DateTime, default=datetime.utcnow)
    detective_asignado = Column(String(100))
    ubicacion = Column(String(200))
```

## 🔧 CONFIGURACIÓN

### requirements.txt
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pg8000==1.30.5
pydantic==1.10.13
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
alembic==1.13.1
python-dotenv==1.0.0
email-validator==2.1.0
```

### .env
```
DATABASE_URL=postgresql+pg8000://user:password@localhost:5432/crimennet
SECRET_KEY=tu_secret_key_super_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=./uploads
```

## 🚀 COMANDOS

### Ejecutar Instalación Automática

**Windows (PowerShell o CMD):**
```powershell
.\install.bat
```

**Windows (Git Bash):**
```bash
./install.bat
```

**Linux / macOS:**
```bash
chmod +x install.sh
./install.sh
```


### Documentación API
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🎯 ORDEN DE DESARROLLO

### FASE 1 - Backend Básico
1. Configurar proyecto FastAPI
2. Configurar PostgreSQL
3. Crear modelos SQLAlchemy
4. Crear schemas Pydantic
5. Implementar autenticación JWT
6. Crear CRUD APIs para todas las entidades

### FASE 3 - Conexión Frontend/Backend
1. Configurar CORS
2. Documentar APIs con Swagger
3. Validar endpoints con Postman/Insomnia
4. Implementar manejo de errores
5. Agregar logging

### FASE 5 - Funcionalidades Avanzadas
1. Implementar subida de archivos
2. Agregar endpoints de búsqueda
3. Implementar filtros y paginación
4. Optimizar queries con índices

## 🧠 IA (OPCIONAL - FUTURO)
Generar:
- Perfil psicológico falso de sospechosos
- Resumen automático de casos
- Análisis de patrones en casos

## 📊 MÉTRICAS A MONITOREAR

### Performance
- Tiempo de respuesta de APIs
- Número de requests por segundo
- Uso de CPU y memoria
- Tiempos de query a DB

### Negocio
- Casos creados por día
- Sospechosos agregados
- Evidencias subidas
- Usuarios activos

### Seguridad
- Intentos de login fallidos
- Tokens emitidos
- IPs sospechosas

## 🔐 SEGURIDAD

### Implementaciones
- Hashing de contraseñas con bcrypt
- JWT con expiración
- Rate limiting en endpoints sensibles
- Validación de inputs con Pydantic
- SQL injection prevention con SQLAlchemy ORM
- CORS configurado adecuadamente
- Sanitización de archivos subidos

### Best Practices
- Nunca exponer credenciales en código
- Usar variables de entorno
- Implementar HTTPS en producción
- Validar y sanitizar todos los inputs
- Logs de auditoría para acciones críticas

## 📦 DEPLOYMENT

### Docker (Opcional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: crimennet
      POSTGRES_USER: crimennet_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
  
  backend:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://crimennet_user:secure_password@db:5432/crimennet
```

### Ejecutar con Docker
```bash
docker-compose up -d
```
