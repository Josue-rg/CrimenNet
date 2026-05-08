from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database.config import get_db
from app.models.suspect import Suspect
from app.schemas.suspect import SuspectCreate, SuspectUpdate, SuspectResponse

router = APIRouter()

@router.get("/", response_model=List[SuspectResponse])
async def get_suspects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    suspects = db.query(Suspect).offset(skip).limit(limit).all()
    return suspects

@router.get("/{suspect_id}", response_model=SuspectResponse)
async def get_suspect(suspect_id: UUID, db: Session = Depends(get_db)):
    suspect = db.query(Suspect).filter(Suspect.id == suspect_id).first()
    if not suspect:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sospechoso no encontrado")
    return suspect

@router.post("/", response_model=SuspectResponse, status_code=status.HTTP_201_CREATED)
async def create_suspect(suspect: SuspectCreate, db: Session = Depends(get_db)):
    db_suspect = Suspect(**suspect.model_dump())
    db.add(db_suspect)
    db.commit()
    db.refresh(db_suspect)
    return db_suspect

@router.put("/{suspect_id}", response_model=SuspectResponse)
async def update_suspect(suspect_id: UUID, suspect: SuspectUpdate, db: Session = Depends(get_db)):
    db_suspect = db.query(Suspect).filter(Suspect.id == suspect_id).first()
    if not db_suspect:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sospechoso no encontrado")
    
    for key, value in suspect.model_dump(exclude_unset=True).items():
        setattr(db_suspect, key, value)
    
    db.commit()
    db.refresh(db_suspect)
    return db_suspect

@router.delete("/{suspect_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_suspect(suspect_id: UUID, db: Session = Depends(get_db)):
    db_suspect = db.query(Suspect).filter(Suspect.id == suspect_id).first()
    if not db_suspect:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sospechoso no encontrado")
    
    db.delete(db_suspect)
    db.commit()
    return None
