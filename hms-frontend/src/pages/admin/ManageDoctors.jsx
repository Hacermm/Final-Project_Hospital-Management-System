import { useEffect, useState } from "react";
import api from "../../lib/api";
const emptyForm = {
  name: "", email: "", password: "", password_confirmation: "",
  department_id: "", specialization: "", bio: "",
  experience_years: "", consultation_fee: "", phone: "",
};

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    api.get("/doctors")
      .then((res) => setDoctors(res.data.data || []))
      .finally(() => setLoading(false));
    api.get("/departments").then((res) => setDepartments(res.data.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") data.append(key, value);
    });
    if (photo) data.append("photo", photo);

    try {
      if (editId) {
        data.append("_method", "PUT");
        await api.post(`/doctors/${editId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        notify("Həkim məlumatları yeniləndi", true);
      } else {
        await api.post("/doctors", data, { headers: { "Content-Type": "multipart/form-data" } });
        notify("Həkim əlavə olundu və dərhal giriş edə bilər", true);
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

  const resetForm = () => {
    setForm(emptyForm);
    setPhoto(null);
    setEditId(null);
  };

  const startEdit = (doc) => {
    setForm({
      ...emptyForm,
      name: doc.name || "",
      email: doc.email || "",
      department_id: doc.department?.id || "",
      specialization: doc.specialization || "",
      bio: doc.bio || "",
      experience_years: doc.experience_years || "",
      consultation_fee: doc.consultation_fee || "",
      phone: doc.phone || "",
    });
    setPhoto(null);
    setEditId(doc.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" həkimini silmək istəyirsiniz? Bu, onun hesabını da siləcək.`)) return;
    try {
      await api.delete(`/doctors/${id}`);
      notify("Həkim silindi", true);
      if (editId === id) resetForm();
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Silinə bilmədi", false);
    }
  };

  const filtered = doctors.filter((d) =>
    !search ||
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
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
              TİBB HEYƏTİ
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
              Həkim İdarəetməsi
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 520 }}>
              Həkim hesabları yaradın — email təsdiqi tələb olunmur, dərhal sistemə daxil ola bilirlər.
            </p>
          </div>

          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "12px 22px", textAlign: "center", minWidth: 90
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#4F46E5", lineHeight: 1 }}>{doctors.length}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: 700, marginTop: 4 }}>Həkim</div>
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

        <div className="doc-manage-grid" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }}>

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
              {editId ? "Həkimi Redaktə Et" : "Yeni Həkim"}
            </h2>
            <p style={{ fontSize: "0.79rem", color: "var(--text-light)", margin: "0 0 20px" }}>
              {editId ? "Şəkil seçilməsə köhnəsi qalır" : "Hesab avtomatik təsdiqlənir"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={labelStyle}>Ad Soyad *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Dr. Anar Məmmədov" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="hekim@novacare.az" style={inputStyle} />
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
                <label style={labelStyle}>İxtisas *</label>
                <input name="specialization" value={form.specialization} onChange={handleChange} required placeholder="Kardioloq" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Şöbə</label>
                <select name="department_id" value={form.department_id} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                  <option value="">Şöbə seçin</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Təcrübə (il)</label>
                  <input name="experience_years" type="number" min="0" max="70" value={form.experience_years} onChange={handleChange} placeholder="10" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Haqq (₼)</label>
                  <input name="consultation_fee" type="number" step="0.01" min="0" value={form.consultation_fee} onChange={handleChange} placeholder="80" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Telefon</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+994 50 123 45 67" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" placeholder="Təcrübə və ixtisas sahəsi haqqında qısa məlumat" style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {/* Şəkil */}
              <div>
                <label style={labelStyle}>Profil şəkli</label>
                <label
                  htmlFor="docphoto"
                  style={{
                    display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                    padding: "12px 14px", borderRadius: 14,
                    border: `1.5px dashed ${photo ? "#4F46E5" : "var(--border)"}`,
                    background: photo ? "#EEF2FF" : "var(--bg)",
                    transition: "all 0.2s",
                  }}
                >
                  {photo ? (
                    <img src={URL.createObjectURL(photo)} alt="" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                      background: "var(--surface)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 800, margin: 0, color: photo ? "#4F46E5" : "var(--text-dark)", wordBreak: "break-all" }}>
                      {photo ? photo.name : "Şəkil seçin"}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-light)", margin: "2px 0 0" }}>
                      {photo ? `${(photo.size / 1024 / 1024).toFixed(2)} MB` : "JPG, PNG — max 2 MB"}
                    </p>
                  </div>
                </label>
                <input id="docphoto" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={{ display: "none" }} />
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
              <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Həkim Heyəti</h2>

              <div style={{ position: "relative", minWidth: 200, flex: "0 1 260px" }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
                  width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ad və ya ixtisas..."
                  style={{ ...inputStyle, padding: "9px 12px 9px 34px", fontSize: "0.83rem" }}
                />
              </div>
            </div>

            {loading ? (
              <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "64px 30px", textAlign: "center" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 14 }}>
                  <path d="M11 2v2M6 2v2M6 4v5a5 5 0 0 0 10 0V4M11 14v2a5 5 0 0 0 10 0v-2M21 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                </svg>
                <p style={{ fontSize: "0.96rem", fontWeight: 800, margin: "0 0 6px" }}>
                  {search ? "Nəticə tapılmadı" : "Hələ həkim yoxdur"}
                </p>
                <p style={{ fontSize: "0.84rem", color: "var(--text-light)", margin: 0 }}>
                  {search ? "Başqa ad sınayın" : "Soldakı formadan ilk həkimi əlavə edin."}
                </p>
              </div>
            ) : (
              filtered.map((doc) => {
                const isEditing = editId === doc.id;
                return (
                  <div
                    key={doc.id}
                    style={{
                      padding: "16px 22px", borderBottom: "1px solid var(--border)",
                      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                      background: isEditing ? "#EEF2FF" : "transparent",
                    }}
                  >
                    {doc.photo_url ? (
                      <img src={doc.photo_url} alt={doc.name}
                        style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }} />
                    ) : (
                      <div style={{
                        width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                        color: "#FFFFFF", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "0.95rem", fontWeight: 900
                      }}>
                        {doc.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "0.96rem", fontWeight: 800, margin: 0, color: "var(--text-dark)" }}>
                        {doc.name}
                      </p>
                      <p style={{ fontSize: "0.83rem", color: "#4F46E5", fontWeight: 700, margin: "3px 0 0" }}>
                        {doc.specialization}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: "3px 0 0" }}>
                        {doc.department?.name || "Şöbə təyin edilməyib"}
                        {doc.experience_years ? ` · ${doc.experience_years} il təcrübə` : ""}
                      </p>
                    </div>

                    <span style={{
                      fontSize: "0.8rem", fontWeight: 900, color: "#047857",
                      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                      padding: "5px 13px", borderRadius: 20, flexShrink: 0, whiteSpace: "nowrap"
                    }}>
                      {doc.consultation_fee} ₼
                    </span>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => startEdit(doc)}
                        style={{
                          padding: "7px 15px", borderRadius: 10,
                          border: "1px solid var(--border)", background: "var(--bg)",
                          color: "#6366F1", fontSize: "0.79rem", fontWeight: 800, cursor: "pointer",
                        }}
                      >
                        Redaktə
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
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