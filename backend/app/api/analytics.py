"""Analytics API endpoints."""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from app.extensions import db
from app.models.document import Document
from app.models.workspace import Workspace
from app.models.tag import Tag

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    """Get dashboard analytics for the current user."""
    user_id = get_jwt_identity()

    total_documents = Document.query.filter_by(user_id=user_id).count()
    total_workspaces = Workspace.query.filter_by(user_id=user_id).count()
    total_tags = Tag.query.filter_by(user_id=user_id).count()

    # Document status breakdown
    status_counts = (
        db.session.query(Document.status, func.count(Document.id))
        .filter_by(user_id=user_id)
        .group_by(Document.status)
        .all()
    )
    status_breakdown = {status: count for status, count in status_counts}

    # Total storage used
    total_size = (
        db.session.query(func.sum(Document.file_size))
        .filter_by(user_id=user_id)
        .scalar()
        or 0
    )

    # Document type breakdown
    type_counts = (
        db.session.query(Document.mime_type, func.count(Document.id))
        .filter_by(user_id=user_id)
        .group_by(Document.mime_type)
        .all()
    )
    type_breakdown = {mime: count for mime, count in type_counts}

    # Recent documents
    recent_docs = (
        Document.query.filter_by(user_id=user_id)
        .order_by(Document.created_at.desc())
        .limit(5)
        .all()
    )

    return jsonify({
        "total_documents": total_documents,
        "total_workspaces": total_workspaces,
        "total_tags": total_tags,
        "total_storage_bytes": total_size,
        "status_breakdown": status_breakdown,
        "type_breakdown": type_breakdown,
        "recent_documents": [doc.to_dict() for doc in recent_docs],
    }), 200
