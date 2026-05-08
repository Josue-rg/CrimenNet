from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.config import Base

class CaseSuspect(Base):
    __tablename__ = "case_suspects"
    
    caso_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"), primary_key=True)
    sospechoso_id = Column(UUID(as_uuid=True), ForeignKey("suspects.id"), primary_key=True)
    fecha_asignacion = Column(DateTime, default=datetime.utcnow)
    rol = Column(String(100))
    
    # Relaciones
    case = relationship("Case", backref="case_suspects")
    suspect = relationship("Suspect", backref="case_suspects")
