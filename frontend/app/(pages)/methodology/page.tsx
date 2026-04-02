import Link from "next/link";
import { Brain, Eye, GraduationCap, Zap, ArrowLeft, Activity, Database, Cpu } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] selection:bg-purple-300 relative overflow-x-hidden pb-24">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px' }}></div>

      {/* Simple Header */}
      <nav className="w-full border-b-[3px] border-black bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-50 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white group-hover:bg-[#FF6B6B] transition-colors rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black uppercase">Back to Home</span>
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-20 relative z-10">
        <div className="mb-20">
          <div className="inline-block bg-[#CBF3F0] border-2 border-black px-4 py-1 text-sm font-bold mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            The Science of Learning
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            How we <span className="text-[#2EC4B6] underline decoration-[6px] decoration-black underline-offset-8">adapt.</span>
          </h1>
          <p className="text-2xl font-bold text-gray-700 max-w-2xl leading-tight">
            We don't ask you how you learn. We measure your cognitive load in real-time and rewrite reality to fit your brain.
          </p>
        </div>

        {/* The 3-Step Process */}
        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="bg-white border-[4px] border-black rounded-[2rem] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 shrink-0 bg-[#FF9F1C] rounded-[2rem] border-[4px] border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-3">
              <Activity className="w-16 h-16 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase rounded-lg">Phase 1</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Implicit Telemetry</h2>
              </div>
              <p className="text-lg font-bold text-gray-600 leading-snug">
                Traditional platforms use flawed self-reporting surveys. We treat human attention as a measurable dataset. By tracking WPM (Words Per Minute), hesitation delays, and UI interaction sequences, we capture your unbiased "digital body language."
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#CBF3F0] border-[4px] border-black rounded-[2rem] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 items-center md:flex-row-reverse text-right md:text-left">
            <div className="w-32 h-32 shrink-0 bg-white rounded-[2rem] border-[4px] border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-3">
              <Database className="w-16 h-16 text-black" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center md:justify-start justify-end gap-3 mb-2">
                <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase rounded-lg">Phase 2</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Cognitive Scoring</h2>
              </div>
              <p className="text-lg font-bold text-gray-600 leading-snug">
                Raw telemetry is fed into our progressive profiling engine. It updates a dynamic "confidence matrix" in PostgreSQL, scoring you across axes like Visual Affinity, Structural Need, and Kinetic Impatience.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-[4px] border-black rounded-[2rem] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 shrink-0 bg-[#FF6B6B] rounded-[2rem] border-[4px] border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-3">
              <Cpu className="w-16 h-16 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase rounded-lg">Phase 3</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">LLM Synthesis</h2>
              </div>
              <p className="text-lg font-bold text-gray-600 leading-snug">
                Using strict Prompt Engineering personas based on your profile, our AI dynamically restructures static text. It applies Cognitive Load Theory to reduce extraneous noise, serving you content exactly how your brain wants to parse it.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}