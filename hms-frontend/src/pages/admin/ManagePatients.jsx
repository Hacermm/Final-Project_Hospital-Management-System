import { useEffect, useState } from "react";
import api from "../../lib/api";

const emptyForm = {
  name: "", email: "", password: "", password_confirmation: "",
  date_of_birth: "", gender: "", blood_group: "",
  address: "", phone: "", emergency_contact: "",
};

const GENDERS = { male: "Kişi", female: "Qadın", other: "Digər" };
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [today] = useState(() => new Date());

  const load = () => {
    api.get("/patients")
      .then((res) => setPatients(res.data.data || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/patients/${editId}`, form);
        notify("Pasiyent məlumatları yeniləndi", true);
      } else {
        await api.post("/patients", form);
        notify("Pasiyent əlavə olundu və dərhal giriş edə bilər", true);
      }
      resetForm();
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

  const startEdit = (p) => {
    setForm({
      ...emptyForm,
      name: p.name || "",
      email: p.email || "",
      date_of_birth: p.date_of_birth || "",
      gender: p.gender || "",
      blood_group: p.blood_group || "",
      address: p.address || "",
      phone: p.phone || "",
      emergency_contact: p.emergency_contact || "",
    });
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" pasiyentini silmək istəyirsiniz? Tibbi qeydləri də silinəcək.`)) return;
    try {
      await api.delete(`/patients/${id}`);
      notify("Pasiyent silindi", true);
      if (editId === id) resetForm();
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Silinə bilmədi", false);
    }
  };

  // yaş hesabla
  const getAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filtered = patients.filter((p) =>
    !search ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 12,
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-dark)", fontSize: "0.87rem", outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block", fontSize: "0.73rem", fontWeight: 800,
    color: "var(--text-dark)", marginBottom: 6,
    textTransform: "uppercase", letterSpacing: "0.4px",
  };

  return (
    <>
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <span style={{
              display: "inline-block", background: "#EEF2FF",
              border: "1px solid rgba(79,70,229,0.25)", borderRadius: 30,
              padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.8px", color: "#4F46E5", marginBottom: 12
            }}>
              PASİYENT QEYDİYYATI
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
              Xəstə İdarəetməsi
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 520 }}>
              Telefonla və ya yerində müraciət edən pasiyentləri sistemə əlavə edin.
            </p>
          </div>

          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "12px 22px", textAlign: "center", minWidth: 96
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#4F46E5", lineHeight: 1 }}>{patients.length}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: 700, marginTop: 4 }}>Pasiyent</div>
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

        <div className="pat-grid" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }}>

          {/* ══ SOL — forma ══ */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--surface)",
              border: editId ? "1px solid #4F46E5" : "1px solid var(--border)",
              borderRadius: 20, padding: 24, position: "sticky", top: 90,
              maxHeight: "calc(100vh - 110px)", overflowY: "auto",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 4px" }}>
              {editId ? "Pasiyenti Redaktə Et" : "Yeni Pasiyent"}
            </h2>
            <p style={{ fontSize: "0.79rem", color: "var(--text-light)", margin: "0 0 20px" }}>
              {editId ? "Dəyişiklikləri yadda saxlayın" : "Hesab avtomatik təsdiqlənir"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={labelStyle}>Ad Soyad *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Kamran Səfərov" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="pasiyent@mail.az" style={inputStyle} />
              </div>

              {!editId && (
                <>
                  <div>
                    <label style={labelStyle}>Parol *</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min 8 simvol, hərf + rəqəm" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Parolu təkrarla *</label>
                    <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
                  </div>
                </>
              )}

              <div>
                <label style={labelStyle}>Doğum tarixi</label>
                <input
                  name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange}
                  max={today.toISOString().split("T")[0]} min="1900-01-01"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Cins</label>
                  <select name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    <option value="">Seçin</option>
                    <option value="male">Kişi</option>
                    <option value="female">Qadın</option>
                    <option value="other">Digər</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Qan qrupu</label>
                  <select name="blood_group" value={form.blood_group} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    <option value="">Seçin</option>
                    {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Telefon</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+994 55 123 45 67" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Təcili əlaqə</label>
                <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} placeholder="Yaxın qohumun nömrəsi" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Ünvan</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows="2" placeholder="Bakı ş., ..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1, padding: "13px", borderRadius: 12, border: "none",
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
                    onClick={resetForm}
                    style={{
                      padding: "13px 18px", borderRadius: 12,
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
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Pasiyent Siyahısı</h2>

              <div style={{ position: "relative", minWidth: 200, flex: "0 1 260px" }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
                  width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ad və ya email..."
                  style={{ ...inputStyle, padding: "9px 12px 9px 34px", fontSize: "0.83rem" }}
                />
              </div>
            </div>

            {loading ? (
              <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "64px 30px", textAlign: "center" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 14 }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
                <p style={{ fontSize: "0.96rem", fontWeight: 800, margin: "0 0 6px" }}>
                  {search ? "Nəticə tapılmadı" : "Hələ pasiyent yoxdur"}
                </p>
                <p style={{ fontSize: "0.84rem", color: "var(--text-light)", margin: 0 }}>
                  {search ? "Başqa ad sınayın" : "Soldakı formadan əlavə edin."}
                </p>
              </div>
            ) : (
              filtered.map((p) => {
                const isEditing = editId === p.id;
                const age = getAge(p.date_of_birth);
                return (
                  <div
                    key={p.id}
                    style={{
                      padding: "16px 22px", borderBottom: "1px solid var(--border)",
                      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                      background: isEditing ? "#EEF2FF" : "transparent",
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                      color: "#FFFFFF", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "0.92rem", fontWeight: 900
                    }}>
                      {p.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "var(--text-dark)" }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-mid)", margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.email}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: "3px 0 0" }}>
                        {age !== null ? `${age} yaş` : "Yaş qeyd edilməyib"}
                        {p.gender ? ` · ${GENDERS[p.gender]}` : ""}
                        {p.phone ? ` · ${p.phone}` : ""}
                      </p>
                    </div>

                    {p.blood_group && (
                      <span style={{
                        fontSize: "0.82rem", fontWeight: 900, flexShrink: 0,
                        color: "#B91C1C", background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        padding: "5px 13px", borderRadius: 20, whiteSpace: "nowrap"
                      }}>
                        {p.blood_group}
                      </span>
                    )}

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => startEdit(p)}
                        style={{
                          padding: "7px 15px", borderRadius: 10,
                          border: "1px solid var(--border)", background: "var(--bg)",
                          color: "#6366F1", fontSize: "0.79rem", fontWeight: 800, cursor: "pointer",
                        }}
                      >
                        Redaktə
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        style={{
                          padding: "7px 15px", borderRadius: 10,
                          border: "1px solid var(--border)", background: "transparent",
                          color: "#DC2626", fontSize: "0.79rem", fontWeight: 800, cursor: "pointer",
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