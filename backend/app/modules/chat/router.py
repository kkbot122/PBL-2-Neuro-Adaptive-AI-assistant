from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.models import User
from app.core.config import settings
from openai import AsyncOpenAI
from typing import Optional
import json
import io

from app.services.adaptation import (
    build_adaptive_system_prompt,
    build_fslsm_system_prompt,
    archetype_to_scores,
    build_tool_instruction,
    infer_signals_from_prompt,
    apply_signals_to_scores,
)
from app.services.fslsm import signals_to_deltas, nudge_vector
from app.modules.profiling.models import UserProfile
from app.modules.chat.models import ChatSession, ChatMessage

router = APIRouter()

client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=settings.GROQ_API_KEY,
)

# --- NATIVE TOOL SCHEMA DEFINITION ---
ADAPTIVE_TOOL = {
    "type": "function",
    "function": {
        "name": "render_adaptive_response",
        "description": "Renders an educational response dynamically generating interactive widgets based on the user's learning style.",
        "parameters": {
            "type": "object",
            "properties": {
                "dialogue": {
                    "type": "string"
                },

                "visual_aid": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "type": {"type": "string", "enum": ["mermaid"]},
                                "code": {"type": "string"}
                            }
                        },
                        {"type": "null"}
                    ]
                },

                "interactive_check": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "questions": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "question": {"type": "string"},
                                            "options": {
                                                "type": "array",
                                                "items": {"type": "string"}
                                            },
                                            "answer": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        },
                        {"type": "null"}
                    ]
                },

                "step_tracker": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "steps": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "number": {"type": "integer"},
                                            "title": {"type": "string"},
                                            "body": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        },
                        {"type": "null"}
                    ]
                },

                "concept_map": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "central": {"type": "string"},
                                "connections": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "label": {"type": "string"},
                                            "node": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        },
                        {"type": "null"}
                    ]
                },

                "concrete_example": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "scenario": {"type": "string"},
                                "breakdown": {"type": "string"}
                            }
                        },
                        {"type": "null"}
                    ]
                }
            },
            "required": ["dialogue"]
        }
    }
}

def _sanitize(text: str) -> str:
    if not isinstance(text, str):
        return ""
    return text.encode("utf-8", errors="replace").decode("utf-8")

def _db_role_to_api_role(role: str) -> str:
    return "assistant" if role == "bot" else role

async def get_current_user_chat(
    x_user_email: str = Header(...),
    x_internal_token: str = Header(...),
    db: Session = Depends(get_db),
) -> User:
    if x_internal_token != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid Internal API Key")
    user = db.query(User).filter(User.email == x_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/sessions")
async def list_sessions(user: User = Depends(get_current_user_chat), db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == user.id).order_by(ChatSession.created_at.desc()).all()
    return [{"id": s.id, "title": s.title or "New Session", "created_at": s.created_at} for s in sessions]

@router.get("/sessions/{session_id}/messages")
async def get_session_messages(session_id: int, user: User = Depends(get_current_user_chat), db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return [{"role": m.role, "content": m.content, "created_at": m.created_at} for m in messages]

@router.post("/message")
async def send_message(
    prompt: str = Form(...),
    session_id: Optional[int] = Form(None),
    file: UploadFile = File(None),
    user: User = Depends(get_current_user_chat),
    db: Session = Depends(get_db),
):
    if not settings.GROQ_API_KEY or "your_groq_api_key" in settings.GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API Key is not configured.")

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    fslsm_vectors = getattr(profile, "fslsm_vectors", None) if profile else None

    if fslsm_vectors and any(abs(v) > 0.01 for v in fslsm_vectors.values()):
        base_system_prompt = build_fslsm_system_prompt(fslsm_vectors)
    else:
        archetype = profile.primary_archetype if profile else "THE_PIONEER"
        scores = archetype_to_scores(archetype)
        base_system_prompt = build_adaptive_system_prompt(scores)

    system_prompt = base_system_prompt + "\n\n" + build_tool_instruction(fslsm_vectors)

    if session_id:
        chat_session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == user.id).first()
        if not chat_session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        title = (prompt[:47] + "…") if len(prompt) > 50 else prompt
        chat_session = ChatSession(user_id=user.id, title=title)
        db.add(chat_session)
        db.commit()
        db.refresh(chat_session)

    history = db.query(ChatMessage).filter(ChatMessage.session_id == chat_session.id).order_by(ChatMessage.created_at.desc()).limit(12).all()
    history = sorted(history, key=lambda x: x.created_at)

    messages_for_llm = [{"role": "system", "content": system_prompt}]
    for h in history:
        messages_for_llm.append({"role": _db_role_to_api_role(h.role), "content": _sanitize(h.content)})

    user_content = _sanitize(prompt)
    if file and file.filename:
        raw_bytes = await file.read()
        fname = file.filename.lower()
        if fname.endswith(".pdf") or file.content_type == "application/pdf":
            try:
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(raw_bytes))
                extracted = "\n".join(page.extract_text() or "" for page in reader.pages)
                user_content += f"\n\n[PDF: {file.filename}]\n{extracted}"
            except Exception as exc:
                raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {exc}")
        else:
            try:
                text_content = raw_bytes.decode("utf-8")
                user_content += f"\n\n[File: {file.filename}]\n{text_content}"
            except UnicodeDecodeError:
                raise HTTPException(status_code=400, detail="Only text-based files (.txt, .md, .csv) and PDFs are supported.")

    messages_for_llm.append({"role": "user", "content": user_content})

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages_for_llm,
            temperature=0.7,
            max_tokens=2048,
            tools=[ADAPTIVE_TOOL],
            tool_choice={"type": "function", "function": {"name": "render_adaptive_response"}}
        )

        tool_call = response.choices[0].message.tool_calls
        if tool_call:
            bot_text = _sanitize(tool_call[0].function.arguments)
        else:
            # Fallback if model ignores tool
            fallback_text = _sanitize(response.choices[0].message.content or "")
            bot_text = json.dumps({"dialogue": fallback_text})

    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"LLM call failed: {exc}")

    db.add_all([
        ChatMessage(session_id=chat_session.id, role="user", content=_sanitize(prompt)),
        ChatMessage(session_id=chat_session.id, role="bot", content=bot_text)
    ])

    if profile:
        signals = infer_signals_from_prompt(prompt)
        if signals:
            profile.raw_scores = apply_signals_to_scores(dict(profile.raw_scores or {}), signals)
            fslsm_deltas = signals_to_deltas(signals)
            if any(v != 0.0 for v in fslsm_deltas.values()):
                updated = nudge_vector(profile.fslsm_vectors, fslsm_deltas)
                profile.fslsm_processing = updated["processing"]
                profile.fslsm_perception = updated["perception"]
                profile.fslsm_reception = updated["reception"]
                profile.fslsm_understanding = updated["understanding"]

    db.commit()

    return {"text": bot_text, "session_id": chat_session.id}