# Docker Deployment Guide

Deploy Cortex using Docker Compose with persistent volumes for PostgreSQL, Redis, and uploads.

## Prerequisites

- Docker installed
- Docker Compose installed
- (Optional) OpenAI API key for chatbot
- (Optional) Google Cloud Vision credentials for OCR

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/Shakiran-Nannyombi/Cortex.git
cd Cortex
```

### 2. Create Environment File

```bash
cp backend/.env.production .env
```

Edit `.env` and set:
```env
SECRET_KEY=your-random-secret-key
JWT_SECRET_KEY=your-random-jwt-secret-key
OPENAI_API_KEY=your-openai-api-key (optional)
OCR_PROVIDER=tesseract (or gcp if you have credentials)
```

### 3. Start Services

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL with persistent volume
- Start Redis with persistent volume
- Build and start backend (runs migrations automatically)
- Build and start frontend

### 4. Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Demo Account:** demo@cortex.app / Demo@123

### 5. Seed Demo Data (if needed)

```bash
docker-compose exec backend flask --app wsgi:app seed-demo
```

Or manually:
```bash
docker-compose exec backend python seed_demo.py
```

## Volume Management

### View Volumes

```bash
docker volume ls | grep cortex
```

### Backup Data

```bash
# Backup PostgreSQL
docker-compose exec db pg_dump -U cortex cortex > backup.sql

# Backup uploads
docker cp cortex-backend:/app/uploads ./uploads_backup
```

### Restore Data

```bash
# Restore PostgreSQL
docker-compose exec -T db psql -U cortex cortex < backup.sql

# Restore uploads
docker cp ./uploads_backup/. cortex-backend:/app/uploads
```

### Clean Volumes (WARNING: Deletes all data)

```bash
docker-compose down -v
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | production | Flask environment |
| `DATABASE_URL` | postgresql://cortex:cortex@db:5432/cortex | Database connection |
| `REDIS_URL` | redis://redis:6379/0 | Redis connection |
| `SECRET_KEY` | - | Flask secret (generate with `openssl rand -hex 32`) |
| `JWT_SECRET_KEY` | - | JWT secret (generate with `openssl rand -hex 32`) |
| `OPENAI_API_KEY` | - | OpenAI API key (optional) |
| `OCR_PROVIDER` | tesseract | OCR provider: tesseract, gcp, aws, azure |
| `VITE_API_URL` | http://localhost:5000 | Frontend API URL |

### Using GCP Vision for OCR

1. Create GCP service account with Vision API access
2. Download JSON key and encode as base64:
   ```bash
   cat service-account-key.json | base64 -w 0
   ```
3. Add to `.env`:
   ```env
   OCR_PROVIDER=gcp
   GOOGLE_APPLICATION_CREDENTIALS_JSON=<base64-encoded-json>
   ```

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Check Service Status

```bash
docker-compose ps
```

### Access Database

```bash
docker-compose exec db psql -U cortex cortex
```

### Access Redis

```bash
docker-compose exec redis redis-cli
```

## Troubleshooting

### Database Connection Failed

```bash
# Check if db is healthy
docker-compose ps db

# View db logs
docker-compose logs db

# Restart db
docker-compose restart db
```

### Backend Won't Start

```bash
# Check logs
docker-compose logs backend

# Rebuild image
docker-compose build --no-cache backend

# Restart
docker-compose up -d backend
```

### Frontend Not Loading

```bash
# Check nginx config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# View frontend logs
docker-compose logs frontend

# Rebuild
docker-compose build --no-cache frontend
```

### OCR Not Working

```bash
# Check OCR_PROVIDER setting
docker-compose exec backend env | grep OCR

# Test OCR
docker-compose exec backend python -c "from app.providers.ocr import get_ocr_provider; print(get_ocr_provider())"
```

## Production Deployment

### Using Docker Swarm

```bash
docker swarm init
docker stack deploy -c docker-compose.yml cortex
```

### Using Kubernetes

```bash
# Convert docker-compose to k8s manifests
kompose convert -f docker-compose.yml -o k8s/

# Deploy
kubectl apply -f k8s/
```

### Using Docker Registry

```bash
# Build and tag images
docker build -t your-registry/cortex-backend:latest ./backend
docker build -t your-registry/cortex-frontend:latest ./cortex-ui

# Push to registry
docker push your-registry/cortex-backend:latest
docker push your-registry/cortex-frontend:latest

# Update docker-compose.yml to use registry images
```

## Performance Tuning

### PostgreSQL

```yaml
# In docker-compose.yml, add to db service:
environment:
  POSTGRES_INITDB_ARGS: "-c shared_buffers=256MB -c max_connections=200"
```

### Redis

```yaml
# In docker-compose.yml, add to redis service:
command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Backend

```yaml
# In docker-compose.yml, update backend command:
command: gunicorn --worker-class eventlet -w 4 --bind 0.0.0.0:5000 --timeout 120 wsgi:app
```

## Security

- Change default PostgreSQL password in `.env`
- Use strong `SECRET_KEY` and `JWT_SECRET_KEY`
- Don't commit `.env` file to git
- Use HTTPS in production (add reverse proxy like Nginx)
- Regularly update base images: `docker-compose pull`
- Scan images for vulnerabilities: `docker scan cortex-backend`

## Cleanup

```bash
# Stop all services
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```
