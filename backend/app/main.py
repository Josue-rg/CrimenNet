from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.database.config import engine, Base
from app.models import user, case, suspect, evidence, interrogation, timeline, case_suspect
from app.routes import cases, suspects, evidence, interrogations, timeline, auth, upload, files

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CrimenNet API",
    description="API del sistema de investigaciones criminales CrimenNet",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://crimennet.vercel.app",
        "https://crimennet-git-main-josue-rgs-projects.vercel.app"  # URL alternativa de Vercel
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
app.include_router(cases.router, prefix="/cases", tags=["Casos"])
app.include_router(suspects.router, prefix="/suspects", tags=["Sospechosos"])
app.include_router(evidence.router, prefix="/evidence", tags=["Evidencias"])
app.include_router(interrogations.router, prefix="/interrogations", tags=["Interrogatorios"])
app.include_router(timeline.router, prefix="/timeline", tags=["Timeline"])
app.include_router(upload.router, prefix="/upload", tags=["Subida de Archivos"])
app.include_router(files.router, prefix="/files", tags=["Archivos"])

# Servir archivos estáticos
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
    
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

@app.get("/")
def root():
    return {
        "message": "CrimenNet API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
