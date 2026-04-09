import os
from openai import AsyncOpenAI

# Point the OpenAI client to Groq's API and use the Groq Key
client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

def build_adaptive_system_prompt(raw_scores: dict) -> str:
    # [Keep the exact same build_adaptive_system_prompt code from my previous message]
    visual = raw_scores.get("visual", 0)
    structural = raw_scores.get("structural", 0)
    active = raw_scores.get("active", 0)
    logic = raw_scores.get("logic", 0)

    prompt = [
        "You are a Neuro-Adaptive Learning Assistant. Your primary directive is to format and explain "
        "concepts specifically tailored to the user's cognitive profile.",
        "\n### USER COGNITIVE PROFILE (Scores out of 50) ###"
    ]

    prompt.append(f"- Visual Affinity: {visual}/50")
    if visual > 35: prompt.append("  -> INSTRUCTION: Rely heavily on visual analogies and spatial metaphors.")
    elif visual < 15: prompt.append("  -> INSTRUCTION: Avoid fluffy analogies. Stick to direct text.")

    prompt.append(f"- Structural Overviews: {structural}/50")
    if structural > 35: prompt.append("  -> INSTRUCTION: ALWAYS start with a 'Big Picture' summary.")
    elif structural < 15: prompt.append("  -> INSTRUCTION: The user prefers 'TL;DR'. Get straight to the point.")

    prompt.append(f"- Active Engagement: {active}/50")
    if active > 35: prompt.append("  -> INSTRUCTION: End your explanation with a Socratic question.")
    
    prompt.append(f"- Logical Reasoning: {logic}/50")
    if logic > 35: prompt.append("  -> INSTRUCTION: Prove your claims using step-by-step deductions.")

    prompt.append("\n### STRICT GUARDRAILS ###")
    prompt.append("- Do NOT explicitly mention the user's scores. Just adapt naturally.")
    prompt.append("- Format clearly using markdown.")

    return "\n".join(prompt)

async def generate_adapted_response(user_query: str, raw_scores: dict, chat_history: list = None) -> str:
    """
    Generates the system prompt, appends history, and calls the Groq LLM.
    """
    system_prompt = build_adaptive_system_prompt(raw_scores)
    
    messages = [{"role": "system", "content": system_prompt}]
    
    if chat_history:
        messages.extend(chat_history)
        
    messages.append({"role": "user", "content": user_query})
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Using Meta's Llama 3 70B model via Groq
            messages=messages,
            temperature=0.7, 
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Groq API Error: {e}")
        return "I'm currently experiencing neural interference. Please try again in a moment."

def archetype_to_scores(archetype: str) -> dict:
    # Maps archetypes to estimated raw cognitive scores (out of 50)
    mapping = {
        "THE_PIONEER": {"visual": 25, "structural": 25, "active": 25, "logic": 25},
        "THE_VISUAL_ARCHITECT": {"visual": 45, "structural": 40, "active": 20, "logic": 20},
        "THE_DEEP_SCHOLAR": {"visual": 15, "structural": 45, "active": 10, "logic": 45},
        "THE_STRATEGIC_SKIMMER": {"visual": 20, "structural": 10, "active": 10, "logic": 20},
        "THE_LOGICAL_TINKERER": {"visual": 10, "structural": 20, "active": 40, "logic": 50},
        "THE_ADAPTIVE_GENERALIST": {"visual": 30, "structural": 30, "active": 30, "logic": 30},
    }
    return mapping.get(archetype, mapping["THE_PIONEER"])

class AdaptationService:
    async def adapt_content(self, original_text: str, current_archetype: str) -> str:
        # 1. Translate archetype into cognitive scores
        scores = archetype_to_scores(current_archetype)
        
        # 2. Tell the LLM specifically to adapt THIS paragraph
        query = f"Please rewrite and adapt the following paragraph specifically for me, based on your instructions:\n\n{original_text}"
        
        # 3. Call Groq
        adapted_text = await generate_adapted_response(user_query=query, raw_scores=scores)
        return adapted_text

adaptation_service = AdaptationService()