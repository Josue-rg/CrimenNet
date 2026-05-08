from sqlalchemy import Column, String, Text, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database.config import Base
import enum

class EstadoCaso(enum.Enum):
    abierto = "abierto"
    cerrado = "cerrado"
    en_investigacion = "en_investigacion"

class PrioridadCaso(enum.Enum):
    baja = "baja"
    media = "media"
    alta = "alta"
    critica = "critica"

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text)
    estado = Column(SQLEnum(EstadoCaso), default=EstadoCaso.abierto)
    prioridad = Column(SQLEnum(PrioridadCaso), default=PrioridadCaso.media)
    fecha = Column(DateTime, default=datetime.utcnow)
    detective_asignado = Column(String(100))
    ubicacion = Column(String(200))
