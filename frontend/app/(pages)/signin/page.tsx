"use client";

import { signIn } from "next-auth/react";
import { Brain, Zap, Sparkles, Orbit, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col md:flex-row font-[family-name:var(--font-kodchasan)] overflow-hidden">
      
      {/* --- LEFT SIDE: THE CREATIVE CANVAS (7/12) --- */}
      <div className="hidden md:flex md:w-7/12 bg-[#2EC4B6] border-r-4 border-black relative items-center justify-center p-12 overflow-hidden">
        {/* Keeping the creative pattern on the blue side only */}
        <div className="absolute inset-0 opacity-15" 
             style={{ backgroundImage: `radial-gradient(circle, black 2px, transparent 2px)`, backgroundSize: '30px 30px' }}>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">
               <Brain className="w-12 h-12 text-[#FF6B6B] mb-4" />
               <h2 className="text-2xl text-black font-black italic">NEURO</h2>
               <p className="text-sm text-black font-bold uppercase ">Adaptive Intelligence</p>
            </div>

            <div className="bg-[#FF9F1C] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-y-8 rotate-3">
               <Zap className="w-10 h-10 text-black fill-black mb-2" />
               <div className="text-xs font-black bg-black text-white px-2 py-1 inline-block mb-2">SYSTEM ACTIVE</div>
               <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="h-2 w-full bg-black/20 rounded-full" />)}
               </div>
            </div>

            <div className="col-span-2 bg-purple-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between group cursor-default">
              <div>
                <h3 className="text-3xl font-black text-black leading-tight">Unleash your <br/> potential.</h3>
              </div>
              <Orbit className="w-16 h-16 animate-[spin_10s_linear_infinite] group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: THE LOGIN PORTAL (5/12) --- */}
      <div className="w-full md:w-5/12 flex items-center justify-center p-8 bg-white relative">
        
        {/* Background dots removed for a cleaner look as requested */}

        <div className="w-full max-w-md relative z-10">
          <div className="mb-14">
            <h1 className="text-7xl font-black text-black mb-4 tracking-tighter">
              Login<span className="text-[#FF6B6B]">.</span>
            </h1>
            <p className="text-xl font-bold text-gray-500 leading-tight">
              Connect to your workspace.
            </p>
          </div>

          <div className="space-y-10">
            {/* GOOGLE BUTTON - REFINED DIMENSIONS & SVG */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="group w-full bg-white border-[4px] border-black text-black font-black py-10 px-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2 transition-all duration-150"
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center bg-white p-2 border-2 border-black rounded-lg group-hover:bg-[#f8f8f8] transition-colors">
                    {/* Balanced Google G-Logo SVG */}
                    <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-2xl md:text-3xl uppercase tracking-tighter">Google Sync</span>
                    <span className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">Instant Access</span>
                </div>
              </div>
              <ArrowRight className="w-10 h-10 hidden sm:block" strokeWidth={4} />
            </button>

            
          </div>

          <div className="mt-20 flex justify-center gap-10 border-t-2 border-black/5 pt-8">
          </div>
        </div>
      </div>
    </div>
  );
}