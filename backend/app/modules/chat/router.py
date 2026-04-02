from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.models import User
import google.generativeai as genai
from app.core.config import settings
import os
import shutil
import tempfile

router = APIRouter()

# Configure Gemini
if hasattr(settings, "GEMINI_API_KEY") and settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=settings.GEMINI_API_KEY)

async def get_current_user_chat(
    x_user_email: str = Header(...),
    x_internal_token: str = Header(...),
    db: Session = Depends(get_db)
):
    if x_internal_token != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid Internal API Key")
    
    user = db.query(User).filter(User.email == x_user_email).first()
    # Let users test chat even if sync hasn't occurred yet
    return user

@router.post("/message")
async def send_message(
    prompt: str = Form(...),
    file: UploadFile = File(None),
    user: User = Depends(get_current_user_chat)
):
    if not hasattr(settings, "GEMINI_API_KEY") or not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")

    # Initialize model
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    parts = [prompt]
    
    if file:
        # Create temp file robustly
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, file.filename)
        
        # Save file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            # Upload to Gemini
            uploaded_file = genai.upload_file(path=file_path, display_name=file.filename)
            parts.insert(0, uploaded_file)
            
            response = model.generate_content(parts)
            
            # Clean up from Gemini
            uploaded_file.delete()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process file with Gemini: {str(e)}")
        finally:
            # Clean up local file
            if os.path.exists(file_path):
                os.remove(file_path)
    else:
        # Just text prompt
        try:
            response = model.generate_content(parts)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")

    return {"text": response.text}
