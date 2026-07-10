"""
General Helper Utilities

Miscellaneous helper functions used across the application.
"""

import uuid
from datetime import datetime, timezone


def generate_session_id() -> str:
    """Generate a unique session identifier."""
    return str(uuid.uuid4())


def utc_now() -> datetime:
    """Return the current UTC timestamp (timezone-aware)."""
    return datetime.now(timezone.utc)
