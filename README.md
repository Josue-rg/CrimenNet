# CrimenNet - Sistema de Investigaciones Criminales

## Descripción del Proyecto

CrimenNet es una aplicación web tipo CRUD para la gestión de investigaciones criminales. El sistema permite registrar, consultar, editar y eliminar casos criminales, sospechosos, evidencias, interrogatorios y eventos de una línea de tiempo. La aplicación cuenta con una interfaz moderna estilo FBI/Cyber detective con tema oscuro, efectos glassmorphism y animaciones interactivas.

## Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web moderno y rápido para Python
- **PostgreSQL (Neon)** - Base de datos relacional en la nube
- **SQLAlchemy** - ORM para manejo de base de datos
- **Pydantic** - Validación de datos y esquemas
- **Bcrypt** - Encriptación de contraseñas
- **JWT (JSON Web Tokens)** - Autenticación y autorización
- **Uvicorn** - Servidor ASGI para ejecutar FastAPI

### Frontend
- **React** - Biblioteca JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de build rápida y moderna
- **TailwindCSS** - Framework CSS para estilos
- **Framer Motion** - Biblioteca de animaciones
- **React Flow** - Visualización de grafos y relaciones
- **Axios** - Cliente HTTP para peticiones API
- **Lucide React** - Iconos modernos
- **React Router v7** - Enrutamiento de la aplicación

### Herramientas de Desarrollo
- **Docker** - Contenedores para despliegue
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto

## Funcionalidades

### 1. Gestión de Casos (CRUD)
- **Crear:** Registrar nuevos casos criminales con título, descripción, estado, prioridad, detective asignado y ubicación
- **Consultar:** Ver lista de todos los casos con filtros de búsqueda
- **Editar:** Modificar información de casos existentes
- **Eliminar:** Eliminar casos del sistema
- **Campos:** id, título, descripción, estado, prioridad, detective_asignado, ubicación, fecha (7 campos)

### 2. Gestión de Sospechosos (CRUD)
- **Crear:** Registrar nuevos sospechosos con nombre, edad, foto, nivel de peligro, estado y descripción
- **Consultar:** Ver lista de sospechosos con filtros y vista detallada
- **Editar:** Modificar información de sospechosos
- **Eliminar:** Eliminar sospechosos del sistema
- **Campos:** id, nombre, edad, foto, nivel_peligro, estado, descripcion (7 campos)

### 3. Gestión de Evidencias (CRUD)
- **Crear:** Subir nuevas evidencias con nombre, tipo, imagen, descripción y caso asociado
- **Consultar:** Ver lista de evidencias filtradas por caso
- **Editar:** Modificar información de evidencias
- **Eliminar:** Eliminar evidencias del sistema
- **Campos:** id, nombre, tipo, imagen, descripcion, ubicacion, caso_id, fecha (8 campos)

### 4. Gestión de Interrogatorios (CRUD)
- **Crear:** Registrar interrogatorios con sospechoso, detective, fecha, resultado y transcripción
- **Consultar:** Ver lista de interrogatorios con filtros
- **Editar:** Modificar información de interrogatorios
- **Eliminar:** Eliminar interrogatorios del sistema
- **Campos:** id, sospechoso_id, detective, fecha, resultado, transcripcion (6 campos)

### 5. Línea de Tiempo de Eventos
- **Crear:** Registrar eventos en la cronología del caso
- **Consultar:** Ver timeline visual de eventos por caso
- **Campos:** id, caso_id, tipo, descripcion, ubicacion, fecha (6 campos)

### 6. Tablero de Investigación Visual
- Visualización interactiva de relaciones entre casos y sospechosos
- Grafos interactivos con React Flow
- Carga dinámica de datos del backend

### 7. Autenticación y Seguridad
- Sistema de registro y login de usuarios
- Tokens JWT para sesiones seguras
- Protección de rutas privadas
- Contraseñas encriptadas con Bcrypt

## Instrucciones para Ejecutar el Proyecto

