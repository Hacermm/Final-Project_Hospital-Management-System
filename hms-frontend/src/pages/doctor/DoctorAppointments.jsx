import { useEffect, useState } from "react";
import api from "../../lib/api";

const STATUS = {
  pending: { label: "Gözləyir", bg: "rgba(245,158,11,0.12)", color: "#B45309", border: "rgba(245,158,11,0.28)" },
  confirmed: { label: "Təsdiqlənib", bg: "rgba(16,185,129,0.12)", color: "#047857", border: "rgba(16,185,129,0.28)" },
  completed: { label: "Tamamlanıb", bg: "rgba(99,102,241,0.12)", color: "#4338CA", border: "rgba(99,102,241,0.28)" },
  cancelled: { label: "Ləğv edilib", bg: "rgba(239,68,68,0.12)", color: "#B91C1C", border: "rgba(239,68,68,0.28)" },
};

const TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { text, ok }

  const load = () => {
    api.get("/appointments")
      .then((r) => setAppointments(r.data.data || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      notify(`Status yeniləndi: ${STATUS[status].label}`, true);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Əməliyyat alınmadı", false);
    }
  };

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === "all" ? appointments.length : appointments.filter((a) => a.status === t).length;
    return acc;
  }, {});

  const filtered = (filter === "all" ? appointments : appointments.filter((a) => a.status === filter))
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ marginBottom: 22 }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
          }}>
            QƏBUL İDARƏETMƏSİ
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
            Randevularım
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0" }}>
            Pasiyent qəbullarını təsdiqləyin, ləğv edin və ya tamamlanmış kimi işarələyin.
          </p>
        </div>

        {/* Filter tabları */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {TABS.map((s) => {
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 16px", borderRadius: 12, cursor: "pointer",
                  fontSize: "0.84rem", fontWeight: 800,
                  border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: active ? "var(--primary)" : "var(--surface)",
                  color: active ? "#FFFFFF" : "var(--text-mid)",
                  transition: "all 0.2s",
                }}
              >
                {s === "all" ? "Hamısı" : STATUS[s].label}
                <span style={{
                  minWidth: 20, padding: "1px 6px", borderRadius: 10,
                  fontSize: "0.7rem", fontWeight: 900,
                  background: active ? "rgba(255,255,255,0.22)" : "var(--bg)",
                  color: active ? "#FFFFFF" : "var(--text-light)",
                }}>
                  {counts[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bildiriş */}
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

        {/* Siyahı */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "70px 0", color: "var(--text-light)", fontWeight: 700 }}>
            Yüklənir...
          </p>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "64px 30px", textAlign: "center"
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 14 }}>
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            </svg>
            <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-dark)", margin: "0 0 6px" }}>
              {filter === "all" ? "Hələ randevunuz yoxdur" : `"${STATUS[filter].label}" statuslu randevu yoxdur`}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", margin: 0 }}>
              Pasiyentlər randevu aldıqca burada görünəcək.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((a) => {
              const st = STATUS[a.status] || STATUS.pending;
              const isToday = a.date === today;

              return (
                <div
                  key={a.id}
                  style={{
                    background: "var(--surface)",
                    border: isToday ? "1px solid var(--primary)" : "1px solid var(--border)",
                    borderRadius: 18, padding: "18px 22px",
                    display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
                    boxShadow: "0 3px 14px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Tarix bloku */}
                  <div style={{
                    minWidth: 78, textAlign: "center", padding: "10px 12px",
                    borderRadius: 14, flexShrink: 0,
                    background: isToday ? "var(--primary)" : "var(--bg)",
                    border: isToday ? "none" : "1px solid var(--border)",
                    color: isToday ? "#FFFFFF" : "var(--text-dark)",
                  }}>
                    <div style={{ fontSize: "1.05rem", fontWeight: 900, lineHeight: 1 }}>{a.time}</div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, marginTop: 5, opacity: isToday ? 0.9 : 0.6 }}>
                      {isToday ? "BUGÜN" : a.date?.slice(5).replace("-", ".")}
                    </div>
                  </div>

                  {/* Məlumat */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>
                        {a.patient?.name || "Pasiyent"}
                      </h3>
                      <span style={{
                        fontSize: "0.68rem", fontWeight: 800, padding: "3px 11px",
                        borderRadius: 20, background: st.bg, color: st.color,
                        border: `1px solid ${st.border}`,
                      }}>
                        {st.label}
                      </span>
                    </div>
                    {a.reason && (
                      <p style={{ fontSize: "0.84rem", color: "var(--text-light)", margin: "5px 0 0", fontStyle: "italic" }}>
                        “{a.reason}”
                      </p>
                    )}
                  </div>

                  {/* Əməliyyatlar */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {a.status === "pending" && (
                      <>
                        <button
                          onClick={() => changeStatus(a.id, "confirmed")}
                          style={{
                            padding: "8px 16px", borderRadius: 10, border: "none",
                            background: "#059669", color: "#FFFFFF",
                            fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
                          }}
                        >
                          Təsdiqlə
                        </button>
                        <button
                          onClick={() => changeStatus(a.id, "cancelled")}
                          style={{
                            padding: "8px 16px", borderRadius: 10,
                            border: "1px solid var(--border)", background: "transparent",
                            color: "#B91C1C", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
                          }}
                        >
                          Ləğv et
                        </button>
                      </>
                    )}

                    {a.status === "confirmed" && (
                      <button
                        onClick={() => changeStatus(a.id, "completed")}
                        style={{
                          padding: "8px 16px", borderRadius: 10, border: "none",
                          background: "var(--primary)", color: "#FFFFFF",
                          fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
                        }}
                      >
                        Tamamla
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
