from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship: One User has One Profile
    profile = relationship("UserProfile", back_populates="user", uselist=False)

# --- ADD THIS CLASS BELOW ---
class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # High-level classification
    primary_archetype = Column(String, default="THE_DEBUGGER") 
    
    # High-resolution affinity scores (0-100)
    visual_affinity = Column(Integer, default=0)    # Preference for diagrams
    textual_affinity = Column(Integer, default=0)   # Preference for text
    depth_preference = Column(Integer, default=0)   # Detail-oriented vs. Summary-oriented
    logic_preference = Column(Integer, default=0)   # Rules/Logic vs. Big Picture
    
    # Metadata for better characterization
    total_engagement_time = Column(Integer, default=0) 
    last_active = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    raw_scores = Column(JSON, default={}) 
    
    user = relationship("User", back_populates="profile")