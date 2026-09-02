import { useEffect, useState } from "react";
import api from "../../lib/api";

const emptyForm = { name: "", email: "", password: "", password_confirmation: "", role: "admin" };

const ROLES = {
  admin: { label: "Admin", bg: "var(--bg)", color: "var(--text-dark)", border: "var(--border)" },
  super_admin: { label: "Super Admin", bg: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "rgba(212,175,55,0.4)" },
};

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [myId, setMyId] = useState(null);

  const load = () => {
    api.get("/admins")
      .then((r) => setAdmins(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get("/me").then((r) => setMyId(r.data.user?.id)).catch(() => {});
    load();
  }, []);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admins", form);
      notify("Administrator hesabı yaradıldı", true);
      setForm(emptyForm);
      load();
    } catch (err) {
      const msg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Hesab yaradıla bilmədi";
      notify(msg, false);
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admins/${id}`, { role });
      notify("Rol yeniləndi", true);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Rol dəyişdirilə bilmədi", false);
    }
  };

  const remove = async (id, name) => {
    if (!confirm(`"${name}" hesabını silmək istəyirsiniz?`)) return;
    try {
      await api.delete(`/admins/${id}`);
      notify("Hesab silindi", true);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Silinə bilmədi", false);
    }
  };

  const superCount = admins.filter((a) => a.role === "super_admin").length;

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
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <span style={{
              display: "inline-block", background: "#FFF5CC",
              border: "1px solid rgba(161, 124, 0, 0.2)", borderRadius: 30,
              padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.8px", color: "#A17C00", marginBottom: 12
            }}>
              SUPER ADMİN SƏLAHİYYƏTİ
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
              Administrator İdarəetməsi
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 520 }}>
              Sistem administratorlarını yaradın və səlahiyyət səviyyələrini idarə edin.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { val: admins.length, label: "Ümumi" },
              { val: superCount, label: "Super Admin" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "12px 20px", textAlign: "center", minWidth: 96
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D4AF37", lineHeight: 1 }}>{s.val}</div>
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

        <div className="admins-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>

          {/* ══ SOL — forma ══ */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 20, padding: 24, position: "sticky", top: 90,
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 4px" }}>Yeni Administrator</h2>
            <p style={{ fontSize: "0.79rem", color: "var(--text-light)", margin: "0 0 20px" }}>
              Hesab avtomatik təsdiqlənir və dərhal aktiv olur.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={labelStyle}>Ad Soyad *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Nərmin Əliyeva" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="admin@novacare.az" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Parol *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min 8 simvol, hərf + rəqəm" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Parolu təkrarla *</label>
                <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
              </div>

              {/* Rol seçimi — kart şəklində */}
              <div>
                <label style={labelStyle}>Səlahiyyət səviyyəsi</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {[
                    { value: "admin", title: "Admin", desc: "Həkim, pasiyent və şöbə idarəetməsi" },
                    { value: "super_admin", title: "Super Admin", desc: "Tam səlahiyyət + administrator idarəetməsi" },
                  ].map((r) => {
                    const active = form.role === r.value;
                    return (
                      <label
                        key={r.value}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 11, cursor: "pointer",
                          padding: "12px 14px", borderRadius: 13,
                          border: active ? "1.5px solid #D4AF37" : "1px solid var(--border)",
                          background: active ? "rgba(212,175,55,0.08)" : "var(--bg)",
                          transition: "all 0.2s",
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={active}
                          onChange={handleChange}
                          style={{ marginTop: 3, accentColor: "#D4AF37", flexShrink: 0 }}
                        />
                        <div>
                          <p style={{ fontSize: "0.86rem", fontWeight: 800, margin: 0, color: active ? "#D4AF37" : "var(--text-dark)" }}>
                            {r.title}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: "3px 0 0", lineHeight: 1.45 }}>
                            {r.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  background: saving ? "var(--border)" : "#D4AF37",
                  color: "#111", fontSize: "0.88rem", fontWeight: 900,
                  cursor: saving ? "default" : "pointer", marginTop: 4,
                }}
              >
                {saving ? "Gözləyin..." : "Əlavə et"}
              </button>
            </div>
          </form>

          {/* ══ SAĞ — siyahı ══ */}
          <div>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden"
            }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Sistem Administratorları</h2>
              </div>

              {loading ? (
                <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>
              ) : admins.length === 0 ? (
                <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Administrator yoxdur.</p>
              ) : (
                admins.map((a) => {
                  const role = ROLES[a.role] || ROLES.admin;
                  const isMe = a.id === myId;
                  const isLastSuper = a.role === "super_admin" && superCount <= 1;
                  const locked = isMe || isLastSuper;

                  return (
                    <div
                      key={a.id}
                      style={{
                        padding: "16px 22px", borderBottom: "1px solid var(--border)",
                        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                        background: isMe ? "rgba(212,175,55,0.06)" : "transparent",
                      }}
                    >
                      <div style={{
                        width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                        background: a.role === "super_admin"
                          ? "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)"
                          : "linear-gradient(135deg, #333333 0%, #111111 100%)",
                        color: a.role === "super_admin" ? "#121212" : "#FFFFFF", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "0.9rem", fontWeight: 900
                      }}>
                        {a.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                          <p style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "var(--text-dark)" }}>
                            {a.name}
                          </p>

                          <span style={{
                            fontSize: "0.68rem", fontWeight: 800, padding: "3px 11px", borderRadius: 20,
                            background: role.bg, color: role.color, border: `1px solid ${role.border}`,
                          }}>
                            {role.label}
                          </span>

                          {isMe && (
                            <span style={{
                              fontSize: "0.65rem", fontWeight: 900, padding: "3px 10px", borderRadius: 20,
                              background: "var(--surface)", color: "var(--text-mid)",
                              border: "1px solid var(--border)",
                            }}>
                              SİZ
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: "0.79rem", color: "var(--text-light)", margin: "3px 0 0" }}>
                          {a.email} · {a.created_at}
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <select
                          value={a.role}
                          onChange={(e) => changeRole(a.id, e.target.value)}
                          disabled={isMe}
                          title={isMe ? "Öz rolunuzu dəyişə bilməzsiniz" : ""}
                          style={{
                            padding: "7px 12px", borderRadius: 10,
                            border: "1px solid var(--border)", background: isMe ? "var(--bg)" : "var(--surface)",
                            color: isMe ? "var(--text-light)" : "var(--text-dark)",
                            fontSize: "0.78rem", fontWeight: 700, outline: "none",
                            cursor: isMe ? "not-allowed" : "pointer",
                            opacity: isMe ? 0.6 : 1,
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>

                        <button
                          onClick={() => remove(a.id, a.name)}
                          disabled={locked}
                          title={isMe ? "Öz hesabınızı silə bilməzsiniz" : isLastSuper ? "Sonuncu super admin silinə bilməz" : ""}
                          style={{
                            padding: "7px 15px", borderRadius: 10,
                            border: "1px solid var(--border)", background: "transparent",
                            color: locked ? "var(--text-light)" : "#B91C1C",
                            fontSize: "0.78rem", fontWeight: 800,
                            cursor: locked ? "not-allowed" : "pointer",
                            opacity: locked ? 0.5 : 1,
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
        </div>
      </main>
    </>
  );
}