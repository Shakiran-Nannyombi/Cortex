"""Workspaces API endpoints."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.workspace import Workspace

workspaces_bp = Blueprint("workspaces", __name__)


@workspaces_bp.route("", methods=["POST"])
@jwt_required()
def create_workspace():
    """Create a new workspace."""
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"error": "Workspace name is required"}), 400

    workspace = Workspace(
        name=data["name"].strip(),
        description=data.get("description", "").strip(),
        user_id=user_id,
    )
    db.session.add(workspace)
    db.session.commit()

    return jsonify({"workspace": workspace.to_dict()}), 201


@workspaces_bp.route("", methods=["GET"])
@jwt_required()
def list_workspaces():
    """List user's workspaces."""
    user_id = get_jwt_identity()
    workspaces = Workspace.query.filter_by(user_id=user_id).order_by(
        Workspace.created_at.desc()
    ).all()
    return jsonify({
        "workspaces": [w.to_dict() for w in workspaces]
    }), 200


@workspaces_bp.route("/<workspace_id>", methods=["GET"])
@jwt_required()
def get_workspace(workspace_id):
    """Get a specific workspace."""
    user_id = get_jwt_identity()
    workspace = Workspace.query.filter_by(
        id=workspace_id, user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Workspace not found"}), 404
    return jsonify({"workspace": workspace.to_dict()}), 200


@workspaces_bp.route("/<workspace_id>", methods=["PUT"])
@jwt_required()
def update_workspace(workspace_id):
    """Update a workspace."""
    user_id = get_jwt_identity()
    workspace = Workspace.query.filter_by(
        id=workspace_id, user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Workspace not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "name" in data:
        workspace.name = data["name"].strip()
    if "description" in data:
        workspace.description = data["description"].strip()

    db.session.commit()
    return jsonify({"workspace": workspace.to_dict()}), 200


@workspaces_bp.route("/<workspace_id>", methods=["DELETE"])
@jwt_required()
def delete_workspace(workspace_id):
    """Delete a workspace."""
    user_id = get_jwt_identity()
    workspace = Workspace.query.filter_by(
        id=workspace_id, user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Workspace not found"}), 404

    db.session.delete(workspace)
    db.session.commit()
    return jsonify({"message": "Workspace deleted successfully"}), 200
