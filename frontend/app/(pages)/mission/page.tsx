"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitCalibration, overrideUserArchetype } from "./actions";
import { useTrackVisibility } from "../../../hooks/useTrackVisibility";
import { calibrationMission } from "./data";
import { IntroPhase, ReadPhase, QuizPhase, RevealPhase } from "./components/MissionViews";

export default function MissionPage() {
  const router = useRouter();

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

  // --- NEW: Phase 2 Metrics Trackers ---
  const quizStartTime = useRef<number>(0);
  const [quizMetrics, setQuizMetrics] = useState<Record<string, { changed_count: number, time_to_answer_ms: number }>>({
    q1: { changed_count: 0, time_to_answer_ms: 0 },
    q2: { changed_count: 0, time_to_answer_ms: 0 },
    q3: { changed_count: 0, time_to_answer_ms: 0 },
  });

  const [clickedDiagram, setClickedDiagram] = useState(false);
  const [readSummaryFirst, setReadSummaryFirst] = useState(false);
  const [scrolledErratically, setScrolledErratically] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });

  useEffect(() => {
    const handleScroll = () => {
      if (phase !== "read") return;
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > 50) scrollCount.current += 1;
      lastScrollY.current = currentScrollY;
      if (scrollCount.current > 15) setScrolledErratically(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  const startMission = () => {
    startTime.current = Date.now();
    scrollCount.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPhase("read");
  };

  const startQuiz = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPhase("quiz");
    quizStartTime.current = Date.now(); // Start hesitation timer!
  };

  const handleSummaryClick = () => {
    if (Date.now() - startTime.current < 10000 && !showSummary) setReadSummaryFirst(true);
    setShowSummary(!showSummary);
  };

  const handleDiagramClick = () => {
    setClickedDiagram(true);
    setShowDiagram(!showDiagram);
  };

  // --- NEW: Handles Answers & Tracks Hesitation/Time ---
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (value !== "") {
      setQuizMetrics((prev) => {
        const timeTaken = Date.now() - quizStartTime.current;
        const currentMetric = prev[questionId];
        return {
          ...prev,
          [questionId]: {
            changed_count: currentMetric.changed_count + 1,
            time_to_answer_ms: timeTaken,
          },
        };
      });
    }
  };

  const finishMission = async () => {
    setIsSubmitting(true);
    let score = 0;
    const q1Correct = answers.q1 === calibrationMission.quiz.questions[0].correctValue;
    const q2Correct = answers.q2 === calibrationMission.quiz.questions[1].correctValue;
    const q3Correct = answers.q3 === calibrationMission.quiz.questions[2].correctValue;

    if (q1Correct) score++;
    if (q2Correct) score++;
    if (q3Correct) score++;

    // Calculate Reading Speed (WPM)
    const wordCount = calibrationMission.content.paragraphs.join(" ").split(" ").length;
    const readingSpeedWpm = textTracker.secondsViewed > 0 ? Math.round(wordCount / (textTracker.secondsViewed / 60)) : 0;

    const payload = {
      telemetry: {
        clicked_diagram: clickedDiagram,
        read_summary_first: readSummaryFirst,
        time_spent_on_text: textTracker.secondsViewed,
        time_spent_on_visuals: diagramTracker.secondsViewed,
        time_spent_on_summary: summaryTracker.secondsViewed,
        scrolled_erratically: scrolledErratically,
        reading_speed_wpm: readingSpeedWpm, // High-fidelity signal added!
      },
      quiz_results: {
        total_score: score,
        q1: { is_correct: q1Correct, time_to_answer_ms: quizMetrics.q1.time_to_answer_ms, changed_answer: quizMetrics.q1.changed_count > 1 },
        q2: { is_correct: q2Correct, time_to_answer_ms: quizMetrics.q2.time_to_answer_ms, changed_answer: quizMetrics.q2.changed_count > 1 },
        q3: { is_correct: q3Correct, time_to_answer_ms: quizMetrics.q3.time_to_answer_ms, changed_answer: quizMetrics.q3.changed_count > 1 },
      },
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

  const handleConfirmArchetype = () => router.push("/dashboard");

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

  // --- RENDER CONTROLLER ---
  if (phase === "intro") return <IntroPhase onStart={startMission} />;
  if (phase === "reveal" && assignedArchetype) return <RevealPhase assignedArchetype={assignedArchetype} showOverrideOptions={showOverrideOptions} setShowOverrideOptions={setShowOverrideOptions} handleConfirmArchetype={handleConfirmArchetype} handleOverride={handleOverride} isSubmitting={isSubmitting} />;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="inline-block bg-[#FF9F1C] border-2 border-black px-3 py-1 text-sm font-bold mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            {calibrationMission.tag}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {phase === "quiz" ? "Mission Assessment" : calibrationMission.title}
          </h1>
          <p className="text-xl font-medium text-gray-700">
            {phase === "quiz" ? "Let's see what you retained from the material." : calibrationMission.subtitle}
          </p>
        </div>

        {phase === "read" && (
          <ReadPhase
            showSummary={showSummary} showDiagram={showDiagram}
            handleSummaryClick={handleSummaryClick} handleDiagramClick={handleDiagramClick} startQuiz={startQuiz}
            textTrackerRef={textTracker.elementRef} summaryTrackerRef={summaryTracker.elementRef} diagramTrackerRef={diagramTracker.elementRef}
          />
        )}

        {phase === "quiz" && (
          <QuizPhase answers={answers} handleAnswerChange={handleAnswerChange} finishMission={finishMission} isSubmitting={isSubmitting} />
        )}
      </div>
    </div>
  );
}