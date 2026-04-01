"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitCalibration, overrideUserArchetype } from "./actions";
import { useTrackVisibility } from "../../../hooks/useTrackVisibility";
import { Brain, Zap, Target, Eye } from "lucide-react"; // Added some icons for the intro!

// Dictionary to map backend keys to user-friendly UI details
const ARCHETYPE_DETAILS: Record<string, { title: string, desc: string, color: string }> = {
  "THE_VISUALIZER": {
    title: "The Visualizer",
    desc: "You learn best through images, spatial maps, and visual metaphors. You remember diagrams better than paragraphs.",
    color: "bg-[#FFD6A5]"
  },
  "THE_ARCHITECT": {
    title: "The Architect",
    desc: "You need the big picture first. You learn top-down, grasping the overarching concepts before diving into the details.",
    color: "bg-[#CBF3F0]"
  },
  "THE_SPRINTER": {
    title: "The Sprinter",
    desc: "You learn by doing. You prefer quick interactions, trial-and-error, and fast feedback over long reading sessions.",
    color: "bg-[#FF6B6B]"
  },
  "THE_DEBUGGER": {
    title: "The Debugger",
    desc: "You are highly logical and methodical. You need step-by-step details and prefer to understand the 'why' under the hood.",
    color: "bg-[#9BF6FF]"
  }
};

