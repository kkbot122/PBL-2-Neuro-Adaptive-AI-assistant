"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitCalibration } from "./actions";

export default function MissionPage() {
  const router = useRouter();
  
  const startTime = useRef<number>(0);
  const scrollCount = useRef(0);
  const lastScrollY = useRef(0);

  const [clickedDiagram, setClickedDiagram] = useState(false);
  const [readSummaryFirst, setReadSummaryFirst] = useState(false);
  const [interactedWithQuiz, setInteractedWithQuiz] = useState(false);
  const [scrolledErratically, setScrolledErratically] = useState(false);
  
  const [showSummary, setShowSummary] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    startTime.current = Date.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > 50) {
        scrollCount.current += 1;
      }
      lastScrollY.current = currentScrollY;
      if (scrollCount.current > 15) {
        setScrolledErratically(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSummaryClick = () => {
    const timeElapsed = Date.now() - startTime.current;
    if (timeElapsed < 10000) setReadSummaryFirst(true);
    setShowSummary(!showSummary);
  };

  const handleDiagramClick = () => {
    setClickedDiagram(true);
    setShowDiagram(!showDiagram);
  };

  const handleQuizClick = () => {
    setInteractedWithQuiz(true);
    alert("In a real app, a quiz modal would pop up here!");
  };

  const finishMission = async () => {
    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);

    const payload = {
      clicked_diagram: clickedDiagram,
      read_summary_first: readSummaryFirst,
      time_spent_on_text: timeSpent,
      interacted_with_quiz: interactedWithQuiz,
      scrolled_erratically: scrolledErratically,
    };

    const result = await submitCalibration(payload);
    if (result.success) {
      router.push("/dashboard"); 
    } else {
      alert("Something went wrong saving your profile.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="inline-block bg-[#FF9F1C] border-2 border-black px-3 py-1 text-sm font-bold mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            🚀 Calibration Test
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Mission: Understanding Black Holes
          </h1>
          <p className="text-xl font-medium text-gray-700">Read the text below to complete your onboarding.</p>
        </div>

        {/* The Summary Tool */}
        <div className="mb-8">
          <button 
            onClick={handleSummaryClick}
            className="bg-[#CBF3F0] text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
          >
            {showSummary ? "HIDE SUMMARY" : "VIEW QUICK SUMMARY"}
          </button>
          {showSummary && (
            <div className="mt-6 p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-lg font-medium">
              <span className="bg-[#FF9F1C] text-black border border-black px-2 py-0.5 text-sm font-bold mr-2">TL;DR</span>
              Black holes are regions of space where gravity is so strong that nothing, not even light, can escape. They form when massive stars collapse at the end of their life cycle.
            </div>
          )}
        </div>

        {/* The Text Box */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 mb-10 text-lg leading-relaxed font-medium">
          <p className="mb-6">
            A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole.
          </p>
          <p>
            The boundary of no escape is called the event horizon. Although it has a massive effect on the fate and circumstances of an object crossing it, it has no locally detectable features according to general relativity. In many ways, a black hole acts like an ideal black body, as it reflects no light.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* The Diagram Tool */}
          <div>
            <button 
              onClick={handleDiagramClick}
              className="w-full bg-[#FFD6A5] text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
            >
              {showDiagram ? "HIDE DIAGRAM" : "VIEW DIAGRAM"}
            </button>
            {showDiagram && (
              <div className="mt-4 p-8 bg-gray-100 flex items-center justify-center h-40 border-2 border-dashed border-black">
                <span className="text-black font-bold text-center">[Imagine Event Horizon Diagram]</span>
              </div>
            )}
          </div>

          {/* The Interactive Tool */}
          <div>
            <button 
              onClick={handleQuizClick}
              className="w-full bg-[#FF6B6B] text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
            >
              TEST KNOWLEDGE (QUIZ)
            </button>
          </div>
        </div>

        {/* The Finish Line */}
        <div className="border-t-4 border-black pt-10 flex justify-end">
          <button 
            onClick={finishMission}
            disabled={isSubmitting}
            className="bg-black text-white border-2 border-black px-10 py-4 font-bold text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "ANALYZING..." : "FINISH MISSION →"}
          </button>
        </div>
      </div>
    </div>
  );
}