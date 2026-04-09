import os
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY"),
)

# ─────────────────────────────────────────────────────────────────────────────
# FSLSM vector → system prompt (Phase 3)
# Dimensions: processing, perception, reception, understanding
# Range: -1.0 to +1.0, default 0.0
# ─────────────────────────────────────────────────────────────────────────────

FSLSM_THRESHOLD = 0.3


def build_fslsm_system_prompt(vectors: dict) -> str:
    processing = float(vectors.get("processing", 0.0))   # -1=active, +1=reflective
    perception = float(vectors.get("perception", 0.0))   # -1=sensing, +1=intuitive
    reception = float(vectors.get("reception", 0.0))     # -1=visual, +1=verbal
    understanding = float(vectors.get("understanding", 0.0))  # -1=sequential, +1=global

    lines = [
        "You are a Neuro-Adaptive Learning Assistant powered by the Felder-Silverman Learning Style Model (FSLSM).",
        "Your responses are scientifically tailored to this learner's cognitive profile.",
        "",
        "━━━ LEARNER FSLSM PROFILE ━━━",
    ]

    # Processing dimension
    if processing < -FSLSM_THRESHOLD:
        lines.append(
            "• PROCESSING: ACTIVE LEARNER — Provide concrete exercises, worked examples, "
            "and mini-tasks the learner can try immediately. Avoid lengthy theory blocks."
        )
    elif processing > FSLSM_THRESHOLD:
        lines.append(
            "• PROCESSING: REFLECTIVE LEARNER — Allow time for contemplation. "
            "Include theoretical depth, multiple perspectives, and summary at the end."
        )
    else:
        lines.append("• PROCESSING: BALANCED — Mix hands-on examples with conceptual explanation.")

    # Perception dimension
    if perception < -FSLSM_THRESHOLD:
        lines.append(
            "• PERCEPTION: SENSING LEARNER — Ground every concept in real-world facts, "
            "data, and established procedures. Minimize abstract speculation."
        )
    elif perception > FSLSM_THRESHOLD:
        lines.append(
            "• PERCEPTION: INTUITIVE LEARNER — Highlight patterns, relationships, theories, "
            "and conceptual connections. Spark curiosity with the 'why'."
        )
    else:
        lines.append("• PERCEPTION: BALANCED — Anchor concepts in reality while connecting to broader patterns.")

    # Reception dimension
    if reception < -FSLSM_THRESHOLD:
        lines.append(
            "• RECEPTION: VISUAL LEARNER — Use ASCII/text diagrams, tables, comparison grids, "
            "and spatial metaphors. Break text into visual chunks."
        )
    elif reception > FSLSM_THRESHOLD:
        lines.append(
            "• RECEPTION: VERBAL LEARNER — Detailed written explanations, rich descriptions, "
            "and annotated summaries are preferred over visual gimmicks."
        )
    else:
        lines.append("• RECEPTION: BALANCED — Combine clear text with well-placed visual structure.")

    # Understanding dimension
    if understanding < -FSLSM_THRESHOLD:
        lines.append(
            "• UNDERSTANDING: SEQUENTIAL LEARNER — Present information in strict linear steps. "
            "Ensure each step is fully understood before the next. Use numbered lists."
        )
    elif understanding > FSLSM_THRESHOLD:
        lines.append(
            "• UNDERSTANDING: GLOBAL LEARNER — Open with the big picture / executive summary. "
            "Then fill in details. Show how pieces connect to the whole."
        )
    else:
        lines.append("• UNDERSTANDING: BALANCED — Provide brief overview, then structured detail.")

    lines.append("")
    lines.extend(_formatting_rules())

    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# Legacy archetype → system prompt (backward compat, Phase 0)
# ─────────────────────────────────────────────────────────────────────────────

def build_adaptive_system_prompt(raw_scores: dict) -> str:
    visual = raw_scores.get("visual", 0)
    structural = raw_scores.get("structural", 0)
    active = raw_scores.get("active", 0)
    logic = raw_scores.get("logic", 0)

    lines = [
        "You are a Neuro-Adaptive Learning Assistant. "
        "Your purpose is to explain, teach, and assess — tailored to this learner's cognitive profile.",
        "",
        "━━━ LEARNER COGNITIVE PROFILE (scores /50) ━━━",
    ]

    lines.append(f"• Visual Affinity: {visual}/50")
    if visual > 35:
        lines.append("  → Use ASCII diagrams, tables, and spatial metaphors liberally.")
    elif visual < 15:
        lines.append("  → Skip visual gimmicks. Use direct, precise text.")

    lines.append(f"• Structural Overview: {structural}/50")
    if structural > 35:
        lines.append("  → ALWAYS open with a 'Big Picture' summary section.")
    elif structural < 15:
        lines.append("  → Get straight to the point. No lengthy preamble.")

    lines.append(f"• Active Engagement: {active}/50")
    if active > 35:
        lines.append("  → End every explanation with a thought-provoking Socratic question.")

    lines.append(f"• Logical Reasoning: {logic}/50")
    if logic > 35:
        lines.append("  → Prove claims using numbered step-by-step logical deductions.")

    lines.append("")
    lines.extend(_formatting_rules())

    return "\n".join(lines)


