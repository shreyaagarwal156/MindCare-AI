"""
Centralized Error Handler Middleware

Defines custom exceptions and registers error handlers to ensure
all API errors return the consistent format:

{
    "success": false,
    "message": "Error details...",
    "error_code": "ERROR_CODE"
}
"""

import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("mindcare.middleware.errors")


class MindCareException(Exception):
    """Base application exception for returning structured errors."""

    def __init__(self, message: str, error_code: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code


class ModelNotLoadedException(MindCareException):
    """Triggered when predictions are requested but the model has failed to load."""

    def __init__(self, message: str = "ML model not loaded."):
        super().__init__(message, "MODEL_NOT_LOADED", 503)


class SessionNotFoundException(MindCareException):
    """Triggered when an invalid session ID is supplied."""

    def __init__(self, message: str = "Session not found."):
        super().__init__(message, "SESSION_NOT_FOUND", 404)


def register_error_handlers(app: FastAPI) -> None:
    """Attaches error handers to the FastAPI app instance."""

    @app.exception_handler(MindCareException)
    async def custom_exception_handler(request: Request, exc: MindCareException):
        """Intercepts custom domain exceptions."""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.message,
                "error_code": exc.error_code
            }
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        """Intercepts FastAPI/Starlette HTTPExceptions."""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "error_code": f"HTTP_{exc.status_code}"
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Intercepts Pydantic verification failures."""
        logger.warning(f"Request validation failed: {str(exc.errors())}")
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Input validation error: please verify fields.",
                "error_code": "VALIDATION_ERROR"
            }
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """Catch-all handler for unhandled backend exceptions."""
        logger.error(f"Unhandled exception encountered: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "An unexpected error occurred. Please try again later.",
                "error_code": "INTERNAL_SERVER_ERROR"
            }
        )
