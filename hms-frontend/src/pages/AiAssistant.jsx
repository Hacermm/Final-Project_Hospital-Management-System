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
    if (!window.confirm("Söhbəti təmizləmək istəyirsiniz?")) return;
    if (isAuthenticated) {
      try {
        await api.delete("/ai/messages");
      } catch(e) {}
    }
    setMessages([]);
  };

  const styles = {
    container: { minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
    main: { flex: 1, maxWidth: "1050px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", boxSizing: "border-box" },
    card: { flex: 1, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", border: "1px solid rgba(227, 30, 36, 0.1)" },
    header: { padding: "22px 28px", background: "linear-gradient(135deg, #E31E24 0%, #B91C1C 100%)", display: "flex", alignItems: "center", gap: "16px", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(227, 30, 36, 0.25)" },
    avatar: { width: "50px", height: "50px", backgroundColor: "#FFFFFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "2px solid rgba(255,255,255,0.95)", flexShrink: 0 },
    avatarIcon: { width: "26px", height: "26px", color: "#E31E24" },
    headerText: { flex: 1 },
    headerTitle: { margin: 0, fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" },
    onlineBadge: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", backgroundColor: "rgba(255,255,255,0.18)", padding: "3px 10px", borderRadius: "99px", color: "#FFFFFF" },
    onlineDot: { width: "8px", height: "8px", backgroundColor: "#4ade80", borderRadius: "50%", animation: "fadeInOut 2s infinite" },
    headerSub: { margin: "4px 0 0", fontSize: "13px", opacity: 0.9, fontWeight: "500" },
    clearBtn: { background: "rgba(255,255,255,0.18)", border: "none", padding: "10px 18px", borderRadius: "12px", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" },
    chatArea: { flex: 1, padding: "28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "#F8FAFC" },
    welcomeBlock: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", animation: "fadeIn 0.5s ease" },
    welcomeIcon: { width: "88px", height: "88px", borderRadius: "50%", background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)", border: "2px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", boxShadow: "0 12px 32px rgba(227, 30, 36, 0.12)" },
    welcomeTitle: { margin: "0 0 10px 0", fontSize: "26px", fontWeight: "700", color: "#0F172A" },
    welcomeSubTitle: { margin: "0 0 8px 0", fontSize: "15px", fontWeight: "600", color: "#E31E24" },
    welcomeSub: { margin: "0 0 32px 0", fontSize: "15px", color: "#64748B", maxWidth: "440px", lineHeight: "1.6" },
    suggestionsWrap: { display: "grid", gap: "12px", width: "100%", maxWidth: "640px" },
    suggestionItem: { backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "9999px", padding: "14px 22px", fontSize: "14px", color: "#1E293B", fontWeight: "600", cursor: "pointer", textAlign: "center", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" },
    msgRow: { display: "flex", width: "100%", animation: "fadeIn 0.3s ease" },
    msgUser: { maxWidth: "75%", padding: "16px 22px", borderRadius: "24px 24px 6px 24px", background: "linear-gradient(135deg, #E31E24 0%, #B91C1C 100%)", color: "#FFFFFF", fontSize: "15px", lineHeight: "1.6", boxShadow: "0 6px 16px rgba(227, 30, 36, 0.25)" },
    msgBotRow: { display: "flex", gap: "12px", maxWidth: "80%", alignItems: "flex-end" },
    botAvatarTiny: { width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #E31E24 0%, #B91C1C 100%)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0, marginBottom: "2px" },
    msgBot: { padding: "16px 22px", borderRadius: "24px 24px 24px 6px", backgroundColor: "#FFFFFF", color: "#1E293B", fontSize: "15px", lineHeight: "1.6", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
    typingBlock: { display: "flex", gap: "6px", padding: "18px 24px", backgroundColor: "#FFFFFF", borderRadius: "24px 24px 24px 6px", border: "1px solid #E2E8F0", width: "fit-content", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
    dot: { width: "8px", height: "8px", backgroundColor: "#E31E24", borderRadius: "50%" },
    form: { padding: "20px 28px", backgroundColor: "#FFFFFF", borderTop: "1px solid #F1F5F9", display: "flex", gap: "16px", alignItems: "center" },
    input: { flex: 1, padding: "16px 24px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "9999px", fontSize: "15px", color: "#0F172A", outline: "none", transition: "all 0.2s ease" },
    sendBtn: { width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #E31E24 0%, #B91C1C 100%)", border: "none", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 6px 16px rgba(227, 30, 36, 0.35)", flexShrink: 0 },
    footerNote: { margin: "16px 0", textAlign: "center", fontSize: "12px", color: "#9CA3AF" }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        @keyframes bounceDot {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .ai-page-main {
          padding: 24px;
          height: calc(100vh - 64px);
        }
        .ai-page-card {
          border-radius: 24px;
        }
        .ai-sugg-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .ai-page-main {
            padding: 0;
            height: calc(100vh - 64px);
          }
          .ai-page-card {
            border-radius: 0;
            box-shadow: none;
          }
          .ai-sugg-grid {
            grid-template-columns: 1fr;
          }
        }
        .ai-btn-hover:hover { background-color: rgba(255,255,255,0.25) !important; transform: translateY(-1px); }
        .ai-sugg-item:hover { background-color: #FFF1F2 !important; border-color: #FECDD3 !important; color: #E31E24 !important; transform: translateY(-2px); }
        .ai-page-input:focus { border-color: #E31E24 !important; background-color: #FFFFFF !important; box-shadow: 0 0 0 4px rgba(227, 30, 36, 0.1) !important; }
        .ai-page-send:hover:not(:disabled) { transform: scale(1.06); }
        .ai-page-send:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
      `}</style>

      <div style={styles.container}>
        <Navbar />

        <main style={styles.main} className="ai-page-main">
          <div style={styles.card} className="ai-page-card">
            <div style={styles.header}>
              <div style={styles.avatar}>
                <svg style={styles.avatarIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.06L2.2 21.2c-.17.52.28 1.03.8 0.94l4.37-.87C8.84 21.75 10.38 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
              </div>
              <div style={styles.headerText}>
                <h1 style={styles.headerTitle}>
                  NovaCare Köməkçi
                  <span style={styles.onlineBadge}>
                    <span style={styles.onlineDot} />
                    Onlayn
                  </span>
                </h1>
                <p style={styles.headerSub}>24/7 Canlı Dəstək Xidməti</p>
              </div>
              {messages.length > 0 && (
                <button onClick={clearChat} style={styles.clearBtn} className="ai-btn-hover">
                  Söhbəti təmizlə
                </button>
              )}
            </div>

            <div style={styles.chatArea}>
              {messages.length === 0 && !sending && (
                <div style={styles.welcomeBlock}>
                  <div style={styles.welcomeIcon}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#E31E24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a8 8 0 0 0-8 8v3a4 4 0 0 0 4 4h1v-7H5v-1a7 7 0 0 1 14 0v1h-4v7h1a4 4 0 0 0 4-4v-3a8 8 0 0 0-8-8z"/>
                      <circle cx="12" cy="17" r="1"/>
                    </svg>
                  </div>
                  <h2 style={styles.welcomeTitle}>Salam! Sizə necə kömək edə bilərik?</h2>
                  <p style={styles.welcomeSubTitle}>NovaCare Canlı Dəstək Mərkəzi</p>
                  <p style={styles.welcomeSub}>
                    Sağlamlığınızla bağlı suallarınızı verə, randevu ala və ya şöbələrimiz haqqında məlumat ala bilərsiniz.
                  </p>
                  <div style={styles.suggestionsWrap} className="ai-sugg-grid">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => ask(s)} style={styles.suggestionItem} className="ai-sugg-item">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} style={{ ...styles.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "user" ? (
                    <div style={styles.msgUser}>
                      <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</span>
                    </div>
                  ) : (
                    <div style={styles.msgBotRow}>
                      <div style={styles.botAvatarTiny}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.06L2.2 21.2c-.17.52.28 1.03.8 0.94l4.37-.87C8.84 21.75 10.38 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                        </svg>
                      </div>
                      <div style={styles.msgBot}>
                        <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {sending && (
                <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
                  <div style={styles.msgBotRow}>
                    <div style={styles.botAvatarTiny}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.06L2.2 21.2c-.17.52.28 1.03.8 0.94l4.37-.87C8.84 21.75 10.38 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                      </svg>
                    </div>
                    <div style={styles.typingBlock}>
                      <span style={{ ...styles.dot, animation: "bounceDot 1.4s infinite ease-in-out both", animationDelay: "-0.32s" }} />
                      <span style={{ ...styles.dot, animation: "bounceDot 1.4s infinite ease-in-out both", animationDelay: "-0.16s" }} />
                      <span style={{ ...styles.dot, animation: "bounceDot 1.4s infinite ease-in-out both" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ask(text); }} style={styles.form}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Mesajınızı bura yazın..."
                disabled={sending}
                style={styles.input}
                className="ai-page-input"
              />
              <button type="submit" disabled={sending || !text.trim()} style={styles.sendBtn} className="ai-page-send">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "-2px" }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>
          <p style={styles.footerNote}>
            AI köməkçi tibbi diaqnoz qoymur. Sağlamlıq problemləri üçün mütləq həkimə müraciət edin.
          </p>
        </main>
      </div>
    </>
  );
}