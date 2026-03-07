from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
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

    user = relationship("User", back_populates="profile")