from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.timeline import TipoEvento

class TimelineBase(BaseModel):
    caso_id: UUID
    tipo: TipoEvento
    descripcion: str
    ubicacion: Optional[str] = Field(None, max_length=200)

class TimelineCreate(TimelineBase):
    pass

class TimelineUpdate(BaseModel):
    tipo: Optional[TipoEvento] = None
    descripcion: Optional[str] = None
    ubicacion: Optional[str] = Field(None, max_length=200)

class TimelineResponse(TimelineBase):
    id: UUID
    fecha: datetime
    
    class Config:
        from_attributes = True
