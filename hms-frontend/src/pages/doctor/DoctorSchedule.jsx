import { useEffect, useState } from "react";
import api from "../../lib/api";

const DAYS = [
  { value: "monday", label: "Bazar ertəsi", short: "B.e" },
  { value: "tuesday", label: "Çərşənbə axşamı", short: "Ç.a" },
  { value: "wednesday", label: "Çərşənbə", short: "Çər" },
  { value: "thursday", label: "Cümə axşamı", short: "C.a" },
  { value: "friday", label: "Cümə", short: "Cüm" },
  { value: "saturday", label: "Şənbə", short: "Şən" },
  { value: "sunday", label: "Bazar", short: "Baz" },
];

export default function DoctorSchedule() {
  const [doctorId, setDoctorId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ day_of_week: "monday", start_time: "09:00", end_time: "17:00" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSchedules = (id) => {
    api.get(`/doctors/${id}/schedules`)
      .then((r) => setSchedules(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get("/me").then((r) => {
      const id = r.data.user?.doctor?.id;
      if (id) {
        setDoctorId(id);
        loadSchedules(id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/doctors/${doctorId}/schedules`, { ...form, is_available: true });
      notify("İş günü əlavə olundu", true);
      loadSchedules(doctorId);
    } catch (err) {
      const msg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Əlavə edilə bilmədi";
      notify(msg, false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Bu iş gününü silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/schedules/${id}`);
      notify("İş günü silindi", true);
      loadSchedules(doctorId);
    } catch (err) {
      notify(err.response?.data?.message || "Silinə bilmədi", false);
    }
  };

  // günləri həftə sırası ilə düz
  const ordered = DAYS.map((d) => ({
    ...d,
    schedule: schedules.find((s) => s.day_of_week === d.value),
  }));

  const activeDays = schedules.length;
  const totalHours = schedules.reduce((sum, s) => {
    const [sh, sm] = s.start_time.split(":").map(Number);
    const [eh, em] = s.end_time.split(":").map(Number);
    return sum + (eh * 60 + em - sh * 60 - sm) / 60;
  }, 0);

  return (
    <>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq + statistika */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <span style={{
              display: "inline-block", background: "var(--primary-light)",
              border: "1px solid var(--secondary-light)", borderRadius: 30,
              padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
            }}>
              QƏBUL SAATLARI
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
              İş Qrafikim
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 520 }}>
              Təyin etdiyiniz saatlar 30 dəqiqəlik randevu slotlarına bölünür və pasiyentlərə göstərilir.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { val: activeDays, label: "İş günü" },
              { val: `${totalHours.toFixed(0)} s`, label: "Həftəlik" },
              { val: Math.round(totalHours * 2), label: "Slot" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "12px 18px", textAlign: "center", minWidth: 80
              }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
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

        <div className="sched-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

          {/* ══ SOL — həftəlik cədvəl ══ */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, overflow: "hidden"
          }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Həftəlik Cədvəl</h2>
            </div>

            {loading ? (
              <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>
            ) : (
              ordered.map((d) => {
                const has = !!d.schedule;
                return (
                  <div
                    key={d.value}
                    style={{
                      padding: "15px 22px", borderBottom: "1px solid var(--border)",
                      display: "flex", alignItems: "center", gap: 16,
                      background: has ? "transparent" : "var(--bg)",
                    }}
                  >
                    {/* Gün nişanı */}
                    <div style={{
                      width: 52, height: 44, borderRadius: 12, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: has ? "var(--primary-light)" : "transparent",
                      border: has ? "1px solid var(--secondary-light)" : "1px dashed var(--border)",
                      color: has ? "var(--primary)" : "var(--text-light)",
                      fontSize: "0.78rem", fontWeight: 900,
                    }}>
                      {d.short}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.92rem", fontWeight: 800, margin: 0, color: has ? "var(--text-dark)" : "var(--text-light)" }}>
                        {d.label}
                      </p>
                      {has ? (
                        <p style={{ fontSize: "0.82rem", color: "var(--text-mid)", margin: "3px 0 0", fontWeight: 700 }}>
                          {d.schedule.start_time} — {d.schedule.end_time}
                        </p>
                      ) : (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: "3px 0 0" }}>
                          İstirahət günü
                        </p>
                      )}
                    </div>

                    {has && (
                      <button
                        onClick={() => remove(d.schedule.id)}
                        style={{
                          padding: "6px 14px", borderRadius: 10, flexShrink: 0,
                          border: "1px solid var(--border)", background: "transparent",
                          color: "#B91C1C", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
                        }}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* ══ SAĞ — əlavə etmə formu ══ */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 20, padding: 24, position: "sticky", top: 90,
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 4px" }}>Yeni İş Günü</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: "0 0 20px", lineHeight: 1.5 }}>
              Hər gün üçün yalnız bir qrafik təyin edilə bilər.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  Gün
                </label>
                <select
                  name="day_of_week"
                  value={form.day_of_week}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 12,
                    border: "1px solid var(--border)", background: "var(--bg)",
                    color: "var(--text-dark)", fontSize: "0.88rem", fontWeight: 700,
                    outline: "none", cursor: "pointer",
                  }}
                >
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Başlama
                  </label>
                  <input
                    name="start_time" type="time" value={form.start_time} onChange={handleChange}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--text-dark)", fontSize: "0.88rem", fontWeight: 700, outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Bitmə
                  </label>
                  <input
                    name="end_time" type="time" value={form.end_time} onChange={handleChange}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--text-dark)", fontSize: "0.88rem", fontWeight: 700, outline: "none",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
                  color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 800,
                  cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1,
                  marginTop: 4,
                }}
              >
                {saving ? "Əlavə olunur..." : "Əlavə et"}
              </button>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: "16px 0 0", lineHeight: 1.5 }}>
              ⓘ Bitmə saatı başlama saatından sonra olmalıdır. Mövcud günü dəyişmək üçün əvvəlcə silin.
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
