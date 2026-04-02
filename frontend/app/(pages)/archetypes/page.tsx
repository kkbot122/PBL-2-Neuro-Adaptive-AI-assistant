import Link from "next/link";
import { ArrowLeft, Eye, LayoutTemplate, Zap, SearchCode } from "lucide-react";

export default function ArchetypesPage() {
  const archetypes = [
    {
      id: "THE_VISUALIZER",
      title: "The Visualizer",
      tag: "Spatial",
      color: "bg-[#FFD6A5]",
      icon: <Eye className="w-12 h-12 text-black" strokeWidth={2} />,
      behavior: "Learns through images, spatial maps, and visual metaphors. Remembers diagrams better than paragraphs. Tends to score high on diagram-viewing telemetry.",
      adaptation: "AI transforms heavy text into Markdown tables, uses visual analogies, and suggests specific diagram placements to anchor concepts."
    },
    {
      id: "THE_ARCHITECT",
      title: "The Architect",
      tag: "Top-Down",
      color: "bg-[#CBF3F0]",
      icon: <LayoutTemplate className="w-12 h-12 text-black" strokeWidth={2} />,
      behavior: "Needs the big picture first. Learns top-down, grasping overarching concepts before diving into details. Often reads summaries before main texts.",
      adaptation: "AI forces a 'High-Level Executive Summary' at the top, structures content with strict nested headers, and isolates granular facts into secondary sections."
    },
    {
      id: "THE_SPRINTER",
      title: "The Sprinter",
      tag: "Kinetic",
      color: "bg-[#FF6B6B]",
      icon: <Zap className="w-12 h-12 text-black" strokeWidth={2} />,
      behavior: "High kinetic energy. Impatient with passive reading. Learns by doing and fast feedback loops. Characterized by high reading WPM and erratic scrolling.",
      adaptation: "AI becomes ruthlessly concise. Limits paragraphs to 3 sentences, bolds critical keywords, and injects micro-quizzes immediately after concepts."
    },
    {
      id: "THE_DEBUGGER",
      title: "The Debugger",
      tag: "Logical",
      color: "bg-[#9BF6FF]",
      icon: <SearchCode className="w-12 h-12 text-black" strokeWidth={2} />,
      behavior: "Highly logical, methodical, and skeptical. Needs to understand the 'why' under the hood. Exhibits slow, deliberate reading speeds and changes answers during quizzes.",
      adaptation: "AI explains concepts in chronological steps. Replaces analogies with precise technical terminology and adds 'Edge Case' sections detailing failure states."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] selection:bg-purple-300 relative overflow-x-hidden pb-24">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px' }}></div>

      <nav className="w-full border-b-[3px] border-black bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-50 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white group-hover:bg-[#FF6B6B] transition-colors rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black uppercase">Back to Home</span>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
            The <span className="text-purple-600 underline decoration-[6px] decoration-black underline-offset-8">Archetypes.</span>
          </h1>
          <p className="text-2xl font-bold text-gray-700 max-w-2xl mx-auto leading-tight">
            The four cognitive profiles our engine uses to restructure your learning reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {archetypes.map((arch) => (
            <div key={arch.id} className={`${arch.color} border-[4px] border-black rounded-[2rem] p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all`}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {arch.icon}
                </div>
                <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl">
                  {arch.tag}
                </span>
              </div>
              
              <h2 className="text-4xl font-black tracking-tighter mb-6">{arch.title}</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">Observed Behavior</div>
                  <p className="text-lg font-bold leading-snug">{arch.behavior}</p>
                </div>
                <div className="bg-white/50 p-5 rounded-2xl border-2 border-black border-dashed">
                  <div className="text-xs font-black uppercase tracking-widest mb-1 text-purple-700">AI Adaptation Strategy</div>
                  <p className="text-md font-bold leading-snug">{arch.adaptation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}