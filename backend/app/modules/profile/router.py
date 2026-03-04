from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.auth.models import User, UserProfile
from pydantic import BaseModel

router = APIRouter()

class PulseRequest(BaseModel):
    paragraph_id: int
    seconds: int
    dimension: str # "textual", "visual", "depth", "logic"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- REFINED: ARCHETYPE CALCULATION LOGIC ---
def _determine_archetype(visual: int, textual: int, depth: int, logic: int) -> str:
    """
    Categorizes the user into a high-resolution learner persona.
    """
    total = visual + textual + logic
    
    # 1. THE PIONEER: New user or very low engagement
    if total < 10:
        return "THE_PIONEER"
    
    # 2. THE VISUAL ARCHITECT: Strong preference for spatial/visual data
    # (Visual is significantly higher than textual and logic)
    if visual > (textual * 1.4) and visual > (logic * 1.4):
        return "THE_VISUAL_ARCHITECT"
    
    # 3. THE DEEP SCHOLAR: High textual focus with long dwell times (depth)
    if textual > visual and depth > 40:
        return "THE_DEEP_SCHOLAR"
    
    # 4. THE STRATEGIC SKIMMER: High textual focus but very low dwell times
    if textual > (visual * 1.5) and depth < 15:
        return "THE_STRATEGIC_SKIMMER"

    # 5. THE LOGICAL TINKERER: High focus on code, steps, or logical sequences
    if logic > textual and logic > visual:
        return "THE_LOGICAL_TINKERER"

    # 6. THE ADAPTIVE GENERALIST: Balanced interaction across all modes
    return "THE_ADAPTIVE_GENERALIST"

@router.post("/pulse")
def receive_pulse(data: PulseRequest, user_id: int = 1, db: Session = Depends(get_db)):
    # 1. Safety Check: Does the user exist?
    user_exists = db.query(User).filter(User.id == user_id).first()
    if not user_exists:
        raise HTTPException(status_code=400, detail="User not found in database.")

    # 2. Retrieve or Initialize Profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(
            user_id=user_id, 
            primary_archetype="THE_PIONEER",
            textual_affinity=0, visual_affinity=0, 
            depth_preference=0, logic_preference=0,
            total_engagement_time=0
        )
        db.add(profile)
        db.flush()

    # 3. Process the Pulse (Increment specific dimension)
    if data.dimension == "textual":
        profile.textual_affinity += 1
    elif data.dimension == "visual":
        profile.visual_affinity += 1
    elif data.dimension == "depth":
        profile.depth_preference += 1
    elif data.dimension == "logic":
        profile.logic_preference += 1
    
    profile.total_engagement_time += data.seconds

    # 4. Update intelligence label based on all dimensions
    profile.primary_archetype = _determine_archetype(
        profile.visual_affinity, 
        profile.textual_affinity,
        profile.depth_preference,
        profile.logic_preference
    )
    
    db.commit()

    return {
        "status": "success", 
        "current_archetype": profile.primary_archetype,
        "scores": {
            "textual": profile.textual_affinity,
            "visual": profile.visual_affinity,
            "depth": profile.depth_preference,
            "logic": profile.logic_preference
        }
    }

@router.get("/")
def get_profile(user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile