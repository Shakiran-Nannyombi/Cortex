"""Workspace model."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text

from app.extensions import db
from app.models.types import GUID


class Workspace(db.Model):
    """Workspace for organizing documents."""

    __tablename__ = "workspaces"

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = db.Column(String(255), nullable=False)
    description = db.Column(Text, default="")
    user_id = db.Column(
        GUID(), db.ForeignKey("users.id"), nullable=False, index=True
    )
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    documents = db.relationship("Document", backref="workspace", lazy="dynamic")
    folders = db.relationship("Folder", backref="workspace", lazy="dynamic")

    def to_dict(self):
        """Serialize workspace to dictionary."""
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "user_id": str(self.user_id),
            "document_count": self.documents.count(),
            "folder_count": self.folders.count(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Workspace {self.name}>"
