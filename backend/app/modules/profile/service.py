# app/modules/profile/service.py
from app.modules.profile.schemas import CalibrationRequest

# Standardized Archetype Dictionary
ARCHETYPES = {
    "VISUALIZER": "THE_VISUALIZER",
    "ARCHITECT": "THE_ARCHITECT",
    "SPRINTER": "THE_SPRINTER",
    "DEBUGGER": "THE_DEBUGGER"
}

def calculate_profile(data: CalibrationRequest) -> dict:
    tel = data.telemetry
    quiz = data.quiz_results

    # Baseline scores for the Radar Chart
    scores = {
        "visual": 10.0,      
        "structural": 10.0,
        "active": 10.0,
        "logic": 10.0        
    }

    # 1. Visualizer Signals
    if tel.clicked_diagram:
        scores["visual"] += 15.0
    # Add points based on time spent on diagram (cap at 20 pts)
    scores["visual"] += min(tel.time_spent_on_visuals, 20.0)
    # Huge boost if they got the visual spatial question right
    if quiz.q3_correct: 
        scores["visual"] += 15.0

    # 2. Architect (Structural) Signals - They like high-level concepts
    if tel.read_summary_first:
        scores["structural"] += 15.0
    scores["structural"] += min(tel.time_spent_on_summary, 20.0)
    # Boost if they nailed the summary/concept question
    if quiz.q2_correct: 
        scores["structural"] += 15.0

    # 3. Sprinter (Active) Signals - Fast, hands-on, impatient
    if tel.scrolled_erratically:
        scores["active"] += 20.0
    # If they skimmed fast but still scored well, they are efficient Sprinters
    if tel.time_spent_on_text < 20 and quiz.score >= 2:
        scores["active"] += 20.0
    # High clicking behavior
    if tel.clicked_diagram and tel.read_summary_first:
        scores["active"] += 10.0

    # 4. Debugger (Logic/Detail) Signals - Methodical, deep readers
    scores["logic"] += min(tel.time_spent_on_text, 20.0)
    if not tel.scrolled_erratically and not tel.read_summary_first:
        scores["logic"] += 10.0
    # Boost if they got the rote text detail question right
    if quiz.q1_correct: 
        scores["logic"] += 15.0

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