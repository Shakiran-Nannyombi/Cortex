"""Folders API endpoints."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.folder import Folder
from app.models.workspace import Workspace

folders_bp = Blueprint("folders", __name__)


@folders_bp.route("", methods=["POST"])
@jwt_required()
def create_folder():
    """Create a new folder within a workspace."""
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("name") or not data.get("workspace_id"):
        return jsonify({"error": "Folder name and workspace_id are required"}), 400

    # Verify workspace ownership
    workspace = Workspace.query.filter_by(
        id=data["workspace_id"], user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Workspace not found"}), 404

    folder = Folder(
        name=data["name"].strip(),
        workspace_id=data["workspace_id"],
        parent_id=data.get("parent_id"),
    )
    db.session.add(folder)
    db.session.commit()

    return jsonify({"folder": folder.to_dict()}), 201


@folders_bp.route("", methods=["GET"])
@jwt_required()
def list_folders():
    """List folders in a workspace."""
    user_id = get_jwt_identity()
    workspace_id = request.args.get("workspace_id")
    if not workspace_id:
        return jsonify({"error": "workspace_id parameter is required"}), 400

    workspace = Workspace.query.filter_by(
        id=workspace_id, user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Workspace not found"}), 404

    parent_id = request.args.get("parent_id")
    query = Folder.query.filter_by(workspace_id=workspace_id)
    if parent_id:
        query = query.filter_by(parent_id=parent_id)
    else:
        query = query.filter(Folder.parent_id.is_(None))

    folders = query.order_by(Folder.name).all()
    return jsonify({"folders": [f.to_dict() for f in folders]}), 200


@folders_bp.route("/<folder_id>", methods=["GET"])
@jwt_required()
def get_folder(folder_id):
    """Get a specific folder."""
    user_id = get_jwt_identity()
    folder = Folder.query.get(folder_id)
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    workspace = Workspace.query.filter_by(
        id=folder.workspace_id, user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Folder not found"}), 404

    return jsonify({"folder": folder.to_dict()}), 200


@folders_bp.route("/<folder_id>", methods=["PUT"])
@jwt_required()
def update_folder(folder_id):
    """Update a folder."""
    user_id = get_jwt_identity()
    folder = Folder.query.get(folder_id)
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    workspace = Workspace.query.filter_by(
        id=folder.workspace_id, user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Folder not found"}), 404

    data = request.get_json()
    if data and "name" in data:
        folder.name = data["name"].strip()

    db.session.commit()
    return jsonify({"folder": folder.to_dict()}), 200


@folders_bp.route("/<folder_id>", methods=["DELETE"])
@jwt_required()
def delete_folder(folder_id):
    """Delete a folder."""
    user_id = get_jwt_identity()
    folder = Folder.query.get(folder_id)
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    workspace = Workspace.query.filter_by(
        id=folder.workspace_id, user_id=user_id
    ).first()
    if not workspace:
        return jsonify({"error": "Folder not found"}), 404

    db.session.delete(folder)
    db.session.commit()
    return jsonify({"message": "Folder deleted successfully"}), 200
