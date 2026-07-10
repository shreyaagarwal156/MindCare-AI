"""
Request Logger Middleware

Logs incoming HTTP requests, status codes, and execution latencies.
"""

import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("mindcare.api.requests")


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """Calculates request duration and logs the metadata."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.perf_counter()

        try:
            response: Response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000

            logger.info(
                f"Method: {request.method} | Path: {request.url.path} "
                f"| Status: {response.status_code} | Latency: {duration_ms:.2f}ms"
            )
            return response

        except Exception as e:
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.error(
                f"Method: {request.method} | Path: {request.url.path} "
                f"| Status: 500 (Exception) | Latency: {duration_ms:.2f}ms | Error: {str(e)}"
            )
            raise e
