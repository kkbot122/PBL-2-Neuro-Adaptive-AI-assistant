from app.modules.profile.schemas import CalibrationRequest

# Standardized Archetype Dictionary
ARCHETYPES = {
    "VISUALIZER": "THE_VISUALIZER",
    "ARCHITECT": "THE_ARCHITECT",
    "SPRINTER": "THE_SPRINTER",
    "DEBUGGER": "THE_DEBUGGER"
}

def calculate_profile(data: CalibrationRequest) -> dict:
    # Baseline scores for the Radar Chart
    scores = {
        "visual": 10.0,      
        "structural": 10.0,
        "active": 10.0,
        "logic": 10.0        
    }

    # 1. Visualizer Signals
    if data.clicked_diagram:
        scores["visual"] += 30.0
    
    # 2. Architect (Structural) Signals
    if data.read_summary_first:
        scores["structural"] += 30.0
    if data.time_spent_on_text < 30 and not data.scrolled_erratically:
        scores["structural"] += 15.0

    # 3. Sprinter (Active) Signals
    if data.interacted_with_quiz:
        scores["active"] += 25.0
    if data.scrolled_erratically:
        scores["active"] += 20.0

    # 4. Debugger (Logic) Signals
    if data.time_spent_on_text > 45 and not data.scrolled_erratically and not data.read_summary_first:
        scores["logic"] += 30.0

    # Cap all scores at 50 max for the UI Radar Chart
    for key in scores:
        scores[key] = min(scores[key], 50.0)

    # Determine Winner
    winner = max(scores, key=scores.get)

    archetype = ARCHETYPES["DEBUGGER"] # Default Fallback
    if winner == "visual":
        archetype = ARCHETYPES["VISUALIZER"]
    elif winner == "structural":
        archetype = ARCHETYPES["ARCHITECT"]
    elif winner == "active":
        archetype = ARCHETYPES["SPRINTER"]
    elif winner == "logic":
        archetype = ARCHETYPES["DEBUGGER"]

    return {
        "primary_archetype": archetype,
        "raw_scores": scores
    }