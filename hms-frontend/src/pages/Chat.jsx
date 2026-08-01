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

    if (!echoRef.current) {
      echoRef.current = createEcho();
    }

    const channelName = `conversation.${activeConv.id}`;
    const channel = echoRef.current.private(channelName);

    channel.listen(".message.sent", (e) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === e.id)) return prev;
        return [
          ...prev,
          {
            id: e.id,
            body: e.body,
            sender_id: e.sender_id,
            sender_name: e.sender_name,
            is_mine: e.sender_id === meId.current,
            created_at: e.created_at,
          },
        ];
      });
    });

    return () => {
      echoRef.current?.leave(channelName);
    };
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

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div
        className="max-w-7xl w-full mx-auto p-3 md:p-6 flex flex-col md:flex-row gap-4"
        style={{ flex: 1, minHeight: "calc(100vh - 80px)", boxSizing: "border-box" }}
      >
        {/* Left Conversations Sidebar */}
        <div
          className={`w-full md:w-80 shrink-0 ac-card flex-col ${
            activeConv ? "hidden md:flex" : "flex"
          }`}
          style={{ padding: 0, overflow: "hidden", display: "flex" }}
        >
          <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  startConversation(Number(e.target.value));
                  e.target.value = "";
                }
              }}
              className="ac-input"
              style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", fontWeight: 700 }}
              defaultValue=""
            >
              <option value="">+ Yeni Söhbət Başlat</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations.map((c) => {
              const isSelected = activeConv?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--border)",
                    background: isSelected ? "var(--primary-light)" : "transparent",
                    borderLeft: isSelected ? "4px solid var(--primary)" : "4px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: isSelected ? "linear-gradient(135deg, #7F1D1D 0%, #B71C1C 100%)" : "var(--bg)",
                      color: isSelected ? "#FFFFFF" : "var(--text-dark)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.82rem",
                      fontWeight: 900,
                      shrink: 0,
                    }}
                  >
                    {getInitials(c.other_user?.name)}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <p style={{ fontWeight: 800, fontSize: "0.88rem", color: isSelected ? "var(--primary)" : "var(--text-dark)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.other_user?.name}
                      </p>
                      {unread[c.id] > 0 && !isSelected && (
                        <span style={{ minWidth: 18, height: 18, padding: "0 6px", borderRadius: 10, background: "var(--primary)", color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          {unread[c.id]}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: "3px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.last_message || "—"}
                    </p>
                  </div>
                </button>
              );
            })}

            {conversations.length === 0 && (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "2.4rem", marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-dark)", margin: "0 0 4px 0" }}>Hələ söhbətiniz yoxdur</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: 0 }}>Yuxarıdakı seçimdən yeni söhbət başladın</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Active Message Window */}
        <div
          className={`flex-1 ac-card flex-col ${
            activeConv ? "flex" : "hidden md:flex"
          }`}
          style={{ padding: 0, overflow: "hidden", display: "flex" }}
        >
          {activeConv ? (
            <>
              {/* Active Conversation Header */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)" }}>
                <button
                  onClick={() => setActiveConv(null)}
                  className="md:hidden"
                  style={{ background: "none", border: "none", color: "var(--text-dark)", cursor: "pointer", padding: 4 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>

                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #7F1D1D 0%, #B71C1C 100%)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 900, shrink: 0 }}>
                  {getInitials(activeConv.other_user?.name)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "1rem", fontWeight: 900, color: "var(--text-dark)", margin: 0 }}>{activeConv.other_user?.name}</p>
                  <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 800 }}>● Canlı Söhbət</span>
                </div>

                <button
                  onClick={() => startCall(activeConv.other_user.id, activeConv.other_user.name)}
                  style={{
                    marginLeft: "auto",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Səsli zəng"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </button>
              </div>

              {/* Message List */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 12, background: "var(--bg)" }}>
                {messages.map((m, i) => (
                  <div key={m.id ?? i} style={{ display: "flex", justifyContent: m.is_mine ? "flex-end" : "flex-start" }}>
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "12px 18px",
                        borderRadius: m.is_mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: m.is_mine ? "linear-gradient(135deg, #7F1D1D 0%, #B71C1C 100%)" : "var(--surface)",
                        color: m.is_mine ? "#FFFFFF" : "var(--text-dark)",
                        border: m.is_mine ? "none" : "1px solid var(--border)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      {!m.is_mine && (
                        <p style={{ fontSize: "0.72rem", fontWeight: 900, color: "var(--primary)", margin: "0 0 4px 0" }}>
                          {m.sender_name}
                        </p>
                      )}
                      <p style={{ fontSize: "0.9rem", lineHeight: 1.5, margin: 0, wordBreak: "break-word" }}>{m.body}</p>
                      <p style={{ fontSize: "0.68rem", marginTop: 4, textAlign: "right", color: m.is_mine ? "rgba(255,255,255,0.7)" : "var(--text-light)", margin: "4px 0 0 0" }}>
                        {m.created_at}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={send} style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 12, background: "var(--surface)" }}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="ac-input"
                  style={{ flex: 1, padding: "12px 18px", borderRadius: 14, fontSize: "0.9rem", fontWeight: 600 }}
                />
                <button
                  type="submit"
                  className="ac-btn"
                  style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, padding: 0 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--primary-light)", border: "1px solid var(--secondary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", marginBottom: 16 }}>
                💬
              </div>
              <p style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 4 }}>Canlı Mesajlaşma</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-light)", margin: 0 }}>Soldakı siyahıdan həkiminizlə söhbət seçin və ya yeni mesajlaşma başladın</p>
            </div>
          )}
        </div>
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
