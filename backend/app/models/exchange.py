from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class ExchangeType(enum.Enum):
    DIRECT_SWAP = "direct_swap"
    POINTS_EXCHANGE = "points_exchange"

class ExchangeStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Exchange(Base):
    __tablename__ = "exchanges"
    
    id = Column(Integer, primary_key=True, index=True)
    exchange_type = Column(Enum(ExchangeType), nullable=False)
    status = Column(Enum(ExchangeStatus), default=ExchangeStatus.PENDING)
    message = Column(Text)
    points_exchanged = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    offering_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    requesting_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    item = relationship("Item", back_populates="exchanges")
    offering_user = relationship("User", foreign_keys=[offering_user_id], back_populates="exchanges_offered")
    requesting_user = relationship("User", foreign_keys=[requesting_user_id], back_populates="exchanges_requested") 