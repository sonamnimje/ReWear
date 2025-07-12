from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Float, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class ItemCategory(enum.Enum):
    TOPS = "tops"
    BOTTOMS = "bottoms"
    DRESSES = "dresses"
    OUTERWEAR = "outerwear"
    SHOES = "shoes"
    ACCESSORIES = "accessories"
    BAGS = "bags"
    OTHER = "other"

class ItemCondition(enum.Enum):
    NEW = "new"
    LIKE_NEW = "like_new"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(Enum(ItemCategory), nullable=False)
    condition = Column(Enum(ItemCondition), nullable=False)
    size = Column(String)
    brand = Column(String)
    color = Column(String)
    material = Column(String)
    price_points = Column(Integer, default=0)  # Points required for exchange
    image_urls = Column(Text)  # JSON array of image URLs
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="items")
    exchanges = relationship("Exchange", back_populates="item") 