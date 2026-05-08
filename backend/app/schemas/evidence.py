from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.evidence import TipoEvidencia

class EvidenceBase(BaseModel):
    nombre: str = Field(..., max_length=200)
    tipo: TipoEvidencia
    imagen: Optional[str] = Field(None, max_length=500)
    descripcion: Optional[str] = None
    ubicacion: Optional[str] = Field(None, max_length=200)
    caso_id: UUID

class EvidenceCreate(EvidenceBase):
    pass

class EvidenceUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=200)
    tipo: Optional[TipoEvidencia] = None
    imagen: Optional[str] = Field(None, max_length=500)
    descripcion: Optional[str] = None
    ubicacion: Optional[str] = Field(None, max_length=200)

class EvidenceResponse(EvidenceBase):
    id: UUID
    fecha: datetime
    
    class Config:
        from_attributes = True
