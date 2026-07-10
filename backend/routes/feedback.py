"""
Feedback Routes
"""

from fastapi import APIRouter, HTTPException
from models.schemas import FeedbackRequest, FeedbackResponse
from services.session_service import session_service

router = APIRouter()


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_session_feedback(request: FeedbackRequest):
    """
    Submits evaluation feedback indicating whether the user
    found the conversation turns helpful (logged for RLHF).
    """
    try:
        success = session_service.save_feedback(
            session_id=request.session_id,
            helpful=request.helpful
        )
        if not success:
            raise HTTPException(
                status_code=400,
                detail="Unable to log feedback. Session might be empty or inactive."
            )
        return {"message": "Feedback saved successfully."}
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Feedback submission failed: {str(e)}"
        )
