"""
Session Service

Handles in-memory tracking of conversation history (Ollama messages format)
and mood analysis turns. Implements RLHF logging by appending completed
session histories and feedback to the CSV log.
"""

import os
import csv
import uuid
import logging
from typing import Dict, List, Optional
from datetime import datetime, timezone
from config.settings import get_settings

logger = logging.getLogger("mindcare.services.session")


class SessionService:
    """Manages active chat sessions and records client feedback in a CSV log."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SessionService, cls).__new__(cls, *args, **kwargs)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self.settings = get_settings()
        # In-memory storage: session_id -> { "messages": list[dict], "turns": list[dict] }
        self._sessions: Dict[str, Dict] = {}
        self._initialized = True

    def create_session(self) -> str:
        """Creates a new session with the standard system prompt."""
        session_id = str(uuid.uuid4())
        
        # System prompt from original final_chatbot.py
        system_prompt = (
            "You are a warm, empathetic mental health companion. "
            "You listen actively, validate feelings, and provide gentle, "
            "non-medical support. Never act as a doctor."
        )

        self._sessions[session_id] = {
            "messages": [{"role": "system", "content": system_prompt}],
            "turns": [],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        logger.info(f"New chat session created: {session_id}")
        return session_id

    def get_session(self, session_id: str) -> Optional[Dict]:
        """Retrieves session data or returns None if it doesn't exist."""
        return self._sessions.get(session_id)

    def session_exists(self, session_id: str) -> bool:
        """Checks if the session is registered."""
        return session_id in self._sessions

    def add_turn(self, session_id: str, user_input: str, prediction: str, bot_reply: str):
        """
        Adds a single turn to the session.

        Updates both the Ollama message history and the structured turn logs.
        """
        if not self.session_exists(session_id):
            raise ValueError(f"Session '{session_id}' not found.")

        session = self._sessions[session_id]

        # 1. Update Ollama message history (with classification tagged to user input)
        # Source: final_chatbot.py line 124
        tagged_input = f"[Mood Analysis: {prediction}] User says: {user_input}"
        session["messages"].append({"role": "user", "content": tagged_input})
        session["messages"].append({"role": "assistant", "content": bot_reply})

        # 2. Update structured turns log (used for reports/RLHF CSV logging)
        # Source: final_chatbot.py line 141
        session["turns"].append({
            "input": user_input,
            "state": prediction,
            "bot_reply": bot_reply
        })

        logger.debug(f"Added conversation turn to session {session_id}.")

    def save_feedback(self, session_id: str, helpful: bool) -> bool:
        """
        Appends all session turns and the feedback value (Yes/No) to the CSV log.

        Source: final_chatbot.py line 19 (log_session_feedback)
        """
        if not self.session_exists(session_id):
            raise ValueError(f"Session '{session_id}' not found.")

        session_data = self._sessions[session_id]["turns"]
        feedback_str = "y" if helpful else "n"

        if not session_data:
            logger.warning(f"No turns found in session {session_id} to log.")
            return False

        # CSV log path (matching original location)
        csv_path = "rlhf_logs.csv"
        file_exists = os.path.isfile(csv_path)

        try:
            with open(csv_path, mode="a", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                if not file_exists:
                    writer.writerow(["User Input", "Detected State", "Bot Response", "Session Feedback (Y/N)"])
                
                for entry in session_data:
                    writer.writerow([
                        entry.get("input", ""),
                        entry.get("state", ""),
                        entry.get("bot_reply", ""),
                        feedback_str
                    ])

            logger.info(f"RLHF feedback successfully saved to {csv_path} for session {session_id}.")
            return True

        except Exception as e:
            logger.error(f"Failed to log session feedback to CSV: {str(e)}", exc_info=True)
            return False


# Exported instance matching the singleton usage pattern
session_service = SessionService()
