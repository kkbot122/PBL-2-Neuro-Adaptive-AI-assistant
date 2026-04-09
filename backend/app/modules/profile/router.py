from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.models import User
from app.modules.profiling.models import UserProfile
from app.modules.profile.schemas import CalibrationRequest, ProfileResponse
from app.modules.auth.schemas import ProfileUpdate  # Ensure this is imported
from app.modules.profile.service import calculate_profile
from app.core.config import settings

router = APIRouter()

# --- Security Dependencies ---
async def verify_internal_api_key(x_internal_token: str = Header(...)):
    if x_internal_token != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid Internal API Key")

async def get_current_user(
    x_user_email: str = Header(...),
    x_internal_token: str = Header(...),
    db: Session = Depends(get_db)
):
    await verify_internal_api_key(x_internal_token)
    
    user = db.query(User).filter(User.email == x_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in DB")
    return user

from app.modules.chat.models import ChatSession
from app.modules.content.models import ArticleReading

# --- Get Profile Endpoint ---
@router.get("/me", response_model=ProfileResponse)
def get_my_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Ensure profile exists
    if not user.profile:
        empty_scores = {"visual": 0, "structural": 0, "active": 0, "logic": 0}
        user.profile = UserProfile(
            user_id=user.id, 
            primary_archetype="THE_DEBUGGER", 
            raw_scores=empty_scores
        )
        db.add(user.profile)
        db.commit()
        db.refresh(user.profile)
    
    # 2. Calculate Total Sessions (Both chat and articles)
    chat_count = db.query(ChatSession).filter(ChatSession.user_id == user.id).count()
    article_count = db.query(ArticleReading).filter(ArticleReading.user_id == user.id).count()
    
    # 3. Create response object with sessions count
    profile_data = {
        "primary_archetype": user.profile.primary_archetype,
        "raw_scores": user.profile.raw_scores,
        "learning_sessions_count": chat_count + article_count
    }
        
    return profile_data

# --- Submit Telemetry Endpoint ---
@router.post("/calibrate")
def submit_calibration(
    data: CalibrationRequest, 
    user=Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    result = calculate_profile(data)
    
    if not user.profile:
        user.profile = UserProfile(user_id=user.id)
    
    user.profile.primary_archetype = result["primary_archetype"]
    user.profile.raw_scores = result["raw_scores"]
    
    db.commit()
    
    return {"status": "calibrated", "archetype": result["primary_archetype"]}

# --- FIXED: Migrated Update Endpoint ---
@router.post("/update", dependencies=[Depends(verify_internal_api_key)])
def update_profile(
    data: ProfileUpdate, 
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = user.profile
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)

    profile.primary_archetype = data.archetype
    profile.raw_scores = data.scores
    
    db.commit()
    db.refresh(profile)
    
    return {"status": "updated", "archetype": profile.primary_archetype}