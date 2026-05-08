from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.config import Base
import enum

class TipoEvidencia(enum.Enum):
    foto = "foto"
    video = "video"
    documento = "documento"
    arma = "arma"
    adn = "adn"
    huella = "huella"

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(200), nullable=False)
    tipo = Column(SQLEnum(TipoEvidencia), nullable=False)
    imagen = Column(String(500))  # URL de la imagen
    descripcion = Column(Text)
    fecha = Column(DateTime, default=datetime.utcnow)
    ubicacion = Column(String(200))
    caso_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"), nullable=False)
    
    # Relación
    case = relationship("Case", backref="evidencias")
