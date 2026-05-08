from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.interrogation import ResultadoInterrogatorio

class InterrogationBase(BaseModel):
    sospechoso_id: UUID
    detective: str = Field(..., max_length=100)
    transcripcion: str
    resultado: Optional[ResultadoInterrogatorio] = ResultadoInterrogatorio.inconcluso

class InterrogationCreate(InterrogationBase):
    pass

class InterrogationUpdate(BaseModel):
    detective: Optional[str] = Field(None, max_length=100)
    transcripcion: Optional[str] = None
    resultado: Optional[ResultadoInterrogatorio] = None

class InterrogationResponse(InterrogationBase):
    id: UUID
    fecha: datetime
    
    class Config:
        from_attributes = True
