"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Brain, LogOut, BookOpen, Target, Activity, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // --- Loading State (Neubrutalist Style) ---
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center font-[family-name:var(--font-kodchasan)]">
        <div className="w-16 h-16 bg-[#FF9F1C] border-2 border-black flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Brain className="w-8 h-8 text-black" strokeWidth={2.5} />
        </div>
        <p className="mt-6 text-xl font-bold tracking-widest uppercase animate-pulse">
          Loading Neuro AI...
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] pb-20">
      
      {/* --- Navbar --- */}
      <nav className="w-full bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight hidden md:block">NeuroLearn</span>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* User Avatar (Mobile hidden name, Desktop visible) */}
          <div className="flex items-center gap-3 bg-yellow-100 px-3 py-1.5 rounded-lg border-2 border-black">
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
             <span className="font-bold text-sm hidden md:block">
                {session.user?.name?.split(" ")[0]}
             </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#ff5252] border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none"
          >
            <LogOut className="w-4 h-4" strokeWidth={3} />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="inline-block bg-[#CBF3F0] border-2 border-black px-3 py-1 text-sm font-bold mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            👋 Ready to learn?
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome back, <span className="underline decoration-wavy decoration-purple-500 underline-offset-4">{session.user?.name?.split(" ")[0]}</span>!
          </h1>
          <p className="text-gray-600 font-medium mt-2 text-lg">
            Your cognitive load is currently optimal. Let's tackle some complex topics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1: Sessions */}
          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-blue-100 border-2 border-black rounded-lg">
                 <BookOpen className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
               </div>
               <span className="bg-gray-100 border border-black px-2 py-0.5 text-xs font-bold rounded">
                 Weekly
               </span>
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wide">Learning Sessions</h3>
            <p className="text-4xl font-bold mt-1">12</p>
            <p className="text-sm font-medium text-gray-500 mt-2">Start your next session</p>
          </div>

          {/* Card 2: Cognitive Profile */}
          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-purple-100 border-2 border-black rounded-lg">
                 <Target className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
               </div>
               <span className="bg-purple-200 border border-black px-2 py-0.5 text-xs font-bold rounded text-purple-800">
                 Pending
               </span>
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wide">Cognitive Profile</h3>
            <p className="text-4xl font-bold mt-1">--</p>
            <p className="text-sm font-medium text-gray-500 mt-2 underline cursor-pointer hover:text-purple-600">
               Complete Assessment →
            </p>
          </div>

          {/* Card 3: Adaptive Score */}
          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-green-100 border-2 border-black rounded-lg">
                 <Activity className="w-6 h-6 text-green-600" strokeWidth={2.5} />
               </div>
               <span className="bg-green-200 border border-black px-2 py-0.5 text-xs font-bold rounded text-green-800">
                 +5%
               </span>
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wide">Adaptive Score</h3>
            <p className="text-4xl font-bold mt-1">94</p>
            <p className="text-sm font-medium text-gray-500 mt-2">Excellent focus retention</p>
          </div>
        </div>

        {/* Profile / Details Section */}
        <div className="bg-[#FFD6A5] border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
           {/* Decorative background circle */}
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full pointer-events-none"></div>

           <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              {session.user?.image ? (
                 <img 
                   src={session.user.image} 
                   alt="Profile Big" 
                   className="w-24 h-24 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                 />
              ) : (
                 <div className="w-24 h-24 rounded-2xl border-2 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <UserIcon className="w-10 h-10" />
                 </div>
              )}
              
              <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-1">{session.user?.name}</h2>
                  <p className="font-medium opacity-70 mb-4">{session.user?.email}</p>
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-md border border-black text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                     <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                     Google Account
                  </div>
              </div>
              
              <div className="md:ml-auto">
                 <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors border-2 border-transparent hover:border-black/20">
                    Edit Settings
                 </button>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}