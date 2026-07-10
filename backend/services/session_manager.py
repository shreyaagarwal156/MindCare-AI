"""
Session Manager Service

Handles chat session lifecycle:
  - Creating and tracking sessions (by session_id)
  - Storing per-turn data (user input, detected state, bot reply)
  - Recording end-of-session feedback for RLHF logging
  - Retrieving session data for report generation

Currently uses in-memory storage. Will be replaced with
a database-backed implementation when the DB layer is added.
"""

# ──────────────────────────────────────────────────────────────────────
# TODO: Implement the following:
#
# 1. In-memory session store (dict[str, list[SessionEntry]])
#    - generate_session_id() → UUID string
#    - add_entry(session_id, entry: SessionEntry)
#    - get_session(session_id) → list[SessionEntry]
#
# 2. RLHF feedback logging:
#    - log_feedback(session_id, was_helpful: bool)
#    - Persist to CSV or database (see ml-original/final_chatbot.py line 19)
#
# 3. Plan for migration to async database storage.
#
# Reference implementation: ml-original/final_chatbot.py (lines 19-26, 105, 141)
# ──────────────────────────────────────────────────────────────────────
