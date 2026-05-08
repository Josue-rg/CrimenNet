from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from uuid import UUID

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: Optional[str] = "detective"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    is_active: bool

    class Config:
        from_attributes = True
