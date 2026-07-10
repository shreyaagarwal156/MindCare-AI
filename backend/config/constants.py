"""
Constants

Application-wide constants that do not change between environments.
Includes the mental health label mapping from the trained BERT model.
"""

# Label mapping matching the trained BERT model's output classes
# Source: ml-original/train.py — num_labels=4
LABEL_MAP: dict[int, str] = {
    0: "Normal",
    1: "Depression",
    2: "Anxiety",
    3: "Suicidal",
}

# Reverse mapping for preprocessing / evaluation
LABEL_TO_ID: dict[str, int] = {v: k for k, v in LABEL_MAP.items()}

# Keywords that should force-override the model prediction to "Suicidal"
# Source: ml-original/final_chatbot.py, line 120
CRITICAL_KEYWORDS: list[str] = [
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

# Crisis helpline information
CRISIS_RESPONSE: str = (
    "I am so sorry you are feeling this way, and I want you to know that I hear you. "
    "Please don't face this alone. Your life is incredibly valuable. "
    "Please reach out to these professionals immediately:\n"
    "📞 National Helpline (India): 9152987821 (Kiran)\n"
    "💬 Crisis Text Line: Text HOME to 741741"
)
