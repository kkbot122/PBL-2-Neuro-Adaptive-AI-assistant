import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { 
  Eye, 
  Brain, 
  GraduationCap,
  TrendingUp,
  Sparkles,
  GitBranch,
  BarChart3,
  MessageSquare,
  Layout
} from "lucide-react";
import Image from "next/image";
import Architect from "@/components/illustrations/Architect";
import Tinkerer from "@/components/illustrations/Tinker";
import Sprinter from "@/components/illustrations/Sprinter";
import Astronaut from "@/components/illustrations/Astronaut";

export default async function Home() {
  const session = await auth();

  // If logged in, go to dashboard.
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] selection:bg-purple-300">
      {/* --- Navbar --- */}
      <nav className="w-full border-b-2 border-black bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">NeuroLearn</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="#how-it-works"
            className="hidden md:block hover:underline underline-offset-4 decoration-2"
          >
            How It Works
          </Link>
          <Link
            href="#adaptation"
            className="hidden md:block hover:underline underline-offset-4 decoration-2"
          >
            Continuous Adaptation
          </Link>
          <Link href="/signin">
            <button className="bg-[#FF6B6B] border-2 border-black px-6 py-2 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1 active:shadow-none">
              Login
            </button>
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center">
        {/* --- Hero Section --- */}
        <section className="w-full max-w-6xl px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-purple-100 border-2 border-black rounded-full px-4 py-2 mb-4 mx-auto md:mx-0">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold">Continuous Adaptation Engine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              An AI that <br />
              <span className="text-purple-600 underline decoration-wavy decoration-black underline-offset-8">
                evolves with you
              </span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-800 max-w-lg mx-auto md:mx-0">
              Not static personas. Not fixed teaching styles. Your tutor changes 
              explanation and UI in real-time based on how you think and interact.
            </p>
            <div className="flex flex-col md:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Link href="/signin">
                <button className="w-full md:w-auto bg-[#4D96FF] text-white border-2 border-black px-8 py-4 rounded-xl text-lg font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Start Learning Free
                </button>
              </Link>
              <button className="w-full md:w-auto bg-white border-2 border-black px-8 py-4 rounded-xl text-lg font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 w-full flex justify-center relative">
            <div className="absolute top-0 right-10 w-16 h-16 bg-yellow-400 rounded-full border-2 border-black animate-bounce delay-700 -z-10"></div>
            <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-400 rotate-12 border-2 border-black -z-10"></div>
            <div className="relative w-full max-w-lg md:max-w-xl bg-white border-2 border-black rounded-2xl p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-[#E0E7FF] border-2 border-black rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(#a5b4fc_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                <Astronaut className="w-full h-full max-h-[400px] text-blue-600 relative z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section
          id="how-it-works"
          className="w-full bg-white border-y-2 border-black py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">
              From Static Personas to{" "}
              <span className="bg-yellow-300 px-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Living Vectors
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Most AI tutors ask you to pick a style once. NeuroLearn builds a 
              dynamic cognitive profile that updates after every interaction.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-[#FF9F1C] border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all relative">
                <div className="absolute -top-3 -left-3 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  1
                </div>
                <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-4">
                  <MessageSquare className="w-7 h-7 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold mb-2">You Interact</h3>
                <p className="font-medium opacity-90">
                  Ask questions, request examples, answer quizzes, or give feedback. 
                  Every click becomes a signal.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#2EC4B6] border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all relative">
                <div className="absolute -top-3 -left-3 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  2
                </div>
                <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-4">
                  <Brain className="w-7 h-7 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Vectors Update</h3>
                <p className="font-medium opacity-90">
                  We track 12+ cognitive dimensions—processing depth, perception 
                  style, pacing preference—in real-time.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#CBF3F0] border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all relative">
                <div className="absolute -top-3 -left-3 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  3
                </div>
                <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-4">
                  <Layout className="w-7 h-7 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold mb-2">UI + Content Adapts</h3>
                <p className="font-medium opacity-90">
                  Your next response includes different explanations, diagrams, 
                  quizzes, and UI components—tailored exactly for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Continuous Adaptation Section --- */}
        <section id="adaptation" className="w-full bg-[#F4F1EA] py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-bold text-sm tracking-widest uppercase text-gray-500 mb-2 block">
                Not a One-Time Setup
              </span>
              <h2 className="text-4xl md:text-5xl font-bold">
                A{" "}
                <span className="underline decoration-wavy decoration-purple-500">
                  Living System
                </span>{" "}
                That Remembers
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: Signal Processing */}
              <div className="space-y-6">
                <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold">What We Track</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium">Processing Signals</span>
                      <span className="text-sm text-gray-600">"Show example" · "Why?" · "Explain more"</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium">Quiz Responses</span>
                      <span className="text-sm text-gray-600">Accuracy · Time to answer · Help requests</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium">Style Feedback</span>
                      <span className="text-sm text-gray-600">👍 · 👎 · "Too fast" · "Too detailed"</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Engagement Patterns</span>
                      <span className="text-sm text-gray-600">Session length · Feature usage · Drop-off points</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-2 border-black rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold">From Signals to Vectors</h3>
                  </div>
                  <p className="text-gray-700">
                    Each interaction adjusts your FSLSM profile across multiple dimensions:
                    <span className="block mt-2 text-sm font-mono bg-white p-2 border border-black rounded">
                      processing: 0.73 → 0.68 (more reflective)<br/>
                      perception: 0.42 → 0.51 (more visual)<br/>
                      pacing: 0.85 → 0.79 (slower, deeper)
                    </span>
                  </p>
                </div>
              </div>

              {/* Right: Adaptation Loop */}
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-6">
                  <GitBranch className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold">The Continuous Loop</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</div>
                    <div>
                      <p className="font-bold">Response Delivered</p>
                      <p className="text-sm text-gray-600">LLM generates dialogue + diagram + quiz + concept map</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</div>
                    <div>
                      <p className="font-bold">You Interact</p>
                      <p className="text-sm text-gray-600">Click a quiz answer, request an example, or skip ahead</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</div>
                    <div>
                      <p className="font-bold">Vectors Recalculated</p>
                      <p className="text-sm text-gray-600">Your cognitive profile updates in milliseconds</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">4</div>
                    <div>
                      <p className="font-bold">System Prompt Rewritten</p>
                      <p className="text-sm text-gray-600">Teaching style, UI directives, and tool instructions change</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">5</div>
                    <div>
                      <p className="font-bold">Next Response Evolves</p>
                      <p className="text-sm text-gray-600">Different widgets. Different explanations. Different YOU.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black text-center">
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    ↻ This loop runs after EVERY message
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- What Makes It Different --- */}
        <section className="w-full bg-white border-y-2 border-black py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Not a Chatbot.{" "}
              <span className="bg-yellow-300 px-2 border-2 border-black">
                A Morphing Interface.
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 border-2 border-black rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-red-500">✗</span> Static Chatbots
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">• Fixed teaching persona forever</li>
                  <li className="flex items-center gap-2">• Same UI for every learner</li>
                  <li className="flex items-center gap-2">• One-time "learning style" quiz</li>
                  <li className="flex items-center gap-2">• Text-only responses</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border-2 border-black rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-green-500">✓</span> NeuroLearn
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">• Evolves as YOU evolve</li>
                  <li className="flex items-center gap-2">• Dynamic UI components per session</li>
                  <li className="flex items-center gap-2">• Continuous vector-based profiling</li>
                  <li className="flex items-center gap-2">• Content + UI + quizzes generated together</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA Footer --- */}
        <section className="w-full bg-[#F4F1EA] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white border-2 border-black rounded-2xl p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-4xl font-bold mb-4">
                Ready to experience a{" "}
                <span className="text-purple-600 underline decoration-wavy">
                  tutor that adapts
                </span>
                ?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                No fixed archetypes. No static personas. Just continuous, 
                personalized learning that moves with you.
              </p>
              <Link href="/signin">
                <button className="bg-purple-500 text-white border-2 border-black px-10 py-4 rounded-xl text-xl font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Start Your Learning Journey
                </button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Free forever tier
              </p>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="w-full py-10 text-center border-t-2 border-black bg-white">
          <p className="font-bold text-gray-600">
            © 2026 NeuroLearn. Continuous vector-based personalization for every learner.
          </p>
        </footer>
      </main>
    </div>
  );
}