"use client";

import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";

interface ProfileData {
  primary_archetype: string;
  raw_scores: {
    visual: number;
    structural: number;
    active: number;
    logic?: number;
  };
}

export default function ProfileDashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!session?.user?.email) return;

    // FIXED: Actually parse the response and set the state!
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/me`, {
      headers: {
        "x-user-email": session.user.email,
        "x-internal-token": process.env.NEXT_PUBLIC_INTERNAL_API_KEY || "dev_secret_key_123",
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching profile", err));
  }, [session]);

  if (!mounted || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F1EA] font-[family-name:var(--font-kodchasan)]">
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse font-bold">
          LOADING NEURO-PROFILE...
        </div>
      </div>
    );
  }

  const chartData = [
    { subject: "Visual", A: profile.raw_scores.visual || 0 },
    { subject: "Structural", A: profile.raw_scores.structural || 0 },
    { subject: "Active", A: profile.raw_scores.active || 0 },
    { subject: "Logic", A: profile.raw_scores.logic || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] py-12 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-block bg-[#FF9F1C] border-2 border-black px-4 py-1 text-sm font-bold mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-1">
            BRAIN SCANNED
          </div>
          <h1 className="text-5xl font-extrabold uppercase tracking-tight mb-6">Cognitive Profile</h1>
          <div className="inline-block px-6 py-2 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <p className="text-black font-extrabold text-xl tracking-widest uppercase">
              {profile.primary_archetype.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Radar Chart Section */}
          <div className="h-[450px] w-full bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#000" strokeWidth={2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#000", fontSize: 14, fontWeight: 800 }} />
                <PolarRadiusAxis domain={[0, "auto"]} tick={false} axisLine={false} />
                <Radar
                  name="Stats"
                  dataKey="A"
                  stroke="#000"
                  strokeWidth={4}
                  fill="#CBF3F0"
                  fillOpacity={0.9}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Section */}
          <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-extrabold uppercase border-b-4 border-black pb-4 mb-8">
              Dimension Breakdown
            </h2>
            <div className="space-y-8">
              <StatBar label="VISUAL AFFINITY" value={profile.raw_scores?.visual || 0} color="bg-[#FF6B6B]" />
              <StatBar label="STRUCTURAL OVERVIEWS" value={profile.raw_scores?.structural || 0} color="bg-[#FF9F1C]" />
              <StatBar label="ACTIVE ENGAGEMENT" value={profile.raw_scores?.active || 0} color="bg-[#CBF3F0]" />
              <StatBar label="LOGICAL REASONING" value={profile.raw_scores?.logic || 0} color="bg-[#FFD6A5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Neubrutalist Stat Bar
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const percentage = Math.min((value / 50) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-2 font-extrabold uppercase">
        <span>{label}</span>
        <span className="bg-black text-white px-2 py-0.5">{value} PTS</span>
      </div>
      <div className="w-full bg-gray-200 border-2 border-black h-6 overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div
          className={`${color} h-full border-r-2 border-black transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}