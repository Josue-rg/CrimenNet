from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.config import Base
import enum

class ResultadoInterrogatorio(enum.Enum):
    confeso = "confeso"
    niego = "niego"
    inconcluso = "inconcluso"

class Interrogation(Base):
    __tablename__ = "interrogations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sospechoso_id = Column(UUID(as_uuid=True), ForeignKey("suspects.id"), nullable=False)
    detective = Column(String(100), nullable=False)
    transcripcion = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    resultado = Column(SQLEnum(ResultadoInterrogatorio), default=ResultadoInterrogatorio.inconcluso)
    
    # Relación
    suspect = relationship("Suspect", backref="interrogations")
