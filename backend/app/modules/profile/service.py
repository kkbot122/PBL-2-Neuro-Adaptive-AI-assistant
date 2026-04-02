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

    # ==========================================
    # 1. VISUALIZER SIGNALS
    # ==========================================
    if tel.clicked_diagram:
        scores["visual"] += 10.0
    
    # Add points based on time spent on diagram (cap at 20 pts)
    scores["visual"] += min(tel.time_spent_on_visuals, 20.0)
    
    # CLAUDE'S FIX: Only reward the visual question if they actually looked at the diagram!
    if quiz.q3.is_correct and tel.clicked_diagram: 
        scores["visual"] += 15.0

    # ==========================================
    # 2. ARCHITECT (Structural) SIGNALS 
    # ==========================================
    if tel.read_summary_first:
        scores["structural"] += 15.0
        
    scores["structural"] += min(tel.time_spent_on_summary, 20.0)
    
    # Boost if they nailed the summary/concept question
    if quiz.q2.is_correct: 
        scores["structural"] += 15.0

    # ==========================================
    # 3. SPRINTER (Active) SIGNALS 
    # ==========================================
    if tel.scrolled_erratically:
        scores["active"] += 15.0
        
    # High Reading Speed (WPM) strongly indicates a Sprinter
    if tel.reading_speed_wpm > 250:
        scores["active"] += 15.0
        
    # If they skimmed fast but still scored well, they are efficient pattern-matchers
    if tel.time_spent_on_text < 20 and quiz.total_score >= 2:
        scores["active"] += 15.0
        
    # NEW: Fast Time-to-Answer indicates gut-instinct / quick action
    if 0 < quiz.q1.time_to_answer_ms < 4000: # Answered under 4 seconds
        scores["active"] += 5.0

    # ==========================================
    # 4. DEBUGGER (Logic/Detail) SIGNALS 
    # ==========================================
    scores["logic"] += min(tel.time_spent_on_text, 20.0)
    
    # Methodical reading (no erratic scrolling or skipping to the end)
    if not tel.scrolled_erratically and not tel.read_summary_first:
        scores["logic"] += 10.0
        
    if quiz.q1.is_correct: 
        scores["logic"] += 15.0
        
    # NEW: Hesitation Tracking. Changing answers implies deep, critical second-guessing
    if quiz.q1.changed_answer or quiz.q2.changed_answer or quiz.q3.changed_answer:
        scores["logic"] += 10.0

    # ==========================================
    # FINAL CALCULATION
    # ==========================================
    # Cap all scores at 50 max for the UI Radar Chart to look clean
    for key in scores:
        scores[key] = min(scores[key], 50.0)

    # Determine Winner
    winner = max(scores, key=scores.get)

    archetype_map = {
        "visual": ARCHETYPES["VISUALIZER"],
        "structural": ARCHETYPES["ARCHITECT"],
        "active": ARCHETYPES["SPRINTER"],
        "logic": ARCHETYPES["DEBUGGER"]
    }
    
    archetype = archetype_map.get(winner, ARCHETYPES["DEBUGGER"])

    return {
        "primary_archetype": archetype,
        "raw_scores": scores
    }