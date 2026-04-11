"use client";

import { signIn } from "next-auth/react";
import {
  Brain,
  TrendingUp,
  GitBranch,
  Sparkles,
  ArrowRight,
  BarChart3,
  Layout,
  MessageSquare,
} from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] font-[family-name:var(--font-kodchasan)] flex">
      {/* --- LEFT COLUMN: Value Proposition --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo Area */}
          <div>
            <div className="flex items-center gap-2 mb-16">
              <span className="text-white text-xl font-bold tracking-tight">
                NeuroLearn
              </span>
            </div>
          </div>

          {/* Main Value Prop */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 w-fit">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-bold">
                Continuous Adaptation Engine
              </span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight">
              An AI that <br />
              <span className="border-b-4 border-yellow-300 inline-block">
                evolves with you
              </span>
            </h1>

            <p className="text-white/80 text-lg leading-relaxed">
              Not static personas. Not fixed teaching styles. <br />
              Your tutor changes explanation and UI in real-time <br />
              based on how you think and interact.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Layout className="w-5 h-5 text-yellow-300 mb-2" />
                <h3 className="text-white font-bold text-sm">Dynamic UI</h3>
                <p className="text-white/60 text-xs">Morphs as you learn</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <BarChart3 className="w-5 h-5 text-yellow-300 mb-2" />
                <h3 className="text-white font-bold text-sm">12+ Dimensions</h3>
                <p className="text-white/60 text-xs">Tracked in real-time</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <GitBranch className="w-5 h-5 text-yellow-300 mb-2" />
                <h3 className="text-white font-bold text-sm">
                  Continuous Loop
                </h3>
                <p className="text-white/60 text-xs">
                  Adapts after every message
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <MessageSquare className="w-5 h-5 text-yellow-300 mb-2" />
                <h3 className="text-white font-bold text-sm">Vector Memory</h3>
                <p className="text-white/60 text-xs">Remembers your style</p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-white/40 text-xs">
            <p>© 2026 NeuroLearn. Built for the future of adaptive learning.</p>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: Sign In Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Decorative floating elements */}
        <div className="absolute top-10 right-10 w-12 h-12 bg-yellow-300 border-2 border-black rounded-lg flex items-center justify-center rotate-6">
          <TrendingUp className="w-6 h-6 text-black" />
        </div>
        <div className="absolute bottom-10 left-10 w-10 h-10 bg-[#2EC4B6] border-2 border-black rounded-lg flex items-center justify-center -rotate-6">
          <GitBranch className="w-5 h-5 text-black" />
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md">
          {/* Sign In Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#FF6B6B] rounded-xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4 rotate-[-2deg] hover:rotate-0 transition-transform">
                <Brain className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Continue your journey
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to access your adaptive learning profile
              </p>
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full bg-white border-2 border-black text-black font-bold py-3 px-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Divider */}
            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t-2 border-black/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold tracking-wider">
                No static personas
              </span>
              <div className="flex-grow border-t-2 border-black/10"></div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  Real-time adaptation
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  Vector-based memory
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  Dynamic UI
                </span>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[10px] text-gray-400 mt-6">
              By continuing, you agree to our{" "}
              <span className="underline decoration-1 decoration-purple-400 cursor-pointer hover:text-purple-600">
                Terms
              </span>{" "}
              and{" "}
              <span className="underline decoration-1 decoration-purple-400 cursor-pointer hover:text-purple-600">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
