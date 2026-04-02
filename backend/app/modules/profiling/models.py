from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime, Float # <-- Added Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    primary_archetype = Column(String, default="THE_DEBUGGER")

    visual_affinity = Column(Integer, default=0)
    textual_affinity = Column(Integer, default=0)
    depth_preference = Column(Integer, default=0)
    logic_preference = Column(Integer, default=0)

    total_engagement_time = Column(Integer, default=0)

    last_active = Column(DateTime(timezone=True),
                         server_default=func.now(),
                         onupdate=func.now())

    raw_scores = Column(JSON, default={})

    # --- NEW PROGRESSIVE PROFILING FIELDS ---
    # Starts at 0.5 (50%) because a single test isn't 100% certain
    archetype_confidence = Column(Float, default=0.5) 
    # Tracks how many learning sessions/tests have influenced this profile
    calibration_count = Column(Integer, default=1) 

    user = relationship("User", back_populates="profile")