from pydantic import BaseModel, EmailStr
from typing import Optional


class GoogleLoginRequest(BaseModel):
    token: str  # The Google ID token from frontend


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool
    auth_provider: str

    class Config:
        from_attributes = True
