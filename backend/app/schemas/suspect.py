from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
from app.models.suspect import NivelPeligro, EstadoSospechoso

class SuspectBase(BaseModel):
    nombre: str = Field(..., max_length=200)
    edad: Optional[int] = None
    foto: Optional[str] = Field(None, max_length=500)
    descripcion: Optional[str] = None
    nivel_peligro: Optional[NivelPeligro] = NivelPeligro.bajo
    estado: Optional[EstadoSospechoso] = EstadoSospechoso.buscado

class SuspectCreate(SuspectBase):
    pass

class SuspectUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=200)
    edad: Optional[int] = None
    foto: Optional[str] = Field(None, max_length=500)
    descripcion: Optional[str] = None
    nivel_peligro: Optional[NivelPeligro] = None
    estado: Optional[EstadoSospechoso] = None

class SuspectResponse(SuspectBase):
    id: UUID
    
    class Config:
        from_attributes = True
