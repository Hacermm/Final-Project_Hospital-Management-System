import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [pending, setPending] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = () => {
    api.get("/admin/reviews")
      .then((r) => {
        setReviews(r.data.data || []);
        setPending(r.data.pending || 0);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const toggle = async (id) => {
    try {
      const r = await api.put(`/admin/reviews/${id}`);
      notify(r.data.message, true);
      load();
    } catch {
      notify("Əməliyyat alınmadı", false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Bu rəyi silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      notify("Rəy silindi", true);
      load();
    } catch {
      notify("Silinə bilmədi", false);
    }
  };

  const filtered =
    filter === "pending" ? reviews.filter((r) => !r.is_approved)
    : filter === "approved" ? reviews.filter((r) => r.is_approved)
    : reviews;

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main style={{ maxWidth: 950, margin: "0 auto", padding: "28px 24px 64px", width: "100%" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <span style={{
              display: "inline-block", background: "#EEF2FF",
              border: "1px solid rgba(79,70,229,0.25)", borderRadius: 30,
              padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.8px", color: "#4F46E5", marginBottom: 12
            }}>
              MODERASİYA
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
              Pasiyent Rəyləri
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 520 }}>
              Rəylər yalnız təsdiqdən sonra saytda görünür.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { val: avg, label: "Orta bal" },
              { val: pending, label: "Gözləyən" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "12px 20px", textAlign: "center", minWidth: 88
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#4F46E5", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            { id: "all", label: "Hamısı", count: reviews.length },
            { id: "pending", label: "Təsdiq gözləyən", count: pending },
            { id: "approved", label: "Təsdiqlənmiş", count: reviews.length - pending },
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
          <p style={{ textAlign: "center", padding: "70px 0", color: "var(--text-light)", fontWeight: 700 }}>Yüklənir...</p>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "64px 30px", textAlign: "center"
          }}>
            <p style={{ fontSize: "0.98rem", fontWeight: 800, margin: "0 0 6px" }}>Rəy yoxdur</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", margin: 0 }}>
              Pasiyentlər rəy yazdıqca burada görünəcək.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((r) => (
              <div key={r.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: r.is_approved ? "3px solid #10B981" : "3px solid #F59E0B",
                borderRadius: 18, padding: "18px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                    color: "#FFFFFF", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "0.88rem", fontWeight: 900
                  }}>
                    {r.author?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 5 }}>
                      <p style={{ fontSize: "0.94rem", fontWeight: 800, margin: 0 }}>{r.author}</p>
                      <span style={{ color: "#F59E0B", fontSize: "0.85rem", letterSpacing: 1 }}>
                        {"★".repeat(r.rating)}<span style={{ color: "var(--border)" }}>{"★".repeat(5 - r.rating)}</span>
                      </span>
                      <span style={{
                        fontSize: "0.66rem", fontWeight: 800, padding: "3px 11px", borderRadius: 20,
                        background: r.is_approved ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                        color: r.is_approved ? "#047857" : "#B45309",
                        border: `1px solid ${r.is_approved ? "rgba(16,185,129,0.28)" : "rgba(245,158,11,0.28)"}`,
                      }}>
                        {r.is_approved ? "SAYTDA" : "GÖZLƏYİR"}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.88rem", color: "var(--text-dark)", margin: "0 0 8px", lineHeight: 1.65 }}>
                      {r.comment}
                    </p>

                    <p style={{ fontSize: "0.76rem", color: "var(--text-light)", margin: 0 }}>
                      {r.doctor ? `${r.doctor} · ` : ""}{r.date}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => toggle(r.id)}
                      style={{
                        padding: "8px 16px", borderRadius: 10, border: "none",
                        background: r.is_approved ? "var(--bg)" : "#6366F1",
                        color: r.is_approved ? "var(--text-mid)" : "#FFFFFF",
                        fontSize: "0.79rem", fontWeight: 800, cursor: "pointer",
                        borderWidth: r.is_approved ? 1 : 0,
                        borderStyle: "solid", borderColor: "var(--border)",
                      }}
                    >
                      {r.is_approved ? "Gizlət" : "Təsdiqlə"}
                    </button>

                    <button
                      onClick={() => remove(r.id)}
                      style={{
                        padding: "8px 16px", borderRadius: 10,
                        border: "1px solid var(--border)", background: "transparent",
                        color: "#B91C1C", fontSize: "0.79rem", fontWeight: 800, cursor: "pointer",
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}