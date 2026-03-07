from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.models import User
from app.modules.profiling.models import UserProfile
# Import the new schema
from app.modules.auth.schemas import UserSync, ProfileUpdate
from app.core.config import settings

router = APIRouter()

# --- Security Dependency ---
async def verify_internal_api_key(x_internal_token: str = Header(...)):
    if x_internal_token != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")

# --- Sync Endpoint ---
@router.post("/sync")
def sync_user(user_data: UserSync, db: Session = Depends(get_db)):
    # 1. Check if user exists
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user:
        # 2. If new, create User + Empty Profile
        new_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password="oauth_user", # Placeholder since NextAuth handles passwords
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create empty profile
        new_profile = UserProfile(user_id=new_user.id)
        db.add(new_profile)
        db.commit()
        
        return {"status": "created", "user_id": new_user.id}
    
    return {"status": "exists", "user_id": user.id}

# --- FIXED Update Endpoint ---
@router.post("/profile/update", dependencies=[Depends(verify_internal_api_key)])
def update_profile(
    data: ProfileUpdate,       # <--- The actual parameter
    db: Session = Depends(get_db)
):
    # 1. Find the user by email
    user = db.query(User).filter(User.email == data.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Get their profile
    profile = user.profile
    if not profile:
        # Create one if it's missing for some reason
        profile = UserProfile(user_id=user.id)
        db.add(profile)

    # 3. Update the fields
    profile.primary_archetype = data.archetype
    profile.raw_scores = data.scores
    
    # 4. Save
    db.commit()
    db.refresh(profile)
    
    return {"status": "updated", "archetype": profile.primary_archetype}