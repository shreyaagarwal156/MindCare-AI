"""
Routes Package Initialization

Imports and exports all sub-routers for easy registration in the main app.
"""

from routes.health import router as health_router
from routes.predict import router as predict_router
from routes.chat import router as chat_router
from routes.report import router as report_router
from routes.feedback import router as feedback_router

__all__ = [
    "health_router",
    "predict_router",
    "chat_router",
    "report_router",
    "feedback_router",
]
