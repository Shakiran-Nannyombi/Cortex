"""API Key model."""
import uuid
import secrets
from datetime import datetime, timezone

from sqlalchemy import String, Boolean

from app.extensions import db
from app.models.types import GUID


class APIKey(db.Model):
    """API Key model for user authentication."""

    __tablename__ = "api_keys"

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = db.Column(String(255), nullable=False)
    key_hash = db.Column(String(255), nullable=False, unique=True, index=True)
    key_preview = db.Column(String(20), nullable=False)  # Last 4 chars for display
    is_revoked = db.Column(Boolean, default=False, index=True)
    
    # Foreign key
    user_id = db.Column(
        GUID(),
        db.ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # Timestamps
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    revoked_at = db.Column(db.DateTime(timezone=True), nullable=True)

    # Relationships
    user = db.relationship("User", backref=db.backref("api_keys", lazy="dynamic"))

    @staticmethod
    def generate_key():
        """Generate a new API key."""
        return f"sk_{secrets.token_urlsafe(32)}"

    @staticmethod
    def hash_key(key: str) -> str:
        """Hash an API key for storage."""
        import hashlib
        return hashlib.sha256(key.encode()).hexdigest()

    @staticmethod
    def get_preview(key: str) -> str:
        """Get preview of key (last 4 chars)."""
        return key[-4:] if len(key) >= 4 else key

    def to_dict(self):
        """Serialize API key to dictionary."""
        return {
            "id": str(self.id),
            "name": self.name,
            "keyPreview": self.key_preview,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "isRevoked": self.is_revoked,
        }

    def __repr__(self):
        return f"<APIKey {self.name}>"
