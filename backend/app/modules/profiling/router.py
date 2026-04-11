from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.profiling.schemas import CalibrationPayload
from app.modules.profiling.models import UserProfile, SessionEvent
from app.modules.auth.models import User
from pydantic import BaseModel
from typing import List, Optional

# Import full FSLSM math engine
from app.services.fslsm import clamp, signals_to_deltas, nudge_vector 

router = APIRouter(prefix="/api/v1/profile", tags=["profiling"])

def normalize_to_vector(score: int, max_possible: int = 50) -> float:
    return clamp(score / max_possible, 0.0, 1.0)

# --- NEW: Ongoing Real-Time Signal Processing ---
class SignalPayload(BaseModel):
    signals: List[str]
    session_id: Optional[int] = None

@router.post("/signals")
def apply_behavioral_signals(
    payload: SignalPayload,
    x_user_email: str = Header(...),
    x_internal_token: str = Header(...),
    db: Session = Depends(get_db)
):
    if x_internal_token != "dev_secret_key_123": 
        raise HTTPException(status_code=403, detail="Unauthorized")

    user = db.query(User).filter(User.email == x_user_email).first()
    if not user or not user.profile:
        raise HTTPException(status_code=404, detail="User or Profile not found")

    # 1. Log the raw telemetry longitudinally 
    events = [
        SessionEvent(user_id=user.id, session_id=payload.session_id, event_type=sig)
        for sig in payload.signals
    ]
    db.add_all(events)

    profile = user.profile
    
    # 2. Convert textual signals from frontend into FSLSM math deltas
    deltas = signals_to_deltas(payload.signals)
    
    # 3. Apply nudges to current vectors
    updated_fslsm = nudge_vector(profile.fslsm_vectors, deltas)

    # 4. Update database atomically
    if any(v != 0.0 for v in deltas.values()):
        profile.fslsm_processing    = updated_fslsm["processing"]
        profile.fslsm_perception    = updated_fslsm["perception"]
        profile.fslsm_reception     = updated_fslsm["reception"]
        profile.fslsm_understanding = updated_fslsm["understanding"]
        
    db.commit()

    return {
        "success": True,
        "vectors": profile.fslsm_vectors,
        "deltas_applied": deltas
    }

# --- EXISTING: Initial Onboarding Calibration ---
@router.post("/calibrate")
def calibrate_user_profile(
    payload: CalibrationPayload,
    x_user_email: str = Header(...),
    x_internal_token: str = Header(...),
    db: Session = Depends(get_db)
):
    if not x_internal_token:
        raise HTTPException(status_code=403, detail="Unauthorized")

    user = db.query(User).filter(User.email == x_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)

    tel = payload.telemetry
    quiz = payload.quiz_results

    vis_pts = tel.time_spent_on_visuals + (10 if tel.clicked_diagram else 0) + (15 if quiz.q3_correct else 0)
    txt_pts = tel.time_spent_on_text + (15 if quiz.q1_correct else 0)
    vis_strength = normalize_to_vector(vis_pts, max_possible=60)
    txt_strength = normalize_to_vector(txt_pts, max_possible=60)
    reception_vector = clamp(txt_strength - vis_strength, -1.0, 1.0)

    logic_pts = 20 if tel.scrolled_erratically else 0
    global_pts = 20 if tel.read_summary_first else 0
    seq_strength = normalize_to_vector(logic_pts, max_possible=40)
    glob_strength = normalize_to_vector(global_pts, max_possible=40)
    understanding_vector = clamp(glob_strength - seq_strength, -1.0, 1.0)

    active_vector = 0.0
    if tel.time_spent_on_text < 10 and tel.time_spent_on_visuals < 10:
        active_vector = -0.5
    elif tel.time_spent_on_text > 40:
        active_vector = 0.5

    profile.fslsm_reception = reception_vector
    profile.fslsm_understanding = understanding_vector
    profile.fslsm_processing = active_vector
    profile.fslsm_perception = 0.0 
    
    if reception_vector <= -0.3:
        archetype = "THE_VISUALIZER"
    elif understanding_vector >= 0.3:
        archetype = "THE_SKIMMER"
    elif reception_vector >= 0.3:
        archetype = "THE_SCHOLAR"
    else:
        archetype = "THE_SYNTHESIZER"

    profile.primary_archetype = archetype
    profile.raw_scores = payload.model_dump()
    profile.total_engagement_time += (tel.time_spent_on_text + tel.time_spent_on_visuals + tel.time_spent_on_summary)

    db.commit()

    return {
        "success": True, 
        "archetype": archetype, 
        "vectors": profile.fslsm_vectors,
        "message": "Profile FSLSM vectors calibrated successfully."
    }