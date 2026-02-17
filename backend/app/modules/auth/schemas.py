from pydantic import BaseModel, EmailStr
from typing import Dict, Any

class UserSync(BaseModel):
    email: EmailStr
    full_name: str | None = None
    provider_id: str  # The unique ID from Google/GitHub

class ProfileUpdate(BaseModel):
    user_email: str
    archetype: str          # e.g., "THE_VISUALIZER"
    scores: Dict[str, Any]