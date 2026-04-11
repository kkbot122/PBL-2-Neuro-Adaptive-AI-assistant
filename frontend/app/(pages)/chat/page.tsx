"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Brain,
  Plus,
  Send,
  ArrowLeft,
  X,
  FileText,
  Target,
  Activity,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import { NeuroSidebar } from "./components/NeuroSidebar";
import { applyBehavioralSignalsAction } from "@/app/actions/profile";

type Message = {
  role: "user" | "bot";
  content: string;
};

// ── WIDGET COMPONENTS ───────────────────────────────────

function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // @ts-ignore
    if (window.mermaid) {
      ref.current.innerHTML = `<div class="mermaid">${code}</div>`;
      // @ts-ignore
      window.mermaid.init(undefined, ref.current.querySelector(".mermaid"));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
    script.onload = () => {
      // @ts-ignore
      window.mermaid.initialize({ startOnLoad: false, theme: "neutral" });
      if (!ref.current) return;
      ref.current.innerHTML = `<div class="mermaid">${code}</div>`;
      // @ts-ignore
      window.mermaid.init(undefined, ref.current.querySelector(".mermaid"));
    };
    document.head.appendChild(script);
  }, [code]);

  return (
    <div className="mt-3 bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mb-2 block">
        Visual Map
      </span>
      <div ref={ref} />
    </div>
  );
}

