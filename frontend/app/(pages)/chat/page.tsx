"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Brain,
  LogOut,
  BookOpen,
  Target,
  Activity,
  User as UserIcon,
  Plus,
  Send,
  ArrowLeft,
  X,
  FileText,
} from "lucide-react";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // LOAD HISTORY if sessionId exists
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get("sessionId");
    
    if (sid && session?.user?.email) {
      const sessionIdInt = parseInt(sid);
      setCurrentSessionId(sessionIdInt);
      
      const fetchHistory = async () => {
        try {
          const res = await fetch(`/api/chat/history?sessionId=${sid}`);
          if (res.ok) {
            const history = await res.json();
            setMessages(history.map((m: any) => ({
                role: m.role,
                content: m.content
            })));
          }
        } catch (e) {
          console.error("Failed to load history", e);
        }
      };
      fetchHistory();
    }
  }, [session]);

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // FEEDBACK LOOP: Handle returning from a quiz
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("quiz_done") === "true") {
      const results = sessionStorage.getItem("last_quiz_results");
      if (results) {
        const parsedResults = JSON.parse(results);
        const feedbackPrompt = `I just finished the quiz "${parsedResults.title}". 
Score: ${parsedResults.score}/${parsedResults.total}.
Areas for improvement: ${parsedResults.missed_topics.join(", ") || "None"}.
What are my next steps for learning?`;
        
        // Clear the storage and URL to prevent infinite loop
        sessionStorage.removeItem("last_quiz_results");
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Auto-submit the feedback
        setPrompt(feedbackPrompt);
        // We trigger the submit after a short delay to ensure state is ready
        setTimeout(() => {
           const btn = document.querySelector("#send-btn") as HTMLButtonElement;
           btn?.click();
        }, 500);
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim() && !selectedFile) return;

    const userMessage = prompt.trim();
    const displayMessage = userMessage || (selectedFile ? `Attached file: ${selectedFile.name}` : "");
    
    setMessages((prev) => [...prev, { role: "user", content: displayMessage }]);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("prompt", userMessage);
    if (currentSessionId) {
      formData.append("session_id", currentSessionId.toString());
    }
    
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "bot", content: data.text }]);
        if (data.session_id && data.session_id !== currentSessionId) {
            setCurrentSessionId(data.session_id);
            // Optional: update URL to reflect session
            window.history.replaceState({}, "", `/chat?sessionId=${data.session_id}`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessages((prev) => [...prev, { role: "bot", content: `Error: ${errorData.error || "Failed to process request."}` }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", content: "Error: Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }

    setPrompt("");
    setSelectedFile(null);
  };

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
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] flex flex-col">
      {/* NAVBAR */}
      <nav className="w-full bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
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

      {/* CHAT AREA */}
      <main className={`flex-1 max-w-4xl mx-auto w-full px-6 py-10 flex flex-col ${messages.length === 0 ? "justify-center items-center text-center" : "overflow-y-auto"}`}>
        {messages.length === 0 ? (
          <div className="bg-white border-2 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">New conversation</h2>
            <p className="text-gray-600">Start learning something new with Neuro AI.</p>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col gap-6 text-left pb-4">
            {messages.map((msg, index) => {
              // Parse for quiz tags
              const quizMatch = msg.content.match(/<quiz>([\s\S]*?)<\/quiz>/);
              const cleanContent = msg.content.replace(/<quiz>([\s\S]*?)<\/quiz>/, "").trim();
              const hasQuiz = msg.role === "bot" && quizMatch && quizMatch[1];

              return (
                <div key={index} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                    {msg.role === "bot" && (
                      <div className="w-8 h-8 mr-3 mt-1 bg-purple-500 rounded-lg border-2 border-black flex-shrink-0 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-4 rounded-xl border-2 border-black ${msg.role === "user" ? "bg-purple-100 rounded-br-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black" : "bg-white rounded-bl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"}`}>
                      <div className="prose prose-sm md:prose-base whitespace-pre-wrap">
                        {cleanContent || (hasQuiz ? "I've prepared a test based on our discussion. Are you ready?" : "...")}
                      </div>
                    </div>
                  </div>

                  {/* READY BUTTON FOR QUIZ */}
                  {hasQuiz && (
                    <div className="ml-11 mt-4">
                      <button
                        onClick={() => {
                          try {
                            const quizData = JSON.parse(quizMatch![1]);
                            sessionStorage.setItem("current_quiz", JSON.stringify(quizData));
                            router.push("/quiz");
                          } catch (e) {
                            console.error("Failed to parse quiz JSON", e);
                          }
                        }}
                        className="bg-[#FF9F1C] hover:bg-[#ff8c00] border-2 border-black px-6 py-2.5 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-2"
                      >
                        <Target className="w-5 h-5" />
                        Ready to answer questions
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
                <div className="p-4 rounded-xl border-2 border-black bg-white rounded-bl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* CHAT INPUT */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-10">
        
       {/* File Attachment Pill */}
       {selectedFile && (
          <div className="mb-3 mx-4 flex items-center gap-2 bg-purple-100 border-2 border-purple-300 w-max px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <button 
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''; // Reset input so same file can be selected again
                }
              }}
              className="p-1 hover:bg-purple-200 rounded-full ml-1 text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-3 h-3" strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="flex items-center bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2">
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,image/*" 
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Ask anything or attach a file..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="flex-1 outline-none px-3 py-2 bg-transparent"
          />

          <button
            id="send-btn"
            onClick={handleSubmit}
            className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
