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

from openai import AsyncOpenAI

# Initialize Groq client
client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=settings.GROQ_API_KEY
)

from app.services.adaptation import build_adaptive_system_prompt, archetype_to_scores
from app.modules.profiling.models import UserProfile

from app.modules.chat.models import ChatSession, ChatMessage
from typing import Optional

async def get_current_user_chat(
    x_user_email: str = Header(...),
    x_internal_token: str = Header(...),
    db: Session = Depends(get_db)
):
    if x_internal_token != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid Internal API Key")
    
    user = db.query(User).filter(User.email == x_user_email).first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/sessions")
async def list_sessions(
    user: User = Depends(get_current_user_chat),
    db: Session = Depends(get_db)
):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == user.id).order_by(ChatSession.created_at.desc()).all()
    return [{
        "id": s.id,
        "title": s.title or "New Mission",
        "created_at": s.created_at
    } for s in sessions]

@router.get("/sessions/{session_id}/messages")
async def get_session_messages(
    session_id: int,
    user: User = Depends(get_current_user_chat),
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return [{
        "role": m.role,
        "content": m.content,
        "created_at": m.created_at
    } for m in messages]

@router.post("/message")
async def send_message(
    prompt: str = Form(...),
    session_id: Optional[int] = Form(None),
    file: UploadFile = File(None),
    user: User = Depends(get_current_user_chat),
    db: Session = Depends(get_db)
):
    if not hasattr(settings, "GROQ_API_KEY") or not settings.GROQ_API_KEY or "your_groq_api_key_here" in settings.GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API Key is not configured on the server.")

    # 1. Fetch user scores/archetype for personalized chat
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    current_archetype = profile.primary_archetype if profile else "THE_PIONEER"
    scores = archetype_to_scores(current_archetype)
    
    # 2. Get or Create Session
    if session_id:
        chat_session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == user.id).first()
        if not chat_session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        # Generate a title from the first few words of the prompt
        title = (prompt[:47] + "...") if len(prompt) > 50 else prompt
        chat_session = ChatSession(user_id=user.id, title=title)
        db.add(chat_session)
        db.commit()
        db.refresh(chat_session)

    # 3. Build personalized system prompt
    base_system_prompt = build_adaptive_system_prompt(scores)
    quiz_instructions = (
        "\n\n### QUIZ MODE INSTRUCTIONS ###\n"
        "If you believe the user has learned enough and is ready for a test, do NOT list the questions in your response. "
        "Instead, provide the quiz at the end of your message in exactly this format:\n"
        "<quiz>\n"
        "{\n"
        "  \"title\": \"Quiz Topic\",\n"
        "  \"questions\": [\n"
        "    {\n"
        "      \"question\": \"Question text?\",\n"
        "      \"topic\": \"Specific sub-topic\",\n"
        "      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n"
        "      \"correct_answer\": \"Option A\",\n"
        "      \"explanation\": \"Why it's correct.\"\n"
        "    }\n"
        "  ]\n"
        "}\n"
        "</quiz>\n"
        "Only use Multiple Choice Questions (MCQ)."
    )
    system_prompt = base_system_prompt + quiz_instructions

    # 4. Fetch recent history for LLM context
    history = db.query(ChatMessage).filter(ChatMessage.session_id == chat_session.id).order_by(ChatMessage.created_at.desc()).limit(10).all()
    history = sorted(history, key=lambda x: x.created_at)

    messages = [{"role": "system", "content": system_prompt}]
    for h in history:
        messages.append({"role": h.role, "content": h.content})

    user_content = prompt
    
    if file:
        content = await file.read()
        filename = file.filename.lower()
        
        if filename.endswith(".pdf") or file.content_type == "application/pdf":
            import io
            from pypdf import PdfReader
            try:
                reader = PdfReader(io.BytesIO(content))
                text_content = ""
                for page in reader.pages:
                    text_content += page.extract_text() + "\n"
                user_content += f"\n\n[Extracted Text from PDF {file.filename}]:\n{text_content}"
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")
        else:
            try:
                text_content = content.decode("utf-8")
                user_content += f"\n\n[Attached File Content from {file.filename}]:\n{text_content}"
            except UnicodeDecodeError:
                raise HTTPException(status_code=400, detail="Only text-based files (.txt, .md, .csv) and PDFs are currently supported with the Groq integration.")

    messages.append({"role": "user", "content": user_content})
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=messages,
            temperature=0.7, 
        )
        bot_text = response.choices[0].message.content

        # 5. Persist both messages
        user_msg = ChatMessage(session_id=chat_session.id, role="user", content=prompt)
        bot_msg = ChatMessage(session_id=chat_session.id, role="bot", content=bot_text)
        db.add_all([user_msg, bot_msg])
        db.commit()

        return {"text": bot_text, "session_id": chat_session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate content with Groq: {str(e)}")
