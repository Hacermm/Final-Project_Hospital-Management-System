import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const ICONS = {
  building: "M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h.01M9 13h.01M9 17h.01",
  stethoscope: "M11 2v2M6 2v2M6 4v5a5 5 0 0 0 10 0V4M11 14v2a5 5 0 0 0 10 0v-2M21 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  chart: "M3 3v18h18M7 16l4-6 4 3 5-8",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  terminal: "M4 17l6-6-6-6M12 19h8",
};

// Super admin = indiqo/gecə mavisi (adminin qırmızısından fərqlənir)
const ACCENT = "#4F46E5";
const ACCENT_SOFT = "rgba(79,70,229,0.1)";
const ACCENT_BORDER = "rgba(79,70,229,0.25)";

const MODULES = [
  { to: "/admin/admins", icon: "shield", title: "Administratorlar", desc: "Admin hesabları yaradın, rolları dəyişin və səlahiyyətləri idarə edin", tag: "Yalnız Super Admin", primary: true },
  { to: "/admin/departments", icon: "building", title: "Şöbələr", desc: "Klinik şöbələri yaradın və redaktə edin", tag: "Struktur" },
  { to: "/admin/doctors", icon: "stethoscope", title: "Həkimlər", desc: "Mütəxəssis hesabları, profil və müayinə haqqı", tag: "Heyət" },
  { to: "/admin/patients", icon: "users", title: "Pasiyentlər", desc: "Pasiyent qeydiyyatları və məlumat bazası", tag: "Qeydiyyat" },
  { to: "/admin/analytics", icon: "chart", title: "Analitika", desc: "Sistem göstəriciləri və hesabatlar", tag: "Hesabat" },
  { to: "/admin/messages", icon: "mail", title: "Müraciətlər", desc: "Saytdan gələn əlaqə mesajları", tag: "Müraciət" },
];

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [adminCount, setAdminCount] = useState(null);
  const [unread, setUnread] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/me").then((r) => setName(r.data.user?.name || "")).catch(() => {});
    api.get("/analytics").then((r) => setStats(r.data.summary)).catch(() => {});
    api.get("/admins").then((r) => setAdminCount((r.data.data || []).length)).catch(() => {});
    api.get("/contact-messages").then((r) => setUnread(r.data.unread || 0)).catch(() => {});
  }, []);

  const cards = [
    { val: adminCount ?? "—", label: "Administrator", icon: "shield", accent: true },
    { val: stats?.doctors ?? "—", label: "Həkim", icon: "stethoscope" },
    { val: stats?.patients ?? "—", label: "Pasiyent", icon: "users" },
    { val: stats?.departments ?? "—", label: "Şöbə", icon: "building" },
    { val: stats?.appointments ?? "—", label: "Randevu", icon: "calendar" },
    { val: stats?.medical_records ?? "—", label: "Tibbi qeyd", icon: "file" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 64px", width: "100%" }}>

        {/* Hero — indiqo (admin panelindən fərqli) */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 55%, #312E81 100%)",
          borderRadius: 24, padding: "34px 32px", color: "#FFFFFF",
          position: "relative", overflow: "hidden", marginBottom: 24,
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }} />
          <div style={{
            position: "absolute", top: -70, right: -40, width: 300, height: 300,
            borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 30, padding: "5px 16px", fontSize: "0.7rem",
                fontWeight: 900, letterSpacing: "1px", color: "#C7D2FE", marginBottom: 14,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS.shield} />
                </svg>
                SUPER ADMİN SƏLAHİYYƏTİ
              </span>

              <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.9px" }}>
                Xoş gəldiniz{name ? `, ${name}` : ""}
              </h1>
              <p style={{ fontSize: "0.94rem", color: "rgba(255,255,255,0.78)", margin: 0, maxWidth: 540, lineHeight: 1.6 }}>
                Sistemin bütün modullarına tam çıxışınız var — administrator hesablarını yaratmaq və səlahiyyətləri idarə etmək daxil olmaqla.
              </p>
            </div>

            <Link
              to="/admin/admins"
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "13px 24px", borderRadius: 13, textDecoration: "none",
                background: "#FFFFFF", color: "#312E81",
                fontSize: "0.88rem", fontWeight: 900, flexShrink: 0,
                boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d={ICONS.shield} />
              </svg>
              Administratorları idarə et
            </Link>
          </div>
        </div>

        {/* Statistika */}
        <div className="sa-stats" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              background: "var(--surface)",
              border: c.accent ? `1px solid ${ACCENT_BORDER}` : "1px solid var(--border)",
              borderRadius: 16, padding: "18px 16px", textAlign: "center",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, margin: "0 auto 10px",
                background: c.accent ? ACCENT_SOFT : "var(--bg)",
                border: `1px solid ${c.accent ? ACCENT_BORDER : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke={c.accent ? ACCENT : "var(--text-mid)"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS[c.icon]} />
                </svg>
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 900, lineHeight: 1, color: c.accent ? ACCENT : "var(--text-dark)" }}>
                {c.val}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: 700, marginTop: 6 }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>

        {/* Diqqət tələb edən */}
        {(stats?.pending > 0 || unread > 0) && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "16px 22px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>

            <p style={{ flex: 1, minWidth: 200, fontSize: "0.87rem", color: "var(--text-mid)", margin: 0, fontWeight: 700 }}>
              {stats?.pending > 0 && `${stats.pending} randevu təsdiq gözləyir`}
              {stats?.pending > 0 && unread > 0 && " · "}
              {unread > 0 && `${unread} oxunmamış müraciət`}
            </p>

            {unread > 0 && (
              <Link to="/admin/messages" style={{
                padding: "8px 18px", borderRadius: 10, textDecoration: "none",
                background: ACCENT, color: "#FFFFFF", fontSize: "0.81rem", fontWeight: 800,
              }}>
                Müraciətlərə bax
              </Link>
            )}
          </div>
        )}

        {/* Modullar */}
        <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 14px" }}>Sistem Modulları</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18, marginBottom: 24 }}>
          {MODULES.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              style={{
                background: "var(--surface)",
                border: m.primary ? `1.5px solid ${ACCENT}` : "1px solid var(--border)",
                borderRadius: 20, padding: 24, textDecoration: "none",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                boxShadow: m.primary ? `0 6px 20px ${ACCENT_SOFT}` : "0 3px 14px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 14px 32px ${ACCENT_SOFT}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = m.primary ? `0 6px 20px ${ACCENT_SOFT}` : "0 3px 14px rgba(0,0,0,0.04)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 15,
                    background: m.primary ? ACCENT : "var(--bg)",
                    border: m.primary ? "none" : "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
                      stroke={m.primary ? "#FFFFFF" : "var(--text-mid)"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d={ICONS[m.icon]} />
                    </svg>
                  </div>

                  <span style={{
                    fontSize: "0.66rem", fontWeight: 800, padding: "4px 11px", borderRadius: 20,
                    background: m.primary ? ACCENT_SOFT : "var(--bg)",
                    color: m.primary ? ACCENT : "var(--text-light)",
                    border: `1px solid ${m.primary ? ACCENT_BORDER : "var(--border)"}`,
                  }}>
                    {m.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.06rem", fontWeight: 800, margin: "0 0 6px", color: "var(--text-dark)" }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: "0.83rem", color: "var(--text-light)", lineHeight: 1.6, margin: "0 0 18px" }}>
                  {m.desc}
                </p>
              </div>

              <div style={{
                paddingTop: 14, borderTop: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: "0.81rem", fontWeight: 800,
                color: m.primary ? ACCENT : "var(--text-mid)",
              }}>
                <span>Keçid et</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Sistem qeydi */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "18px 22px", display: "flex", gap: 15,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS.terminal} />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 800, margin: "0 0 5px", color: "var(--text-dark)" }}>
              Rol iyerarxiyası
            </p>
            <p style={{ fontSize: "0.79rem", color: "var(--text-light)", margin: 0, lineHeight: 1.65 }}>
              Super Admin → Admin → Həkim/Pasiyent. Heç bir rol özündən yüksək hesab yarada bilmir.
              İlk super admin yalnız serverdə{" "}
              <code style={{ background: "var(--bg)", padding: "2px 7px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 700 }}>
                php artisan hms:reset-superadmin
              </code>{" "}
              komandası ilə yaradılır.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}