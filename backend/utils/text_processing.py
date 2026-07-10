"""
Text Processing Utilities

Pre-processing and sanitization functions for user input
before it reaches the ML model or LLM.

These utilities ensure consistent input quality regardless
of what the user types.
"""


def sanitize_input(text: str) -> str:
    """
    Clean and normalize user input text.

    - Strip leading/trailing whitespace
    - Collapse multiple spaces into one
    - Remove null bytes and control characters

    Args:
        text: Raw user input string.

    Returns:
        Cleaned text ready for model inference.
    """
    if not text:
        return ""

    # Remove null bytes and control characters (except newlines)
    cleaned = "".join(
        char for char in text if char == "\n" or (ord(char) >= 32)
    )

    # Collapse whitespace
    cleaned = " ".join(cleaned.split())

    return cleaned.strip()


def truncate_text(text: str, max_length: int = 2000) -> str:
    """
    Safely truncate text to a maximum character length.

    Args:
        text: Input text.
        max_length: Maximum allowed characters.

    Returns:
        Truncated text.
    """
    if len(text) <= max_length:
        return text
    return text[:max_length].rsplit(" ", 1)[0] + "..."


def contains_critical_keywords(text: str, keywords: list[str]) -> bool:
    """
    Check if the text contains any crisis-related keywords.

    Used as a safety override — if critical keywords are detected,
    the system force-classifies the state as 'Suicidal' regardless
    of the BERT model's output.

    Args:
        text: User input (lowercased).
        keywords: List of crisis keywords from config/constants.py.

    Returns:
        True if any keyword is found in the text.
    """
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in keywords)
