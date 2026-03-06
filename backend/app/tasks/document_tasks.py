"""Celery document processing tasks."""
from celery import shared_task


@shared_task(bind=True, max_retries=3)
def process_document(self, document_id):
    """Process a document asynchronously."""
    from app.create_app import create_app
    from app.extensions import db
    from app.models.document import Document
    from app.services.document_processor import DocumentProcessor

    app = create_app()
    with app.app_context():
        document = Document.query.get(document_id)
        if not document:
            return {"error": "Document not found"}

        try:
            processor = DocumentProcessor()
            processor.process(document)
            return {"status": "completed", "document_id": document_id}
        except Exception as exc:
            document.status = "failed"
            document.error_message = str(exc)
            db.session.commit()
            raise self.retry(exc=exc, countdown=60)
