import { useState, useRef, useEffect } from "react";
import api from "../../lib/api";

/**
 * components/sections/AskSufyanAI.tsx
 * ----------------
 * Ye tumhare portfolio ka naya AI section hai. Isko tum Home page
 * mein kahin bhi drop kar sakte ho, e.g. Experience section ke baad:
 *
 *   import AskSufyanAI from "../components/sections/AskSufyanAI";
 *   ...
 *   <AskSufyanAI />
 *
 * Kya kar raha hai:
 *  - 4 quick-mode buttons dikhata hai (Ask / Job Match / Challenge / Architect)
 *  - Chat interface: message bhejo, /api/chat ko call karo
 *  - Response ke sath "Evidence" chips dikhata hai (source project names)
 *  - Agar backend "no evidence" bole, wo bhi clearly show hota hai
 *
 * Styling tumhare existing site ke design (light section, orange accent,
 * rounded soft cards, dark contact-style panel for the chat window) se
 * match karne ki koshish kar rahi hai — apne actual Tailwind tokens
 * (colors, radius) ke hisaab se adjust kar lena.
 */

type Mode = "ask" | "job_match" | "challenge" | "architect";

interface Source {
  title: string;
  sourceType: string;
  score: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  confidence?: string;
}

const MODES: { id: Mode; label: string; placeholder: string }[] = [
  { id: "ask", label: "Ask about Sufyan", placeholder: "e.g. What backend frameworks does he use?" },
  { id: "job_match", label: "Analyze for a Job", placeholder: "Paste a job description here..." },
  { id: "architect", label: "Build My Solution", placeholder: "Describe the system you need built..." },
  { id: "challenge", label: "Challenge His Experience", placeholder: "e.g. Has he built a banking app?" },
];

export default function AskSufyanAI() {
  const [mode, setMode] = useState<Mode>("ask");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post("/chat", { message: userMessage, mode });
      const data = response.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          sources: data.sources,
          confidence: data.confidence,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const activeMode = MODES.find((m) => m.id === mode)!;

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close Ask Sufyan AI" : "Open Ask Sufyan AI"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="fixed right-5 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:right-8"
      >
        <span aria-hidden="true" className="relative block h-6 w-7 rounded-md border-2 border-current">
          <span className="absolute -bottom-1 left-1 h-2 w-2 rotate-45 border-b-2 border-l-2 border-current bg-primary" />
        </span>
      </button>

      {isOpen && (
        <aside className="fixed inset-y-4 right-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-2xl md:inset-y-6 md:right-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-medium text-orange-400">AI ASSISTANT</p>
              <h2 className="text-xl font-semibold">Ask Sufyan AI</h2>
              <p className="mt-1 text-xs text-slate-400">Ask about experience, projects, or architecture.</p>
            </div>
            <button
              type="button"
              aria-label="Close Ask Sufyan AI"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  mode === m.id
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <p className="text-sm text-slate-400">Try: “{activeMode.placeholder}”</p>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block max-w-[92%] rounded-xl px-4 py-3 text-[15px] leading-6 ${m.role === "user" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-100"}`}>
                  {m.text}
                </div>

                {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.sources.map((s, j) => (
                      <span key={j} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-orange-300">
                        {s.title}
                      </span>
                    ))}
                    {m.confidence && <span className="rounded-md px-2 py-1 text-xs text-slate-400">Confidence: {m.confidence}</span>}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-left">
                <div className="inline-block rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-400">Retrieving evidence...</div>
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={activeMode.placeholder}
              className="min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </aside>
      )}
    </>
  );
}