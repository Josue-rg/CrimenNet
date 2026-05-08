from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database.config import get_db
from app.models.timeline import Timeline
from app.schemas.timeline import TimelineCreate, TimelineUpdate, TimelineResponse

router = APIRouter()

@router.get("/", response_model=List[TimelineResponse])
async def get_timeline(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    timeline = db.query(Timeline).offset(skip).limit(limit).order_by(Timeline.fecha.desc()).all()
    return timeline

@router.get("/case/{case_id}", response_model=List[TimelineResponse])
async def get_timeline_by_case(case_id: UUID, db: Session = Depends(get_db)):
    timeline = db.query(Timeline).filter(Timeline.caso_id == case_id).order_by(Timeline.fecha.desc()).all()
    return timeline

@router.post("/", response_model=TimelineResponse, status_code=status.HTTP_201_CREATED)
async def create_timeline_event(event: TimelineCreate, db: Session = Depends(get_db)):
    db_event = Timeline(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.put("/{event_id}", response_model=TimelineResponse)
async def update_event(event_id: UUID, event: TimelineUpdate, db: Session = Depends(get_db)):
    db_event = db.query(Timeline).filter(Timeline.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado")
    
    for key, value in event.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_timeline_event(event_id: UUID, db: Session = Depends(get_db)):
    db_event = db.query(Timeline).filter(Timeline.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado")
    
    db.delete(db_event)
    db.commit()
    return None
