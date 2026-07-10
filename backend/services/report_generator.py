"""
Clinical Report Generator Service

Generates structured clinical reports from session data using the
Ollama LLM. The report follows a professional psychological assessment
format with sections for:

  1. Subjective Summary
  2. Primary Condition Identified
  3. Behavioral Observations
  4. Non-Medical Recommendations

Does NOT prescribe medication — only coping strategies.
"""

# ──────────────────────────────────────────────────────────────────────
# TODO: Implement the following:
#
# 1. Analyze session entries to determine primary_condition:
#    - If any entry has "Suicidal" → "Severe Crisis (High Risk)"
#    - Otherwise → most frequent detected state
#
# 2. Build the clinical prompt (see ml-original/final_chatbot.py lines 53-69)
#
# 3. Call ollama.chat() with the clinical system prompt and report prompt
#
# 4. Return ClinicalReportResponse with the generated text
#
# Reference implementation: ml-original/final_chatbot.py (lines 28-86)
# ──────────────────────────────────────────────────────────────────────
