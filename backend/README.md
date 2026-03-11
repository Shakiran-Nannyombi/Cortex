# Cortex Backend

Flask-based REST API for the Cortex document processing platform.

## Prerequisites

- Python 3.11+
- Docker and Docker Compose (for PostgreSQL and Redis)
- pip and virtualenv

## Quick Start

### 1. Start Database Services

The backend requires PostgreSQL and Redis. The easiest way is to use Docker Compose:

```bash
# From the project root directory
cd ..
docker compose up db redis -d
```

**Important:** If you have local PostgreSQL or Redis services running, they will conflict with Docker containers on ports 5432 and 6379. Stop them first:

```bash
sudo systemctl stop postgresql
sudo systemctl stop redis-server
```

### 2. Set Up Python Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Initialize Database

```bash
# Initialize Flask-Migrate (only needed first time)
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade
```

### 4. Run the Development Server

```bash
flask run --host=0.0.0.0 --port=5000
```

The API will be available at:

- **API Base:** <http://localhost:5000/api/>
- **Health Check:** <http://localhost:5000/api/health>

## Environment Variables

Create a `.env` file in the backend directory (optional for development):

```bash
# Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database
DATABASE_URL=postgresql://cortex:cortex@localhost:5432/cortex

# Redis
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# File Storage
UPLOAD_FOLDER=/tmp/cortex/uploads
MAX_CONTENT_LENGTH=52428800  # 50MB

# Cloud Providers (default: local)
CLOUD_PROVIDER=local
OCR_PROVIDER=tesseract
STORAGE_PROVIDER=local
```

## Database Migrations

### Create a New Migration

After modifying models:

```bash
flask db migrate -m "Description of changes"
```

### Apply Migrations

```bash
flask db upgrade
```

### Rollback Migration

```bash
flask db downgrade
```

### View Migration History

```bash
flask db history
```

## Running Tests

```bash
# Install test dependencies (already in requirements.txt)
pip install pytest pytest-flask pytest-cov

# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ -v --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

## Project Structure

```bash
backend/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration classes
│   ├── create_app.py          # App factory
│   ├── extensions.py          # Flask extensions
│   ├── celery_app.py          # Celery configuration
│   ├── api/                   # API endpoints (Blueprints)
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── documents.py       # Document management
│   │   ├── workspaces.py      # Workspace management
│   │   ├── folders.py         # Folder management
│   │   ├── tags.py            # Tag management
│   │   ├── search.py          # Search functionality
│   │   ├── analytics.py       # Analytics endpoints
│   │   └── health.py          # Health check
│   ├── models/                # Database models
│   │   ├── user.py
│   │   ├── document.py
│   │   ├── workspace.py
│   │   ├── folder.py
│   │   ├── tag.py
│   │   └── types.py           # Custom SQLAlchemy types
│   ├── providers/             # Cloud provider abstractions
│   │   ├── storage.py         # Storage provider interface
│   │   └── ocr.py             # OCR provider interface
│   ├── services/              # Business logic
│   │   └── document_processor.py
│   ├── tasks/                 # Celery async tasks
│   │   └── document_tasks.py
│   └── utils/                 # Utility functions
├── migrations/                # Database migrations
│   └── versions/
├── tests/                     # Test suite
│   ├── conftest.py           # Pytest fixtures
│   ├── test_auth.py
│   ├── test_documents.py
│   └── test_workspaces.py
├── Dockerfile
├── requirements.txt
├── pytest.ini
├── wsgi.py                   # WSGI entry point
└── README.md
```

## Common Issues & Troubleshooting

### Port Conflicts

**Problem:** `connection refused` or `address already in use` errors.

**Solution:** Local PostgreSQL/Redis services are conflicting with Docker containers.

```bash
# Check what's using the ports
sudo lsof -i :5432  # PostgreSQL
sudo lsof -i :6379  # Redis

# Stop local services
sudo systemctl stop postgresql
sudo systemctl stop redis-server

# Restart Docker containers
docker compose down
docker compose up db redis -d
```

### Migration Import Errors

**Problem:** `NameError: name 'app' is not defined` in migration files.

**Solution:** Migration files need to import custom types directly. Edit the migration file:

```python
# Add this import at the top
from app.models.types import GUID, TSVectorType

# Replace app.models.types.GUID() with GUID()
# Replace app.models.types.TSVectorType() with TSVectorType()
```

### Database Connection Issues

**Problem:** Can't connect to PostgreSQL.

**Solution:**

1. Verify Docker containers are running: `docker compose ps`
2. Check port mappings: `docker port cortex-db-1`
3. Test connection: `docker compose exec db psql -U cortex -d cortex -c "SELECT 1;"`

### Virtual Environment Not Activated

**Problem:** Commands not found or using system Python.

**Solution:**

```bash
# Make sure you're in the backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Verify (should show path to venv)
which python
```

## API Documentation

### Authentication

```bash
# Register new user
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "Full Name"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Documents

```bash
# Upload document
POST /api/documents
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: file=<file>

# List documents
GET /api/documents?page=1&per_page=20
Headers: Authorization: Bearer <token>

# Get document
GET /api/documents/:id
Headers: Authorization: Bearer <token>

# Delete document
DELETE /api/documents/:id
Headers: Authorization: Bearer <token>
```

See the main project README for a complete API reference.

## Running with Docker

To run the entire backend stack with Docker:

```bash
# From project root
docker compose up backend worker -d
```

This will start:

- Flask API (port 5000)
- Celery worker
- PostgreSQL
- Redis

## Development Tips

### Auto-reload on File Changes

Flask development server automatically reloads on file changes when `FLASK_ENV=development`.

### Debugging

```python
# Add to any file for debugging
import pdb; pdb.set_trace()
```

### Checking Logs

```bash
# Docker logs
docker compose logs backend -f
docker compose logs worker -f

# Check all services
docker compose logs -f
```

### Database Shell

```bash
# PostgreSQL shell via Docker
docker compose exec db psql -U cortex -d cortex

# Flask shell (with app context)
flask shell
```

## Production Deployment

For production deployment:

1. Use a production WSGI server (gunicorn is included)
2. Set proper environment variables (SECRET_KEY, JWT_SECRET_KEY)
3. Use a managed database service
4. Enable HTTPS
5. Set up proper logging
6. Configure CORS properly
7. Use environment-specific config (ProductionConfig)

```bash
# Production server example
gunicorn --bind 0.0.0.0:5000 --workers 4 wsgi:app
```

## Contributing

1. Follow PEP 8 style guidelines
2. Use type hints for function signatures
3. Write docstrings for all public functions
4. Add tests for new features
5. Use the provider abstraction layer for cloud services
6. Never hardcode secrets or credentials

## License

See the main project LICENSE file.
