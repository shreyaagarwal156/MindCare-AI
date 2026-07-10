"""
Predict Routes
"""

from fastapi import APIRouter, HTTPException
from models.schemas import PredictRequest, PredictResponse
from services.classifier_service import classifier_service

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
async def predict_mood(request: PredictRequest):
    """
    Analyzes the input text using the trained BERT sequence classifier
    and returns the predicted state along with full class probabilities.
    """
    if not classifier_service.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Machine learning classification model is not currently loaded."
        )

    try:
        result = classifier_service.predict(request.text)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference prediction failed: {str(e)}"
        )
