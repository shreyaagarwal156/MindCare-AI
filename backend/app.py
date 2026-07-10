"""
MindCare AI — FastAPI Application Entry Point

Assembles the REST API web server, initializes logging configurations,
registers security middleware, imports all routers, and handles the
on-startup model loading sequence.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configurations & Middlewares
from config.settings import get_settings
from middleware.error_handler import register_error_handlers
from middleware.request_logger import RequestLoggerMiddleware
from middleware.auth import RateLimiterMiddleware

# Router Modules
from routes import (
    health_router,
    predict_router,
    chat_router,
    report_router,
    feedback_router,
)

# Services to boot on start
from services.classifier_service import classifier_service

# Setup Logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("mindcare.app")


def create_app() -> FastAPI:
    """FastAPI Application factory configuring middleware, routes and events."""
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="REST API wrapping BERT mental health classifier and Llama 3.2 Ollama chat.",
        debug=settings.DEBUG,
    )

    # ── 1. Register CORS Security Middleware ──────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── 2. Register Custom Logger & Rate Limiter ──────────────────────
    app.add_middleware(RequestLoggerMiddleware)
    app.add_middleware(RateLimiterMiddleware)

    # ── 3. Register Error Exception Interceptors ──────────────────────
    register_error_handlers(app)

    # ── 4. Include Routers (Registered at Root) ───────────────────────
    app.include_router(health_router)
    app.include_router(predict_router)
    app.include_router(chat_router)
    app.include_router(report_router)
    app.include_router(feedback_router)

    # ── 5. Lifecycle Events ───────────────────────────────────────────
    @app.on_event("startup")
    async def startup_event():
        logger.info("Initializing MindCare AI server startup...")
        
        # Load BERT Classifier Model once (Singleton)
        logger.info("Bootstrapping custom BERT model weights...")
        loaded = classifier_service.load_model()
        if loaded:
            logger.info("Success! Custom BERT classifier loaded and warm.")
        else:
            logger.warning(
                "Warning: BERT model weights failed to load. "
                "Prediction APIs will return degraded status until weights are supplied."
            )

    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("Shutting down MindCare AI server...")

    return app


app = create_app()
