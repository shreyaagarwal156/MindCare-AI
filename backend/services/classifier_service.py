"""
Classifier Service

Responsible for loading the custom BERT model and tokenizer,
preprocessing user inputs, running model inference, and applying
the critical keyword override logic.
"""

import os
import logging
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertForSequenceClassification
from config.settings import get_settings

logger = logging.getLogger("mindcare.services.classifier")


class ClassifierService:
    """Singleton service for BERT-based mood prediction and preprocessing."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ClassifierService, cls).__new__(cls, *args, **kwargs)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self.settings = get_settings()
        self.tokenizer = None
        self.model = None
        self.is_loaded = False

        # Pre-load model at service instantiation
        self.load_model()
        self._initialized = True

    def load_model(self) -> bool:
        """Loads the BERT tokenizer and sequence classification model into memory."""
        if self.is_loaded:
            return True

        model_path = self.settings.MODEL_PATH
        tokenizer_name = self.settings.TOKENIZER_NAME

        # Resolve path relative to execution root or absolute path
        resolved_path = os.path.abspath(model_path)
        logger.info(f"Attempting to load model from resolved path: {resolved_path}")

        try:
            # Load BERT Tokenizer from HuggingFace
            self.tokenizer = BertTokenizer.from_pretrained(tokenizer_name)
            logger.info("BERT Tokenizer loaded successfully.")

            # Load BERT Model weights from local path
            if not os.path.exists(resolved_path):
                # Fallback check for subdirectory nesting
                alternative_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml-original", "final_mental_health_model"))
                if os.path.exists(alternative_path):
                    resolved_path = alternative_path
                else:
                    raise FileNotFoundError(f"Model weights directory not found at {resolved_path} or {alternative_path}")

            self.model = BertForSequenceClassification.from_pretrained(resolved_path)
            self.model.eval()  # Put model in evaluation mode
            self.is_loaded = True
            logger.info("BERT sequence classification model loaded successfully.")
            return True

        except Exception as e:
            logger.error(f"Failed to load BERT model/tokenizer: {str(e)}", exc_info=True)
            self.tokenizer = None
            self.model = None
            self.is_loaded = False
            return False

    def predict(self, text: str) -> dict:
        """
        Runs the text preprocessing, tokenizer, model inference, and safety override logic.

        Args:
            text: Raw input text from the user.

        Returns:
            dict: Containing 'prediction', 'confidence', and 'probabilities' map.
        """
        if not self.is_loaded or self.model is None or self.tokenizer is None:
            raise RuntimeError("Model is not loaded. Please verify the weights path.")

        # ── Preprocessing & Sanitization ──────────────────────────────────
        sanitized_text = self._sanitize_text(text)
        if not sanitized_text:
            return {
                "prediction": self.settings.LABEL_MAPPING[0],
                "confidence": 1.0,
                "probabilities": {label: (1.0 if idx == 0 else 0.0) for idx, label in self.settings.LABEL_MAPPING.items()}
            }

        # ── Tokenization ──────────────────────────────────────────────────
        inputs = self.tokenizer(
            sanitized_text,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=self.settings.MAX_LENGTH
        )

        # ── Model Inference ───────────────────────────────────────────────
        with torch.no_grad():
            outputs = self.model(**inputs)

        # ── Softmax Probability Calculation ──────────────────────────────
        probs = F.softmax(outputs.logits, dim=1)[0]
        
        # Build raw probabilities dictionary
        probabilities_dict = {}
        for idx, label in self.settings.LABEL_MAPPING.items():
            probabilities_dict[label] = float(probs[idx].item())

        # Determine predicted class and confidence
        pred_class_id = int(torch.argmax(probs).item())
        predicted_label = self.settings.LABEL_MAPPING[pred_class_id]
        confidence = probabilities_dict[predicted_label]

        # ── Safety Override (Crisis Keywords) ─────────────────────────────
        is_crisis = self._check_crisis_keywords(sanitized_text)
        if is_crisis:
            logger.warning(f"Crisis keyword override triggered for text: '{sanitized_text}'")
            predicted_label = "Suicidal"
            confidence = 1.0
            # Adjust probabilities map to reflect the override
            for label in probabilities_dict:
                probabilities_dict[label] = 1.0 if label == "Suicidal" else 0.0

        return {
            "prediction": predicted_label,
            "confidence": confidence,
            "probabilities": probabilities_dict
        }

    def _sanitize_text(self, text: str) -> str:
        """Cleans whitespace and basic strings (matching original text processing)."""
        if not text:
            return ""
        return " ".join(text.strip().split())

    def _check_crisis_keywords(self, text: str) -> bool:
        """Checks if input text matches any configured crisis keywords."""
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.settings.CRISIS_KEYWORDS)


# Exported instance matching the singleton usage pattern
classifier_service = ClassifierService()
