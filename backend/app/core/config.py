from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./rewear_db.sqlite3"
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # File uploads
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    # AI/LLM Settings
    LLM_MODEL: str = "llama2"
    LLM_ENDPOINT: str = "http://localhost:11434"
    # Cloudinary
    cloudinary_cloud_name: str = "your-cloud-name"
    cloudinary_api_key: str = "your-api-key"
    cloudinary_api_secret: str = "your-api-secret"
    # Environment
    ENVIRONMENT: str = "development"
    node_env: str = "development"
    DEBUG: bool = True
    port: int = 5000
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Create uploads directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True) 