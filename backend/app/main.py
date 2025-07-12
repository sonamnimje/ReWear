from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.routers import auth, items
# from app.routers import users, exchanges, chat  # TODO: Create these routers
from app.core.config import settings
from app.core.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ReWear API",
    description="Community Clothing Exchange Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(items.router, prefix="/api/items", tags=["Items"])
# app.include_router(users.router, prefix="/api/users", tags=["Users"])  # TODO: Create users router
# app.include_router(exchanges.router, prefix="/api/exchanges", tags=["Exchanges"])  # TODO: Create exchanges router
# app.include_router(chat.router, prefix="/api/chat", tags=["SmartChain AI"])  # TODO: Create chat router

# Serve static files for uploaded images
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Serve static files for frontend/landing page
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/", include_in_schema=False)
async def serve_index():
    index_path = os.path.join(static_dir, "index.html")
    return FileResponse(index_path, media_type="text/html")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ReWear API"} 