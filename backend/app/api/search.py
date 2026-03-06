"""Search API endpoints."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text, or_

from app.models.document import Document

search_bp = Blueprint("search", __name__)


@search_bp.route("", methods=["GET"])
@jwt_required()
def search_documents():
    """Search documents using full-text search or LIKE fallback."""
    user_id = get_jwt_identity()
    query_text = request.args.get("q", "").strip()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    per_page = min(per_page, 100)

    if not query_text:
        return jsonify({"error": "Search query is required"}), 400

    base_query = Document.query.filter_by(user_id=user_id)

    try:
        # Try PostgreSQL full-text search
        ts_query = text(
            "search_vector @@ plainto_tsquery('english', :query)"
        )
        query = base_query.filter(
            ts_query
        ).params(query=query_text)
    except Exception:
        # Fallback to LIKE search for non-PostgreSQL databases
        search_pattern = f"%{query_text}%"
        query = base_query.filter(
            or_(
                Document.title.ilike(search_pattern),
                Document.content_text.ilike(search_pattern),
                Document.filename.ilike(search_pattern),
            )
        )

    # Optional filters
    workspace_id = request.args.get("workspace_id")
    if workspace_id:
        query = query.filter_by(workspace_id=workspace_id)

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    pagination = query.order_by(Document.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "documents": [doc.to_dict() for doc in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "query": query_text,
    }), 200
