import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";

const SUGGESTIONS = [
  "Şöbələr və həkimlər",
  "Randevu necə alınır?",
  "Qiymətlər haqqında",
  "İş saatları",
];

export default function AiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  // Hide floating widget if user is already on the dedicated full /ai page
  const isOnAiPage = location.pathname === "/ai";

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      api.get("/ai/messages")
        .then((r) => setMessages(r.data.data || []))
        .catch(() => {});
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending, isOpen]);

  if (isOnAiPage) return null;

  const ask = async (question) => {
    if (!question.trim() || sending) return;

    const userMsg = question.trim();
    setText("");
    setMessages((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, role: "user", content: userMsg },
    ]);
    setSending(true);

    try {
      const endpoint = isAuthenticated ? "/ai/ask" : "/ai/public-ask";
      const r = await api.post(endpoint, { question: userMsg });

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: "assistant", content: r.data.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Bağışlayın, cavab alına bilmədi. Zəhmət olmasa yenidən cəhd edin.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!confirm("Söhbəti təmizləmək istəyirsiniz?")) return;
    if (isAuthenticated) {
      try {
        await api.delete("/ai/messages");
      } catch (e) {}
    }
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Popover */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[80vh] mb-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-slate-800/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg shadow-md shadow-emerald-500/20">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-white leading-none">NovaCare Köməkçi</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAuthenticated ? "Şəxsi & Ümumi məlumat" : "Ümumi xəstəxana köməkçisi"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isAuthenticated && messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Söhbəti təmizlə"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => navigate("/ai")}
                title="Böyük ekranda aç"
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Guest Notice */}
          {!isAuthenticated && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-300">
              <span>Şəxsi randevu və analizlərinizi görmək üçün daxil olun.</span>
              <button
                onClick={() => { setIsOpen(false); navigate("/login"); }}
                className="font-semibold underline hover:text-amber-200 ml-2 shrink-0"
              >
                Giriş et
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.length === 0 && !sending && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-2xl">
                  👋
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Salam! Sizə necə kömək edə bilərəm?</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {isAuthenticated
                      ? "Şöbələr, həkimlər, randevularınız və nəticələriniz haqqında soruşa bilərsiniz."
                      : "Şöbələr, həkimlər və saytdan istifadə haqqında soruşa bilərsiniz."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 w-full pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="text-left text-[12px] text-slate-300 bg-slate-800/60 hover:bg-emerald-600/20 hover:border-emerald-500/30 border border-white/5 rounded-xl px-3 py-2 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs shadow-md shadow-emerald-900/20"
                      : "bg-slate-800 border border-white/5 text-slate-200 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-white/5 px-3 py-2 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); ask(text); }}
            className="p-3 bg-slate-950/80 border-t border-white/10 flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Sualınızı bura yazın..."
              disabled={sending}
              className="flex-1 px-3 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-medium rounded-xl hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center shrink-0 shadow-md shadow-emerald-900/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="AI Chat Köməkçi"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75 group-hover:opacity-100" />

        {isOpen ? (
          <svg className="w-6 h-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative z-10 flex items-center justify-center text-2xl">
            🤖
          </div>
        )}
      </button>
    </div>
  );
}
