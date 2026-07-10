# 📡 API Reference

Base URL: `http://localhost:8000/api`

---

## Health

### `GET /api/health`
Basic liveness probe.

**Response** `200 OK`
```json
{ "status": "healthy" }
```

### `GET /api/health/ready`
Deep readiness check — verifies ML model and Ollama are operational.

**Response** `200 OK`
```json
{
  "status": "healthy",
  "model_loaded": true,
  "ollama_connected": true
}
```

---

## Chat

### `POST /api/chat`
Send a message and receive an AI-powered empathetic response.

**Request Body**
```json
{
  "message": "I've been feeling really anxious about my exams",
  "session_id": "optional-existing-session-id"
}
```

**Response** `200 OK`
```json
{
  "reply": "I hear you, and exam stress is really tough...",
  "mood_analysis": {
    "label": "Anxiety",
    "confidence": 0.87
  },
  "session_id": "uuid-v4-string",
  "is_crisis": false,
  "timestamp": "2026-07-10T12:00:00Z"
}
```

---

## Sessions

### `GET /api/sessions/{session_id}`
Retrieve the full conversation history for a session.

**Response** `200 OK`
```json
[
  {
    "user_input": "I feel so hopeless",
    "detected_state": "Depression",
    "bot_reply": "I'm really sorry you're feeling this way...",
    "timestamp": "2026-07-10T12:00:00Z"
  }
]
```

### `POST /api/sessions/{session_id}/feedback`
Submit end-of-session feedback (used for RLHF logging).

**Request Body**
```json
{
  "session_id": "uuid-v4-string",
  "was_helpful": true
}
```

**Response** `200 OK`
```json
{ "message": "Feedback recorded successfully" }
```

---

## Reports

### `POST /api/reports/generate`
Generate an AI-powered clinical report from a completed session.

**Request Body**
```json
{
  "session_id": "uuid-v4-string"
}
```

**Response** `200 OK`
```json
{
  "session_id": "uuid-v4-string",
  "primary_condition": "Anxiety",
  "report_text": "## Subjective Summary\n...",
  "generated_at": "2026-07-10T12:05:00Z"
}
```

---

## Error Responses

All errors follow this structure:

```json
{
  "error": "ErrorType",
  "detail": "Human-readable explanation",
  "status_code": 422
}
```

| Code | Meaning |
|------|---------|
| `422` | Validation error (bad input) |
| `404` | Resource not found |
| `501` | Endpoint not yet implemented |
| `500` | Internal server error |
