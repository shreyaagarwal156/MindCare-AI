"""
Health Check Routes
"""

from fastapi import APIRouter
from models.schemas import HealthResponse
from services.classifier_service import classifier_service
from services.chat_service import chat_service

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Checks the status of the server and its critical dependencies:
      - The local fine-tuned BERT classification model.
      - The local Ollama Llama 3.2 model endpoint.
    """
    model_loaded = classifier_service.is_loaded
    ollama_connected = chat_service.check_connection()

    status = "healthy" if (model_loaded and ollama_connected) else "degraded"

    return {
        "status": status,
        "model_loaded": model_loaded,
        "ollama_connected": ollama_connected
    }
