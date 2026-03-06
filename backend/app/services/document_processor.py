"""Document processing service."""
import os
from datetime import datetime, timezone

from app.extensions import db


class DocumentProcessor:
    """Process documents to extract text content."""

    def process(self, document):
        """Process a document and extract text."""
        from app.models.document import Document

        document.status = "processing"
        db.session.commit()

        try:
            ext = document.filename.rsplit(".", 1)[1].lower() if "." in document.filename else ""

            if ext == "pdf":
                text = self._extract_pdf(document.file_path)
            elif ext in ("docx", "doc"):
                text = self._extract_docx(document.file_path)
            elif ext in ("txt", "md"):
                text = self._extract_text(document.file_path)
            elif ext in ("png", "jpg", "jpeg", "gif"):
                text = self._extract_image_text(document.file_path)
            else:
                text = ""

            document.content_text = text
            document.status = "completed"
            document.processed_at = datetime.now(timezone.utc)

            # Update search vector for PostgreSQL
            self._update_search_vector(document)

            db.session.commit()
        except Exception as e:
            document.status = "failed"
            document.error_message = str(e)
            db.session.commit()

    def _extract_pdf(self, file_path):
        """Extract text from PDF files."""
        try:
            from PyPDF2 import PdfReader

            reader = PdfReader(file_path)
            text_parts = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            return "\n".join(text_parts)
        except ImportError:
            return ""

    def _extract_docx(self, file_path):
        """Extract text from DOCX files."""
        try:
            from docx import Document as DocxDocument

            doc = DocxDocument(file_path)
            return "\n".join([para.text for para in doc.paragraphs if para.text])
        except ImportError:
            return ""

    def _extract_text(self, file_path):
        """Extract text from plain text files."""
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    def _extract_image_text(self, file_path):
        """Extract text from images using OCR."""
        try:
            from app.providers.ocr import get_ocr_provider

            provider = get_ocr_provider()
            return provider.extract_text(file_path)
        except Exception:
            return ""

    def _update_search_vector(self, document):
        """Update PostgreSQL full-text search vector."""
        try:
            from sqlalchemy import text

            db.session.execute(
                text(
                    "UPDATE documents SET search_vector = "
                    "to_tsvector('english', coalesce(:title, '') || ' ' || coalesce(:content, '')) "
                    "WHERE id = :doc_id"
                ),
                {
                    "title": document.title,
                    "content": document.content_text or "",
                    "doc_id": str(document.id),
                },
            )
        except Exception:
            # Skip if not using PostgreSQL
            pass
