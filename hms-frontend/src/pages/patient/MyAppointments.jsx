import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const statusStyles = {
    pending: { bg: "rgba(245, 158, 11, 0.12)", color: "#d97706", border: "1px solid rgba(245, 158, 11, 0.3)" },
    confirmed: { bg: "rgba(16, 185, 129, 0.12)", color: "#059669", border: "1px solid rgba(16, 185, 129, 0.3)" },
    completed: { bg: "rgba(59, 130, 246, 0.12)", color: "#2563eb", border: "1px solid rgba(59, 130, 246, 0.3)" },
    cancelled: { bg: "rgba(239, 68, 68, 0.12)", color: "#dc2626", border: "1px solid rgba(239, 68, 68, 0.3)" },
  };
  const statusLabels = { pending: "Gözləyir", confirmed: "Təsdiqlənib", completed: "Tamamlanıb", cancelled: "Ləğv edilib" };

  const load = () => {
    setLoading(true);
    api.get("/appointments")
      .then((r) => setAppointments(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("Bu randevunu ləğv etmək istəyirsiniz?")) return;
    try {
      await api.put(`/appointments/${id}`, { status: "cancelled" });
      setMessage(" Randevu uğurla ləğv edildi.");
      load();
    } catch (err) {
      setMessage(` ${err.response?.data?.message || "Xəta baş verdi."}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 80px", width: "100%", flex: 1, boxSizing: "border-box" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <Link to="/patient" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--primary)", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            ← Pasiyent Kabinetinə Qayıt
          </Link>

          <Link to="/patient/book" className="ac-btn" style={{ padding: "10px 20px", fontSize: "0.84rem", textDecoration: "none" }}>
            + Yeni Randevu Al
          </Link>
        </div>

        {/* Title Header Card */}
        <div className="ac-card" style={{ padding: "28px 32px", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                Randevularım
              </h1>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)", margin: 0 }}>
                Təsdiqlənmiş, gözləmədə olan və keçmiş həkim randevularınız
              </p>
            </div>
            <span style={{ padding: "6px 16px", borderRadius: 20, fontSize: "0.82rem", fontWeight: 900, background: "var(--primary-light)", color: "var(--primary)" }}>
              {appointments.length} Randevu
            </span>
          </div>
        </div>

        {message && (
          <p
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              fontSize: "0.88rem",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 20,
              background: message.startsWith("") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              color: message.startsWith("") ? "#059669" : "#dc2626",
              border: message.startsWith("") ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
            }}
          >
            {message}
          </p>
        )}

        {/* Appointments List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-light)", fontWeight: 700, fontSize: "0.95rem" }} className="animate-pulse">
              Randevular yüklənir...
            </div>
          )}

          {!loading && appointments.length === 0 && (
            <div className="ac-card" style={{ padding: "60px 32px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}></div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 8 }}>
                Hələ Heç Bir Randevunuz Yoxdur
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)", marginBottom: 20 }}>
                Həkimlərin iş saatlarına baxaraq ilk onlayn randevunuzu təyin edə bilərsiniz.
              </p>
              <Link to="/patient/book" className="ac-btn" style={{ padding: "12px 28px", fontSize: "0.88rem", textDecoration: "none" }}>
                Həkim Qəbuluna Yazılın
              </Link>
            </div>
          )}

          {!loading && appointments.map((a) => {
            const style = statusStyles[a.status] || statusStyles.pending;
            const canCancel = ["pending", "confirmed"].includes(a.status);
            return (
              <div
                key={a.id}
                className="ac-card"
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  justify: "space-between",
                  alignItems: "center",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "var(--primary-light)",
                      border: "1px solid var(--secondary-light)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      shrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1 }}>
                      {a.date?.split("-")[2] || "15"}
                    </span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-light)", textTransform: "uppercase", marginTop: 3 }}>
                      {a.date?.split("-")[1] || "AVQ"}
                    </span>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--text-dark)", margin: 0 }}>
                        {a.doctor?.name || "Dr. Həkim"}
                      </h3>
                      <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 800, background: style.bg, color: style.color, border: style.border }}>
                        {statusLabels[a.status] || a.status}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary)", margin: "0 0 6px 0" }}>
                      {a.doctor?.specialization || "Poliklinika"}
                    </p>

                    <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>
                       {a.date} — {a.time} {a.reason && `• "${a.reason}"`}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Link
                    to="/chat"
                    style={{
                      padding: "10px 18px",
                      borderRadius: 10,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-dark)",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                     Mesajlaş
                  </Link>

                  {canCancel && (
                    <button
                      onClick={() => cancel(a.id)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#dc2626",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Ləğv et
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
