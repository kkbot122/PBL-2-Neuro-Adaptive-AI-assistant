"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitCalibration } from "./actions";

export default function MissionPage() {
  const router = useRouter();
  
  // --- TELEMETRY STATE (The Spies) ---
  const [startTime, setStartTime] = useState<number>(0);
  const [clickedDiagram, setClickedDiagram] = useState(false);
  const [readSummaryFirst, setReadSummaryFirst] = useState(false);
  const [interactedWithQuiz, setInteractedWithQuiz] = useState(false);
  const [scrolledErratically, setScrolledErratically] = useState(false);
  
  // Ref to track scroll directions
  const scrollCount = useRef(0);
  const lastScrollY = useRef(0);

  // --- UI STATE ---
  const [showSummary, setShowSummary] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Start the timer when the page loads
  useEffect(() => {
    setStartTime(Date.now());

    // 2. Scroll Tracking Logic (Simple erratic scroll detection)
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // If they are bouncing up and down a lot
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

  // --- EVENT HANDLERS ---
  const handleSummaryClick = () => {
    if (Date.now() - startTime < 10000) {
      // If they clicked summary within the first 10 seconds!
      setReadSummaryFirst(true);
    }
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

  // --- SUBMIT THE TEST ---
  const finishMission = async () => {
    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds

    const payload = {
      clicked_diagram: clickedDiagram,
      read_summary_first: readSummaryFirst,
      time_spent_on_text: timeSpent,
      interacted_with_quiz: interactedWithQuiz,
      scrolled_erratically: scrolledErratically,
    };

    console.log("Submitting Telemetry:", payload);

    const result = await submitCalibration(payload);
    
    if (result.success) {
      alert(`Calibration Complete! You are: ${result.archetype}`);
      // Redirect to the main dashboard
      router.push("/dashboard"); 
    } else {
      alert("Something went wrong saving your profile.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-2">Mission: Understanding Black Holes</h1>
      <p className="text-gray-500 mb-8">Read the text below to complete your onboarding.</p>

      {/* The Summary Tool (Architects love this) */}
      <div className="mb-6">
        <button 
          onClick={handleSummaryClick}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200 transition"
        >
          {showSummary ? "Hide Summary" : "View Quick Summary"}
        </button>
        {showSummary && (
          <div className="mt-4 p-4 bg-gray-50 border-l-4 border-blue-500 rounded text-gray-700">
            <strong>TL;DR:</strong> Black holes are regions of space where gravity is so strong that nothing, not even light, can escape. They form when massive stars collapse at the end of their life cycle.
          </div>
        )}
      </div>

      {/* The Text (Debuggers will read this linearly) */}
      <div className="prose prose-lg text-gray-800 mb-8 space-y-6 leading-relaxed">
        <p>
          A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole.
        </p>
        <p>
          The boundary of no escape is called the event horizon. Although it has a massive effect on the fate and circumstances of an object crossing it, it has no locally detectable features according to general relativity. In many ways, a black hole acts like an ideal black body, as it reflects no light.
        </p>
      </div>

      {/* The Diagram Tool (Visualizers flock to this) */}
      <div className="mb-8">
        <button 
          onClick={handleDiagramClick}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md font-medium hover:bg-purple-200 transition"
        >
          {showDiagram ? "Hide Diagram" : "View Diagram"}
        </button>
        {showDiagram && (
          <div className="mt-4 p-8 bg-gray-200 rounded flex items-center justify-center h-48 border-2 border-dashed border-gray-400">
            <span className="text-gray-500 font-mono">[Imagine a beautiful diagram of an Event Horizon here]</span>
          </div>
        )}
      </div>

      {/* The Interactive Tool (Tinkerers love this) */}
      <div className="mb-12">
        <button 
          onClick={handleQuizClick}
          className="bg-green-100 text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-200 transition"
        >
          Test your knowledge (Quiz)
        </button>
      </div>

      <hr className="mb-8" />

      {/* The Finish Line */}
      <div className="flex justify-end">
        <button 
          onClick={finishMission}
          disabled={isSubmitting}
          className="bg-black text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Analyzing..." : "Finish Mission"}
        </button>
      </div>
    </div>
  );
}