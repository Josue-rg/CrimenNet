from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.case import EstadoCaso, PrioridadCaso

class CaseBase(BaseModel):
    titulo: str = Field(..., max_length=200)
    descripcion: Optional[str] = None
    estado: Optional[EstadoCaso] = EstadoCaso.abierto
    prioridad: Optional[PrioridadCaso] = PrioridadCaso.media
    detective_asignado: Optional[str] = Field(None, max_length=100)
    ubicacion: Optional[str] = Field(None, max_length=200)

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    titulo: Optional[str] = Field(None, max_length=200)
    descripcion: Optional[str] = None
    estado: Optional[EstadoCaso] = None
    prioridad: Optional[PrioridadCaso] = None
    detective_asignado: Optional[str] = Field(None, max_length=100)
    ubicacion: Optional[str] = Field(None, max_length=200)

class CaseResponse(CaseBase):
    id: UUID
    fecha: datetime
    
    class Config:
        from_attributes = True
