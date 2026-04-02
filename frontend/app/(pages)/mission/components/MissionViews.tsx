import { Brain, Zap, Target, Eye } from "lucide-react";
import Image from "next/image";
import { calibrationMission } from "../data";

export const ARCHETYPE_DETAILS: Record<string, { title: string; desc: string; color: string }> = {
  THE_VISUALIZER: { title: "The Visualizer", desc: "You learn best through images, spatial maps, and visual metaphors.", color: "bg-[#FFD6A5]" },
  THE_ARCHITECT: { title: "The Architect", desc: "You need the big picture first. You learn top-down.", color: "bg-[#CBF3F0]" },
  THE_SPRINTER: { title: "The Sprinter", desc: "You learn by doing. You prefer quick interactions over long reading.", color: "bg-[#FF6B6B]" },
  THE_DEBUGGER: { title: "The Debugger", desc: "You are highly logical. You need step-by-step details.", color: "bg-[#9BF6FF]" },
};

export function IntroPhase({ onStart }: { onStart: () => void }) {
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
        <div className="bg-[#FFD6A5] border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Ready to find your archetype?</h2>
            <p className="mb-6 font-medium">Don't overthink the material. Just read naturally.</p>
            <button onClick={onStart} className="bg-black text-white border-2 border-black px-10 py-4 font-bold text-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all">
              START CALIBRATION →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReadPhase({
  showSummary, showDiagram, handleSummaryClick, handleDiagramClick, startQuiz,
  textTrackerRef, summaryTrackerRef, diagramTrackerRef
}: any) {
  return (
    <div className="space-y-8">
      <div>
        <button onClick={handleSummaryClick} className="bg-[#CBF3F0] border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          {showSummary ? "HIDE SUMMARY" : "VIEW QUICK SUMMARY"}
        </button>
        {showSummary && (
          <div ref={summaryTrackerRef} className="mt-6 p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-lg font-medium">
            <span className="bg-[#FF9F1C] border border-black px-2 py-0.5 text-sm font-bold mr-2">{calibrationMission.summary.label}</span>
            {calibrationMission.summary.text}
          </div>
        )}
      </div>

      <div ref={textTrackerRef} className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 text-lg leading-relaxed font-medium">
        {calibrationMission.content.paragraphs.map((para, idx) => (
          <p key={idx} className={idx !== calibrationMission.content.paragraphs.length - 1 ? "mb-6" : ""}>{para}</p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <button onClick={handleDiagramClick} className="w-full bg-[#FFD6A5] border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
            <Eye className="w-5 h-5" /> {showDiagram ? "HIDE DIAGRAM" : "VIEW DIAGRAM"}
          </button>
          {showDiagram && (
            <div ref={diagramTrackerRef} className="mt-4 p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center">
              <div className="relative w-full h-48 mb-4 bg-gray-900 rounded border-2 border-black overflow-hidden flex items-center justify-center">
                <Image src={calibrationMission.visual.src} alt={calibrationMission.visual.alt} fill className="object-contain p-4" />
              </div>
              <span className="text-black font-bold text-sm text-center">{calibrationMission.visual.caption}</span>
            </div>
          )}
        </div>
        <button onClick={startQuiz} className="w-full bg-[#FF6B6B] border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          I'M READY. START QUIZ →
        </button>
      </div>
    </div>
  );
}

export function QuizPhase({ answers, handleAnswerChange, finishMission, isSubmitting }: any) {
  return (
    <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 space-y-8">
      {calibrationMission.quiz.questions.map((q) => {
        const answerKey = q.id as keyof typeof answers;
        return (
          <div key={q.id}>
            <label className="block font-bold text-lg mb-2">{q.label}</label>
            <select
              className="w-full border-2 border-black p-4 bg-gray-50 font-medium"
              value={answers[answerKey]}
              onChange={(e) => handleAnswerChange(answerKey, e.target.value)}
            >
              <option value="">Select an answer...</option>
              {q.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.text}</option>)}
            </select>
          </div>
        );
      })}
      <div className="pt-8 border-t-4 border-black flex justify-end">
        <button onClick={finishMission} disabled={isSubmitting || !answers.q1 || !answers.q2 || !answers.q3} className="bg-black text-white border-2 border-black px-10 py-4 font-bold text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all disabled:opacity-50">
          {isSubmitting ? "ANALYZING..." : "REVEAL MY PROFILE →"}
        </button>
      </div>
    </div>
  );
}

export function RevealPhase({ assignedArchetype, showOverrideOptions, setShowOverrideOptions, handleConfirmArchetype, handleOverride, isSubmitting }: any) {
  const profile = ARCHETYPE_DETAILS[assignedArchetype];
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] py-12 px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-4">Calibration Complete!</h1>
        </div>
        <div className={`${profile.color} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 mb-8 text-center`}>
          <div className="text-sm font-bold tracking-widest uppercase mb-2">Your Primary Archetype</div>
          <h2 className="text-5xl font-black mb-6">{profile.title}</h2>
          <p className="text-xl font-medium">{profile.desc}</p>
        </div>
        {!showOverrideOptions ? (
          <div className="flex flex-col gap-4">
            <button onClick={handleConfirmArchetype} className="w-full bg-black text-white border-4 border-black px-6 py-4 font-bold text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all">YES, THIS SOUNDS LIKE ME →</button>
            <button onClick={() => setShowOverrideOptions(true)} className="w-full bg-transparent text-black border-4 border-black px-6 py-4 font-bold text-lg transition-all">Actually, let me choose manually</button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Choose the style that fits you best:</h3>
            {Object.entries(ARCHETYPE_DETAILS).map(([key, data]) => (
              <button key={key} onClick={() => handleOverride(key)} disabled={isSubmitting} className={`w-full text-left p-4 border-4 border-black ${data.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between`}>
                <div><div className="font-bold text-xl">{data.title}</div><div className="text-sm font-medium mt-1">{data.desc}</div></div>
                {key === assignedArchetype && <span className="bg-black text-white text-xs px-2 py-1 font-bold ml-4">AI SUGGESTION</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}