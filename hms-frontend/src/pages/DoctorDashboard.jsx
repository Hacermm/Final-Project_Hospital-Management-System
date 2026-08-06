import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const ICONS = {
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8",
  flask: "M9 2v6L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3L15 8V2M9 2h6M7.5 13h9",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  bot: "M12 2v3M8 8h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3zM9 14h.01M15 14h.01",
};

const QUICK = [
  { to: "/doctor/appointments", icon: "calendar", title: "Bütün randevular" },
  { to: "/doctor/schedule", icon: "clock", title: "İş qrafikim" },
  { to: "/doctor/records/new", icon: "file", title: "Tibbi qeyd yaz" },
  { to: "/doctor/lab-tests", icon: "flask", title: "Lab nəticələri" },
  { to: "/chat", icon: "chat", title: "Mesajlar" },
  { to: "/ai", icon: "bot", title: "AI asistent" },
];

const STATUS = {
  pending: { label: "Gözləyir", bg: "rgba(245,158,11,0.12)", color: "#B45309" },
  confirmed: { label: "Təsdiqlənib", bg: "rgba(16,185,129,0.12)", color: "#047857" },
  completed: { label: "Tamamlanıb", bg: "rgba(99,102,241,0.12)", color: "#4338CA" },
  cancelled: { label: "Ləğv edilib", bg: "rgba(239,68,68,0.12)", color: "#B91C1C" },
};

export default function DoctorDashboard() {
  const [name, setName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = () => {
    api.get("/appointments")
      .then((r) => setAppointments(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get("/me").then((r) => setName(r.data.user?.name || "")).catch(() => {});
    load();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayList = appointments
    .filter((a) => a.date === today && a.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcoming = appointments
    .filter((a) => a.date > today && ["pending", "confirmed"].includes(a.status))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 4);

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setMsg(status === "confirmed" ? "✅ Randevu təsdiqləndi" : "✅ Randevu ləğv edildi");
      load();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ Əməliyyat alınmadı");
    }
  };

  return (
    <>
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq sətri */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 26 }}>
          <div>
            <span style={{
              display: "inline-block", background: "var(--primary-light)",
              border: "1px solid var(--secondary-light)", borderRadius: 30,
              padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
            }}>
              HƏKİM PANELİ
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px", color: "var(--text-dark)" }}>
              Xoş gəldiniz{name ? `, ${name}` : ""}
            </h1>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { val: todayList.length, label: "Bugün", color: "var(--primary)" },
              { val: pendingCount, label: "Gözləyən", color: "#B45309" },
              { val: appointments.length, label: "Ümumi", color: "var(--text-mid)" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "12px 20px", textAlign: "center", minWidth: 88
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {msg && (
          <p style={{ marginBottom: 16, fontSize: "0.86rem", fontWeight: 700, color: "var(--text-dark)" }}>{msg}</p>
        )}

        <div className="doc-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, alignItems: "start" }}>

          {/* ══ SOL — bugünkü qəbullar ══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 900, margin: 0, color: "var(--text-dark)" }}>Bugünkü Qəbullar</h2>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: "3px 0 0" }}>
                    {new Date().toLocaleDateString("az-AZ", { day: "numeric", month: "long", weekday: "long" })}
                  </p>
                </div>
                <Link to="/doctor/appointments" style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
                  Hamısı →
                </Link>
              </div>

              {loading ? (
                <p style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-light)", fontSize: "0.88rem" }}>Yüklənir...</p>
              ) : todayList.length === 0 ? (
                <div style={{ padding: "56px 24px", textAlign: "center" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 12 }}>
                    <path d={ICONS.calendar} />
                  </svg>
                  <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-dark)", margin: "0 0 4px" }}>Bu gün qəbul yoxdur</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>Rahat gün olsun</p>
                </div>
              ) : (
                todayList.map((a) => {
                  const st = STATUS[a.status] || STATUS.pending;
                  return (
                    <div key={a.id} style={{
                      padding: "16px 24px", borderBottom: "1px solid var(--border)",
                      display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap"
                    }}>
                      {/* Saat */}
                      <div style={{
                        minWidth: 62, textAlign: "center", padding: "8px 10px",
                        background: "var(--primary-light)", borderRadius: 12,
                        border: "1px solid var(--secondary-light)"
                      }}>
                        <div style={{ fontSize: "1rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1 }}>{a.time}</div>
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "0.94rem", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>
                          {a.patient?.name || "Pasiyent"}
                        </p>
                        {a.reason && (
                          <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {a.reason}
                          </p>
                        )}
                      </div>

                      <span style={{
                        fontSize: "0.7rem", fontWeight: 800, padding: "4px 12px",
                        borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0
                      }}>
                        {st.label}
                      </span>

                      {a.status === "pending" && (
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button
                            onClick={() => changeStatus(a.id, "confirmed")}
                            style={{
                              padding: "7px 14px", borderRadius: 10, border: "none",
                              background: "#059669", color: "#FFFFFF",
                              fontSize: "0.78rem", fontWeight: 800, cursor: "pointer"
                            }}
                          >
                            Təsdiqlə
                          </button>
                          <button
                            onClick={() => changeStatus(a.id, "cancelled")}
                            style={{
                              padding: "7px 14px", borderRadius: 10,
                              border: "1px solid var(--border)", background: "transparent",
                              color: "#B91C1C", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer"
                            }}
                          >
                            Ləğv
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Yaxınlaşan */}
            {upcoming.length > 0 && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0, color: "var(--text-dark)" }}>Yaxınlaşan Randevular</h2>
                </div>
                {upcoming.map((a) => (
                  <div key={a.id} style={{
                    padding: "13px 24px", borderBottom: "1px solid var(--border)",
                    display: "flex", alignItems: "center", gap: 14
                  }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)", minWidth: 96 }}>
                      {a.date} · {a.time}
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-dark)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.patient?.name}
                    </span>
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                      background: (STATUS[a.status] || STATUS.pending).bg,
                      color: (STATUS[a.status] || STATUS.pending).color, flexShrink: 0
                    }}>
                      {(STATUS[a.status] || STATUS.pending).label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══ SAĞ — sürətli keçidlər ══ */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, overflow: "hidden", position: "sticky", top: 90
          }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0, color: "var(--text-dark)" }}>Sürətli Keçidlər</h2>
            </div>

            {QUICK.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 22px", borderBottom: "1px solid var(--border)",
                  textDecoration: "none", transition: "background 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: "var(--primary-light)", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[q.icon]} />
                  </svg>
                </div>
                <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-dark)", flex: 1 }}>
                  {q.title}
                </span>
                <span style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}