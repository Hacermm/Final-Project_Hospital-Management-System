import { useEffect, useState } from "react";
import api from "../../lib/api";
export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/departments")
      .then((res) => setDepartments(res.data.data || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/departments/${editId}`, form);
        notify("Şöbə yeniləndi", true);
      } else {
        await api.post("/departments", form);
        notify("Şöbə əlavə olundu", true);
      }
      setForm({ name: "", description: "" });
      setEditId(null);
      load();
    } catch (err) {
      const msg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Əməliyyat alınmadı";
      notify(msg, false);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description || "" });
    setEditId(dept.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
  };

  const handleDelete = async (id, name, count) => {
    if (count > 0) {
      return notify(`"${name}" şöbəsində ${count} həkim var. Əvvəlcə həkimləri başqa şöbəyə keçirin.`, false);
    }
    if (!confirm(`"${name}" şöbəsini silmək istəyirsiniz?`)) return;
    try {
      await api.delete(`/departments/${id}`);
      notify("Şöbə silindi", true);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Silinə bilmədi", false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 12,
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-dark)", fontSize: "0.88rem", outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block", fontSize: "0.75rem", fontWeight: 800,
    color: "var(--text-dark)", marginBottom: 6,
    textTransform: "uppercase", letterSpacing: "0.4px",
  };

  const totalDoctors = departments.reduce((s, d) => s + (d.doctors_count || 0), 0);

  return (
    <>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <span style={{
              display: "inline-block", background: "#EEF2FF",
              border: "1px solid rgba(79,70,229,0.25)", borderRadius: 30,
              padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.8px", color: "#4F46E5", marginBottom: 12
            }}>
              KLİNİK STRUKTUR
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
              Şöbə İdarəetməsi
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 520 }}>
              Klinik şöbələri yaradın və redaktə edin. Hər həkim bir şöbəyə təyin olunur.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { val: departments.length, label: "Şöbə" },
              { val: totalDoctors, label: "Həkim" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "12px 20px", textAlign: "center", minWidth: 84
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#4F46E5", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
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

        <div className="dept-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" }}>

          {/* ══ SOL — forma ══ */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--surface)",
              border: editId ? "1px solid #4F46E5" : "1px solid var(--border)",
              borderRadius: 20, padding: 24, position: "sticky", top: 90,
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 4px" }}>
              {editId ? "Şöbəni Redaktə Et" : "Yeni Şöbə"}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: "0 0 20px" }}>
              {editId ? "Dəyişiklikləri yadda saxlayın" : "Yeni klinik şöbə əlavə edin"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Şöbə adı *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Məsələn: Kardiologiya"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Təsvir</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Şöbənin ixtisas sahəsi..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 12, border: "none",
                    background: saving ? "var(--border)" : "#6366F1",
                    color: "#FFFFFF", fontSize: "0.88rem", fontWeight: 800,
                    cursor: saving ? "default" : "pointer",
                  }}
                >
                  {saving ? "Gözləyin..." : editId ? "Yenilə" : "Əlavə et"}
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{
                      padding: "12px 18px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "transparent",
                      color: "var(--text-mid)", fontSize: "0.88rem", fontWeight: 800, cursor: "pointer",
                    }}
                  >
                    Ləğv
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* ══ SAĞ — siyahı ══ */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, overflow: "hidden"
          }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Mövcud Şöbələr</h2>
            </div>

            {loading ? (
              <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>
            ) : departments.length === 0 ? (
              <div style={{ padding: "64px 30px", textAlign: "center" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 14 }}>
                  <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                </svg>
                <p style={{ fontSize: "0.96rem", fontWeight: 800, margin: "0 0 6px" }}>Hələ şöbə yoxdur</p>
                <p style={{ fontSize: "0.84rem", color: "var(--text-light)", margin: 0 }}>
                  Soldakı formadan ilk şöbəni əlavə edin.
                </p>
              </div>
            ) : (
              departments.map((dept) => {
                const isEditing = editId === dept.id;
                return (
                  <div
                    key={dept.id}
                    style={{
                      padding: "16px 22px", borderBottom: "1px solid var(--border)",
                      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                      background: isEditing ? "#EEF2FF" : "transparent",
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "#EEF2FF", border: "1px solid rgba(79,70,229,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h.01M9 13h.01M9 17h.01" />
                      </svg>
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <p style={{ fontSize: "0.96rem", fontWeight: 800, margin: 0, color: "var(--text-dark)" }}>
                          {dept.name}
                        </p>
                        <span style={{
                          fontSize: "0.7rem", fontWeight: 800, padding: "3px 11px", borderRadius: 20,
                          background: dept.doctors_count > 0 ? "rgba(16,185,129,0.12)" : "var(--bg)",
                          color: dept.doctors_count > 0 ? "#047857" : "var(--text-light)",
                          border: `1px solid ${dept.doctors_count > 0 ? "rgba(16,185,129,0.28)" : "var(--border)"}`,
                        }}>
                          {dept.doctors_count || 0} həkim
                        </span>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-light)", margin: "4px 0 0", lineHeight: 1.5 }}>
                        {dept.description || "Təsvir əlavə edilməyib"}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => startEdit(dept)}
                        style={{
                          padding: "7px 15px", borderRadius: 10,
                          border: "1px solid var(--border)", background: "var(--bg)",
                          color: "#6366F1", fontSize: "0.79rem", fontWeight: 800, cursor: "pointer",
                        }}
                      >
                        Redaktə
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id, dept.name, dept.doctors_count || 0)}
                        style={{
                          padding: "7px 15px", borderRadius: 10,
                          border: "1px solid var(--border)", background: "transparent",
                          color: "#B91C1C", fontSize: "0.79rem", fontWeight: 800, cursor: "pointer",
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </>
  );
}