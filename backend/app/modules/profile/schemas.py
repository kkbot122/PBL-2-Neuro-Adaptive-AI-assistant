from pydantic import BaseModel
from typing import Dict, Any, Optional

# --- 1. Define the Nested Models (Phase 2 & 3 Metrics) ---
class QuestionMetricSchema(BaseModel):
    is_correct: bool = False
    time_to_answer_ms: int = 0
    changed_answer: bool = False

class QuizResultsSchema(BaseModel):
    total_score: int = 0
    q1: QuestionMetricSchema
    q2: QuestionMetricSchema
    q3: QuestionMetricSchema

class TelemetrySchema(BaseModel):
    clicked_diagram: bool = False
    read_summary_first: bool = False
    # Use float for time spent since frontend visibility trackers often return decimals
    time_spent_on_text: float = 0.0 
    time_spent_on_visuals: float = 0.0
    time_spent_on_summary: float = 0.0
    scrolled_erratically: bool = False
    reading_speed_wpm: int = 0

# --- 2. Update the Main Request ---
class CalibrationRequest(BaseModel):
    telemetry: TelemetrySchema
    quiz_results: QuizResultsSchema

# --- 3. Keep Response model with Optional fallbacks ---
class ProfileResponse(BaseModel):
    primary_archetype: str
    raw_scores: Dict[str, float]
    
    # Optional fields prevent 500 errors for existing users in the database
    archetype_confidence: Optional[float] = 0.5
    calibration_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ArchetypeOverrideRequest(BaseModel):
    primary_archetype: str