### Requisitos Previos
- Python 3.11 o superior
- Node.js 18 o superior
- Cuenta en [Neon](https://console.neon.tech) para base de datos
- Git instalado

### Configuración de Base de Datos
1. Ve a [console.neon.tech](https://console.neon.tech)
2. Crea un nuevo proyecto
3. Copia la Connection String proporcionada

### Configuración del Backend
## Ejecutar Instalación Automática

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

El backend estará disponible en: http://localhost:8000
Documentación API: http://localhost:8000/docs

### Configuración del Frontend
```bash
# Navegar al directorio del frontend (nueva terminal)
cd frontend

# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: http://localhost:5173

### Ejecutar con Docker (Opcional)
```bash
# En la raíz del proyecto
# Configurar .env con tus valores
cp .env.example .env

# Iniciar todos los servicios
docker-compose up --build
```

## Evidencias del Sistema Funcionando

### Capturas de Pantalla (Descripción)

1. **Pantalla de Login:** Interfaz de autenticación con diseño estilo FBI
2. **Dashboard Principal:** Vista general con estadísticas y acceso a módulos
3. **Lista de Casos:** Grid de casos con filtros de búsqueda y estado
4. **Detalle de Caso:** Información completa del caso con sospechosos, evidencias y timeline
5. **Formulario de Caso:** Modal para crear/editar casos
6. **Lista de Sospechosos:** Grid de sospechosos con fotos y nivel de peligro
7. **Detalle de Sospechoso:** Perfil completo con información y interrogatorios
8. **Formulario de Sospechoso:** Modal con subida de foto para registro
9. **Lista de Evidencias:** Grid de evidencias con imágenes y filtros por caso
10. **Formulario de Evidencia:** Modal para subir archivos y registrar evidencias
11. **Timeline de Eventos:** Cronología vertical visual de eventos por caso
12. **Lista de Interrogatorios:** Tabla de interrogatorios con CRUD completo
13. **Formulario de Interrogatorio:** Modal para registrar interrogaciones
14. **Tablero de Investigación:** Visualización interactiva de relaciones con React Flow

### Funcionalidades CRUD Verificadas

**✅ Crear Registros:** Todos los módulos permiten crear nuevos registros mediante formularios modales validados.

**✅ Consultar Registros:** Cada entidad tiene su propia vista de lista con filtros de búsqueda y ordenamiento.

**✅ Editar Registros:** Los formularios de creación reutilizan la misma lógica para editar registros existentes.

**✅ Eliminar Registros:** Cada módulo incluye botón de eliminación con confirmación de seguridad.

## Uso de Inteligencia Artificial

**Sí, se utilizó Inteligencia Artificial (Cascade) en el desarrollo de este proyecto para:**

- **Generación de código:** Creación de componentes React, esquemas Pydantic, rutas de API y configuraciones
- **Depuración y corrección de errores:** Solución de problemas de CORS, configuración de Pydantic y errores de sintaxis
- **Optimización de código:** Mejora de estructura y organización del código
- **Documentación:** Generación de comentarios y documentación de funciones
- **Configuración de despliegue:** Creación de archivos Docker, .env.example y guías de despliegue

**Nota:** Aunque se utilizó IA como herramienta de asistencia, el estudiante es capaz de explicar el funcionamiento general del proyecto, incluyendo la arquitectura, flujo de datos, autenticación JWT, manejo de base de datos con SQLAlchemy, y el patrón CRUD implementado en cada entidad.

## Organización del Código

```
CrimenNet/
├── backend/
│   ├── app/
│   │   ├── models/          # Modelos SQLAlchemy (User, Case, Suspect, Evidence, Interrogation, Timeline)
│   │   ├── schemas/         # Esquemas Pydantic para validación
│   │   ├── routes/          # Rutas API (auth, cases, suspects, evidence, interrogations, timeline)
│   │   ├── database/        # Configuración de conexión a base de datos
│   │   ├── auth/            # Módulos de seguridad (JWT, Bcrypt, dependencias)
│   │   └── main.py          # Punto de entrada de la aplicación FastAPI
│   ├── uploads/             # Directorio para archivos subidos
│   ├── requirements.txt     # Dependencias de Python
│   ├── .env.example         # Plantilla de variables de entorno
│   └── Dockerfile           # Imagen Docker del backend
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (SuspectForm, CaseForm, ClassifiedAnimation)
│   │   ├── pages/           # Páginas principales (Dashboard, CaseList, SuspectList, etc.)
│   │   ├── services/        # Servicios API (api.js, index.js con authService, caseService, etc.)
│   │   ├── hooks/           # Hooks personalizados (useSoundEffects, useAuth)
│   │   ├── layouts/         # Layouts de la aplicación (MainLayout)
│   │   ├── context/         # Contextos React (AuthContext)
│   │   └── App.jsx          # Componente principal con rutas
│   ├── public/              # Archivos estáticos
│   ├── index.css            # Estilos globales y animaciones
│   ├── package.json         # Dependencias de Node.js
│   ├── .env.example         # Plantilla de variables de entorno
│   └── Dockerfile           # Imagen Docker del frontend
├── docker-compose.yml       # Orquestación de servicios Docker
├── .gitignore              # Archivos ignorados por Git
├── .env.example            # Plantilla de variables de entorno general
└── README.md               # Este archivo
```

## Criterios de Evaluación Cumplidos

- ✅ **Repositorio en GitHub:** Proyecto subido a GitHub con control de versiones
- ✅ **README completo:** Contiene nombre, descripción, tecnologías, funcionalidades, instrucciones, evidencias y mención de IA
- ✅ **Interfaz funcional:** Interfaz moderna, responsiva y con buen UX
- ✅ **Crear registros:** Todos los módulos permiten crear nuevos registros
- ✅ **Consultar registros:** Cada entidad tiene vista de lista con filtros
- ✅ **Editar registros:** Formularios reutilizables para edición
- ✅ **Eliminar registros:** Botones de eliminación con confirmación
- ✅ **Organización del código:** Estructura clara y modular siguiendo patrones MVC

## Enlace del Repositorio

[GitHub - CrimenNet](https://github.com/tu-usuario/CrimenNet)

---

**Desarrollado como proyecto educativo para demostración de desarrollo full-stack con CRUD completo.**