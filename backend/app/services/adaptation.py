"""
Neuro-Adaptive Learning Engine
================================
Continuous vector-driven personalization. No archetypes. No labels.
No hardcoded if/else trees for personalization logic.
"""

import math
import os
from typing import NamedTuple
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY"),
)

# FIX THIS FUNCTION ONLY (replace your broken build_tool_instruction)

def build_tool_instruction(vectors: dict | None = None) -> str:
    v = vectors or {}

    reception     = float(v.get("reception", 0.0))
    processing    = float(v.get("processing", 0.0))
    understanding = float(v.get("understanding", 0.0))
    perception    = float(v.get("perception", 0.0))

    mandates: list[str] = []

    if reception < -0.3:
        mandates.append(
            '"visual_aid": REQUIRED — MUST be valid Mermaid. STRICT FORMAT:\n'
            '- MUST start with: graph TD;\n'
            '- MUST use: A["Text"] --> B["Text"]\n'
            '- NO plain text nodes\n'
            '- NO invalid syntax\n'
            '- Example:\n'
            'graph TD; A["Input"] --> B["Process"]; B --> C["Output"];'
        )
    else:
        mandates.append('"visual_aid": null.')

    if processing < -0.3:
        mandates.append('"interactive_check": REQUIRED.')
    else:
        mandates.append('"interactive_check": null.')

    if understanding < -0.3:
        mandates.append('"step_tracker": REQUIRED.')
    else:
        mandates.append('"step_tracker": null.')

    if understanding > 0.3:
        mandates.append('"concept_map": REQUIRED.')
    else:
        mandates.append('"concept_map": null.')

    if perception < -0.3:
        mandates.append('"concrete_example": REQUIRED.')
    else:
        mandates.append('"concrete_example": null.')

    mandate_block = "\n".join(f"- {m}" for m in mandates)

    return f"""
You MUST output strict JSON:

{{
  "dialogue": "Markdown explanation",
  "visual_aid": {{"type": "mermaid", "code": "graph TD; A[\\"Text\\"] --> B[\\"Text\\"]"}} | null,
  "interactive_check": {{"title": "...", "questions": []}} | null,
  "step_tracker": {{"steps": []}} | null,
  "concept_map": {{"central": "...", "connections": []}} | null,
  "concrete_example": {{"scenario": "...", "breakdown": "..."}} | null
}}

Requirements:
{mandate_block}

Rules:
- RETURN ONLY JSON
- NO markdown blocks
- Mermaid MUST be valid
- dialogue is required
"""

def _norm(v: float) -> float:
    return (max(0.0, min(100.0, v)) / 50.0) - 1.0

def _soft(x: float, k: float = 2.0) -> float:
    return math.tanh(k * x)

def normalize_profile(raw: dict) -> dict:
    return {
        dim: _soft(_norm(raw.get(dim, 50.0)))
        for dim in ("visual", "structural", "active", "logic")
    }

GATE_THRESHOLD = 0.25 

class Directive(NamedTuple):
    text: str
    weights: dict

RAW_DIRECTIVES: list[Directive] = [
    Directive("ASCII diagrams, comparison tables, spatial analogies.", {"visual": +1.0}),
    Directive("Dense precise text; skip decorative visuals.", {"visual": -1.0}),
    Directive("Open with executive overview, then drill into detail.", {"structural": +1.0}),
    Directive("Lead with specifics; no preamble or broad intro.", {"structural": -1.0}),
    Directive("Number every reasoning step; include formulas and code.", {"logic": +1.0, "structural": +0.3}),
    Directive("End with a hands-on task or Socratic question.", {"active": +1.0}),
    Directive("Worked examples with intermediate steps shown.", {"active": +0.6, "logic": +0.4}),
    Directive("Real-world analogies and concrete connections.", {"visual": +0.4, "structural": +0.4}),
]

FSLSM_DIRECTIVES: list[Directive] = [
    Directive("Provide theoretical depth, multiple perspectives, and reflective summaries.", {"processing": +1.0}),
    Directive("Skip lengthy theory, jump straight into hands-on exercises.", {"processing": -1.0}),
    Directive("Ground explanations in real data, established facts, and concrete procedures.", {"perception": -1.0}),
    Directive("Highlight underlying patterns, relationships, and the conceptual 'why'.", {"perception": +1.0}),
    Directive("Use spatial layouts and mappings to explain.", {"reception": -1.0}),
    Directive("Focus on rich, annotated written explanations.", {"reception": +1.0}),
    Directive("Follow strict linear steps, mastering each before the next.", {"understanding": -1.0}),
    Directive("Show how all pieces connect to the whole before details.", {"understanding": +1.0}),
]

