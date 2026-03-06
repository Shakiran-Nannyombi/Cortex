# Copilot Instructions for Cortex

## Project Overview

Cortex is a production-ready, cloud-agnostic document processing platform that supports upload, OCR, search, and document organization. It can run on GCP, AWS, Azure, on-premises infrastructure, or locally with Docker Compose.

## Architecture

The application follows a three-tier architecture with a provider abstraction layer:

```
Frontend (React + TypeScript)
    ↓
Backend API (Flask + Python)
    ↓
Provider Abstraction Layer
    ↓
Cloud Services (GCP/AWS/Azure) or Local Services
```

## Technology Stack

### Backend
- Python 3.11+ with Flask
- SQLAlchemy + Alembic for database migrations
- Celery for async task processing
- Redis for caching and message queuing
- JWT for authentication
- Hypothesis for property-based testing

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- Tailwind CSS for styling
- Socket.io for real-time updates
- fast-check for property-based testing

### Infrastructure
- Docker & Docker Compose for containerization
- Terraform for cloud provisioning (GCP, AWS, Azure)
- PostgreSQL as the primary database
- Elasticsearch (optional) for full-text search

## Project Structure

```
Cortex/
├── backend/                    # Flask API and services
│   ├── app/
│   │   ├── api/               # API endpoints (Flask Blueprints)
│   │   ├── services/          # Business logic layer
│   │   ├── providers/         # Cloud provider abstractions
│   │   ├── models/            # SQLAlchemy database models
│   │   └── worker/            # Celery async tasks
│   ├── migrations/            # Alembic database migrations
│   ├── tests/                 # pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page-level components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client modules
│   │   └── store/             # State management
│   ├── public/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
├── terraform/                  # Infrastructure as code
│   ├── gcp/
│   ├── aws/
│   └── azure/
├── docs/                       # Documentation
├── docker-compose.yml
└── README.md
```

## Development Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
flask run --port=8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker Compose (full stack)

```bash
docker-compose up
```

Services: PostgreSQL (:5432), Redis (:6379), Backend API (:8080), Celery worker, Frontend (:3000).

## Environment Variables

### Required
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `JWT_SECRET` — Secret key for JWT tokens

### Provider Selection
- `STORAGE_PROVIDER` — `local`, `gcs`, `s3`, or `azure_blob`
- `MESSAGE_PROVIDER` — `redis`, `pubsub`, `sqs`, or `servicebus`
- `DATABASE_PROVIDER` — `postgresql` or `bigquery`
- `SEARCH_PROVIDER` — `postgresql_fts` or `elasticsearch`
- `OCR_PROVIDER` — `tesseract`, `cloud_vision`, `textract`, or `computer_vision`

## Coding Conventions

### Python (Backend)
- Follow PEP 8 style guidelines
- Use type hints for function signatures and return types
- Use docstrings for all public functions, classes, and modules
- Use the provider abstraction layer for all cloud service interactions — never call cloud APIs directly from business logic
- Handle errors with specific exception types, not bare `except` clauses
- Use SQLAlchemy models for all database interactions

### TypeScript (Frontend)
- Use functional components with hooks — no class components
- Use TypeScript strict mode; avoid `any` types
- Use TanStack Query for all server state; keep client state in dedicated store modules
- Use Tailwind CSS utility classes for styling — avoid custom CSS where possible
- Prefer named exports over default exports

### General
- All new cloud-specific functionality must go through the provider abstraction layer in `backend/app/providers/`
- Keep API endpoints thin — delegate business logic to the services layer
- Use environment variables for all configuration; never hardcode secrets or connection strings
- All user input must be validated and sanitized before processing

## Testing

### Backend
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend
```bash
cd frontend
npm test
```

- Write tests for all new features and bug fixes
- Backend tests use pytest; frontend tests use Vitest
- Use property-based testing (Hypothesis for Python, fast-check for TypeScript) for data transformation and validation logic
- Test cloud provider integrations with mocks — do not make real cloud API calls in tests

## Security Guidelines

- HTTPS is enforced in production
- Passwords are hashed with bcrypt (cost factor 12)
- Rate limiting is applied at 100 requests/minute per user
- Use parameterized queries; never build SQL strings with user input
- Apply CORS policies; configure allowed origins via `CORS_ORIGINS`
- Include security headers (CSP, X-Frame-Options, etc.) on all responses

## Health Check Endpoints

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`
- Metrics: `GET /metrics` (Prometheus format)
