import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor_id: "", rating: 5, comment: "" });
  const [hover, setHover] = useState(0);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/my-reviews")
      .then((r) => {
        setReviews(r.data.data || []);
        setCanReview(r.data.can_review);
      })
      .finally(() => setLoading(false));
    api.get("/doctors").then((r) => setDoctors(r.data.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.post("/reviews", form);
      notify(r.data.message, true);
      setForm({ doctor_id: "", rating: 5, comment: "" });
      load();
    } catch (err) {
      notify(
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Rəy göndərilə bilmədi",
        false
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 12,
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-dark)", fontSize: "0.88rem", outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block", fontSize: "0.74rem", fontWeight: 800,
    color: "var(--text-dark)", marginBottom: 7,
    textTransform: "uppercase", letterSpacing: "0.4px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 64px", width: "100%" }}>

        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
          }}>
            TƏCRÜBƏNİZ
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
            Rəylərim
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 560 }}>
            Müayinə təcrübənizi paylaşın — rəyiniz administrator təsdiqindən sonra saytda görünəcək.
          </p>
        </div>

        {toast && (
          <div style={{
            marginBottom: 20, padding: "13px 18px", borderRadius: 12,
            fontSize: "0.87rem", fontWeight: 700,
            background: toast.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${toast.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: toast.ok ? "#047857" : "#B91C1C",
          }}>
            {toast.ok ? "✓" : "✕"} {toast.text}
          </div>
        )}

        {canReview ? (
          <form onSubmit={handleSubmit} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: 24, marginBottom: 24,
          }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 20px" }}>Yeni Rəy Yaz</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={labelStyle}>Qiymətiniz</label>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, rating: s })}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: 2, fontSize: "1.9rem", lineHeight: 1,
                        color: s <= (hover || form.rating) ? "#F59E0B" : "var(--border)",
                        transition: "color 0.15s, transform 0.15s",
                        transform: s === hover ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ marginLeft: 10, fontSize: "0.85rem", fontWeight: 800, color: "var(--text-mid)" }}>
                    {form.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Həkim (istəyə bağlı)</label>
                <select
                  value={form.doctor_id}
                  onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}
                >
                  <option value="">Ümumi rəy (həkim seçmədən)</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Rəyiniz *</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  required
                  minLength={10}
                  maxLength={1000}
                  rows="4"
                  placeholder="Təcrübənizi paylaşın — ən azı 10 simvol..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                <p style={{ fontSize: "0.73rem", color: "var(--text-light)", margin: "6px 0 0", textAlign: "right" }}>
                  {form.comment.length}/1000
                </p>
              </div>

              <button
                type="submit"
                disabled={saving || form.comment.trim().length < 10}
                style={{
                  padding: "13px", borderRadius: 12, border: "none",
                  background: saving || form.comment.trim().length < 10
                    ? "var(--border)"
                    : "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
                  color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 800,
                  cursor: saving || form.comment.trim().length < 10 ? "default" : "pointer",
                }}
              >
                {saving ? "Göndərilir..." : "Rəyi göndər"}
              </button>
            </div>
          </form>
        ) : !loading && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "40px 30px", textAlign: "center", marginBottom: 24,
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 12 }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p style={{ fontSize: "0.96rem", fontWeight: 800, margin: "0 0 6px" }}>Hələ rəy yaza bilmirsiniz</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", margin: 0, lineHeight: 1.6 }}>
              Rəy yazmaq üçün ən azı bir tamamlanmış müayinəniz olmalıdır.
            </p>
          </div>
        )}

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 20, overflow: "hidden",
        }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Göndərdiyim Rəylər</h2>
          </div>

          {loading ? (
            <p style={{ padding: "50px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>
          ) : reviews.length === 0 ? (
            <p style={{ padding: "50px 24px", textAlign: "center", color: "var(--text-light)", fontSize: "0.88rem" }}>
              Hələ rəy yazmamısınız.
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "#F59E0B", fontSize: "0.95rem", letterSpacing: 1 }}>
                      {"★".repeat(r.rating)}<span style={{ color: "var(--border)" }}>{"★".repeat(5 - r.rating)}</span>
                    </span>
                    {r.doctor && (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-mid)", fontWeight: 700 }}>
                        {r.doctor}
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "4px 12px", borderRadius: 20,
                    background: r.is_approved ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                    color: r.is_approved ? "#047857" : "#B45309",
                    border: `1px solid ${r.is_approved ? "rgba(16,185,129,0.28)" : "rgba(245,158,11,0.28)"}`,
                  }}>
                    {r.is_approved ? "Saytda görünür" : "Təsdiq gözləyir"}
                  </span>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-dark)", margin: "0 0 6px", lineHeight: 1.6 }}>
                  {r.comment}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: 0 }}>{r.date}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}