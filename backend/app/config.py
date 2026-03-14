"""Application configuration."""
import os
from datetime import timedelta


class Config:
    """Base configuration."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Database
    @staticmethod
    def get_database_url():
        """Get database URL with proper handling for different environments."""
        db_url = os.environ.get("DATABASE_URL")
        
        if not db_url:
            # Only use localhost fallback in development
            if os.environ.get("FLASK_ENV") != "production":
                db_url = "postgresql://cortex:cortex@localhost:5432/cortex"
            else:
                # In production, DATABASE_URL must be set by Render
                db_url = "postgresql://cortex:cortex@localhost:5432/cortex"  # Fallback, will fail if not set
        
        # Handle Render's postgres:// to postgresql:// conversion
        if db_url and db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        
        return db_url
    
    SQLALCHEMY_DATABASE_URI = get_database_url.__func__()

    # JWT
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.environ.get("JWT_ACCESS_TOKEN_HOURS", "1"))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.environ.get("JWT_REFRESH_TOKEN_DAYS", "30"))
    )

    # Redis
    REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

    # Celery
    CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", REDIS_URL)
    CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", REDIS_URL)

    # File Storage
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "/tmp/cortex/uploads")
    MAX_CONTENT_LENGTH = int(os.environ.get("MAX_CONTENT_LENGTH", 50 * 1024 * 1024))
    ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "png", "jpg", "jpeg", "gif", "txt", "md"}

    # Cloud Provider
    CLOUD_PROVIDER = os.environ.get("CLOUD_PROVIDER", "local")  # local, gcp, aws, azure

    # OCR Provider
    OCR_PROVIDER = os.environ.get("OCR_PROVIDER", "tesseract")  # tesseract, gcp, aws, azure

    # Storage Provider
    STORAGE_PROVIDER = os.environ.get("STORAGE_PROVIDER", "local")  # local, gcs, s3, azure_blob
    STORAGE_BUCKET = os.environ.get("STORAGE_BUCKET", "")

    # Elasticsearch (optional)
    ELASTICSEARCH_URL = os.environ.get("ELASTICSEARCH_URL", "")


class DevelopmentConfig(Config):
    """Development configuration."""

    DEBUG = True


class TestingConfig(Config):
    """Testing configuration."""

    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "TEST_DATABASE_URL", "sqlite:///test.db"
    )
    JWT_SECRET_KEY = "test-secret-key"
    UPLOAD_FOLDER = "/tmp/cortex/test-uploads"


class ProductionConfig(Config):
    """Production configuration."""

    DEBUG = False

    @classmethod
    def init_app(cls):
        """Validate production configuration."""
        assert cls.SECRET_KEY != "dev-secret-key-change-in-production", (
            "SECRET_KEY must be set in production"
        )


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
