from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # ── Legacy archetype system (kept for backward compat) ───────────────────
    primary_archetype = Column(String, default="THE_PIONEER")
    visual_affinity = Column(Integer, default=0)
    textual_affinity = Column(Integer, default=0)
    depth_preference = Column(Integer, default=0)
    logic_preference = Column(Integer, default=0)
    total_engagement_time = Column(Integer, default=0)
    raw_scores = Column(JSON, default=dict)

    # ── FSLSM continuous vector system (Phase 1) ─────────────────────────────
    fslsm_processing    = Column(Float, default=0.0, nullable=False)
    fslsm_perception    = Column(Float, default=0.0, nullable=False)
    fslsm_reception     = Column(Float, default=0.0, nullable=False)
    fslsm_understanding = Column(Float, default=0.0, nullable=False)

    last_active = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship("User", back_populates="profile")

    @property
    def fslsm_vectors(self) -> dict:
        return {
            "processing":    self.fslsm_processing,
            "perception":    self.fslsm_perception,
            "reception":     self.fslsm_reception,
            "understanding": self.fslsm_understanding,
        }

class SessionEvent(Base):
    __tablename__ = "session_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, nullable=True) # Nullable if signal occurs outside a chat session
    event_type = Column(String, nullable=False)
    payload = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")