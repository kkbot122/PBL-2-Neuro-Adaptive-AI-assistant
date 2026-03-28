"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
Brain,
LogOut,
BookOpen,
Target,
Activity,
User as UserIcon,
Plus,
Send,
} from "lucide-react";

export default function DashboardPage() {
const { data: session, status } = useSession();
const router = useRouter();



useEffect(() => {
if (status === "unauthenticated") {
router.push("/signin");
}
}, [status, router]);



if (status === "loading") {
return ( <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center font-[family-name:var(--font-kodchasan)]"> <div className="w-16 h-16 bg-[#FF9F1C] border-2 border-black flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"> <Brain className="w-8 h-8 text-black" strokeWidth={2.5} /> </div> <p className="mt-6 text-xl font-bold tracking-widest uppercase animate-pulse">
Loading Neuro AI... </p> </div>
);
}

if (!session) return null;

return ( <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] pb-28">

  {/* NAVBAR */}
  <nav className="w-full bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-purple-500 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold tracking-tight hidden md:block">
        NeuroLearn
      </span>
    </div>

    <div className="flex items-center gap-4">
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

      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#ff5252] border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      >
        <LogOut className="w-4 h-4" strokeWidth={3} />
        <span className="hidden md:inline">Sign Out</span>
      </button>
    </div>
  </nav>

  {/* MAIN CONTENT */}
  <main className="max-w-6xl mx-auto px-6 py-10">

    {/* HEADER */}
    <div className="mb-12">
      <div className="inline-block bg-[#CBF3F0] border-2 border-black px-3 py-1 text-sm font-bold mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1">
        👋 Ready to learn?
      </div>

      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Welcome back,
        <span className="underline decoration-wavy decoration-purple-500 underline-offset-4 ml-2">
          {session.user?.name?.split(" ")[0]}
        </span>
        !
      </h1>

      <p className="text-gray-600 font-medium mt-2 text-lg">
        Your cognitive load is currently optimal. Let's tackle some complex
        topics.
      </p>

      <button
        onClick={() => router.push("/chat")}
        className="mt-6 flex items-center gap-3 bg-[#FF9F1C] hover:bg-[#ff8c00] border-2 border-black px-6 py-3 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <Plus className="w-6 h-6" strokeWidth={3} />
        New Chat
      </button>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

      <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-3 bg-blue-100 border-2 border-black rounded-lg mb-4 w-fit">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>

        <h3 className="text-gray-500 font-bold text-sm uppercase">
          Learning Sessions
        </h3>

        <p className="text-4xl font-bold mt-1">12</p>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-3 bg-purple-100 border-2 border-black rounded-lg mb-4 w-fit">
          <Target className="w-6 h-6 text-purple-600" />
        </div>

        <h3 className="text-gray-500 font-bold text-sm uppercase">
          Cognitive Profile
        </h3>

        <p className="text-4xl font-bold mt-1">--</p>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-3 bg-green-100 border-2 border-black rounded-lg mb-4 w-fit">
          <Activity className="w-6 h-6 text-green-600" />
        </div>

        <h3 className="text-gray-500 font-bold text-sm uppercase">
          Adaptive Score
        </h3>

        <p className="text-4xl font-bold mt-1">94</p>
      </div>

    </div>

  </main>



</div>

);
}
