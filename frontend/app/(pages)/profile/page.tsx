"use client";

import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ProfileData {
  visual_affinity: number;
  textual_affinity: number;
  depth_preference: number;
  logic_preference: number;
  primary_archetype: string;
}

export default function ProfileDashboard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [mounted, setMounted] = useState(false); // FIXED: Prevents Hydration Error

  useEffect(() => {
    setMounted(true);
    // Fetch user profile - ensure your backend is running!
    fetch("http://127.0.0.1:8000/api/v1/profile/?user_id=1")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  // Show a skeleton or loading state while waiting for the client-side mount
  if (!mounted || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans">
        <div className="animate-pulse text-gray-400">Loading Neuro-Profile...</div>
      </div>
    );
  }

  const chartData = [
    { subject: "Visual", A: profile.visual_affinity },
    { subject: "Textual", A: profile.textual_affinity },
    { subject: "Logic", A: profile.logic_preference },
    { subject: "Depth", A: profile.depth_preference },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans bg-white min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cognitive Profile</h1>
        <div className="mt-3 inline-block px-4 py-1 bg-blue-50 rounded-full border border-blue-100">
          <p className="text-blue-600 font-mono text-sm font-bold tracking-widest uppercase">
            {profile.primary_archetype.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Radar Chart Section */}
        <div className="h-[400px] w-full bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 13, fontWeight: 500 }} />
              <PolarRadiusAxis domain={[0, 'auto']} tick={false} axisLine={false} />
              <Radar
                name="Stats"
                dataKey="A"
                stroke="#2563eb"
                strokeWidth={3}
                fill="#3b82f6"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Dimension Breakdown
            </h2>
            <div className="space-y-5">
              <StatBar label="Visual Affinity" value={profile.visual_affinity} color="bg-purple-500" />
              <StatBar label="Textual Affinity" value={profile.textual_affinity} color="bg-blue-500" />
              <StatBar label="Logical Reasoning" value={profile.logic_preference} color="bg-orange-500" />
              <StatBar label="Depth/Focus" value={profile.depth_preference} color="bg-emerald-500" />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              Your profile is computed based on dwell time and interaction patterns across different content types.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  // Normalize value to a percentage for the UI bar
  const percentage = Math.min((value / 50) * 100, 100); 

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5 font-medium text-gray-700">
        <span>{label}</span>
        <span className="text-gray-400">{value} pts</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}