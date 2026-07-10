"""
Chat Routes
"""

from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.chat_service import chat_service

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def process_chat_message(request: ChatRequest):
    """
    Submits a conversational message. Runs classification, checks for
    crisis overrides, queries Llama 3.2, and saves history.
    """
    try:
        response_payload, session_id = chat_service.process_message(
            message=request.message,
            session_id=request.session_id
        )

        return {
            "session_id": session_id,
            "reply": response_payload["reply"],
            "prediction": response_payload["prediction"],
            "confidence": response_payload["confidence"],
            "crisis": response_payload["crisis"],
            "timestamp": response_payload["timestamp"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat processing failed: {str(e)}"
        )
