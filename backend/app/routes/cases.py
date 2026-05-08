from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database.config import get_db
from app.models.case import Case
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse

from app.models.case_suspect import CaseSuspect
from app.models.suspect import Suspect
from app.schemas.suspect import SuspectResponse

router = APIRouter()

@router.get("/{case_id}/suspects", response_model=List[SuspectResponse])
async def get_case_suspects(case_id: UUID, db: Session = Depends(get_db)):
    suspects = db.query(Suspect).join(CaseSuspect).filter(CaseSuspect.caso_id == case_id).all()
    return suspects

@router.get("/", response_model=List[CaseResponse])
async def get_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cases = db.query(Case).offset(skip).limit(limit).all()
    return cases

@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: UUID, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    return case

@router.post("/", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    db_case = Case(**case.model_dump())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(case_id: UUID, case: CaseUpdate, db: Session = Depends(get_db)):
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    
    for key, value in case.model_dump(exclude_unset=True).items():
        setattr(db_case, key, value)
    
    db.commit()
    db.refresh(db_case)
    return db_case

@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_case(case_id: UUID, db: Session = Depends(get_db)):
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    
    db.delete(db_case)
    db.commit()
    return None
