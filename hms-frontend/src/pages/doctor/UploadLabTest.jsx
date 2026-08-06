import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function UploadLabTest() {
  const [patients, setPatients] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [form, setForm] = useState({ patient_id: "", title: "", description: "" });
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/patients").then((r) => setPatients(r.data.data || [])).catch(() => {});
    api.get("/lab-tests")
      .then((r) => setLabTests(r.data.data || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return notify("Zəhmət olmasa fayl seçin", false);

    const data = new FormData();
    data.append("patient_id", form.patient_id);
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("file", file);

    setUploading(true);
    try {
      await api.post("/lab-tests", data, { headers: { "Content-Type": "multipart/form-data" } });
      notify("Nəticə yükləndi və pasiyentə göndərildi", true);
      setForm({ patient_id: "", title: "", description: "" });
      setFile(null);
      e.target.reset();
      load();
    } catch (err) {
      const msg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Yüklənə bilmədi";
      notify(msg, false);
    } finally {
      setUploading(false);
    }
  };

  const download = async (id, fileName) => {
    try {
      const res = await api.get(`/lab-tests/${id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      notify("Fayl endirilə bilmədi", false);
    }
  };

  const fileIcon = (name = "") =>
    /\.(jpe?g|png)$/i.test(name)
      ? "M4 16l4.6-4.6a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM9 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
      : "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8";

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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 64px", width: "100%" }}>

        {/* Başlıq */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
          }}>
            LABORATORİYA
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
            Lab Nəticələri
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 560 }}>
            Analiz nəticələrini yükləyin — fayl yalnız aid pasiyent və həkim tərəfindən endirilə bilər.
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

        <div className="lab-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>

          {/* ══ SOL — yükləmə formu ══ */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 20, padding: 24, position: "sticky", top: 90,
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 18px" }}>Yeni Nəticə Yüklə</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Pasiyent *</label>
                <select
                  value={form.patient_id}
                  onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                  required
                  style={{ ...inputStyle, fontWeight: 700, cursor: "pointer" }}
                >
                  <option value="">Pasiyent seçin...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Başlıq *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Məsələn: Ümumi qan analizi"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Təsvir</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="2"
                  placeholder="Qısa şərh, tövsiyə..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {/* Fayl seçimi */}
              <div>
                <label style={labelStyle}>Fayl *</label>
                <label
                  htmlFor="labfile"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 8, padding: "22px 16px", borderRadius: 14, cursor: "pointer",
                    border: `1.5px dashed ${file ? "var(--primary)" : "var(--border)"}`,
                    background: file ? "var(--primary-light)" : "var(--bg)",
                    transition: "all 0.2s", textAlign: "center",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                    stroke={file ? "var(--primary)" : "var(--text-light)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span style={{ fontSize: "0.84rem", fontWeight: 800, color: file ? "var(--primary)" : "var(--text-dark)", wordBreak: "break-all" }}>
                    {file ? file.name : "Fayl seçmək üçün klikləyin"}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-light)" }}>
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "PDF, JPG, PNG — maksimum 5 MB"}
                  </span>
                </label>
                <input
                  id="labfile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  style={{ display: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  background: uploading ? "var(--border)" : "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
                  color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 800,
                  cursor: uploading ? "default" : "pointer", marginTop: 4,
                }}
              >
                {uploading ? "Yüklənir..." : "Yüklə və göndər"}
              </button>
            </div>

            <p style={{ fontSize: "0.74rem", color: "var(--text-light)", margin: "16px 0 0", lineHeight: 1.5 }}>
              🔒 Fayllar qorunan diskdə saxlanılır və birbaşa URL ilə açıla bilmir.
            </p>
          </form>

          {/* ══ SAĞ — yüklənmiş nəticələr ══ */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, overflow: "hidden"
          }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Yüklənmiş Nəticələr</h2>
              <span style={{
                fontSize: "0.74rem", fontWeight: 800, padding: "3px 11px", borderRadius: 20,
                background: "var(--primary-light)", color: "var(--primary)",
                border: "1px solid var(--secondary-light)"
              }}>
                {labTests.length}
              </span>
            </div>

            {loading ? (
              <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>
            ) : labTests.length === 0 ? (
              <div style={{ padding: "64px 30px", textAlign: "center" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 14 }}>
                  <path d="M9 2v6L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3L15 8V2M9 2h6M7.5 13h9" />
                </svg>
                <p style={{ fontSize: "0.96rem", fontWeight: 800, margin: "0 0 6px" }}>Hələ nəticə yüklənməyib</p>
                <p style={{ fontSize: "0.84rem", color: "var(--text-light)", margin: 0 }}>
                  Soldakı formadan ilk analizi yükləyin.
                </p>
              </div>
            ) : (
              labTests.map((t) => (
                <div key={t.id} style={{
                  padding: "16px 22px", borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "var(--primary-light)", border: "1px solid var(--secondary-light)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d={fileIcon(t.file_name)} />
                    </svg>
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: "0.94rem", fontWeight: 800, margin: 0, color: "var(--text-dark)" }}>
                      {t.title}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-mid)", margin: "3px 0 0" }}>
                      {t.patient} · {t.date}
                    </p>
                    {t.description && (
                      <p style={{ fontSize: "0.79rem", color: "var(--text-light)", margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => download(t.id, t.file_name)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
                      padding: "8px 16px", borderRadius: 10,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--primary)", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#FFFFFF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--primary)"; }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Endir
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}