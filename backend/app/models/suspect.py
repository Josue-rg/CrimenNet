from sqlalchemy import Column, String, Text, Integer, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database.config import Base
import enum

class NivelPeligro(enum.Enum):
    bajo = "bajo"
    medio = "medio"
    alto = "alto"
    extremo = "extremo"

class EstadoSospechoso(enum.Enum):
    buscado = "buscado"
    capturado = "capturado"
    liberado = "liberado"
    fallecido = "fallecido"

class Suspect(Base):
    __tablename__ = "suspects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(200), nullable=False)
    edad = Column(Integer)
    foto = Column(String(500))  # URL de la foto
    descripcion = Column(Text)
    nivel_peligro = Column(SQLEnum(NivelPeligro), default=NivelPeligro.bajo)
    estado = Column(SQLEnum(EstadoSospechoso), default=EstadoSospechoso.buscado)