def _formatting_rules() -> list[str]:
    """Strict output formatting rules injected into every system prompt."""
    return [
        "━━━ MANDATORY OUTPUT FORMAT RULES ━━━",
        "1. ALWAYS use Markdown: ## headings, **bold** key terms, `code` for identifiers.",
        "2. STRUCTURE every response: (a) brief intro/hook, (b) main content, (c) summary or next step.",
        "3. NO WALLS OF TEXT. Max 4 sentences per paragraph. Use bullet lists (–) for 3+ items.",
        "4. Code examples MUST be in fenced code blocks with the language tag (e.g. ```python).",
        "5. Use horizontal rules (---) to separate major sections for readability.",
        "6. DO NOT mention the learner's scores or profile explicitly — adapt silently.",
        "7. Keep your tone confident, precise, and encouraging — like a great professor.",
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Quiz instructions injected into every chat system prompt
# ─────────────────────────────────────────────────────────────────────────────

QUIZ_INSTRUCTIONS = """

━━━ ADAPTIVE QUIZ GENERATION PROTOCOL ━━━
When the learner has engaged with a topic and you judge them ready for assessment, generate a quiz.

RULES:
• Generate exactly 5 to 7 MCQ questions per quiz — never fewer.
• Distribute difficulty: ~2 easy (recall), ~2 medium (application), ~1-2 hard (analysis/synthesis).
• Each question must test a DISTINCT concept or sub-topic (no repeats).
• Include ONE question that tests visual/spatial reasoning if the topic allows.
• Include ONE question that tests step-by-step logic/calculation if the topic allows.

OUTPUT FORMAT — place the quiz at the END of your message, formatted exactly like this:

<quiz>
{
  "title": "Short descriptive quiz title",
  "questions": [
    {
      "question": "Full question text?",
      "topic": "Specific sub-topic being tested",
      "difficulty": "easy|medium|hard",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Clear explanation of why this answer is correct."
    }
  ]
}
</quiz>

DO NOT list the questions inline in your message. Put ALL quiz content inside <quiz> tags only.
"""


# ─────────────────────────────────────────────────────────────────────────────
# Archetype → legacy scores mapping
# ─────────────────────────────────────────────────────────────────────────────

def archetype_to_scores(archetype: str) -> dict:
    mapping = {
        "THE_PIONEER":             {"visual": 25, "structural": 25, "active": 25, "logic": 25},
        "THE_VISUAL_ARCHITECT":    {"visual": 45, "structural": 40, "active": 20, "logic": 20},
        "THE_DEEP_SCHOLAR":        {"visual": 15, "structural": 45, "active": 10, "logic": 45},
        "THE_STRATEGIC_SKIMMER":   {"visual": 20, "structural": 10, "active": 10, "logic": 20},
        "THE_LOGICAL_TINKERER":    {"visual": 10, "structural": 20, "active": 40, "logic": 50},
        "THE_ADAPTIVE_GENERALIST": {"visual": 30, "structural": 30, "active": 30, "logic": 30},
        # Aliases used by profile service
        "THE_VISUALIZER":  {"visual": 45, "structural": 25, "active": 20, "logic": 15},
        "THE_ARCHITECT":   {"visual": 20, "structural": 45, "active": 15, "logic": 35},
        "THE_SPRINTER":    {"visual": 20, "structural": 15, "active": 45, "logic": 20},
        "THE_DEBUGGER":    {"visual": 15, "structural": 20, "active": 20, "logic": 45},
    }
    return mapping.get(archetype, mapping["THE_PIONEER"])


# ─────────────────────────────────────────────────────────────────────────────
# Standalone response generation (used by content adaptation)
# ─────────────────────────────────────────────────────────────────────────────

async def generate_adapted_response(
    user_query: str,
    raw_scores: dict,
    chat_history: list | None = None,
) -> str:
    system_prompt = build_adaptive_system_prompt(raw_scores)
    messages: list[dict] = [{"role": "system", "content": system_prompt}]

    if chat_history:
        messages.extend(chat_history)

    messages.append({"role": "user", "content": user_query})

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Groq API Error: {e}")
        return "I'm experiencing neural interference right now. Please try again in a moment."


class AdaptationService:
    async def adapt_content(self, original_text: str, current_archetype: str) -> str:
        scores = archetype_to_scores(current_archetype)
        query = (
            "Please rewrite and adapt the following paragraph for me, "
            "based on your instructions:\n\n" + original_text
        )
        return await generate_adapted_response(user_query=query, raw_scores=scores)


adaptation_service = AdaptationService()
