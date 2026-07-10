"""
Application Settings

Configuration settings loaded from environment or .env file.
Uses pydantic-settings for validation.
"""

from functools import lru_cache
from typing import List, Dict

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Type-safe application configuration loaded from environment/.env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # ── Server Config ──────────────────────────────────────────────
    APP_NAME: str = "MindCare AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    API_PREFIX: str = "/api"

    # ── ML Model Config ────────────────────────────────────────────
    MODEL_PATH: str = "../ml-original/final_mental_health_model"
    TOKENIZER_NAME: str = "bert-base-uncased"
    MAX_LENGTH: int = 128

    # ── Ollama LLM Config ──────────────────────────────────────────
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2"

    # ── Security & CORS ────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # ── Mapping & Safety Override Constants ───────────────────────
    # Label mapping matching the trained BERT model's classes
    LABEL_MAPPING: Dict[int, str] = {
        0: "Normal",
        1: "Depression",
        2: "Anxiety",
        3: "Suicidal",
    }

    # Pre-defined crisis keywords trigger override logic
    CRISIS_KEYWORDS: List[str] = [
        "suicide",
        "kill",
        "die",
        "end it",
        "hang myself",
        "no point living",
        "want it all to end",
        "not want to be here",
        "end my life",
    ]

    # Crisis contact info returned when Suicidal state is detected
    CRISIS_RESPONSE: str = (
        "I am so sorry you are feeling this way, and I want you to know that I hear you. "
        "Please don't face this alone. Your life is incredibly valuable. "
        "Please reach out to these professionals immediately:\n"
        "📞 National Helpline (India): 9152987821 (Kiran)\n"
        "💬 Crisis Text Line: Text HOME to 741741"
    )


@lru_cache()
def get_settings() -> Settings:
    """Returns a cached Settings singleton."""
    return Settings()
