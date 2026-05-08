# FRONTEND - CrimenNet

## 📋 DESCRIPCIÓN
Frontend del sistema web de investigaciones criminales CrimenNet. Interfaz visual para detectives que administran casos, sospechosos, evidencias, interrogatorios y líneas de tiempo, todo conectado visualmente.

## 🛠️ TECNOLOGÍAS

### Stack Principal
- **React + Vite** - Framework y build tool
- **TailwindCSS** - Estilos
- **Framer Motion** - Animaciones

### Herramientas Clave
- **React Flow** - Tablero de investigación con nodos conectados
- **Axios** - Cliente HTTP para API calls
- **React Router** - Enrutamiento
- **Tailwind** - Estilos utility-first
- **Framer Motion** - Animaciones suaves

## 🎨 ESTILO VISUAL

### Tema
- Oscuro
- Estilo FBI
- Cyber detective
- Terminales
- Glassmorphism

### Paleta de Colores
- Negro
- Gris oscuro
- Rojo suave
- Azul neon suave

### Efectos Visuales
- Glow (brillo)
- Animaciones suaves
- Hover elegante
- Cards modernas

## 📂 ESTRUCTURA DE DIRECTORIOS

```
src/
 ├── components/     # Componentes reutilizables
 ├── pages/          # Páginas principales
 ├── services/       # Servicios API (Axios)
 ├── hooks/          # Custom hooks
 ├── layouts/        # Layouts compartidos
 ├── routes/         # Configuración de rutas
 └── context/        # Context providers (Auth, etc.)
```

## 📄 PÁGINAS Y COMPONENTES

### 🔐 Autenticación
- **Login** - Página de inicio de sesión
  - Roles: detective, administrador
  - Autenticación con JWT

### 📊 Dashboard
- Mostrar:
  - Casos abiertos
  - Casos cerrados
  - Casos peligrosos
  - Actividad reciente

### 📁 Gestión de Casos
- **Lista de casos** - Tabla con todos los casos
- **Detalle de caso** - Vista individual de caso
- **Crear caso** - Formulario para nuevo caso
- **Editar caso** - Formulario de edición
- **Eliminar caso** - Confirmación y eliminación

### 👤 Gestión de Sospechosos
- **Lista de sospechosos** - Grid con fotos y datos
- **Detalle de sospechoso** - Perfil completo
- **Crear sospechoso** - Formulario con foto
- **Editar sospechoso** - Actualización de datos

### 🔍 Gestión de Evidencias
- **Lista de evidencias** - Grid con imágenes
- **Subir evidencia** - Formulario con imagen
- **Detalle de evidencia** - Información completa

### 🎤 Gestión de Interrogatorios
- **Lista de interrogatorios** - Tabla cronológica
- **Crear interrogatorio** - Formulario con transcripción
- **Detalle de interrogatorio** - Transcripción completa

### 🧵 Tablero de Investigación
- **ALMA DEL PROYECTO**
- Nodos conectados visualmente
- Sospechosos unidos
- Evidencias relacionadas
- Implementado con React Flow

### 🕒 Línea de Tiempo
- Eventos del caso:
  - Crimen
  - Hallazgo
  - Interrogatorio
  - Movimiento sospechoso

### 🖼️ Sistema de Fotos
- Subir:
  - Fotos de sospechosos
  - Evidencias
  - Escenas del crimen

### 🗺️ Mapa
- Ubicación de eventos del caso

### 📁 Archivos Clasificados
- Animación estilo:
  - [CLASSIFIED]
  - ACCESS GRANTED

## 🔗 INTEGRACIÓN CON BACKEND

### APIs a Consumir

#### Casos
- `GET /cases` - Obtener todos los casos
- `POST /cases` - Crear nuevo caso
- `PUT /cases/:id` - Actualizar caso
- `DELETE /cases/:id` - Eliminar caso

#### Sospechosos
- `GET /suspects` - Obtener todos los sospechosos
- `POST /suspects` - Crear nuevo sospechoso

#### Evidencias
- `POST /evidence` - Subir nueva evidencia

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Refrescar token

### Servicios API (Axios)
```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

## 🔊 SONIDOS (OPCIONAL)
Efectos de sonido muy suaves:
- Clicks
- Terminal
- Scanner

## 🚀 COMANDOS

### Crear Proyecto
```bash
npm create vite@latest frontend -- --template react
cd frontend
```

### Instalar Dependencias
```bash
npm install
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion
npm install reactflow
```

### Configurar Tailwind
```bash
# En tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fbi-black': '#0a0a0a',
        'fbi-gray': '#1a1a1a',
        'fbi-red': '#8b0000',
        'fbi-blue': '#00ffff',
      }
    }
  },
  plugins: [],
}
```

### Desarrollo
```bash
npm run dev
```

### Build para Producción
```bash
npm run build
```

### Preview de Producción
```bash
npm run preview
```

## 📦 DEPENDENCIAS (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "framer-motion": "^10.16.0",
    "reactflow": "^11.10.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "vite": "^5.0.0"
  }
}
```

## 🎯 ORDEN DE DESARROLLO

### FASE 2 - Frontend Básico
1. Configurar proyecto React + Vite
2. Configurar TailwindCSS
3. Crear estructura de directorios
4. Implementar Login
5. Implementar Dashboard
6. Crear tablas para CRUD básico

### FASE 3 - Conexión Frontend/Backend
1. Configurar Axios con interceptors
2. Crear servicios API
3. Conectar Login con backend
4. Conectar Dashboard con APIs
5. Implementar CRUD completo

### FASE 4 - Diseño Visual
1. Aplicar tema oscuro FBI
2. Implementar glassmorphism
3. Agregar efectos glow
4. Animaciones con Framer Motion
5. Hover elegantes en cards

### FASE 5 - Tablero de Investigación
1. Instalar React Flow
2. Crear componente de nodos
3. Implementar conexiones
4. Integrar con datos del backend
5. Agregar interactividad

## 📊 MÉTRICAS A MONITOREAR

### Performance
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Bundle size

### UX
- Tiempo de carga de páginas
- Tiempo de respuesta de APIs
- Errores de usuario

### Negocio
- Casos creados por sesión
- Tiempo promedio en investigación
- Uso del tablero de investigación

## 🔐 SEGURIDAD
- Almacenar JWT en localStorage con cuidado
- Validar tokens en cada request
- Sanitizar inputs de usuario
- Proteger rutas con PrivateRoute
- Logout automático al expirar token

## 🎨 COMPONENTES UI RECOMENDADOS
- Cards con glassmorphism
- Tablas con hover effects
- Modales animados
- Toast notifications
- Loading skeletons
- Image galleries
- Timeline vertical
- Node graph (React Flow)
