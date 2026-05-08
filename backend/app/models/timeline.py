from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.config import Base
import enum

class TipoEvento(enum.Enum):
    crimen = "crimen"
    hallazgo = "hallazgo"
    interrogatorio = "interrogatorio"
    movimiento = "movimiento"

class Timeline(Base):
    __tablename__ = "timeline"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    caso_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"), nullable=False)
    tipo = Column(SQLEnum(TipoEvento), nullable=False)
    descripcion = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    ubicacion = Column(String(200))
    
    # Relación
    case = relationship("Case", backref="timeline")
