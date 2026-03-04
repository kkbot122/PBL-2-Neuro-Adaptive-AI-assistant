from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    topic = Column(String, index=True)
    
    # An article has many paragraphs
    paragraphs = relationship("Paragraph", back_populates="article", cascade="all, delete-orphan")

class Paragraph(Base):
    __tablename__ = "paragraphs"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id"))
    order_index = Column(Integer) # To keep the paragraphs in the right order (1, 2, 3...)
    original_text = Column(Text)  # The raw, unadapted text
    
    # A paragraph belongs to one article
    article = relationship("Article", back_populates="paragraphs")