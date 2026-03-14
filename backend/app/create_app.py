"""Flask application factory."""
import os

from flask import Flask

from app.config import config
from app.extensions import db, migrate, jwt, cors, socketio


def create_app(config_name=None):
    """Create and configure the Flask application."""
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    socketio.init_app(app, cors_allowed_origins="*", async_mode="threading")

    # Ensure upload folder exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.documents import documents_bp
    from app.api.workspaces import workspaces_bp
    from app.api.folders import folders_bp
    from app.api.tags import tags_bp
    from app.api.search import search_bp
    from app.api.analytics import analytics_bp
    from app.api.health import health_bp
    from app.api.chat import create_chat_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(documents_bp, url_prefix="/api/documents")
    app.register_blueprint(workspaces_bp, url_prefix="/api/workspaces")
    app.register_blueprint(folders_bp, url_prefix="/api/folders")
    app.register_blueprint(tags_bp, url_prefix="/api/tags")
    app.register_blueprint(search_bp, url_prefix="/api/search")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(create_chat_bp())

    # Import models for migration support
    from app import models  # noqa: F401

    # Create tables if they don't exist (for first run)
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"Warning: Could not create tables: {e}")

    return app
