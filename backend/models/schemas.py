"""
API Schemas

Pydantic models representing the exact API contracts for all endpoints.
"""

from typing import Dict, Optional
from pydantic import BaseModel, Field


# ── Health Schema ──────────────────────────────────────────────────

class HealthResponse(BaseModel):
    """Server health status checks."""
    status: str
    model_loaded: bool
    ollama_connected: bool


# ── Predict Schema ─────────────────────────────────────────────────

class PredictRequest(BaseModel):
    """Input payload for mood prediction."""
    text: str = Field(..., min_length=1, description="Text to analyze")


class PredictResponse(BaseModel):
    """Classification analysis details from the BERT model."""
    prediction: str
    confidence: float
    probabilities: Dict[str, float]


# ── Chat Schema ────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    """Input payload for a conversation message."""
    session_id: Optional[str] = None
    message: str = Field(..., min_length=1, description="Message content")


class ChatResponse(BaseModel):
    """Response returned from the conversation assistant."""
    session_id: str
    reply: str
    prediction: str
    confidence: float
    crisis: bool
    timestamp: str


# ── Clinical Report Schema ─────────────────────────────────────────

class ReportRequest(BaseModel):
    """Payload to trigger post-chat report compilation."""
    session_id: str


class ReportResponse(BaseModel):
    """Structured psychologist report compiled by the LLM."""
    report: str


# ── Session Feedback Schema ────────────────────────────────────────

class FeedbackRequest(BaseModel):
    """Submit end-of-session evaluation score."""
    session_id: str
    helpful: bool


class FeedbackResponse(BaseModel):
    """Response confirming feedback registration."""
    message: str
