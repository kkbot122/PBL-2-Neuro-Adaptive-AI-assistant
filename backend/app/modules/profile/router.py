from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.models import User
from app.modules.profiling.models import UserProfile
from app.modules.profile.schemas import CalibrationRequest, ProfileResponse
from app.modules.profile.service import calculate_profile
from app.core.config import settings
from app.modules.profile.schemas import ArchetypeOverrideRequest
from app.modules.profile.service import ARCHETYPES

router = APIRouter()

# --- Security Gatekeeper ---
async def get_current_user(
    x_user_email: str = Header(...),
    x_internal_token: str = Header(...),
    db: Session = Depends(get_db)
):
    if x_internal_token != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid Internal API Key")
    
    user = db.query(User).filter(User.email == x_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in DB")
    return user

# --- Get Profile Endpoint ---
@router.get("/me", response_model=ProfileResponse)
def get_my_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.profile:
        # Auto-create a blank profile if they haven't taken the test
        empty_scores = {"visual": 0, "structural": 0, "active": 0, "logic": 0}
        profile = UserProfile(
            user_id=user.id, 
            primary_archetype="THE_DEBUGGER", 
            raw_scores=empty_scores
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile
        
    return user.profile

# --- Submit Telemetry Endpoint ---
@router.post("/calibrate")
def submit_calibration(
    data: CalibrationRequest, 
    user=Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Process the raw clicks/scrolls into a Profile
    result = calculate_profile(data)
    
    if not user.profile:
        user.profile = UserProfile(user_id=user.id)
    
    # Save to PostgreSQL
    user.profile.primary_archetype = result["primary_archetype"]
    user.profile.raw_scores = result["raw_scores"]
    
    db.commit()
    
    return {"status": "calibrated", "archetype": result["primary_archetype"]}

# 
@router.patch("/override")
def override_archetype(
    data: ArchetypeOverrideRequest, 
    user=Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if not user.profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please calibrate first.")
    
    valid_archetypes = list(ARCHETYPES.values())
    if data.primary_archetype not in valid_archetypes:
        raise HTTPException(status_code=400, detail="Invalid archetype selection.")

    user.profile.primary_archetype = data.primary_archetype
    db.commit()
    
    return {"status": "updated", "archetype": user.profile.primary_archetype}