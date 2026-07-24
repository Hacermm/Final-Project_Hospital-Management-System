import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { createEcho } from "../lib/echo";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const echoRef = useRef(null);
  const bottomRef = useRef(null);
  const meId = useRef(null);
  const [meName, setMeName] = useState("");
  const loadConversations = () => {
    api.get("/conversations").then((r) => setConversations(r.data.data));
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
      setMeName(`${me.data.user.name} (${me.data.role})`);   
      loadConversations();
      await loadPossibleUsers();
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeConv) return;

    api
      .get(`/conversations/${activeConv.id}/messages`)
      .then((r) => setMessages(r.data.data));

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
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Mesajlar</h1>
            <p className="text-xs text-slate-400">Siz: {meName}</p>   
              </div>
          </div>
          <a href={localStorage.getItem("role") === "doctor" ? "/doctor" : "/patient"} 
             className="text-sm text-slate-400 hover:text-indigo-400 flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Panelə qayıt
          </a>
        </div>
      </header>

      {/* Main chat area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex gap-4" style={{ height: "calc(100vh - 73px)" }}>
        
        {/* Sidebar - Conversations */}
        <div className="w-80 shrink-0 glass-card flex flex-col animate-slide-in-left">
          {/* New conversation */}
          <div className="p-4 border-b border-white/5">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  startConversation(Number(e.target.value));
                  e.target.value = "";
                }
              }}
              className="hms-select text-sm"
              defaultValue=""
            >
              <option value="">+ Yeni söhbət başlat</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConv(c)}
                className={`w-full text-left px-4 py-3.5 border-b border-white/5 hover:bg-white/5 flex items-center gap-3 group ${
                  activeConv?.id === c.id ? "bg-indigo-500/10 border-l-2 border-l-indigo-500" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  activeConv?.id === c.id 
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                    : "bg-slate-700/50 text-slate-300"
                }`}>
                  {getInitials(c.other_user?.name)}
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${
                    activeConv?.id === c.id ? "text-indigo-300" : "text-slate-200 group-hover:text-white"
                  }`}>
                    {c.other_user?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{c.last_message || "—"}</p>
                </div>
              </button>
            ))}

            {conversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className="text-slate-500 text-sm text-center">Hələ söhbət yoxdur</p>
                <p className="text-slate-600 text-xs text-center mt-1">Yuxarıdakı seçimdən yeni söhbət başladın</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 glass-card flex flex-col animate-fade-in-up">
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {getInitials(activeConv.other_user?.name)}
                </div>
                <div>
                  <p className="font-semibold text-white">{activeConv.other_user?.name}</p>
                  <p className="text-xs text-slate-400">Aktiv söhbət</p>
                </div>
                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={m.id ?? i}
                    className={`flex ${m.is_mine ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                        m.is_mine
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-md"
                          : "bg-slate-700/50 text-slate-200 rounded-bl-md"
                      }`}
                    >
                      {!m.is_mine && (
                        <p className="text-[11px] font-semibold text-indigo-400 mb-0.5">{m.sender_name}</p>
                      )}
                      <p className="text-sm leading-relaxed">{m.body}</p>
                      <p
                        className={`text-[10px] mt-1.5 ${
                          m.is_mine ? "text-indigo-200/70" : "text-slate-500"
                        }`}
                      >
                        {m.created_at}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={send} className="p-4 border-t border-white/5 flex gap-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Mesaj yazın..."
                  className="flex-1 px-5 py-3 bg-slate-800/50 border border-white/5 rounded-2xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/25 shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-slate-800/30 flex items-center justify-center mb-6">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="text-slate-400 text-lg font-medium mb-2">Söhbət seçin</p>
              <p className="text-slate-600 text-sm">Soldan söhbət seçin və ya yeni başladın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}