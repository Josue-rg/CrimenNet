from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database.config import get_db
from app.models.evidence import Evidence
from app.schemas.evidence import EvidenceCreate, EvidenceUpdate, EvidenceResponse

router = APIRouter()

@router.get("/", response_model=List[EvidenceResponse])
async def get_evidence(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).offset(skip).limit(limit).all()
    return evidence

@router.get("/case/{case_id}", response_model=List[EvidenceResponse])
async def get_evidence_by_case(case_id: UUID, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.caso_id == case_id).all()
    return evidence

@router.get("/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence_by_id(evidence_id: UUID, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidencia no encontrada")
    return evidence

@router.post("/", response_model=EvidenceResponse, status_code=status.HTTP_201_CREATED)
async def create_evidence(evidence: EvidenceCreate, db: Session = Depends(get_db)):
    db_evidence = Evidence(**evidence.model_dump())
    db.add(db_evidence)
    db.commit()
    db.refresh(db_evidence)
    return db_evidence

@router.put("/{evidence_id}", response_model=EvidenceResponse)
async def update_evidence(evidence_id: UUID, evidence: EvidenceUpdate, db: Session = Depends(get_db)):
    db_evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not db_evidence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidencia no encontrada")
    
    for key, value in evidence.model_dump(exclude_unset=True).items():
        setattr(db_evidence, key, value)
    
    db.commit()
    db.refresh(db_evidence)
    return db_evidence

@router.delete("/{evidence_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_evidence(evidence_id: UUID, db: Session = Depends(get_db)):
    db_evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not db_evidence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidencia no encontrada")
    
    db.delete(db_evidence)
    db.commit()
    return None
