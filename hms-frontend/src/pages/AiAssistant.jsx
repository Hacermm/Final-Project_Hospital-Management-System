import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

const SUGGESTIONS = [
  "Hansı həkimlər var?",
  "Necə randevu ala bilərəm?",
  "Reseptimi haradan yükləyə bilərəm?",
  "Kardiologiya şöbəsi haqqında məlumat verin",
];

export default function AiAssistant() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/ai/messages").then((r) => setMessages(r.data.data)).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const ask = async (question) => {
    if (!question.trim() || sending) return;

    setText("");
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, role: "user", content: question }]);
    setSending(true);

    try {
      const endpoint = isAuthenticated ? "/ai/ask" : "/ai/public-ask";
      const r = await api.post(endpoint, { question });
      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: "assistant", content: r.data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", content: "Bağışlayın, cavab alına bilmədi. Bir azdan yenidən cəhd edin." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!confirm("Söhbəti təmizləmək istəyirsiniz?")) return;
    if (isAuthenticated) {
      await api.delete("/ai/messages");
    }
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto p-3 md:p-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
        <div className="glass-card flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg">
              🤖
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white">NovaCare Köməkçi</p>
              <p className="text-xs text-slate-400">Suallarınızı cavablandırıram</p>
            </div>
            {messages.length > 0 && (
              <button onClick={clearChat} className="ml-auto text-xs text-slate-500 hover:text-red-400 shrink-0">
                Təmizlə
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3">
            {messages.length === 0 && !sending && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-5xl mb-4">🤖</div>
                <p className="text-slate-300 font-medium mb-2">Salam! Sizə necə kömək edə bilərəm?</p>
                <p className="text-slate-500 text-sm mb-6">Randevu, həkimlər, şöbələr və sayt haqqında soruşun</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="text-left text-sm text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-xl px-4 py-3 transition"
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
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-md"
                      : "bg-slate-700/50 text-slate-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); ask(text); }}
            className="p-3 md:p-4 border-t border-white/5 flex gap-2 md:gap-3"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Sualınızı yazın..."
              disabled={sending}
              className="flex-1 px-4 md:px-5 py-3 bg-slate-800/50 border border-white/5 rounded-2xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>

        <p className="text-[11px] text-slate-600 text-center mt-2">
          AI köməkçi tibbi diaqnoz qoymur. Sağlamlıq problemləri üçün həkimə müraciət edin.
        </p>
      </div>
    </div>
  );
}