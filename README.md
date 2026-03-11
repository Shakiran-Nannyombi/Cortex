# Cortex

A cloud-agnostic document processing platform (upload → OCR → search → organize). A production-ready, cloud-agnostic document processing application that can run on GCP, AWS, Azure, on-premises infrastructure, or locally with Docker Compose.

## Features

- **Cloud Agnostic**: Deploy to GCP, AWS, Azure, or run locally without code changes
- **Full-Stack**: Modern React frontend with RESTful Flask backend
- **Document Processing**: Automatic text extraction from PDF, DOCX, images, and text files
- **OCR Support**: Extract text from images using Tesseract, Google Cloud Vision, AWS Textract, or Azure Computer Vision
- **Full-Text Search**: Search document content with PostgreSQL full-text search
- **User Management**: Secure authentication with JWT tokens
- **Workspaces & Folders**: Organize documents into workspaces and nested folders
- **Analytics Dashboard**: View document statistics and usage trends
- **Tagging & Categorization**: Organize documents with colored tags
- **Async Processing**: Background document processing with Celery and Redis

## Architecture

```bash
Frontend (React + TypeScript + Vite)
    ↓
Backend API (Flask + Python)
    ↓
Provider Abstraction Layer
    ↓
Cloud Services (GCP/AWS/Azure) or Local Services
```

### Technology Stack

**Backend:**

- Python 3.11+ with Flask
- SQLAlchemy + Alembic for database
- Celery for async processing
- Redis for caching and queuing
- JWT for authentication
- PyPDF2, python-docx, Pillow, pytesseract for document processing

**Frontend:**

- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

**Infrastructure:**

- Docker & Docker Compose
- PostgreSQL database
- Redis for caching/queuing
- Nginx for frontend serving

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git installed
- (Optional) Node.js 20+ and Python 3.11+ for local development

### Local Development with Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/Shakiran-Nannyombi/Cortex.git
cd Cortex
```

1. Start all services:

```bash
docker compose up --build
```

1. Access the application:
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:5000/api/health>

### Local Development (without Docker)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start database services (PostgreSQL & Redis)
cd .. && docker compose up db redis -d && cd backend

# Run migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Start development server
flask run --host=0.0.0.0 --port=5000
```

> **Note:** For detailed backend setup instructions, troubleshooting, and common issues, see [backend/README.md](backend/README.md)

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |
| POST | `/api/documents` | Upload document |
| GET | `/api/documents` | List documents |
| GET | `/api/documents/:id` | Get document |
| PUT | `/api/documents/:id` | Update document |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/documents/:id/reprocess` | Reprocess document |
| GET | `/api/search?q=` | Search documents |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces` | List workspaces |
| PUT | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |
| POST | `/api/folders` | Create folder |
| GET | `/api/folders` | List folders |
| POST | `/api/tags` | Create tag |
| GET | `/api/tags` | List tags |
| PUT | `/api/tags/:id` | Update tag |
| DELETE | `/api/tags/:id` | Delete tag |
| GET | `/api/analytics/dashboard` | Dashboard analytics |
| GET | `/api/health` | Health check |

## Cloud Provider Configuration

Set environment variables to configure cloud providers:

| Variable | Options | Default |
|----------|---------|---------|
| `CLOUD_PROVIDER` | `local`, `gcp`, `aws`, `azure` | `local` |
| `OCR_PROVIDER` | `tesseract`, `gcp`, `aws`, `azure` | `tesseract` |
| `STORAGE_PROVIDER` | `local`, `gcs`, `s3`, `azure_blob` | `local` |
| `STORAGE_BUCKET` | Your bucket/container name | - |

## Testing

```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/ -v
```

## Project Structure

```bashsource venv/bin/activate
Cortex/
├── backend/
│   ├── app/
│   │   ├── api/          # REST API endpoints
│   │   ├── models/       # SQLAlchemy models
│   │   ├── providers/    # Cloud provider abstractions
│   │   ├── services/     # Business logic
│   │   ├── tasks/        # Celery async tasks
│   │   └── utils/        # Utilities
│   ├── tests/            # Backend tests
│   ├── Dockerfile
│   ├── requirements.txt
│   └── wsgi.py
├── frontend/
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript types
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## License

See [LICENSE](LICENSE) file.
