# Heroku Deployment Guide

## Prerequisites

1. Heroku CLI installed
2. Git repository initialized
3. Google Cloud Vision API enabled (for OCR)

## Setup Steps

### 1. Create Heroku App

```bash
heroku create your-app-name
```

### 2. Add PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:standard-0 --app your-app-name
```

### 3. Add Redis Cache

```bash
heroku addons:create heroku-redis:premium-0 --app your-app-name
```

### 4. Set Environment Variables

```bash
heroku config:set FLASK_ENV=production --app your-app-name
heroku config:set SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))') --app your-app-name
heroku config:set JWT_SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))') --app your-app-name
heroku config:set OPENAI_API_KEY=your-openai-api-key --app your-app-name
heroku config:set OCR_PROVIDER=gcp --app your-app-name
heroku config:set GOOGLE_CLOUD_PROJECT=your-gcp-project-id --app your-app-name
```

### 5. Setup Google Cloud Vision for OCR

#### Option A: Using Service Account JSON (Recommended)

1. Create a GCP service account with Vision API access
2. Download the JSON key file
3. Encode it as base64:
   ```bash
   cat /path/to/service-account-key.json | base64
   ```
4. Set as Heroku config var:
   ```bash
   heroku config:set GOOGLE_APPLICATION_CREDENTIALS_JSON=<base64-encoded-json> --app your-app-name
   ```

5. Update the OCR provider to decode it:
   - The app will automatically handle this if the env var is set

#### Option B: Using Heroku Google Cloud Buildpack

```bash
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-google-cloud-sql.git --app your-app-name
```

### 6. Add Buildpacks

```bash
heroku buildpacks:add heroku/python --app your-app-name
heroku buildpacks:add heroku/nodejs --app your-app-name
```

### 7. Deploy

```bash
git push heroku main
```

### 8. Run Migrations

```bash
heroku run "cd backend && flask --app wsgi:app db upgrade" --app your-app-name
```

### 9. Seed Demo Data (Optional)

```bash
heroku run "cd backend && python seed_demo.py" --app your-app-name
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection (auto-set by Heroku) | - |
| `REDIS_URL` | Redis connection (auto-set by Heroku) | - |
| `SECRET_KEY` | Flask secret key | Generate with `secrets.token_hex(32)` |
| `JWT_SECRET_KEY` | JWT signing key | Generate with `secrets.token_hex(32)` |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | `sk-...` |
| `OCR_PROVIDER` | OCR provider to use | `gcp`, `tesseract`, `aws`, `azure` |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID | `my-project-123` |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Base64-encoded service account JSON | - |

## Monitoring

```bash
# View logs
heroku logs --tail --app your-app-name

# Check dyno status
heroku ps --app your-app-name

# Scale dynos
heroku ps:scale web=2 --app your-app-name
```

## Troubleshooting

### Database Connection Issues
```bash
heroku config:get DATABASE_URL --app your-app-name
```

### Redis Connection Issues
```bash
heroku config:get REDIS_URL --app your-app-name
```

### OCR Not Working
1. Verify `OCR_PROVIDER` is set to `gcp`
2. Check GCP credentials are properly set
3. Verify Vision API is enabled in GCP console
4. Check logs: `heroku logs --tail`

### Build Failures
```bash
# Clear build cache
heroku builds:cancel --app your-app-name
heroku builds:cache:purge --app your-app-name

# Rebuild
git push heroku main
```

## Cost Optimization

- Use `standard-0` PostgreSQL for production
- Use `premium-0` Redis for reliability
- Monitor usage in Heroku dashboard
- Set up alerts for cost overages

## Security

- Never commit `.env` files
- Rotate `SECRET_KEY` and `JWT_SECRET_KEY` regularly
- Use strong, unique API keys
- Enable Heroku Shield for DDoS protection
- Keep dependencies updated
