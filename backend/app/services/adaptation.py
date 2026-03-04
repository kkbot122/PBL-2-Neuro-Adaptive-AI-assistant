from app.core.archetypes import get_archetype_instruction

class AdaptationService:
    @staticmethod
    def adapt_content(original_text: str, archetype: str) -> str:
        """
        Simulates AI content adaptation based on the user's archetype.
        In the future, this is where the Gemini/OpenAI API call happens.
        """
        
        if archetype == "THE_STRATEGIC_SKIMMER":
            return f"**TL;DR:** {original_text[:100]}... \n\n* Key Point 1\n* Key Point 2"
        
        elif archetype == "THE_VISUAL_ARCHITECT":
            return f"{original_text[:150]}... \n\n| Concept | Relation |\n| :--- | :--- |\n| Qubit | Superposition |"
        
        elif archetype == "THE_DEEP_SCHOLAR":
            return f"Exhaustive Analysis: {original_text}. Furthermore, considering the historical context of the 1920s Copenhagen interpretation..."
        
        elif archetype == "THE_LOGICAL_TINKERER":
            return f"Logic Flow: \n1. Start: {original_text[:50]}\n2. Process: IF input THEN {original_text[50:100]}"
            
        # Fallback for Pioneer or Generalist
        return original_text

adaptation_service = AdaptationService()