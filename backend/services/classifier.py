"""
Mental Health Classifier Service

Loads the fine-tuned BERT model and provides inference.
This is the integration point where the existing HuggingFace
model gets plugged into the backend.

The model classifies user text into 4 mental states:
  0 → Normal
  1 → Depression
  2 → Anxiety
  3 → Suicidal
"""

# ──────────────────────────────────────────────────────────────────────
# TODO: Implement the following when plugging in the trained model:
#
# 1. Load the BertTokenizer and BertForSequenceClassification
#    from the path specified in settings.MODEL_PATH
#
# 2. Expose a `predict(text: str) -> MoodAnalysis` method that:
#    - Tokenizes the input (max_length=128, padding=True, truncation=True)
#    - Runs inference with torch.no_grad()
#    - Applies softmax to get confidence scores
#    - Checks for critical keywords override (see config/constants.py)
#    - Returns the predicted label and confidence
#
# 3. Use a singleton pattern — model should be loaded ONCE at
#    app startup, not per-request.
#
# Reference implementation: ml-original/final_chatbot.py (lines 91-122)
# ──────────────────────────────────────────────────────────────────────
