"""Documents API endpoints."""
import os
import uuid

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.document import Document
from app.models.tag import Tag

documents_bp = Blueprint("documents", __name__)


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in current_app.config["ALLOWED_EXTENSIONS"]
    )


@documents_bp.route("", methods=["POST"])
@jwt_required()
def upload_document():
    """Upload a new document."""
    user_id = get_jwt_identity()

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # Generate unique filename
    original_filename = secure_filename(file.filename)
    ext = original_filename.rsplit(".", 1)[1].lower() if "." in original_filename else ""
    unique_filename = f"{uuid.uuid4()}.{ext}"

    # Save file
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    file_path = os.path.join(upload_folder, unique_filename)
    file.save(file_path)
    file_size = os.path.getsize(file_path)

    # Determine MIME type
    mime_map = {
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "doc": "application/msword",
        "txt": "text/plain",
        "md": "text/markdown",
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "gif": "image/gif",
    }
    mime_type = mime_map.get(ext, "application/octet-stream")

    # Create document record
    title = request.form.get("title", original_filename)
    workspace_id = request.form.get("workspace_id") or None
    folder_id = request.form.get("folder_id") or None

    document = Document(
        title=title,
        filename=original_filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=mime_type,
        user_id=user_id,
        workspace_id=workspace_id,
        folder_id=folder_id,
        status="pending",
    )

    db.session.add(document)
    db.session.commit()

    # Trigger async processing
    try:
        from app.tasks.document_tasks import process_document

        process_document.delay(str(document.id))
    except Exception:
        # If Celery is not available, process synchronously
        from app.services.document_processor import DocumentProcessor

        processor = DocumentProcessor()
        processor.process(document)

    return jsonify({
        "message": "Document uploaded successfully",
        "document": document.to_dict(),
    }), 201


@documents_bp.route("", methods=["GET"])
@jwt_required()
def list_documents():
    """List user's documents with optional filters."""
    user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    per_page = min(per_page, 100)

    query = Document.query.filter_by(user_id=user_id)

    # Optional filters
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    workspace_id = request.args.get("workspace_id")
    if workspace_id:
        query = query.filter_by(workspace_id=workspace_id)

    folder_id = request.args.get("folder_id")
    if folder_id:
        query = query.filter_by(folder_id=folder_id)

    # Ordering
    sort = request.args.get("sort", "created_at")
    order = request.args.get("order", "desc")
    sort_column = getattr(Document, sort, Document.created_at)
    if order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "documents": [doc.to_dict() for doc in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages,
    }), 200


@documents_bp.route("/<document_id>", methods=["GET"])
@jwt_required()
def get_document(document_id):
    """Get a specific document."""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first()
    if not document:
        return jsonify({"error": "Document not found"}), 404

    result = document.to_dict()
    result["content_text"] = document.content_text
    return jsonify({"document": result}), 200


@documents_bp.route("/<document_id>", methods=["PUT"])
@jwt_required()
def update_document(document_id):
    """Update document metadata."""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first()
    if not document:
        return jsonify({"error": "Document not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "title" in data:
        document.title = data["title"]
    if "workspace_id" in data:
        document.workspace_id = data["workspace_id"] or None
    if "folder_id" in data:
        document.folder_id = data["folder_id"] or None

    # Handle tags
    if "tag_ids" in data:
        tags = Tag.query.filter(
            Tag.id.in_(data["tag_ids"]), Tag.user_id == user_id
        ).all()
        document.tags = tags

    db.session.commit()
    return jsonify({"document": document.to_dict()}), 200


@documents_bp.route("/<document_id>", methods=["DELETE"])
@jwt_required()
def delete_document(document_id):
    """Delete a document."""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first()
    if not document:
        return jsonify({"error": "Document not found"}), 404

    # Delete file from storage
    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.session.delete(document)
    db.session.commit()

    return jsonify({"message": "Document deleted successfully"}), 200


@documents_bp.route("/<document_id>/reprocess", methods=["POST"])
@jwt_required()
def reprocess_document(document_id):
    """Reprocess a document."""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first()
    if not document:
        return jsonify({"error": "Document not found"}), 404

    document.status = "pending"
    document.error_message = ""
    db.session.commit()

    try:
        from app.tasks.document_tasks import process_document

        process_document.delay(str(document.id))
    except Exception:
        from app.services.document_processor import DocumentProcessor

        processor = DocumentProcessor()
        processor.process(document)

    return jsonify({"document": document.to_dict()}), 200
