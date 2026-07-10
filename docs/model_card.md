# 🧠 Model Card — Mental Health BERT Classifier

## Model Details

| Property | Value |
|----------|-------|
| **Base Model** | `bert-base-uncased` |
| **Framework** | HuggingFace Transformers + PyTorch |
| **Task** | Sequence Classification (4-class) |
| **Training Script** | `ml-original/train.py` |
| **Saved Weights** | `ml-original/final_mental_health_model/` |

## Classes

| ID | Label | Description |
|----|-------|-------------|
| 0 | Normal | No mental health distress detected |
| 1 | Depression | Indicators of depressive state |
| 2 | Anxiety | Indicators of anxiety |
| 3 | Suicidal | Suicidal ideation detected (CRITICAL) |

## Training Configuration

- **Epochs**: 3
- **Batch Size**: 8 (train & eval)
- **Max Sequence Length**: 128 tokens
- **Evaluation Strategy**: Per-epoch
- **Tokenizer**: `bert-base-uncased`

## Training Data

| Dataset | Size |
|---------|------|
| `Combined Data.csv` | ~31.5 MB |
| `Mental-Health-Twitter.csv` | ~3.5 MB |
| `mental_health.csv` | ~13.1 MB |
| `master_psychiatric_dataset.csv` | ~40.4 MB |

Data was preprocessed using `preprocess.py` and stored in HuggingFace Dataset format at `processed_data/`.

## Safety Override

In addition to model predictions, a **keyword-based safety override** force-classifies input as "Suicidal" if critical phrases are detected (e.g., "kill myself", "end it all"). This is a defense-in-depth measure.

## Limitations

- Trained on English text data only
- Performance on conversational vs. clinical text may vary
- The model provides classifications, NOT clinical diagnoses
- Must always be paired with human professional oversight

## Ethical Considerations

- This model is for **supportive companionship only**, not medical diagnosis
- Crisis detection triggers safety responses with helpline information
- Session data should be handled with strict privacy protections
- The system explicitly does **not** prescribe medication
