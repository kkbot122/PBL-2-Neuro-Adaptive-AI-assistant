from pydantic import BaseModel
from typing import Dict

class CalibrationRequest(BaseModel):
    clicked_diagram: bool = False
    read_summary_first: bool = False
    time_spent_on_text: int
    interacted_with_quiz: bool = False
    scrolled_erratically: bool = False

class ProfileResponse(BaseModel):
    # This perfectly matches the ProfileData interface in ProfileDashboard.tsx
    primary_archetype: str
    raw_scores: Dict[str, float]

    class Config:
        from_attributes = True