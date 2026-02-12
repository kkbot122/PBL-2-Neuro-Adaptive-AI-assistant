from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings
from app.core.security import create_access_token, get_current_user
from app.db.session import get_db
from app.modules.auth.models import User
from app.modules.auth.schemas import GoogleLoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/google", response_model=TokenResponse)
async def google_login(body: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Verify a Google ID token sent from the frontend.
    If the user doesn't exist, create them. Return a JWT.
    """
    try:
        idinfo = id_token.verify_oauth2_token(
            body.token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    email = idinfo.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token does not contain an email",
        )

    # Find or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            full_name=idinfo.get("name"),
            picture=idinfo.get("picture"),
            auth_provider="google",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Issue JWT
    access_token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return info about the currently authenticated user."""
    return current_user
