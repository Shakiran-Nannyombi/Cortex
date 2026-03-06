"""Document model."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Integer, BigInteger, Index

from app.extensions import db
from app.models.types import GUID, TSVectorType


class Document(db.Model):
    """Document model with full-text search support."""

    __tablename__ = "documents"

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = db.Column(String(500), nullable=False, index=True)
    filename = db.Column(String(500), nullable=False)
    file_path = db.Column(String(1000), nullable=False)
    file_size = db.Column(BigInteger, default=0)
    mime_type = db.Column(String(255), default="")
    content_text = db.Column(Text, default="")
    status = db.Column(
        String(50), default="pending", index=True
    )  # pending, processing, completed, failed
    page_count = db.Column(Integer, default=0)
    error_message = db.Column(Text, default="")

    # Full-text search vector (PostgreSQL TSVECTOR, TEXT on other DBs)
    search_vector = db.Column(TSVectorType)

    # Foreign keys
    user_id = db.Column(
        GUID(), db.ForeignKey("users.id"), nullable=False, index=True
    )
    workspace_id = db.Column(
        GUID(), db.ForeignKey("workspaces.id"), nullable=True, index=True
    )
    folder_id = db.Column(
        GUID(), db.ForeignKey("folders.id"), nullable=True, index=True
    )

    # Timestamps
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    processed_at = db.Column(db.DateTime(timezone=True), nullable=True)

    # Relationships
    tags = db.relationship(
        "Tag", secondary="document_tags", backref=db.backref("documents", lazy="dynamic")
    )

    __table_args__ = (
        Index(
            "idx_document_search",
            "search_vector",
            postgresql_using="gin",
        ),
    )

    def to_dict(self):
        """Serialize document to dictionary."""
        return {
            "id": str(self.id),
            "title": self.title,
            "filename": self.filename,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "status": self.status,
            "page_count": self.page_count,
            "content_preview": (self.content_text[:200] + "...") if self.content_text and len(self.content_text) > 200 else self.content_text,
            "error_message": self.error_message,
            "user_id": str(self.user_id),
            "workspace_id": str(self.workspace_id) if self.workspace_id else None,
            "folder_id": str(self.folder_id) if self.folder_id else None,
            "tags": [tag.to_dict() for tag in self.tags],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "processed_at": self.processed_at.isoformat() if self.processed_at else None,
        }

    def __repr__(self):
        return f"<Document {self.title}>"
