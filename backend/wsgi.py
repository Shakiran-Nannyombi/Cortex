"""WSGI entry point for the application."""
import os
from app.create_app import create_app

# Determine environment
env = os.environ.get("FLASK_ENV", "development")
app = create_app(env)

if __name__ == "__main__":
    # Only run development server locally
    if env == "development":
        app.run(host="0.0.0.0", port=5000, debug=True)
    else:
        # Production should use gunicorn
        print("Running in production mode. Use gunicorn to start the server.")