function StepTracker({ steps }: { steps: { number: number; title: string; body: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-3 border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-blue-50 px-4 py-2 border-b-2 border-black">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
          Step-by-Step
        </span>
      </div>
      <div className="flex">
        {/* Step list */}
        <div className="w-1/3 border-r-2 border-black bg-gray-50">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-full text-left px-3 py-2.5 border-b border-gray-200 transition-all text-xs font-bold flex items-center gap-2 ${
                active === i ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[10px] flex-shrink-0 font-black ${
                  active === i ? "bg-blue-500 text-white border-blue-700" : "bg-white"
                }`}
              >
                {s.number}
              </span>
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
        {/* Step detail */}
        <div className="flex-1 p-4 bg-white">
          <p className="text-sm font-black mb-2 text-blue-800">
            Step {steps[active]?.number}: {steps[active]?.title}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{steps[active]?.body}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setActive((p) => Math.max(0, p - 1))}
              disabled={active === 0}
              className="px-3 py-1 text-xs font-bold border-2 border-black rounded-lg disabled:opacity-30 hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
              ← Prev
            </button>
            <button
              onClick={() => setActive((p) => Math.min(steps.length - 1, p + 1))}
              disabled={active === steps.length - 1}
              className="px-3 py-1 text-xs font-bold border-2 border-black rounded-lg bg-blue-500 text-white disabled:opacity-30 hover:bg-blue-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptMap({ central, connections }: { central: string; connections: { label: string; node: string }[] }) {
  return (
    <div className="mt-3 bg-yellow-50 border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-800 mb-3 block">
        Big Picture First
      </span>
      <div className="flex flex-col items-center gap-3">
        <div className="bg-[#FF9F1C] border-2 border-black rounded-lg px-4 py-2 font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          {central}
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          {connections.map((c, i) => (
            <div key={i} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[9px] uppercase font-black text-gray-400 block">{c.label}</span>
              <span className="text-xs font-semibold">{c.node}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConcreteExample({ scenario, breakdown }: { scenario: string; breakdown: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 bg-green-50 border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-green-100 transition-colors"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-green-800">
          Real-World Example
        </span>
        <span className="text-green-700 font-black text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t-2 border-black">
          <p className="text-sm font-bold text-green-900 mt-3 mb-1">Scenario</p>
          <p className="text-sm text-gray-700 mb-3">{scenario}</p>
          <p className="text-sm font-bold text-green-900 mb-1">Breakdown</p>
          <p className="text-sm text-gray-700">{breakdown}</p>
        </div>
      )}
    </div>
  );
}

// ── MAIN CHAT COMPONENT ─────────────────────────────────

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<{name: string; url: string; type: string} | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [pendingFeedback, setPendingFeedback] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);
  const [ratedMessages, setRatedMessages] = useState<Set<number>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentFeedback = useRef(false);
  const currentSessionIdRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sidFromUrl = params.get("sessionId");
    const quizDone = params.get("quiz_done") === "true";

    const rawId = sidFromUrl ?? (quizDone ? sessionStorage.getItem("chat_session_id") : null);
    const parsedId = rawId ? parseInt(rawId, 10) : NaN;

    if (!isNaN(parsedId)) {
      setCurrentSessionId(parsedId);
      currentSessionIdRef.current = parsedId;
    }

    if (quizDone) {
      const resultsRaw = sessionStorage.getItem("last_quiz_results");
      sessionStorage.removeItem("last_quiz_results");

      if (resultsRaw) {
        try {
          const r = JSON.parse(resultsRaw);
          const missed = r.missed_topics?.length
            ? `I struggled with: ${r.missed_topics.join(", ")}.`
            : "I got everything right!";
          const msg =
            `I just completed the quiz **"${r.title}"** and scored **${r.score}/${r.total}**. ` +
            `${missed} Based on my performance, what should I focus on next? ` +
            `Please give me a structured learning plan for improving my weak areas.`;
          setPendingFeedback(msg);
        } catch {
          // silently ignore
        }
      }

      const cleanUrl = !isNaN(parsedId) ? `/chat?sessionId=${parsedId}` : "/chat";
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  useEffect(() => {
    if (!currentSessionId || !session?.user?.email) return;

    setIsHistoryLoading(true);
    fetch(`/api/chat/history?sessionId=${currentSessionId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load history");
        return r.json();
      })
      .then((data: Array<{ role: string; content: string }>) => {
        if (Array.isArray(data)) {
          setMessages(
            data.map((m) => ({
              role: m.role as "user" | "bot",
              content: m.content,
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setIsHistoryLoading(false));
  }, [currentSessionId, session?.user?.email]);

  const handleSubmit = useCallback(
    async (overrideMessage?: string) => {
      const userMessage = (overrideMessage ?? prompt).trim();
      if (!userMessage && !selectedFile) return;

      const displayMessage = userMessage || (selectedFile ? `Attached file: ${selectedFile.name}` : "");

      setMessages((prev) => [...prev, { role: "user", content: displayMessage }]);
      setIsLoading(true);
      setPrompt("");

      if (selectedFile) {
        const url = URL.createObjectURL(selectedFile);
        setFilePreview({ name: selectedFile.name, url, type: selectedFile.type });
      }

      const formData = new FormData();
      formData.append("prompt", userMessage);
      
      const sid = currentSessionIdRef.current;
      if (sid) {
        formData.append("session_id", sid.toString());
      }
      
      if (selectedFile) {
        formData.append("file", selectedFile);
        setSelectedFile(null);
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prev) => [...prev, { role: "bot", content: data.text }]);
          setSidebarRefreshTrigger((prev) => prev + 1);

          if (data.session_id && data.session_id !== currentSessionIdRef.current) {
            setCurrentSessionId(data.session_id);
            currentSessionIdRef.current = data.session_id;
            window.history.replaceState({}, "", `/chat?sessionId=${data.session_id}`);
            sessionStorage.setItem("chat_session_id", data.session_id.toString());
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error ?? "Failed to process request.";
          setMessages((prev) => [
            ...prev,
            { role: "bot", content: `**Error:** ${errMsg}` },
          ]);
        }
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "**Error:** Connection lost. Please try again." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, selectedFile, currentSessionId],
  );

  useEffect(() => {
    if (
      pendingFeedback &&
      !isHistoryLoading &&
      !hasSentFeedback.current &&
      session?.user?.email
    ) {
      hasSentFeedback.current = true;
      setPendingFeedback(null);
      handleSubmit(pendingFeedback);
    }
  }, [pendingFeedback, isHistoryLoading, session?.user?.email, handleSubmit]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen bg-[#F4F1EA] flex flex-col items-center justify-center font-[family-name:var(--font-kodchasan)]">
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
    <div className="h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] flex flex-col overflow-hidden">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="w-full bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full border-2 border-transparent hover:border-black transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-purple-500 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight hidden md:block">
            Neuro Chat
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-black transition-all ${isSidebarOpen ? "bg-purple-200 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-purple-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0 active:translate-x-0"}`}
          >
            <Activity className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-sm hidden md:block">Profile</span>
          </button>

          <div className="flex items-center gap-3 bg-yellow-100 px-3 py-1.5 rounded-lg border-2 border-black">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-black"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full border border-black flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full" />
              </div>
            )}
            <span className="font-bold text-sm hidden md:block">
              {session.user?.name?.split(" ")[0]}
            </span>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT W/ SIDEBAR ──────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── CHAT AREA ──────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-6">
            {/* Empty state */}
            {messages.length === 0 && !isHistoryLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
                <div className="bg-white border-2 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md">
                  <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">New Session</h2>
                  <p className="text-gray-600 text-sm">
                    Ask a question, attach a file, or request a quiz on any topic.
                  </p>
                </div>
              </div>
            )}

            {/* History loading */}
            {isHistoryLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 bg-white border-2 border-black px-5 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="text-sm font-semibold text-gray-500">
                    Loading history...
                  </span>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div className="flex flex-col gap-6">
                {messages.map((msg, index) => {
                  let isJson = false;
                  let parsedData: any = {};
                  let rawDialogue = msg.content;

                  if (msg.role === "bot") {
                    try {
                      parsedData = JSON.parse(msg.content);
                      isJson = true;
                      rawDialogue = parsedData.dialogue || "";
                    } catch (e) {
                      isJson = false;
                    }
                  }

                  const quizMatch = rawDialogue.match(/<quiz>([\s\S]*?)<\/quiz>/);
                  const cleanContent = rawDialogue.replace(/<quiz>[\s\S]*?<\/quiz>/, "").trim();
                  const hasLegacyQuiz = msg.role === "bot" && !!quizMatch?.[1];

                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                        {msg.role === "bot" && (
                          <div className="w-8 h-8 mr-3 mt-1 bg-purple-500 rounded-lg border-2 border-black flex-shrink-0 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                        )}

                        <div
                          className={`max-w-[82%] p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                            msg.role === "user"
                              ? "bg-purple-100 rounded-br-none"
                              : "bg-white rounded-bl-none"
                          }`}
                        >
                          {msg.role === "bot" ? (
                            <div className="flex flex-col gap-4">
                              <MarkdownMessage
                                content={
                                  cleanContent ||
                                  (hasLegacyQuiz
                                    ? "I've prepared an assessment for you. Click below when ready."
                                    : "...")
                                }
                              />

                              {isJson && parsedData.visual_aid?.type === "mermaid" && parsedData.visual_aid.code && (
                                <MermaidDiagram code={parsedData.visual_aid.code} />
                              )}

                              {isJson && parsedData.interactive_check?.questions && (
                                <div className="mt-2 bg-blue-50 border-2 border-black rounded-lg p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                  <span className="text-xs font-bold uppercase text-blue-800 tracking-wider mb-3 block">
                                    {parsedData.interactive_check.title || "Quick Check"}
                                  </span>
                                  {parsedData.interactive_check.questions.map((q: any, idx: number) => (
                                    <div key={idx} className="mb-4 last:mb-0">
                                      <p className="font-bold mb-3 text-sm">{q.question}</p>
                                      <div className="flex flex-col gap-2">
                                        {q.options?.map((opt: string, i: number) => (
                                          <button
                                            key={i}
                                            className="text-left px-3 py-2 border-2 border-black rounded-md hover:bg-blue-200 transition-colors text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                                            onClick={(e) => {
                                              const target = e.currentTarget;
                                              const parent = target.parentElement;
                                              target.style.backgroundColor = opt === q.answer ? "#86efac" : "#fca5a5";
                                              target.style.borderColor = opt === q.answer ? "#166534" : "#991b1b";
                                              
                                              if (parent && opt !== q.answer) {
                                                parent.querySelectorAll('button').forEach(btn => {
                                                  if (btn.innerText === q.answer) {
                                                    btn.style.backgroundColor = "#86efac";
                                                  }
                                                });
                                              }

                                              if (parent) {
                                                parent.querySelectorAll('button').forEach(btn => btn.disabled = true);
                                              }
                                              handleSubmit(`My answer to "${q.question}" is: "${opt}"`);
                                            }}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {isJson && parsedData.step_tracker?.steps?.length > 0 && (
                                <StepTracker steps={parsedData.step_tracker.steps} />
                              )}

                              {isJson && parsedData.concept_map?.central && (
                                <ConceptMap
                                  central={parsedData.concept_map.central}
                                  connections={parsedData.concept_map.connections || []}
                                />
                              )}

                              {isJson && parsedData.concrete_example?.scenario && (
                                <ConcreteExample
                                  scenario={parsedData.concrete_example.scenario}
                                  breakdown={parsedData.concrete_example.breakdown || ""}
                                />
                              )}

                              {!hasLegacyQuiz && cleanContent && (
                                <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-2">
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-2">
                                    Style Check
                                  </span>
                                  <button
                                    onClick={async () => {
                                      setRatedMessages((prev) => { const s = new Set(prev); s.add(index); return s; });
                                      try {
                                        await applyBehavioralSignalsAction(["prefer_visual", "prefer_overview"], currentSessionIdRef.current);
                                        setSidebarRefreshTrigger((prev) => prev + 1);
                                      } catch (e) { console.error("Style feedback failed", e); }
                                    }}
                                    disabled={ratedMessages.has(index)}
                                    className={`p-1.5 rounded transition-all ${ratedMessages.has(index) ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-400 hover:text-green-600 hover:bg-green-50"}`}
                                    title="This teaching style works for me"
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      setRatedMessages((prev) => { const s = new Set(prev); s.add(index); return s; });
                                      try {
                                        await applyBehavioralSignalsAction(["prefer_text", "prefer_details"], currentSessionIdRef.current);
                                        setSidebarRefreshTrigger((prev) => prev + 1);
                                      } catch (e) { console.error("Style feedback failed", e); }
                                    }}
                                    disabled={ratedMessages.has(index)}
                                    className={`p-1.5 rounded transition-all ${ratedMessages.has(index) ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-400 hover:text-red-600 hover:bg-red-50"}`}
                                    title="I'd prefer a different style"
                                  >
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <p className="text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
                              {filePreview && messages.indexOf(msg) === messages.findLastIndex(m => m.role === "user") && (
                                <div className="flex items-center gap-2 bg-purple-200 border-2 border-black rounded-lg px-3 py-2 w-fit">
                                  <FileText className="w-4 h-4 text-purple-700 flex-shrink-0" />
                                  <a href={filePreview.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-purple-800 underline underline-offset-2 truncate max-w-[180px]">
                                    {filePreview.name}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {hasLegacyQuiz && (
                        <div className="ml-11 mt-3">
                          <button
                            onClick={() => {
                              try {
                                const quizData = JSON.parse(quizMatch![1]);
                                sessionStorage.setItem("current_quiz", JSON.stringify(quizData));
                                sessionStorage.setItem("chat_session_id", currentSessionId?.toString() ?? "");
                                router.push("/quiz");
                              } catch (e) {
                                console.error("Failed to parse quiz JSON", e);
                              }
                            }}
                            className="bg-[#FF9F1C] hover:bg-[#ff8c00] border-2 border-black px-6 py-2.5 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-2 text-sm"
                          >
                            <Target className="w-4 h-4" />
                            Start Assessment
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 mr-3 mt-1 bg-purple-500 rounded-lg border-2 border-black flex-shrink-0 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-4 rounded-xl border-2 border-black bg-white rounded-bl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-2" />
              </div>
            )}
          </div>
        </main>

        {/* ── NEURO SIDEBAR ───────────────────────────────────── */}
        <NeuroSidebar isOpen={isSidebarOpen} refreshTrigger={sidebarRefreshTrigger} sessionId={currentSessionId} />
      </div>

      {/* ── CHAT INPUT ─────────────────────────────────────── */}
      <div className="flex-shrink-0 w-full bg-[#F4F1EA] border-t-2 border-black px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {selectedFile && (
            <div className="mb-3 flex items-center gap-2 bg-purple-100 border-2 border-purple-300 w-max px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="p-1 hover:bg-purple-200 rounded-full ml-1 text-gray-500 hover:text-black transition-colors"
              >
                <X className="w-3 h-3" strokeWidth={3} />
              </button>
            </div>
          )}

          <div className="flex items-center bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.txt,.md,.csv"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              title="Attach file"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Ask anything or attach a file..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isLoading}
              className="flex-1 outline-none px-3 py-2 bg-transparent text-sm md:text-base disabled:opacity-50"
            />

            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || (!prompt.trim() && !selectedFile)}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}