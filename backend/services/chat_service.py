"""
Chat Service

Coordinates the conversational flow by interfacing with the BERT Classifier,
directing crisis intervention when appropriate, and sending standard chat
contexts to the Ollama LLM.
"""

import logging
import time
from datetime import datetime
from typing import Dict, Tuple, Optional
import ollama

from config.settings import get_settings
from services.classifier_service import classifier_service
from services.session_service import session_service

logger = logging.getLogger("mindcare.services.chat")


class ChatService:
    """Manages chatbot state, safety routing, and local Ollama interactions."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ChatService, cls).__new__(cls, *args, **kwargs)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self.settings = get_settings()
        self._initialized = True

    def check_connection(self) -> bool:
        """
        Checks if the local Ollama daemon is active and responsive.

        Source: final_chatbot.py line 12 (check_ollama_connection)
        """
        try:
            # Reconfigure ollama host if specified in settings
            if hasattr(ollama, "Client") and self.settings.OLLAMA_BASE_URL:
                # In modern python-ollama versions we might configure host this way
                pass
            ollama.list()
            return True
        except Exception as e:
            logger.warning(f"Ollama server connection check failed: {str(e)}")
            return False

    def process_message(self, message: str, session_id: Optional[str] = None) -> Tuple[Dict, str]:
        """
        Orchestrates the chat message lifecycle:
          1. Validates or initializes the session ID.
          2. Analyzes user mood via ClassifierService (BERT + Keyword Override).
          3. Evaluates if state is Suicidal -> triggers safety intercept.
          4. Otherwise, appends turn and calls Ollama Llama 3.2.
          5. Registers interaction turn in SessionService.

        Args:
            message: Raw user message.
            session_id: Optional existing session ID.

        Returns:
            Tuple[Dict, str]: (response_metadata, resolved_session_id)
        """
        # Resolve or create session
        if not session_id or not session_service.session_exists(session_id):
            session_id = session_service.create_session()

        # ── 1. Construct Conversation Context for Classifier ──────────────
        session = session_service.get_session(session_id)
        previous_user_msgs = []
        if session and "turns" in session:
            previous_user_msgs = [turn["input"] for turn in session["turns"] if "input" in turn]

        # Combine history with the current message
        all_user_msgs = previous_user_msgs + [message]
        
        # Limit window to the last 5 user messages to balance memory and model token limits
        recent_user_msgs = all_user_msgs[-5:]
        
        # Build context blocks representation
        context_parts = []
        for msg in recent_user_msgs:
            context_parts.append(f"User:\n{msg}")
        conversation_context = "\n\n".join(context_parts)

        # ── 2. Mood Analysis & Safety Classification ──────────────────────
        analysis = classifier_service.predict(conversation_context)
        prediction = analysis["prediction"]
        confidence = analysis["confidence"]
        is_crisis = (prediction == "Suicidal")

        # ── 2. Response Generation Routing ────────────────────────────────
        if is_crisis:
            # Intercept conversation and return emergency information
            bot_reply = self.settings.CRISIS_RESPONSE
            logger.warning(f"Session {session_id}: Suicidal state detected. Routing to crisis intercept.")
        else:
            # Standard conversational path using Ollama (Llama 3.2)
            session = session_service.get_session(session_id)
            
            # Create a temporary list representation to simulate the history update
            # We must append the current user turn *prior* to asking Ollama
            tagged_input = f"[Mood Analysis: {prediction}] User says: {message}"
            temp_history = list(session["messages"])
            temp_history.append({"role": "user", "content": tagged_input})

            start_time = time.perf_counter()
            try:
                # Query Llama 3.2 model in Ollama
                response = ollama.chat(
                    model=self.settings.OLLAMA_MODEL,
                    messages=temp_history
                )
                bot_reply = response["message"]["content"]
                latency = (time.perf_counter() - start_time) * 1000
                logger.info(f"Ollama response generated in {latency:.1f}ms.")
            except Exception as e:
                logger.error(f"Failed to query Ollama LLM: {str(e)}", exc_info=True)
                # Fail-safe response matching original code
                bot_reply = "(I'm having a small connection issue, but I'm here!)"

        # ── 3. Record Interaction ─────────────────────────────────────────
        session_service.add_turn(
            session_id=session_id,
            user_input=message,
            prediction=prediction,
            bot_reply=bot_reply
        )

        response_payload = {
            "reply": bot_reply,
            "prediction": prediction,
            "confidence": confidence,
            "crisis": is_crisis,
            "timestamp": datetime.now().isoformat()
        }

        return response_payload, session_id


# Exported instance matching the singleton usage pattern
chat_service = ChatService()
