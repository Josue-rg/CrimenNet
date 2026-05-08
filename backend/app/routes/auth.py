from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, Token, UserCreate, UserResponse
from app.auth.security import verify_password, get_password_hash, create_access_token
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado")
    
    db_email = db.query(User).filter(User.email == user_data.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Crear nuevo usuario
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pwd,
        role=user_data.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    # Buscar en la base de datos
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    return {"message": "Sesión cerrada correctamente"}
