class AdaptationService:
    @staticmethod
    def adapt_content(original_text: str, archetype: str) -> str:
        """
        Simulates AI content adaptation based on the user's archetype.
        In the future, this is where the Ollama/Local LLM generation happens.
        """
        if archetype == "THE_SPRINTER":
            # Just take the first sentence for a clean MVP summary
            first_sentence = original_text.split('.')[0] + "."
            return f"**Quick Summary:** {first_sentence}"
            
        elif archetype == "THE_VISUALIZER":
            return f"{original_text}\n\n*[System triggers diagram generation for this concept]*"
            
        elif archetype == "THE_ARCHITECT":
            return f"**Core Concept:** The structure relies on this principle.\n{original_text}"
            
        # Fallback for THE_DEBUGGER (Likes linear, unaltered reading)
        return original_text 

adaptation_service = AdaptationService()