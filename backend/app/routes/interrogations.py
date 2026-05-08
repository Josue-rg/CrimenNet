from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database.config import get_db
from app.models.interrogation import Interrogation
from app.schemas.interrogation import InterrogationCreate, InterrogationUpdate, InterrogationResponse

router = APIRouter()

@router.get("/", response_model=List[InterrogationResponse])
async def get_interrogations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    interrogations = db.query(Interrogation).offset(skip).limit(limit).all()
    return interrogations

@router.get("/{interrogation_id}", response_model=InterrogationResponse)
async def get_interrogation(interrogation_id: UUID, db: Session = Depends(get_db)):
    interrogation = db.query(Interrogation).filter(Interrogation.id == interrogation_id).first()
    if not interrogation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interrogatorio no encontrado")
    return interrogation

@router.get("/suspect/{suspect_id}", response_model=List[InterrogationResponse])
async def get_interrogations_by_suspect(suspect_id: UUID, db: Session = Depends(get_db)):
    interrogations = db.query(Interrogation).filter(Interrogation.sospechoso_id == suspect_id).all()
    return interrogations

@router.post("/", response_model=InterrogationResponse, status_code=status.HTTP_201_CREATED)
async def create_interrogation(interrogation: InterrogationCreate, db: Session = Depends(get_db)):
    db_interrogation = Interrogation(**interrogation.model_dump())
    db.add(db_interrogation)
    db.commit()
    db.refresh(db_interrogation)
    return db_interrogation

@router.put("/{interrogation_id}", response_model=InterrogationResponse)
async def update_interrogation(interrogation_id: UUID, interrogation: InterrogationUpdate, db: Session = Depends(get_db)):
    db_interrogation = db.query(Interrogation).filter(Interrogation.id == interrogation_id).first()
    if not db_interrogation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interrogatorio no encontrado")
    
    for key, value in interrogation.model_dump(exclude_unset=True).items():
        setattr(db_interrogation, key, value)
    
    db.commit()
    db.refresh(db_interrogation)
    return db_interrogation

@router.delete("/{interrogation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_interrogation(interrogation_id: UUID, db: Session = Depends(get_db)):
    db_interrogation = db.query(Interrogation).filter(Interrogation.id == interrogation_id).first()
    if not db_interrogation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interrogatorio no encontrado")
    
    db.delete(db_interrogation)
    db.commit()
    return None
