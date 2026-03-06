"""Tags API endpoints."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.tag import Tag

tags_bp = Blueprint("tags", __name__)


@tags_bp.route("", methods=["POST"])
@jwt_required()
def create_tag():
    """Create a new tag."""
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"error": "Tag name is required"}), 400

    existing = Tag.query.filter_by(
        name=data["name"].strip(), user_id=user_id
    ).first()
    if existing:
        return jsonify({"error": "Tag already exists"}), 409

    tag = Tag(
        name=data["name"].strip(),
        color=data.get("color", "#3B82F6"),
        user_id=user_id,
    )
    db.session.add(tag)
    db.session.commit()

    return jsonify({"tag": tag.to_dict()}), 201


@tags_bp.route("", methods=["GET"])
@jwt_required()
def list_tags():
    """List user's tags."""
    user_id = get_jwt_identity()
    tags = Tag.query.filter_by(user_id=user_id).order_by(Tag.name).all()
    return jsonify({"tags": [t.to_dict() for t in tags]}), 200


@tags_bp.route("/<tag_id>", methods=["PUT"])
@jwt_required()
def update_tag(tag_id):
    """Update a tag."""
    user_id = get_jwt_identity()
    tag = Tag.query.filter_by(id=tag_id, user_id=user_id).first()
    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "name" in data:
        existing = Tag.query.filter_by(
            name=data["name"].strip(), user_id=user_id
        ).first()
        if existing and existing.id != tag.id:
            return jsonify({"error": "Tag name already exists"}), 409
        tag.name = data["name"].strip()
    if "color" in data:
        tag.color = data["color"]

    db.session.commit()
    return jsonify({"tag": tag.to_dict()}), 200


@tags_bp.route("/<tag_id>", methods=["DELETE"])
@jwt_required()
def delete_tag(tag_id):
    """Delete a tag."""
    user_id = get_jwt_identity()
    tag = Tag.query.filter_by(id=tag_id, user_id=user_id).first()
    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    db.session.delete(tag)
    db.session.commit()
    return jsonify({"message": "Tag deleted successfully"}), 200
