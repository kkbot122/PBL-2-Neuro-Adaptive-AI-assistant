// frontend/app/(pages)/mission/data.ts

export const calibrationMission = {
  id: "mission_fermi_01",
  tag: "🚀 Calibration Test",
  title: "Mission: The Fermi Paradox",
  subtitle: "Read the text below naturally. Don't rush, just learn.",
  summary: {
    label: "TL;DR",
    text: "The Fermi Paradox is the unsettling contradiction between the extremely high mathematical probability of alien life existing, and the absolute lack of any evidence that it actually does."
  },
  content: {
    paragraphs: [
      "The observable universe is unimaginably vast, containing roughly two trillion galaxies, each teeming with billions of stars. Statistically, even if a tiny fraction of these stars have planets in the habitable zone, there should be millions of advanced civilizations out there.",
      "Yet, despite decades of scanning the cosmos with radio telescopes and sending probes into the void, humanity has found absolutely zero definitive proof of extraterrestrial intelligence. The sky is completely silent. This glaring contradiction between high probability and zero evidence was famously summarized by physicist Enrico Fermi when he asked: 'Where is everybody?'",
    ],
  },
  visual: {
    // We are linking this to the Astronaut.svg in your /public folder!
    src: "/Astronaut.svg", 
    alt: "Astronaut floating in empty space",
    caption: "[Diagram: The Vast Emptiness of the Observable Universe]"
  },
  quiz: {
    questions: [
      {
        id: "q1",
        type: "text_detail", // Tests The Debugger (Logic)
        label: "1. According to the text, how many galaxies are estimated to be in the observable universe?",
        options: [
          { value: "millions", text: "Millions" },
          { value: "two_trillion", text: "Two Trillion" },
          { value: "infinite", text: "Infinite" }
        ],
        correctValue: "two_trillion"
      },
      {
        id: "q2",
        type: "summary_concept", // Tests The Architect (Structure)
        label: "2. The core concept of the Fermi Paradox is the contradiction between:",
        options: [
          { value: "gravity", text: "Gravity and Quantum Mechanics" },
          { value: "probability_vs_evidence", text: "High probability of life vs. Zero evidence" },
          { value: "stars_vs_planets", text: "The number of stars vs. the number of planets" }
        ],
        correctValue: "probability_vs_evidence"
      },
      {
        id: "q3",
        type: "visual_spatial", // Tests The Visualizer
        label: "3. Based on the visual diagram, what feeling is most conveyed?",
        options: [
          { value: "crowded", text: "A crowded, bustling universe" },
          { value: "isolation", text: "Vast emptiness and isolation" },
          { value: "danger", text: "Immediate danger from aliens" }
        ],
        correctValue: "isolation"
      }
    ]
  }
};