def _directive_score(d: Directive, profile: dict) -> float:
    return sum(profile.get(dim, 0.0) * w for dim, w in d.weights.items())

def select_directives(profile: dict, library: list[Directive], max_n: int = 3) -> list[str]:
    scored = sorted([(d, _directive_score(d, profile)) for d in library], key=lambda x: x[1], reverse=True)
    active = [d.text for d, score in scored if score > GATE_THRESHOLD]
    if not active:
        return ["Balance structure with depth; mix text with clarity."]
    return active[:max_n]

_FORMAT_RULES = "Rules: ## headings, **bold** terms, `code` literals. Structure: hook→content. Tone: precise, encouraging."

def generate_system_prompt(raw_scores: dict) -> str:
    profile = normalize_profile(raw_scores)
    directives = select_directives(profile, RAW_DIRECTIVES)
    style = " ".join(directives)
    return f"You are a Neuro-Adaptive Learning Assistant.\nLearner style: {style}\n{_FORMAT_RULES}"

def build_fslsm_system_prompt(vectors: dict) -> str:
    profile = {dim: _soft(float(v), k=1.5) for dim, v in vectors.items()}
    directives = select_directives(profile, FSLSM_DIRECTIVES)
    style = " ".join(directives)
    return f"You are a Neuro-Adaptive Learning Assistant.\nLearner style: {style}\n{_FORMAT_RULES}"

def build_adaptive_system_prompt(raw_scores: dict) -> str:
    return generate_system_prompt(raw_scores)

_PROMPT_SIGNALS: list[tuple[list[str], str]] = [
    (["diagram", "chart", "draw", "visualize", "picture", "graph"], "requested_diagram"),
    (["show me", "example", "demonstrate", "illustrate"],           "requested_example"),
    (["summary", "summarize", "tldr", "overview", "brief"],        "requested_summary"),
    (["step by step", "step-by-step", "walkthrough", "how to"],    "requested_steps"),
    (["why", "reason", "purpose", "what's the point"],             "prompt_why"),
    (["big picture", "overall", "in general", "at a high level"], "prompt_big_picture"),
]

BEHAVIORAL_SIGNAL_DELTAS: dict[str, dict[str, float]] = {
    "requested_diagram":   {"visual": +5},
    "requested_example":   {"active": +4, "logic": +3},
    "requested_summary":   {"structural": +5},
    "requested_steps":     {"logic": +5},
    "prompt_why":          {"structural": +3, "logic": +2},
    "prompt_big_picture":  {"structural": +4},
    "prefer_visual":       {"visual": +4},
    "prefer_text":         {"visual": -4},
    "prefer_overview":     {"structural": +4},
    "prefer_details":      {"structural": -4},
}

def infer_signals_from_prompt(prompt: str) -> list[str]:
    p = prompt.lower()
    return [signal for keywords, signal in _PROMPT_SIGNALS if any(k in p for k in keywords)]

def apply_signals_to_scores(scores: dict, signals: list[str]) -> dict:
    updated = dict(scores)
    for sig in signals:
        for dim, delta in BEHAVIORAL_SIGNAL_DELTAS.get(sig, {}).items():
            updated[dim] = max(0.0, min(100.0, updated.get(dim, 50.0) + delta))
    return updated

def archetype_to_scores(archetype: str) -> dict:
    _map = {
        "THE_PIONEER":             {"visual": 50, "structural": 50, "active": 50, "logic": 50},
        "THE_VISUAL_ARCHITECT":    {"visual": 90, "structural": 80, "active": 40, "logic": 40},
        "THE_DEEP_SCHOLAR":        {"visual": 30, "structural": 90, "active": 20, "logic": 90},
        "THE_SPRINTER":            {"visual": 40, "structural": 30, "active": 90, "logic": 40},
    }
    return _map.get(archetype, _map["THE_PIONEER"])

# ─── 9. STANDALONE ASYNC GENERATION (legacy compat) ─────────────────────────

async def generate_adapted_response(
    user_query: str,
    raw_scores: dict,
    chat_history: list | None = None,
) -> str:
    system_prompt = generate_system_prompt(raw_scores)
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
        return "I'm experiencing neural interference right now. Please try again."

class AdaptationService:
    async def adapt_content(self, original_text: str, raw_scores: dict) -> str:
        query = "Adapt the following text for me:\n\n" + original_text
        return await generate_adapted_response(user_query=query, raw_scores=raw_scores)

adaptation_service = AdaptationService()