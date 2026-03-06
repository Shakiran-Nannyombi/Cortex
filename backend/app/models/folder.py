"""Folder model."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import String

from app.extensions import db
from app.models.types import GUID


class Folder(db.Model):
    """Nested folder structure within workspaces."""

    __tablename__ = "folders"

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = db.Column(String(255), nullable=False)
    workspace_id = db.Column(
        GUID(),
        db.ForeignKey("workspaces.id"),
        nullable=False,
        index=True,
    )
    parent_id = db.Column(
        GUID(),
        db.ForeignKey("folders.id"),
        nullable=True,
        index=True,
    )
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    documents = db.relationship("Document", backref="folder", lazy="dynamic")
    children = db.relationship(
        "Folder", backref=db.backref("parent", remote_side=[id]), lazy="dynamic"
    )

    def to_dict(self):
        """Serialize folder to dictionary."""
        return {
            "id": str(self.id),
            "name": self.name,
            "workspace_id": str(self.workspace_id),
            "parent_id": str(self.parent_id) if self.parent_id else None,
            "document_count": self.documents.count(),
            "children_count": self.children.count(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Folder {self.name}>"
