import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { createEcho } from "../lib/echo";
import Navbar from "../components/Navbar";
import { useCall } from "../hooks/useCall";
import CallOverlay from "../components/CallOverlay";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [unread, setUnread] = useState({});
  const [myId, setMyId] = useState(null);
  const [search, setSearch] = useState("");
  const echoRef = useRef(null);
  const bottomRef = useRef(null);
  const meId = useRef(null);

  const { callState, peer, error, startCall, accept, reject, end, clearError } = useCall(myId);

  const loadConversations = async () => {
    const r = await api.get("/conversations");
    setConversations(r.data.data);
    try {
      const u = await api.get("/unread-count");
      setUnread(u.data.per_conversation || {});
    } catch {
      setUnread({});
    }
  };

  const loadPossibleUsers = async () => {
    const role = localStorage.getItem("role");
    try {
      if (role === "patient") {
        const r = await api.get("/doctors");
        setUsers(r.data.data.map((d) => ({ id: d.user_id, name: d.name })));
      } else {
        const r = await api.get("/patients");
        setUsers(r.data.data.map((p) => ({ id: p.user_id, name: p.name })));
      }
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      const me = await api.get("/me");
      meId.current = me.data.user.id;
      setMyId(me.data.user.id);
      await loadConversations();
      await loadPossibleUsers();
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeConv) return;

    api.get(`/conversations/${activeConv.id}/messages`).then((r) => {
      setMessages(r.data.data);
      setUnread((prev) => ({ ...prev, [activeConv.id]: 0 }));
    });

    if (!echoRef.current) echoRef.current = createEcho();

    const channelName = `conversation.${activeConv.id}`;
    const channel = echoRef.current.private(channelName);

    channel.listen(".message.sent", (e) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === e.id)) return prev;
        return [...prev, {
          id: e.id,
          body: e.body,
          sender_id: e.sender_id,
          sender_name: e.sender_name,
          is_mine: e.sender_id === meId.current,
          created_at: e.created_at,
        }];
      });
    });

    return () => echoRef.current?.leave(channelName);
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async (userId) => {
    const r = await api.post("/conversations", { user_id: userId });
    loadConversations();
    setActiveConv(r.data.data);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConv) return;
    const body = text;
    setText("");
    const r = await api.post(
      `/conversations/${activeConv.id}/messages`,
      { body },
      { headers: { "X-Socket-Id": echoRef.current?.socketId() } }
    );
    setMessages((prev) => [...prev, r.data.data]);
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  const filteredConvs = conversations.filter((c) =>
    !search || c.other_user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div className="chat-wrap" style={{
        flex: 1, width: "100%", maxWidth: 1240, margin: "0 auto",
        padding: "20px 24px 28px", display: "flex", gap: 20,
        minHeight: 0, boxSizing: "border-box"
      }}>

        {/* ══ SOL PANEL ══ */}
        <aside
          className={activeConv ? "chat-side chat-side-hidden" : "chat-side"}
          style={{
            width: 330, flexShrink: 0, display: "flex", flexDirection: "column",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}
        >
          {/* Başlıq */}
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-dark)", margin: 0, letterSpacing: "-0.4px" }}>
                Mesajlar
              </h2>
              {totalUnread > 0 && (
                <span style={{
                  background: "var(--primary)", color: "#FFFFFF", fontSize: "0.7rem",
                  fontWeight: 900, padding: "3px 10px", borderRadius: 20
                }}>
                  {totalUnread} yeni
                </span>
              )}
            </div>

            {/* Axtarış */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Söhbətlərdə axtar..."
                style={{
                  width: "100%", padding: "10px 14px 10px 38px", borderRadius: 12,
                  border: "1px solid var(--border)", background: "var(--bg)",
                  color: "var(--text-dark)", fontSize: "0.85rem", outline: "none"
                }}
              />
            </div>

            {/* Yeni söhbət */}
            <select
              onChange={(e) => { if (e.target.value) { startConversation(Number(e.target.value)); e.target.value = ""; } }}
              defaultValue=""
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 12,
                border: "1px dashed var(--primary)", background: "var(--primary-light)",
                color: "var(--primary)", fontSize: "0.84rem", fontWeight: 800,
                cursor: "pointer", outline: "none"
              }}
            >
              <option value="">+ Yeni söhbət başlat</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          {/* Söhbət siyahısı */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredConvs.map((c) => {
              const isSelected = activeConv?.id === c.id;
              const count = unread[c.id] || 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  style={{
                    width: "100%", textAlign: "left", padding: "14px 18px",
                    borderBottom: "1px solid var(--border)", cursor: "pointer",
                    background: isSelected ? "var(--primary-light)" : "transparent",
                    borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                    display: "flex", alignItems: "center", gap: 13,
                    transition: "background 0.2s", border: "none", borderBottomWidth: 1, borderBottomStyle: "solid"
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--bg)"; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: isSelected
                      ? "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)"
                      : "var(--bg)",
                    border: isSelected ? "none" : "1px solid var(--border)",
                    color: isSelected ? "#FFFFFF" : "var(--text-mid)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", fontWeight: 900
                  }}>
                    {getInitials(c.other_user?.name)}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <p style={{
                        fontWeight: count > 0 ? 900 : 800, fontSize: "0.89rem", margin: 0,
                        color: isSelected ? "var(--primary)" : "var(--text-dark)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                      }}>
                        {c.other_user?.name}
                      </p>
                      {count > 0 && !isSelected && (
                        <span style={{
                          minWidth: 20, height: 20, padding: "0 6px", borderRadius: 10,
                          background: "var(--primary)", color: "#FFFFFF", fontSize: "0.7rem",
                          fontWeight: 900, display: "inline-flex", alignItems: "center",
                          justifyContent: "center", flexShrink: 0
                        }}>
                          {count}
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: "0.79rem", margin: "3px 0 0", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                      color: count > 0 ? "var(--text-dark)" : "var(--text-light)",
                      fontWeight: count > 0 ? 700 : 500
                    }}>
                      {c.last_message || "Mesaj yoxdur"}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredConvs.length === 0 && (
              <div style={{ padding: "56px 24px", textAlign: "center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 12 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-dark)", margin: "0 0 4px" }}>
                  {search ? "Nəticə tapılmadı" : "Hələ söhbətiniz yoxdur"}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: 0 }}>
                  {search ? "Başqa ad sınayın" : "Yuxarıdakı seçimdən başladın"}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ══ SAĞ PANEL ══ */}
        <section
          className={activeConv ? "chat-main" : "chat-main chat-main-hidden"}
          style={{
            flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}
        >
          {activeConv ? (
            <>
              {/* Header */}
              <div style={{
                padding: "14px 20px", borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 14, background: "var(--surface)"
              }}>
                <button
                  onClick={() => setActiveConv(null)}
                  className="chat-back"
                  style={{ background: "none", border: "none", color: "var(--text-dark)", cursor: "pointer", padding: 4, display: "none" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>

                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
                    color: "#FFFFFF", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "0.88rem", fontWeight: 900
                  }}>
                    {getInitials(activeConv.other_user?.name)}
                  </div>
                  <span style={{
                    position: "absolute", bottom: 1, right: 1, width: 12, height: 12,
                    borderRadius: "50%", background: "#10B981",
                    border: "2px solid var(--surface)"
                  }} />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "0.98rem", fontWeight: 900, color: "var(--text-dark)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeConv.other_user?.name}
                  </p>
                  <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
                    Real vaxt bağlantı aktivdir
                  </span>
                </div>

                <button
                  onClick={() => startCall(activeConv.other_user.id, activeConv.other_user.name)}
                  style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.28)",
                    color: "#059669", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#10B981"; e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; e.currentTarget.style.color = "#059669"; }}
                  title="Səsli zəng"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </button>
              </div>

              {/* Mesajlar */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "24px 22px",
                display: "flex", flexDirection: "column", gap: 10, background: "var(--bg)"
              }}>
                {messages.length === 0 && (
                  <p style={{ textAlign: "center", color: "var(--text-light)", fontSize: "0.85rem", margin: "auto" }}>
                    Söhbətə ilk mesajı siz yazın
                  </p>
                )}

                {messages.map((m, i) => (
                  <div key={m.id ?? i} style={{ display: "flex", justifyContent: m.is_mine ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "72%",
                      padding: "11px 16px",
                      borderRadius: m.is_mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: m.is_mine
                        ? "linear-gradient(135deg, #C62828 0%, #A31919 100%)"
                        : "var(--surface)",
                      color: m.is_mine ? "#FFFFFF" : "var(--text-dark)",
                      border: m.is_mine ? "none" : "1px solid var(--border)",
                      boxShadow: m.is_mine ? "0 3px 12px rgba(198,40,40,0.2)" : "0 2px 8px rgba(0,0,0,0.05)"
                    }}>
                      {!m.is_mine && (
                        <p style={{ fontSize: "0.71rem", fontWeight: 900, color: "var(--primary)", margin: "0 0 4px", letterSpacing: "0.2px" }}>
                          {m.sender_name}
                        </p>
                      )}
                      <p style={{ fontSize: "0.9rem", lineHeight: 1.55, margin: 0, wordBreak: "break-word" }}>
                        {m.body}
                      </p>
                      <p style={{
                        fontSize: "0.67rem", margin: "5px 0 0", textAlign: "right",
                        color: m.is_mine ? "rgba(255,255,255,0.72)" : "var(--text-light)"
                      }}>
                        {m.created_at}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={send} style={{
                padding: "14px 18px", borderTop: "1px solid var(--border)",
                display: "flex", gap: 12, background: "var(--surface)"
              }}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  style={{
                    flex: 1, padding: "13px 20px", borderRadius: 30,
                    border: "1px solid var(--border)", background: "var(--bg)",
                    color: "var(--text-dark)", fontSize: "0.9rem", outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  style={{
                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0, border: "none",
                    background: text.trim()
                      ? "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)"
                      : "var(--border)",
                    color: "#FFFFFF", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: text.trim() ? "pointer" : "default",
                    transition: "all 0.2s"
                  }}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: 40, textAlign: "center"
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: 26, marginBottom: 20,
                background: "var(--primary-light)", border: "1px solid var(--secondary-light)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-dark)", margin: "0 0 6px" }}>
                Canlı Mesajlaşma
              </p>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)", margin: 0, maxWidth: 320, lineHeight: 1.6 }}>
                Soldakı siyahıdan söhbət seçin və ya yeni mesajlaşma başladın. Mesajlar real vaxtda çatdırılır.
              </p>
            </div>
          )}
        </section>
      </div>

      <CallOverlay
        callState={callState}
        peer={peer}
        error={error}
        onAccept={accept}
        onReject={reject}
        onEnd={end}
        onClearError={clearError}
      />
    </div>
  );
}
