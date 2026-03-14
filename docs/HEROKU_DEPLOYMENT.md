# Heroku Deployment Guide - Docker

Deploy entire Cortex system (backend + frontend + PostgreSQL + Redis) to Heroku using Docker.

## What Gets Deployed

✅ **Backend** (Flask API with Tesseract OCR)  
✅ **Frontend** (React with Nginx)  
✅ **PostgreSQL** (in Docker container with volume)  
✅ **Redis** (in Docker container with volume)  
✅ **Demo Data** (pre-seeded)

Everything runs as one Docker Compose stack on Heroku.

## Prerequisites

1. Heroku account (https://www.heroku.com)
2. Git repository initialized
3. Docker images (Heroku builds them automatically)

## Setup Steps - Using Heroku Dashboard

### 1. Create Heroku App

1. Go to https://dashboard.heroku.com/apps
2. Click **"New"** → **"Create new app"**
3. Enter app name: `your-app-name` (e.g., `cortex-demo`)
4. Choose region: **United States**
5. Click **"Create app"**
6. **Note your app URL** (shown at top): `https://your-app-name.herokuapp.com`

### 2. Set Environment Variables

1. Go to **"Settings"** tab
2. Click **"Reveal Config Vars"**
3. Add these variables:

| Key | Value |
|-----|-------|
| `FLASK_ENV` | `production` |
| `SECRET_KEY` | `a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3f5a7c9` |
| `JWT_SECRET_KEY` | `b8g4d0f3e2c1a9b7d5f3e1c9a7b5d3f1e9c7a5b3d1f9e7c5a3b1d9f7e5c3a1` |
| `OPENAI_API_KEY` | (leave empty for now) |
| `OCR_PROVIDER` | `tesseract` |
| `VITE_API_URL` | `https://your-app-name.herokuapp.com` (use your actual app name) |

**Example:** If your app is named `cortex-demo`, set:
```
VITE_API_URL=https://cortex-demo.herokuapp.com
```

### 3. Connect GitHub Repository

1. Go to **"Deploy"** tab
2. Under **"Deployment method"**, click **"GitHub"**
3. Click **"Connect to GitHub"**
4. Search for your repository: `Cortex`
5. Click **"Connect"**

### 4. Deploy

**Option A: Manual Deploy (Recommended for first time)**
1. In **"Deploy"** tab, scroll to **"Manual deploy"**
2. Select branch: `main`
3. Click **"Deploy Branch"**
4. Wait for build to complete (10-15 minutes)
5. Check **"View"** button to see your app

**Option B: Automatic Deploy**
1. In **"Deploy"** tab, scroll to **"Automatic deploys"**
2. Click **"Enable Automatic Deploys"**
3. Every push to `main` will auto-deploy

### 5. View Your App

1. Click **"Open app"** button (top right)
2. Your app is now live at: `https://your-app-name.herokuapp.com`
3. Demo login: `demo@cortex.app` / `Demo@123`

## Setup Steps - Using Heroku CLI (Alternative)

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set FLASK_ENV=production --app your-app-name
heroku config:set SECRET_KEY=a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3f5a7c9 --app your-app-name
heroku config:set JWT_SECRET_KEY=b8g4d0f3e2c1a9b7d5f3e1c9a7b5d3f1e9c7a5b3d1f9e7c5a3b1d9f7e5c3a1 --app your-app-name
heroku config:set OCR_PROVIDER=tesseract --app your-app-name
heroku config:set VITE_API_URL=https://your-app-name.herokuapp.com --app your-app-name

# Deploy
git push heroku main

# View app
heroku open --app your-app-name
```

## About VITE_API_URL

**Yes, you need it.** It tells the frontend where the backend API is located.

- **Local:** `http://localhost:5000`
- **Docker Compose:** `http://backend:5000`
- **Heroku:** `https://your-app-name.herokuapp.com`

## Monitoring

```bash
# View logs
heroku logs --tail --app your-app-name

# Check dyno status
heroku ps --app your-app-name
```

## Troubleshooting

### App won't start
```bash
heroku logs --tail --app your-app-name
```

### Frontend not loading
Check that `VITE_API_URL` is set correctly in config vars

### Database errors
Check logs for PostgreSQL connection issues

## Cost

- Heroku free tier: Limited (sleeps after 30 mins)
- Heroku paid tier: ~$50-100/month for reliable hosting
- No additional addon costs (everything in Docker)

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
