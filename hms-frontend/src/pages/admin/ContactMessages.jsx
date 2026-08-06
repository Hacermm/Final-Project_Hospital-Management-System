import { useEffect, useState } from "react";
import api from "../../lib/api";

const SUBJECTS = {
  appointment: "Randevu Məlumatı",
  checkup: "Check-Up Paketləri",
  feedback: "Təklif və Rəy",
  other: "Digər",
};

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState(null);

  const load = () => {
    api.get("/contact-messages")
      .then((r) => {
        setMessages(r.data.data || []);
        setUnread(r.data.unread || 0);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleOpen = async (m) => {
    const opening = openId !== m.id;
    setOpenId(opening ? m.id : null);

    if (opening && !m.is_read) {
      try {
        await api.put(`/contact-messages/${m.id}`);
        load();
      } catch { /* səssiz */ }
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Bu müraciəti silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/contact-messages/${id}`);
      notify("Müraciət silindi", true);
      if (openId === id) setOpenId(null);
      load();
    } catch {
      notify("Silinə bilmədi", false);
    }
  };

  const filtered = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  return (
    <>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <span style={{
              display: "inline-block", background: "#EEF2FF",
              border: "1px solid rgba(79,70,229,0.25)", borderRadius: 30,
              padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.8px", color: "#4F46E5", marginBottom: 12
            }}>
              MÜRACİƏTLƏR
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
              Əlaqə Mesajları
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0" }}>
              Saytdakı əlaqə formundan göndərilən müraciətlər.
            </p>
          </div>

          {/* Filter */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "all", label: "Hamısı", count: messages.length },
              { id: "unread", label: "Oxunmamış", count: unread },
            ].map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "9px 16px", borderRadius: 12, cursor: "pointer",
                    fontSize: "0.83rem", fontWeight: 800,
                    border: active ? "1px solid #4F46E5" : "1px solid var(--border)",
                    background: active ? "#4F46E5" : "var(--surface)",
                    color: active ? "#FFFFFF" : "var(--text-mid)",
                    transition: "all 0.2s",
                  }}
                >
                  {f.label}
                  <span style={{
                    minWidth: 20, padding: "1px 6px", borderRadius: 10,
                    fontSize: "0.7rem", fontWeight: 900,
                    background: active ? "rgba(255,255,255,0.22)" : "var(--bg)",
                    color: active ? "#FFFFFF" : "var(--text-light)",
                  }}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {toast && (
          <div style={{
            marginBottom: 18, padding: "12px 18px", borderRadius: 12,
            fontSize: "0.86rem", fontWeight: 700,
            background: toast.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${toast.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: toast.ok ? "#047857" : "#B91C1C",
          }}>
            {toast.ok ? "✓" : "✕"} {toast.text}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: "70px 0", color: "var(--text-light)", fontWeight: 700 }}>
            Yüklənir...
          </p>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "64px 30px", textAlign: "center"
          }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 14 }}>
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6" />
            </svg>
            <p style={{ fontSize: "0.98rem", fontWeight: 800, margin: "0 0 6px" }}>
              {filter === "unread" ? "Oxunmamış müraciət yoxdur" : "Hələ müraciət yoxdur"}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", margin: 0 }}>
              {filter === "unread" ? "Bütün mesajlar oxunub." : "Saytdan gələn müraciətlər burada görünəcək."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((m) => {
              const isOpen = openId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => toggleOpen(m)}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: m.is_read ? "1px solid var(--border)" : "3px solid #F59E0B",
                    borderRadius: 18, padding: "18px 22px", cursor: "pointer",
                    transition: "box-shadow 0.2s",
                    boxShadow: isOpen ? "0 8px 24px rgba(0,0,0,0.08)" : "0 2px 10px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                      background: m.is_read
                        ? "var(--bg)"
                        : "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                      border: m.is_read ? "1px solid var(--border)" : "none",
                      color: m.is_read ? "var(--text-mid)" : "#FFFFFF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.88rem", fontWeight: 900,
                    }}>
                      {m.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                        <p style={{
                          fontSize: "0.95rem", margin: 0, color: "var(--text-dark)",
                          fontWeight: m.is_read ? 700 : 900,
                        }}>
                          {m.name}
                        </p>

                        {!m.is_read && (
                          <span style={{
                            fontSize: "0.63rem", fontWeight: 900, padding: "3px 10px",
                            borderRadius: 20, background: "rgba(245,158,11,0.14)",
                            color: "#B45309", border: "1px solid rgba(245,158,11,0.3)",
                            letterSpacing: "0.5px",
                          }}>
                            YENİ
                          </span>
                        )}

                        {m.subject && (
                          <span style={{
                            fontSize: "0.68rem", fontWeight: 800, padding: "3px 11px",
                            borderRadius: 20, background: "#EEF2FF",
                            color: "#4F46E5", border: "1px solid rgba(79,70,229,0.25)",
                          }}>
                            {SUBJECTS[m.subject] || m.subject}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: "0.79rem", color: "var(--text-light)", margin: "4px 0 0" }}>
                        {m.email} · {m.date}
                      </p>

                      {!isOpen && (
                        <p style={{
                          fontSize: "0.85rem", color: "var(--text-mid)", margin: "8px 0 0",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {m.message}
                        </p>
                      )}
                    </div>

                    {/* Sağ tərəf */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <button
                        onClick={(e) => remove(m.id, e)}
                        style={{
                          padding: "6px 14px", borderRadius: 10,
                          border: "1px solid var(--border)", background: "transparent",
                          color: "#DC2626", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
                        }}
                      >
                        Sil
                      </button>

                      <svg
                        width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-light)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {/* Açıq məzmun */}
                  {isOpen && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                      <p style={{
                        fontSize: "0.89rem", lineHeight: 1.7, color: "var(--text-dark)",
                        margin: "0 0 16px", whiteSpace: "pre-wrap", wordBreak: "break-word",
                      }}>
                        {m.message}
                      </p>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        
                          <a href={`mailto:${m.email}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 7,
                            padding: "8px 16px", borderRadius: 10, textDecoration: "none",
                            background: "#6366F1", color: "#FFFFFF",
                            fontSize: "0.8rem", fontWeight: 800,
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6" />
                          </svg>
                          Cavab yaz
                        </a>

                        {m.phone && (
                          
                            <a href={`tel:${m.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 7,
                              padding: "8px 16px", borderRadius: 10, textDecoration: "none",
                              border: "1px solid rgba(16,185,129,0.3)",
                              background: "rgba(16,185,129,0.1)", color: "#047857",
                              fontSize: "0.8rem", fontWeight: 800,
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            {m.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}