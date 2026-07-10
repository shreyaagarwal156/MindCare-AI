# 🏗️ System Architecture

## High-Level Overview

```
┌─────────────┐     HTTP/REST      ┌──────────────────────────────────────┐
│             │ ◄────────────────► │           FastAPI Backend            │
│   Frontend  │                    │                                      │
│  (React/    │                    │  ┌──────────┐    ┌────────────────┐  │
│   Next.js)  │                    │  │  Routes   │───►│   Services     │  │
│             │                    │  └──────────┘    │                │  │
└─────────────┘                    │                  │  ┌────────────┐│  │
                                   │                  │  │ Classifier ││  │
                                   │                  │  │  (BERT)    ││  │
                                   │                  │  └────────────┘│  │
                                   │                  │  ┌────────────┐│  │
                                   │                  │  │ Chat Engine││  │
                                   │                  │  │  (Ollama)  ││  │
                                   │                  │  └────────────┘│  │
                                   │                  │  ┌────────────┐│  │
                                   │                  │  │  Session   ││  │
                                   │                  │  │  Manager   ││  │
                                   │                  │  └────────────┘│  │
                                   │                  │  ┌────────────┐│  │
                                   │                  │  │  Report    ││  │
                                   │                  │  │ Generator  ││  │
                                   │                  │  └────────────┘│  │
                                   │                  └────────────────┘  │
                                   └──────────────────────────────────────┘
                                              │              │
                                              ▼              ▼
                                   ┌──────────────┐  ┌──────────────┐
                                   │  BERT Model  │  │ Ollama LLM   │
                                   │  (HuggingFace│  │ (Llama 3.2)  │
                                   │   on-disk)   │  │  local API   │
                                   └──────────────┘  └──────────────┘
```

## Request Flow — Chat Message

```
User Input
    │
    ▼
POST /api/chat
    │
    ├──► text_processing.sanitize_input()
    │
    ├──► classifier.predict(text)
    │         │
    │         ├──► BertTokenizer.encode()
    │         ├──► BertForSequenceClassification.forward()
    │         ├──► softmax → label + confidence
    │         └──► critical keyword override check
    │
    ├──► chat_engine.generate_response(text, mood_label)
    │         │
    │         ├──► If "Suicidal" → return CRISIS_RESPONSE
    │         └──► Else → ollama.chat() with mood-tagged context
    │
    ├──► session_manager.add_entry(session_id, entry)
    │
    └──► Return ChatResponse { reply, mood_analysis, session_id }
```

## Data Flow — Clinical Report

```
POST /api/reports/generate
    │
    ├──► session_manager.get_session(session_id)
    │
    ├──► Analyze states → determine primary_condition
    │
    ├──► report_generator.generate(session_data, primary_condition)
    │         │
    │         └──► ollama.chat() with clinical prompt template
    │
    └──► Return ClinicalReportResponse
```

## Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `routes/` | HTTP layer — parse requests, format responses, status codes |
| `services/` | Business logic — ML inference, LLM calls, session state |
| `models/` | Data contracts — Pydantic schemas for validation |
| `middleware/` | Cross-cutting — auth, logging, error handling |
| `config/` | Environment — settings, constants, label maps |
| `utils/` | Shared tools — text processing, ID generation |
