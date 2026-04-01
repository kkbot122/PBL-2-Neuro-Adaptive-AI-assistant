# app/modules/profile/schemas.py
from pydantic import BaseModel
from typing import Dict

# 1. Define the nested blocks
class TelemetryData(BaseModel):
    clicked_diagram: bool = False
    read_summary_first: bool = False
    time_spent_on_text: int = 0
    time_spent_on_visuals: int = 0
    time_spent_on_summary: int = 0
    scrolled_erratically: bool = False

class QuizResultsData(BaseModel):
    score: int = 0
    q1_correct: bool = False
    q2_correct: bool = False
    q3_correct: bool = False

# 2. Update your main Request model to wrap them
class CalibrationRequest(BaseModel):
    telemetry: TelemetryData
    quiz_results: QuizResultsData

# 3. Keep Response model exactly as it was
class ProfileResponse(BaseModel):
    primary_archetype: str
    raw_scores: Dict[str, float]

    class Config:
        from_attributes = True

class ArchetypeOverrideRequest(BaseModel):
    primary_archetype: str