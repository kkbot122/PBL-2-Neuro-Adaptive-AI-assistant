from sqlalchemy import Column, Integer, String, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # The Core Archetype (e.g., 'THE_VISUALIZER', 'THE_ARCHITECT')
    primary_archetype = Column(String, nullable=True)
    
    # The Raw Scores (0.0 to 1.0) - kept as JSON for flexibility
    # Example: {"visual": 0.8, "textual": 0.2, "active": 0.5}
    cognitive_scores = Column(JSON, default={})
    
    # Back relation
    user = relationship("User", back_populates="profile")