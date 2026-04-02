import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { Eye, Brain, GraduationCap, ArrowRight, Zap, Sparkles } from "lucide-react";
import Architect from "@/components/illustrations/Architect";
import Tinkerer from "@/components/illustrations/Tinker";
import Sprinter from "@/components/illustrations/Sprinter";
import Astronaut from "@/components/illustrations/Astronaut";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] selection:bg-purple-300 relative overflow-x-hidden">
      
      {/* --- Global Background Texture --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px' }}>
      </div>

      {/* --- Navbar --- */}
      <nav className="w-full border-b-[3px] border-black bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-50 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3">
            <Brain className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">NeuroLearn<span className="text-[#FF6B6B]">.</span></span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/archetypes" className="hidden md:block font-bold hover:text-[#2EC4B6] transition-colors uppercase text-xs tracking-widest">Archetypes</Link>
          <Link href="/methodology" className="hidden md:block font-bold hover:text-[#2EC4B6] transition-colors uppercase text-xs tracking-widest">Methodology</Link>
          <Link href="/signin">
            <button className="bg-[#FF6B6B] border-[3px] border-black px-8 py-2.5 rounded-xl font-black uppercase text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all">
              Login
            </button>
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center relative z-10">
        
        {/* --- Hero Section --- */}
        <section className="w-full max-w-7xl px-6 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#2EC4B6] border-2 border-black px-4 py-1 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                <Zap className="w-4 h-4 fill-black" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Learning Engine</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-black">
              Learn at the <br />
              <span className="text-purple-600 italic">speed of thought.</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-gray-700 max-w-xl mx-auto lg:mx-0 leading-tight">
              A neuro-adaptive assistant that monitors your cognitive load and adjusts content complexity instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-6 justify-center lg:justify-start">
              <Link href="/signin" className="group">
                <button className="w-full sm:w-auto bg-[#4D96FF] text-white border-[3px] border-black px-10 py-5 rounded-2xl text-xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-[2px] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3">
                  Start Learning <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-white border-[3px] border-black px-10 py-5 rounded-2xl text-xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                View Demo
              </button>
            </div>
          </div>

          {/* Right Illustration Area */}
          <div className="flex-1 w-full flex justify-center relative">
            <div className="absolute -top-10 -right-4 w-24 h-24 bg-[#FF9F1C] rounded-full border-4 border-black animate-bounce -z-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="relative w-full max-w-xl bg-white border-[4px] border-black rounded-[2.5rem] p-3 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-[#E0E7FF] border-[3px] border-black rounded-[2rem] overflow-hidden relative aspect-square md:aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#a5b4fc_2px,transparent_2px)] [background-size:24px_24px] opacity-40"></div>
                <Astronaut className="w-4/5 h-4/5 text-blue-600 relative z-10 drop-shadow-[10px_10px_0px_rgba(0,0,0,0.1)]" />
              </div>
            </div>
          </div>
        </section>

        {/* --- Methodology Section --- */}
        <section id="methodology" className="w-full bg-white border-y-[4px] border-black py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-20 text-center">
                <span className="font-black text-[#FF6B6B] tracking-[0.4em] uppercase text-xs mb-4">The Process</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                  The <span className="bg-yellow-300 border-2 border-black px-4 italic">Functional</span> Engine
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Card 1 */}
              <div className="bg-[#FF9F1C] border-[3px] border-black rounded-3xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform">
                  <Eye className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">The Sensor</h3>
                <p className="font-bold text-black/80 leading-snug">
                  Gaze & Scroll tracking captures your "digital body language" to detect confusion instantly.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#2EC4B6] border-[3px] border-black rounded-3xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-6 transition-transform">
                  <Brain className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">The Brain</h3>
                <p className="font-bold text-black/80 leading-snug">
                  Translates raw data into a "Load Score," deciding if you are zoning out or deeply focused.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#CBF3F0] border-[3px] border-black rounded-3xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">The Teacher</h3>
                <p className="font-bold text-black/80 leading-snug">
                  Adapts content by injecting JIT scaffolding, simplifying text, or offering micro-quizzes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Archetypes Section --- */}
        <section id="archetypes" className="w-full bg-[#F4F1EA] py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-black text-sm tracking-[0.3em] uppercase text-gray-500">Personalized Learning</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Find your <br/> <span className="text-purple-600 underline decoration-[6px] decoration-black underline-offset-8">Archetype.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "The Architect", type: "Holist", color: "bg-[#E2E8F0]", icon: <Architect className="w-full h-full text-purple-600" />, actionColor: "text-purple-600", desc: "Scans the whole page first. Needs to know 'Why' before 'How'. Gets frustrated by details without context.", ai: "Generates a high-level 'Concept Map' at the start of every article." },
                { title: "The Tinkerer", type: "Active", color: "bg-[#FFEDD5]", icon: <Tinkerer className="w-full h-full text-orange-600" />, actionColor: "text-orange-600", desc: "Learns by doing. Skips text to find the 'Try it yourself' button. Needs interaction within 30 seconds.", ai: "Converts static examples into interactive code blocks & challenges." },
                { title: "The Sprinter", type: "Micro", color: "bg-[#D1FAE5]", icon: <Sprinter className="w-full h-full text-green-600" />, actionColor: "text-green-600", desc: "High energy, short duration. Needs rapid-fire content delivery. Checks phone every 3 mins.", ai: "Auto-summarizes text into 'TikTok-style' 30-second flashcards." }
              ].map((item, idx) => (
                <div key={idx} className="group bg-white border-[3px] border-black rounded-[2rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className={`h-56 ${item.color} border-b-[3px] border-black flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]"></div>
                    <div className="relative w-3/4 h-3/4 p-4 transform group-hover:scale-110 transition-transform duration-500">
                        {item.icon}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-3xl font-black tracking-tighter">{item.title}</h3>
                      <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase rounded-lg">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-md font-bold text-gray-600 mb-6 leading-tight">
                      {item.desc}
                    </p>
                    <div className="bg-[#F4F1EA] p-5 rounded-2xl border-2 border-black border-dashed">
                      <p className={`text-[10px] font-black uppercase mb-1 ${item.actionColor}`}>AI Neural Action:</p>
                      <p className="text-sm font-bold text-black italic">
                        "{item.ai}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div className="mt-24 bg-black text-white p-12 rounded-[3rem] border-[4px] border-black shadow-[15px_15px_0px_0px_rgba(46,196,182,1)] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B6B] opacity-20 blur-3xl"></div>
                <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter italic">Ready to discover your potential?</h3>
                <Link href="/signin">
                    <button className="bg-[#2EC4B6] text-black border-2 border-white px-12 py-5 rounded-2xl text-2xl font-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all">
                    Get Started Free
                    </button>
                </Link>
                <p className="mt-8 text-xs font-bold text-white/40 uppercase tracking-widest">7 more archetypes waiting to be discovered</p>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="w-full py-12 text-center border-t-[3px] border-black bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-[#FF6B6B] rounded-xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
                <Brain className="w-6 h-6 text-black" />
            </div>
            <p className="font-black text-sm uppercase tracking-widest">
              © 2026 NeuroLearn • The Future of EdTech
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}