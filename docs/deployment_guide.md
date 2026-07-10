# 🚀 Deployment Guide

## Prerequisites

- Python 3.10+
- Ollama installed and running locally
- The trained BERT model at `ml-original/final_mental_health_model/`

## Local Development

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
copy .env.example .env
# Edit .env as needed

# 5. Ensure Ollama is running
ollama serve
ollama pull llama3.2

# 6. Start the server
uvicorn app:app --reload --port 8000
```

## Verify Installation

```bash
# Health check
curl http://localhost:8000/api/health

# API documentation
# Open in browser: http://localhost:8000/api/docs
```

## Production Deployment (Planned)

### Docker (Recommended)
```dockerfile
# Dockerfile will be added in a future phase
# Key considerations:
# - Multi-stage build (deps → app)
# - Include ML model weights in image or mount as volume
# - Ollama as a sidecar service
# - Non-root user
# - Health check endpoint
```

### Environment Variables for Production
```env
APP_ENV=production
DEBUG=false
ALLOWED_ORIGINS=["https://yourdomain.com"]
```
