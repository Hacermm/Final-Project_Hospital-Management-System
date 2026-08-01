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
    if (!window.confirm("Söhbəti təmizləmək istəyirsiniz?")) return;
    if (isAuthenticated) {
      try {
        await api.delete("/ai/messages");
      } catch (e) {}
    }
    setMessages([]);
  };

  const styles = {
    container: { position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
    chatWindow: { width: "380px", height: "620px", maxHeight: "85vh", marginBottom: "20px", backgroundColor: "var(--surface)", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.28)", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid var(--border)", animation: "slideUpKontakt 0.35s cubic-bezier(0.16, 1, 0.3, 1)", transition: "background-color 0.3s ease" },
    header: { background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(198, 40, 40, 0.2)" },
    headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
    avatar: { width: "44px", height: "44px", backgroundColor: "#FFFFFF", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "2px solid rgba(255,255,255,0.9)", flexShrink: 0 },
    avatarIcon: { width: "24px", height: "24px", color: "var(--primary)" },
    headerTitleContainer: { display: "flex", flexDirection: "column", gap: "2px" },
    headerTitle: { margin: 0, fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", letterSpacing: "-0.3px", color: "#FFFFFF" },
    onlineBadge: { display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "500", backgroundColor: "rgba(255,255,255,0.18)", padding: "2px 8px", borderRadius: "99px", color: "#FFFFFF" },
    onlineIndicator: { width: "7px", height: "7px", backgroundColor: "#4ade80", borderRadius: "50%", animation: "fadeInOut 2s infinite" },
    headerSubtitle: { margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.9)", fontWeight: "400" },
    headerActions: { display: "flex", gap: "6px" },
    iconBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "#FFFFFF", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease" },
    guestBanner: { backgroundColor: "var(--primary-light)", borderBottom: "1px solid var(--secondary-light)", padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--primary)" },
    guestLink: { background: "var(--primary)", border: "none", color: "#FFFFFF", fontWeight: "600", fontSize: "11px", borderRadius: "8px", cursor: "pointer", padding: "5px 12px", transition: "all 0.2s ease" },
    messagesArea: { flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column", gap: "16px", transition: "background-color 0.3s ease" },
    welcomeContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", animation: "fadeIn 0.5s ease", padding: "0 10px" },
    welcomeAvatar: { width: "72px", height: "72px", borderRadius: "50%", background: "var(--primary-light)", border: "2px solid var(--secondary-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 8px 24px rgba(198, 40, 40, 0.12)" },
    welcomeTitle: { margin: "0 0 6px 0", fontSize: "18px", fontWeight: "700", color: "var(--text-dark)" },
    welcomeSubtitle: { margin: "0 0 4px 0", fontSize: "13px", fontWeight: "600", color: "var(--primary)" },
    welcomeText: { margin: "0 0 20px 0", fontSize: "13px", color: "var(--text-mid)", lineHeight: "1.5", maxWidth: "280px" },
    suggestionsGrid: { display: "flex", flexWrap: "wrap", gap: "8px", width: "100%", justifyContent: "center" },
    suggestionBtn: { backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "9999px", padding: "9px 15px", fontSize: "12px", color: "var(--text-dark)", fontWeight: "600", cursor: "pointer", textAlign: "center", transition: "all 0.2s ease", boxShadow: "var(--shadow-xs)" },
    messageRow: { display: "flex", width: "100%", animation: "fadeIn 0.3s ease" },
    msgUser: { maxWidth: "82%", padding: "13px 18px", borderRadius: "20px 20px 4px 20px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", fontSize: "14px", lineHeight: "1.5", boxShadow: "0 4px 12px rgba(198, 40, 40, 0.25)" },
    msgBotRow: { display: "flex", gap: "10px", maxWidth: "88%", alignItems: "flex-end" },
    botAvatarTiny: { width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, marginBottom: "2px" },
    msgBot: { padding: "13px 18px", borderRadius: "20px 20px 20px 4px", backgroundColor: "var(--surface)", color: "var(--text-dark)", fontSize: "14px", lineHeight: "1.5", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" },
    typingIndicator: { display: "flex", gap: "5px", padding: "14px 18px", backgroundColor: "var(--surface)", borderRadius: "20px 20px 20px 4px", border: "1px solid var(--border)", width: "fit-content", boxShadow: "var(--shadow-xs)" },
    typingDot: { width: "6px", height: "6px", backgroundColor: "var(--primary)", borderRadius: "50%" },
    inputArea: { padding: "14px 18px", backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", gap: "10px", alignItems: "center" },
    input: { flex: 1, padding: "12px 18px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "9999px", fontSize: "13px", color: "var(--text-dark)", outline: "none", transition: "all 0.2s ease" },
    sendBtn: { width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", border: "none", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(198, 40, 40, 0.35)", flexShrink: 0 },
    fabWrapper: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
    fabGroup: { display: "flex", alignItems: "center", gap: "10px" },
    fabLabel: { backgroundColor: "var(--surface)", color: "var(--text-dark)", padding: "8px 14px", borderRadius: "9999px", fontSize: "13px", fontWeight: "600", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" },
    fabLabelDot: { width: "8px", height: "8px", backgroundColor: "var(--primary)", borderRadius: "50%", animation: "fadeInOut 1.5s infinite" },
    fab: { width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", border: "none", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 24px rgba(198, 40, 40, 0.45)", zIndex: 2, position: "relative" },
    ring: { position: "absolute", right: 0, width: "60px", height: "60px", borderRadius: "50%", border: "2px solid var(--primary)", animation: "pulseRingKontakt 2s infinite cubic-bezier(0.4, 0, 0.6, 1)" }
  };

  return (
    <>
      <style>{`
        @keyframes slideUpKontakt {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        @keyframes pulseRingKontakt {
          0% { transform: scale(0.9); opacity: 1; border-width: 2px; }
          100% { transform: scale(1.65); opacity: 0; border-width: 1px; }
        }
        .ai-hover-btn:hover { background-color: var(--primary-light) !important; border-color: var(--secondary-light) !important; color: var(--primary) !important; transform: translateY(-2px); }
        .ai-hover-icon:hover { background-color: rgba(255,255,255,0.25) !important; transform: scale(1.06); }
        .ai-input:focus { border-color: var(--primary) !important; background-color: var(--surface) !important; box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.1) !important; }
        .ai-send-btn:hover:not(:disabled) { transform: scale(1.08); }
        .ai-send-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .ai-fab:hover { transform: scale(1.06); }
        .ai-fab:active { transform: scale(0.95); }
        .guest-login-btn:hover { background: var(--primary-hover) !important; }
      `}</style>
      
      <div style={styles.container}>
        {isOpen && (
          <div style={styles.chatWindow}>
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.avatar}>
                  <svg style={styles.avatarIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.06L2.2 21.2c-.17.52.28 1.03.8 0.94l4.37-.87C8.84 21.75 10.38 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                  </svg>
                </div>
                <div style={styles.headerTitleContainer}>
                  <h3 style={styles.headerTitle}>
                    NovaCare Köməkçi
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={styles.onlineBadge}>
                      <span style={styles.onlineIndicator} />
                      Onlayn
                    </span>
                    <p style={styles.headerSubtitle}>24/7 Canlı Dəstək</p>
                  </div>
                </div>
              </div>
              <div style={styles.headerActions}>
                {messages.length > 0 && (
                  <button onClick={clearChat} title="Söhbəti təmizlə" style={styles.iconBtn} className="ai-hover-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                )}
                <button onClick={() => navigate("/ai")} title="Böyük ekranda aç" style={styles.iconBtn} className="ai-hover-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                </button>
                <button onClick={() => setIsOpen(false)} title="Bağla" style={styles.iconBtn} className="ai-hover-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {!isAuthenticated && (
              <div style={styles.guestBanner}>
                <span>Randevu və şəxsi analizlər üçün daxil olun.</span>
                <button onClick={() => { setIsOpen(false); navigate("/login"); }} style={styles.guestLink} className="guest-login-btn">
                  Giriş et →
                </button>
              </div>
            )}

            <div style={styles.messagesArea}>
              {messages.length === 0 && !sending && (
                <div style={styles.welcomeContainer}>
                  <div style={styles.welcomeAvatar}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a8 8 0 0 0-8 8v3a4 4 0 0 0 4 4h1v-7H5v-1a7 7 0 0 1 14 0v1h-4v7h1a4 4 0 0 0 4-4v-3a8 8 0 0 0-8-8z"/>
                      <circle cx="12" cy="17" r="1"/>
                    </svg>
                  </div>
                  <h4 style={styles.welcomeTitle}>Salam! Sizə necə kömək edə bilərik?</h4>
                  <p style={styles.welcomeSubtitle}>NovaCare Canlı Dəstək Mərkəzi</p>
                  <p style={styles.welcomeText}>
                    Sualınızı aşağıdakı sahəyə yazın və ya ən çox soruşulan mövzulardan birini seçin.
                  </p>
                  <div style={styles.suggestionsGrid}>
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => ask(s)} style={styles.suggestionBtn} className="ai-hover-btn">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} style={{ ...styles.messageRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "user" ? (
                    <div style={styles.msgUser}>
                      <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</span>
                    </div>
                  ) : (
                    <div style={styles.msgBotRow}>
                      <div style={styles.botAvatarTiny}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
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
                <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
                  <div style={styles.msgBotRow}>
                    <div style={styles.botAvatarTiny}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.06L2.2 21.2c-.17.52.28 1.03.8 0.94l4.37-.87C8.84 21.75 10.38 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                      </svg>
                    </div>
                    <div style={styles.typingIndicator}>
                      <span style={{ ...styles.typingDot, animation: "bounceDot 1.4s infinite ease-in-out both", animationDelay: "-0.32s" }} />
                      <span style={{ ...styles.typingDot, animation: "bounceDot 1.4s infinite ease-in-out both", animationDelay: "-0.16s" }} />
                      <span style={{ ...styles.typingDot, animation: "bounceDot 1.4s infinite ease-in-out both" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ask(text); }} style={styles.inputArea}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Mesajınızı bura yazın..."
                disabled={sending}
                style={styles.input}
                className="ai-input"
              />
              <button type="submit" disabled={sending || !text.trim()} style={styles.sendBtn} className="ai-send-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "-2px" }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>
        )}

        <div style={styles.fabWrapper}>
          <div style={styles.fabGroup}>
            {!isOpen && (
              <div style={styles.fabLabel} onClick={() => setIsOpen(true)}>
                <span style={styles.fabLabelDot} />
                Canlı Dəstək
              </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} style={styles.fab} className="ai-fab" aria-label="Ai Assistent Çat">
              {isOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              )}
            </button>
          </div>
          {!isOpen && <div style={styles.ring} />}
        </div>
      </div>
    </>
  );
}
