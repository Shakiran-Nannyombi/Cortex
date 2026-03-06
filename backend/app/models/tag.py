"""Tag model."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import String

from app.extensions import db
from app.models.types import GUID

# Association table for many-to-many document-tag relationship
document_tags = db.Table(
    "document_tags",
    db.Column(
        "document_id",
        GUID(),
        db.ForeignKey("documents.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    db.Column(
        "tag_id",
        GUID(),
        db.ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Tag(db.Model):
    """Tag for categorizing documents."""

    __tablename__ = "tags"

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = db.Column(String(100), nullable=False, index=True)
    color = db.Column(String(7), default="#3B82F6")  # hex color
    user_id = db.Column(
        GUID(), db.ForeignKey("users.id"), nullable=False, index=True
    )
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Unique tag name per user
    __table_args__ = (
        db.UniqueConstraint("name", "user_id", name="uq_tag_name_user"),
    )

    def to_dict(self):
        """Serialize tag to dictionary."""
        return {
            "id": str(self.id),
            "name": self.name,
            "color": self.color,
            "user_id": str(self.user_id),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Tag {self.name}>"
