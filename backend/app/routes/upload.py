from fastapi import APIRouter, UploadFile, File, HTTPException, status
import os
import uuid
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".mp4"}

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    return await _save_file(file)

@router.post("/evidence")
async def upload_evidence(file: UploadFile = File(...)):
    return await _save_file(file)

async def _save_file(file: UploadFile):
    # Validar extensión
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Extensión no permitida. Extensiones permitidas: {ALLOWED_EXTENSIONS}"
        )
    
    # Generar nombre único
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Guardar archivo
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al guardar el archivo: {str(e)}"
        )
    
    # Retornar URL del archivo
    file_url = f"/files/{unique_filename}"
    return {"filename": unique_filename, "url": file_url}