export default function MissionPage() {
  const router = useRouter();
  
  // Phase State: "intro" -> "read" -> "quiz" -> "reveal"
  const [phase, setPhase] = useState<"intro" | "read" | "quiz" | "reveal">("intro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedArchetype, setAssignedArchetype] = useState<string | null>(null);
  const [showOverrideOptions, setShowOverrideOptions] = useState(false);

  // Telemetry Trackers
  const textTracker = useTrackVisibility(0.5);
  const diagramTracker = useTrackVisibility(0.5);
  const summaryTracker = useTrackVisibility(0.5);
  const startTime = useRef<number>(0);
  const scrollCount = useRef(0);
  const lastScrollY = useRef(0);

  // User Interaction State
  const [clickedDiagram, setClickedDiagram] = useState(false);
  const [readSummaryFirst, setReadSummaryFirst] = useState(false);
  const [scrolledErratically, setScrolledErratically] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });

  useEffect(() => {
    const handleScroll = () => {
      // Only track erratic scrolling during the reading phase
      if (phase !== "read") return;

      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > 50) scrollCount.current += 1;
      lastScrollY.current = currentScrollY;
      if (scrollCount.current > 15) setScrolledErratically(true);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  // --- TRANSITION HANDLERS ---
  
  const startMission = () => {
    // RESET AND START TIMERS ONLY WHEN THEY LEAVE THE INTRO!
    startTime.current = Date.now();
    scrollCount.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPhase("read");
  };

  const startQuiz = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPhase("quiz");
  };

  // --- INTERACTION HANDLERS ---

  const handleSummaryClick = () => {
    if (Date.now() - startTime.current < 10000 && !showSummary) setReadSummaryFirst(true);
    setShowSummary(!showSummary);
  };

  const handleDiagramClick = () => {
    setClickedDiagram(true);
    setShowDiagram(!showDiagram);
  };

  const finishMission = async () => {
    setIsSubmitting(true);
    let score = 0;
    if (answers.q1 === "event_horizon") score++;
    if (answers.q2 === "gravity") score++;
    if (answers.q3 === "sphere") score++;

    const payload = {
      telemetry: {
        clicked_diagram: clickedDiagram,
        read_summary_first: readSummaryFirst,
        time_spent_on_text: textTracker.secondsViewed,
        time_spent_on_visuals: diagramTracker.secondsViewed,
        time_spent_on_summary: summaryTracker.secondsViewed,
        scrolled_erratically: scrolledErratically,
      },
      quiz_results: {
        score: score,
        q1_correct: answers.q1 === "event_horizon",
        q2_correct: answers.q2 === "gravity",
        q3_correct: answers.q3 === "sphere",
      }
    };

    const result = await submitCalibration(payload);
    
    if (result.success && result.archetype) {
      setAssignedArchetype(result.archetype);
      setPhase("reveal");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Something went wrong saving your profile.");
    }
    setIsSubmitting(false);
  };

  const handleConfirmArchetype = () => {
    router.push("/dashboard");
  };

  const handleOverride = async (newArchetype: string) => {
    setIsSubmitting(true);
    const result = await overrideUserArchetype(newArchetype);
    if (result.success) {
      router.push("/dashboard");
    } else {
      alert("Failed to update archetype.");
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RENDER: PHASE 1 - THE INTRO EXPLANATION
  // ==========================================
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] py-12 px-6 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          
          <div className="mb-10 text-center">
            <div className="inline-block bg-[#CBF3F0] border-2 border-black px-3 py-1 text-sm font-bold mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2">
              Welcome to NeuroLearn
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Before we begin, we need to <span className="text-[#FF6B6B] underline decoration-wavy decoration-black">map your brain.</span>
            </h1>
            <p className="text-xl font-medium text-gray-700 max-w-2xl mx-auto">
              Everyone learns differently. Instead of asking you how you learn, we prefer to see it in action. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-[#FF9F1C] border-2 border-black flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. The Sandbox</h3>
              <p className="text-gray-600 font-medium">We'll give you a 2-minute micro-lesson on a complex topic. Read it however feels natural to you.</p>
            </div>
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-[#9BF6FF] border-2 border-black flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. The Analysis</h3>
              <p className="text-gray-600 font-medium">Our AI tracks your interactions—what you click, what you skip, and where you focus your attention.</p>
            </div>
          </div>

          <div className="bg-[#FFD6A5] border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Ready to find your archetype?</h2>
              <p className="mb-6 font-medium">Don't overthink the material. Just read naturally.</p>
              <button 
                onClick={startMission}
                className="bg-black text-white border-2 border-black px-10 py-4 font-bold text-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all"
              >
                START CALIBRATION →
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: PHASE 4 - REVEAL 
  // ==========================================
  if (phase === "reveal" && assignedArchetype) {
    const profile = ARCHETYPE_DETAILS[assignedArchetype];
    
    return (
      <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] py-12 px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Calibration Complete!</h1>
            <p className="text-xl font-medium text-gray-700">Based on how you interacted with the material, we've identified your learning style.</p>
          </div>

          <div className={`${profile.color} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 mb-8 text-center`}>
            <div className="text-sm font-bold tracking-widest uppercase mb-2">Your Primary Archetype</div>
            <h2 className="text-5xl font-black mb-6">{profile.title}</h2>
            <p className="text-xl font-medium">{profile.desc}</p>
          </div>

          {!showOverrideOptions ? (
            <div className="flex flex-col gap-4">
              <button onClick={handleConfirmArchetype} className="w-full bg-black text-white border-4 border-black px-6 py-4 font-bold text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                YES, THIS SOUNDS LIKE ME →
              </button>
              <button onClick={() => setShowOverrideOptions(true)} className="w-full bg-transparent text-black border-4 border-black px-6 py-4 font-bold text-lg hover:bg-[#E5E2DC] transition-all">
                Actually, let me choose manually
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-bold mb-4">Choose the style that fits you best:</h3>
              {Object.entries(ARCHETYPE_DETAILS).map(([key, data]) => (
                <button 
                  key={key}
                  onClick={() => handleOverride(key)}
                  disabled={isSubmitting}
                  className={`w-full text-left p-4 border-4 border-black ${data.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between disabled:opacity-50`}
                >
                  <div>
                    <div className="font-bold text-xl">{data.title}</div>
                    <div className="text-sm font-medium mt-1">{data.desc}</div>
                  </div>
                  {key === assignedArchetype && <span className="bg-black text-white text-xs px-2 py-1 font-bold ml-4">AI SUGGESTION</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: PHASES 2 & 3 - READ & QUIZ 
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="inline-block bg-[#FF9F1C] border-2 border-black px-3 py-1 text-sm font-bold mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            🚀 Calibration Test
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {phase === "quiz" ? "Mission Assessment" : "Mission: Understanding Black Holes"}
          </h1>
          <p className="text-xl font-medium text-gray-700">
            {phase === "quiz" ? "Let's see what you retained from the material." : "Read the text below naturally. Don't rush, just learn."}
          </p>
        </div>

        {phase === "read" && (
          <div className="space-y-8">
            {/* The Summary Tool */}
            <div>
              <button onClick={handleSummaryClick} className="bg-[#CBF3F0] border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none">
                {showSummary ? "HIDE SUMMARY" : "VIEW QUICK SUMMARY"}
              </button>
              {showSummary && (
                <div ref={summaryTracker.elementRef} className="mt-6 p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-lg font-medium">
                  <span className="bg-[#FF9F1C] border border-black px-2 py-0.5 text-sm font-bold mr-2">TL;DR</span>
                  Black holes are regions of space where gravity is so strong that nothing, not even light, can escape. They form when massive stars collapse at the end of their life cycle.
                </div>
              )}
            </div>

            {/* The Text Box */}
            <div ref={textTracker.elementRef} className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 text-lg leading-relaxed font-medium">
              <p className="mb-6">A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole.</p>
              <p>The boundary of no escape is called the event horizon. Although it has a massive effect on the fate and circumstances of an object crossing it, it has no locally detectable features according to general relativity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <button onClick={handleDiagramClick} className="w-full bg-[#FFD6A5] border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5" />
                  {showDiagram ? "HIDE DIAGRAM" : "VIEW DIAGRAM"}
                </button>
                {showDiagram && (
                  <div ref={diagramTracker.elementRef} className="mt-4 p-8 bg-gray-100 flex items-center justify-center h-40 border-2 border-dashed border-black">
                    <span className="text-black font-bold text-center">[Imagine Event Horizon Diagram]</span>
                  </div>
                )}
              </div>
              <div>
                <button onClick={startQuiz} className="w-full bg-[#FF6B6B] border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none">
                  I'M READY. START QUIZ →
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "quiz" && (
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 space-y-8">
            <div>
              <label className="block font-bold text-lg mb-2">1. What is the boundary of no escape called?</label>
              <select className="w-full border-2 border-black p-4 bg-gray-50 font-medium" value={answers.q1} onChange={(e) => setAnswers({...answers, q1: e.target.value})}>
                <option value="">Select an answer...</option>
                <option value="singularity">The Singularity</option>
                <option value="event_horizon">The Event Horizon</option>
                <option value="accretion_disk">The Accretion Disk</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-lg mb-2">2. What primarily prevents light from escaping?</label>
              <select className="w-full border-2 border-black p-4 bg-gray-50 font-medium" value={answers.q2} onChange={(e) => setAnswers({...answers, q2: e.target.value})}>
                <option value="">Select an answer...</option>
                <option value="gravity">Extreme Gravity</option>
                <option value="dark_matter">Dark Matter</option>
                <option value="vacuum">The Vacuum of Space</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-lg mb-2">3. Based on the diagram, the event horizon is shaped most like a:</label>
              <select className="w-full border-2 border-black p-4 bg-gray-50 font-medium" value={answers.q3} onChange={(e) => setAnswers({...answers, q3: e.target.value})}>
                <option value="">Select an answer...</option>
                <option value="flat_disc">Flat Disc</option>
                <option value="sphere">Sphere / Bubble</option>
                <option value="funnel">Funnel</option>
              </select>
            </div>
            <div className="pt-8 border-t-4 border-black flex justify-end">
              <button 
                onClick={finishMission} 
                disabled={isSubmitting || !answers.q1 || !answers.q2 || !answers.q3} 
                className="bg-black text-white border-2 border-black px-10 py-4 font-bold text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? "ANALYZING..." : "REVEAL MY PROFILE →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}