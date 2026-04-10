// frontend/app/(pages)/dashboard/page.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  LogOut,
  BookOpen,
  Target,
  Activity,
  User as UserIcon,
  Plus,
  Clock,
  TrendingUp,
  GitBranch,
  BarChart3,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Zap,
  Radar,
  Layers,
  Cpu
} from "lucide-react";

// Helper to format "THE_VISUALIZER" into "Visualizer"
const formatArchetype = (archetype: string) => {
  if (!archetype) return "Unknown";
  const clean = archetype.replace("THE_", "");
  return clean.charAt(0) + clean.slice(1).toLowerCase();
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signin");
  }

  const apiUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://backend:8000";
    
  const commonHeaders = {
    "x-user-email": session.user.email,
    "x-internal-token": process.env.INTERNAL_API_KEY as string,
  };

  const [profileRes, sessionsRes] = await Promise.all([
    fetch(`${apiUrl}/api/v1/profile/me`, { headers: commonHeaders, cache: "no-store" }),
    fetch(`${apiUrl}/api/v1/chat/sessions`, { headers: commonHeaders, cache: "no-store" })
  ]);

  if (!profileRes.ok) {
    redirect("/mission");
  }

  const profile = await profileRes.json();
  const raw = profile.raw_scores || {};
  const recentSessions = sessionsRes.ok ? await sessionsRes.json() : [];

  const isOnboarded =
    Object.keys(raw).length > 0 && Object.values(raw).some((v: any) => v > 0);
  if (!isOnboarded) {
    redirect("/mission");
  }

  const vector = profile.fslsm || { processing: 0, perception: 0, reception: 0, understanding: 0 };
  const paramsRaw = Object.values(vector) as number[];
  const adaptationMagnitude = paramsRaw.reduce((acc, val) => acc + Math.abs(val), 0) / 4;
  const adaptiveScore = Math.min(100, Math.round(50 + (adaptationMagnitude * 50) + (profile.learning_sessions_count * 2)));

  // Calculate dimensional scores for radar chart (0-100 scale)
  const dimensions = {
    processing: Math.round(50 + (vector.processing || 0) * 50),
    perception: Math.round(50 + (vector.perception || 0) * 50),
    reception: Math.round(50 + (vector.reception || 0) * 50),
    understanding: Math.round(50 + (vector.understanding || 0) * 50),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F1EA] to-[#E8E4DC] text-black font-[family-name:var(--font-kodchasan)]">
      
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b-2 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight hidden md:block">
            NeuroLearn
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white border-2 border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-black"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full border border-black flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
            <div className="hidden md:block">
              <p className="text-xs text-gray-500 leading-tight">Welcome back</p>
              <p className="font-bold text-sm leading-tight">
                {session.user?.name?.split(" ")[0]}
              </p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/signin" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#ff5252] border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none"
            >
              <LogOut className="w-4 h-4" strokeWidth={3} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* --- HERO SECTION --- */}
        <div className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-black px-4 py-1.5 rounded-full mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-600">Active Session</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to expand your{" "}
                <span className="bg-yellow-300 px-2 inline-block -rotate-1">
                  cognitive horizons
                </span>
                ?
              </h1>
              <p className="text-gray-600 font-medium mt-3 text-lg max-w-2xl">
                Your AI tutor is tuned to your{" "}
                <span className="font-bold text-black bg-purple-100 px-2 py-0.5 rounded">
                  {formatArchetype(profile.primary_archetype)}
                </span>{" "}
                cognitive style. Start a new mission or continue where you left off.
              </p>
            </div>
            
            <Link
              href="/chat"
              className="flex items-center gap-3 bg-gradient-to-r from-[#FF9F1C] to-[#FF6B6B] hover:from-[#ff8c00] hover:to-[#ff5252] border-2 border-black px-8 py-4 rounded-xl font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" strokeWidth={3} />
              New Neural Mission
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* --- STATS GRID (4 cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Sessions Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 border-2 border-black rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" strokeWidth={2} />
              </div>
              <span className="text-xs font-mono text-gray-400">Lifetime</span>
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">
              Learning Sessions
            </h3>
            <p className="text-4xl font-black text-blue-600">{profile.learning_sessions_count}</p>
            <p className="text-xs text-gray-400 mt-2">+{Math.min(5, profile.learning_sessions_count)} this week</p>
          </div>

          {/* Archetype Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 border-2 border-black rounded-xl">
                <Target className="w-6 h-6 text-purple-600" strokeWidth={2} />
              </div>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">
              Primary Archetype
            </h3>
            <p className="text-2xl font-black tracking-tight">
              {formatArchetype(profile.primary_archetype)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Dynamic classification</p>
          </div>

          {/* Adaptation Score Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-purple-200 rounded-bl-full -mr-10 -mt-10 opacity-30" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-green-100 border-2 border-black rounded-xl">
                <Activity className="w-6 h-6 text-green-600" strokeWidth={2} />
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-black border ${
                adaptiveScore > 85 ? "bg-[#FF9F1C] border-black text-black" :
                adaptiveScore > 65 ? "bg-purple-200 border-purple-600 text-purple-900" :
                "bg-gray-100 border-gray-400 text-gray-600"
              }`}>
                {adaptiveScore > 85 ? "Peak Performance" : adaptiveScore > 65 ? "Active Adaptation" : "Building Profile"}
              </span>
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider relative z-10">
              Adaptation Score
            </h3>
            <div className="flex items-baseline gap-2 mt-1 relative z-10">
              <p className="text-4xl font-black">{adaptiveScore}</p>
              <span className="text-sm font-bold text-gray-400">/ 100</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full border border-gray-300 mt-4 overflow-hidden relative z-10">
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-purple-400 to-[#FF9F1C] transition-all duration-1000 ease-out" 
                style={{ width: `${adaptiveScore}%` }} 
              />
            </div>
          </div>

          {/* Engagement Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 border-2 border-black rounded-xl">
                <MessageSquare className="w-6 h-6 text-orange-600" strokeWidth={2} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">
              Total Interactions
            </h3>
            <p className="text-4xl font-black text-orange-600">
              {profile.total_interactions || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">Across all sessions</p>
          </div>
        </div>

        {/* --- COGNITIVE DIMENSIONS & RECENT ACTIVITY (Split View) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left: Radar Chart / Dimensions */}
          <div className="lg:col-span-2 bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Radar className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold">Cognitive Dimensions</h2>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <GitBranch className="w-3 h-3" />
                <span>Real-time vector values</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Dimension 1 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Processing Depth</span>
                  <span className="text-xs font-mono text-purple-600">{dimensions.processing}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full border border-black overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all" style={{ width: `${dimensions.processing}%` }} />
                </div>
                <p className="text-xs text-gray-500">
                  {dimensions.processing > 70 ? "Deep, reflective processing" : 
                   dimensions.processing > 50 ? "Balanced approach" : "Quick, surface-level"}
                </p>
              </div>
              
              {/* Dimension 2 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Visual Perception</span>
                  <span className="text-xs font-mono text-purple-600">{dimensions.perception}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full border border-black overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all" style={{ width: `${dimensions.perception}%` }} />
                </div>
                <p className="text-xs text-gray-500">
                  {dimensions.perception > 70 ? "Highly visual learner" : 
                   dimensions.perception > 50 ? "Balanced visual-textual" : "Prefers text"}
                </p>
              </div>
              
              {/* Dimension 3 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Reception Style</span>
                  <span className="text-xs font-mono text-purple-600">{dimensions.reception}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full border border-black overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all" style={{ width: `${dimensions.reception}%` }} />
                </div>
                <p className="text-xs text-gray-500">
                  {dimensions.reception > 70 ? "Sequential, step-by-step" : 
                   dimensions.reception > 50 ? "Moderate structure" : "Holistic, big picture"}
                </p>
              </div>
              
              {/* Dimension 4 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Understanding Pace</span>
                  <span className="text-xs font-mono text-purple-600">{dimensions.understanding}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full border border-black overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all" style={{ width: `${dimensions.understanding}%` }} />
                </div>
                <p className="text-xs text-gray-500">
                  {dimensions.understanding > 70 ? "Fast, rapid learner" : 
                   dimensions.understanding > 50 ? "Moderate pace" : "Thoughtful, deliberate"}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Vector model: FSLSM
              </span>
              <span className="font-mono">Last updated: Just now</span>
            </div>
          </div>
          
          {/* Right: Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Vector Status Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold">Vector Evolution</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Adaptation Magnitude</span>
                  <span className="font-mono font-bold">{adaptationMagnitude.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence Score</span>
                  <span className="font-mono font-bold">{Math.min(100, Math.round(profile.confidence || 70))}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Stability</span>
                  <span className="font-mono font-bold">
                    {profile.learning_sessions_count > 10 ? "High" : 
                     profile.learning_sessions_count > 5 ? "Medium" : "Building"}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-purple-200">
                <p className="text-[10px] text-purple-600 font-mono">
                  ↻ Updates after each interaction
                </p>
              </div>
            </div>
            
            {/* Weekly Activity Preview */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Weekly Activity
              </h3>
              <div className="flex items-end gap-2 h-24">
                {[65, 45, 80, 35, 70, 55, 40].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-400 to-purple-600 rounded-t border border-black transition-all hover:scale-110"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] font-mono">D{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- RECENT MISSIONS SECTION --- */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-700 border-2 border-black" />
              <h2 className="text-2xl font-bold">Recent Neural Missions</h2>
            </div>
            <Link href="/chat" className="text-sm font-bold text-purple-600 hover:underline flex items-center gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentSessions.length > 0 ? (
              recentSessions.slice(0, 4).map((s: any) => (
                <Link
                  key={s.id}
                  href={`/chat?sessionId=${s.id}`}
                  className="group bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-black rounded-xl group-hover:scale-110 transition-transform">
                        <Brain className="w-5 h-5 text-yellow-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg group-hover:text-purple-600 transition-colors">
                          {s.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(s.created_at).toLocaleDateString()}
                          </p>
                          {s.message_count && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {s.message_count} messages
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full bg-white border-2 border-black border-dashed p-12 rounded-2xl flex flex-col items-center justify-center text-center">
                <Brain className="w-16 h-16 text-gray-300 mb-4" />
                <p className="font-bold text-lg">No Neural Missions yet</p>
                <p className="text-gray-500 text-sm mt-1">Start your first learning session to begin your adaptive journey</p>
                <Link
                  href="/chat"
                  className="mt-6 inline-flex items-center gap-2 bg-purple-500 text-white border-2 border-black px-6 py-3 rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Start First Mission
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER INSIGHT --- */}
        <div className="mt-12 pt-6 border-t-2 border-black/10">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                Continuous adaptation active
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Learning vectors updating
              </span>
            </div>
            <p className="font-mono">NeuroLearn v2.0 • Real-time personalization</p>
          </div>
        </div>
      </main>
    </div>
  );
}