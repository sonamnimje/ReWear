from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from pydantic import BaseModel
import json
import os
from datetime import datetime

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.item import Item, ItemCategory, ItemCondition
from app.routers.auth import get_current_user

router = APIRouter()

class ItemCreate(BaseModel):
    title: str
    description: str | None = None
    category: ItemCategory
    condition: ItemCondition
    size: str | None = None
    brand: str | None = None
    color: str | None = None
    material: str | None = None
    price_points: int = 0

class ItemResponse(BaseModel):
    id: int
    title: str
    description: str | None
    category: ItemCategory
    condition: ItemCondition
    size: str | None
    brand: str | None
    color: str | None
    material: str | None
    price_points: int
    image_urls: str | None
    is_available: bool
    is_featured: bool
    created_at: datetime
    owner_id: int
    
    class Config:
        from_attributes = True

class ItemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: ItemCategory | None = None
    condition: ItemCondition | None = None
    size: str | None = None
    brand: str | None = None
    color: str | None = None
    material: str | None = None
    price_points: int | None = None
    is_available: bool | None = None

@router.post("/", response_model=ItemResponse)
async def create_item(
    item_data: ItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_item = Item(
        **item_data.dict(),
        owner_id=current_user.id
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[ItemResponse])
async def get_items(
    skip: int = 0,
    limit: int = 20,
    category: Optional[ItemCategory] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Item).filter(Item.is_available == True)
    
    if category:
        query = query.filter(Item.category == category)
    
    if search:
        search_filter = or_(
            Item.title.ilike(f"%{search}%"),
            Item.description.ilike(f"%{search}%"),
            Item.brand.ilike(f"%{search}%"),
            Item.color.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    items = query.offset(skip).limit(limit).all()
    return items

@router.get("/featured", response_model=List[ItemResponse])
async def get_featured_items(db: Session = Depends(get_db)):
    items = db.query(Item).filter(
        Item.is_featured == True,
        Item.is_available == True
    ).limit(10).all()
    return items

@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return item

@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: int,
    item_data: ItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    if item.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this item"
        )
    
    update_data = item_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
async def delete_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    if item.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item"
        )
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}

@router.post("/{item_id}/upload-image")
async def upload_item_image(
    item_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    if item.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to upload images for this item"
        )
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Save file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"item_{item_id}_{timestamp}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Update item with image URL
    image_url = f"/uploads/{filename}"
    current_images = json.loads(item.image_urls) if item.image_urls else []
    current_images.append(image_url)
    item.image_urls = json.dumps(current_images)
    
    db.commit()
    return {"image_url": image_url} 