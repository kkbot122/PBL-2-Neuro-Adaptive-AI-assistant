"use client";

import { useEffect, useState } from "react";
import { Activity, Target, Zap, Maximize, Eye, Layout } from "lucide-react";
import {
  getFSLSMVectorAction,
  applyBehavioralSignalsAction,
  FSLSMVectorResponse,
} from "@/app/actions/profile";

interface NeuroSidebarProps {
  isOpen: boolean;
  refreshTrigger: number; 
  sessionId?: number | null;
}

export function NeuroSidebar({ isOpen, refreshTrigger, sessionId }: NeuroSidebarProps) {
  const [vector, setVector] = useState<FSLSMVectorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    getFSLSMVectorAction()
      .then(setVector)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen, refreshTrigger]);

  const handleNudge = async (signal: string) => {
    try {
      const updated = await applyBehavioralSignalsAction([signal], sessionId);
      setVector(updated);
    } catch (err) {
      console.error("Nudge failed", err);
    }
  };

  const renderDimensionBar = (
    dim: string,
    val: number,
    leftLabel: string,
    rightLabel: string,
  ) => {
    const percent = ((val + 1) / 2) * 100;

    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
          <span className={val < 0 ? "text-purple-600" : "text-gray-500"}>
            {leftLabel}
          </span>
          <span className={val > 0 ? "text-purple-600" : "text-gray-500"}>
            {rightLabel}
          </span>
        </div>
        <div className="relative h-3 w-full bg-gray-200 rounded-full border border-black overflow-hidden shadow-[inset_1px_1px_0px_0px_rgba(0,0,0,0.2)]">
          <div
            className="absolute top-0 bottom-0 left-0 bg-transparent z-[1]"
            style={{ width: "50%", borderRight: "2px solid black" }}
          />
          <div
            className="absolute top-0 bottom-0 bg-[#FF9F1C] transition-all duration-500 ease-out z-0"
            style={{
              left: val < 0 ? `${percent}%` : "50%",
              right: val > 0 ? `${100 - percent}%` : "50%",
              width: val === 0 ? "0%" : `${Math.abs(val) * 50}%`,
            }}
          />
        </div>
        {vector?.labels && vector.labels[dim] && (
          <div className="text-center text-[10px] text-gray-500 mt-1 font-mono uppercase">
            {vector.labels[dim]}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="w-72 md:w-80 border-l-2 border-black bg-white flex flex-col h-full z-10 shadow-[-4px_0px_0px_0px_rgba(0,0,0,0.1)] overflow-y-auto shrink-0 transition-all duration-300">
      <div className="p-4 border-b-2 border-black bg-purple-50 shrink-0">
        <h2 className="text-lg font-black flex items-center gap-2 uppercase tracking-wide">
          <Activity className="w-5 h-5 text-purple-600" />
          Neural Profile
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Live cognitive model driving this session.
        </p>
      </div>

      <div className="p-5 flex-1 pb-20">
        {isLoading && !vector ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded border-2 border-dashed border-gray-300"
              />
            ))}
          </div>
        ) : vector ? (
          <div className="space-y-6">
            <div>
              {renderDimensionBar("reception", vector.reception, "Visual", "Verbal")}
              {renderDimensionBar("understanding", vector.understanding, "Sequential", "Global")}
              {renderDimensionBar("processing", vector.processing, "Active", "Reflective")}
              {renderDimensionBar("perception", vector.perception, "Sensing", "Intuitive")}
            </div>

            <div className="pt-4 border-t-2 border-dashed border-gray-300">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3" /> Explicit Nudges
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNudge("nudge_more_visual")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-purple-500 shrink-0" /> +Visuals
                </button>
                <button
                  onClick={() => handleNudge("nudge_more_verbal")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Layout className="w-3 h-3 text-purple-500 shrink-0" /> +Text
                </button>
                <button
                  onClick={() => handleNudge("nudge_more_global")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Maximize className="w-3 h-3 text-green-500 shrink-0" /> Big Pic
                </button>
                <button
                  onClick={() => handleNudge("nudge_more_sequential")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Target className="w-3 h-3 text-green-500 shrink-0" /> Steps
                </button>
                <button
                  onClick={() => handleNudge("nudge_more_active")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-orange-500 shrink-0" /> Active
                </button>
                <button
                  onClick={() => handleNudge("nudge_more_reflective")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Activity className="w-3 h-3 text-orange-500 shrink-0" /> Reflect
                </button>
                <button
                  onClick={() => handleNudge("nudge_more_sensing")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Target className="w-3 h-3 text-blue-500 shrink-0" /> Concrete
                </button>
                <button
                  onClick={() => handleNudge("nudge_more_intuitive")}
                  className="px-2 py-1.5 text-[10px] md:text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-1"
                >
                  <Maximize className="w-3 h-3 text-blue-500 shrink-0" /> Intuitive
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center font-bold">
            Failed to load profile.
          </div>
        )}
      </div>
    </div>
  );
}