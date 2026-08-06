import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
const ICONS = {
  building: "M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h.01M9 13h.01M9 17h.01",
  stethoscope: "M11 2v2M6 2v2M6 4v5a5 5 0 0 0 10 0V4M11 14v2a5 5 0 0 0 10 0v-2M21 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  chart: "M3 3v18h18M7 16l4-6 4 3 5-8",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
};

const MODULES = [
  { to: "/admin/departments", icon: "building", title: "Şöbələr", desc: "Klinik şöbələri yaradın, redaktə edin və idarə edin", tag: "Struktur" },
  { to: "/admin/doctors", icon: "stethoscope", title: "Həkimlər", desc: "Mütəxəssis hesabları, profil, şəkil və müayinə haqqı", tag: "Heyət" },
  { to: "/admin/patients", icon: "users", title: "Pasiyentlər", desc: "Pasiyent qeydiyyatları və şəxsi məlumatların idarəsi", tag: "Qeydiyyat" },
  { to: "/admin/analytics", icon: "chart", title: "Analitika", desc: "Randevu statistikası, şöbə yükü və göstəricilər", tag: "Hesabat" },
  { to: "/admin/messages", icon: "mail", title: "Əlaqə Mesajları", desc: "Saytdan gələn müraciətlər və rəylər", tag: "Müraciət" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [name, setName] = useState("");
  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    api.get("/me")
      .then((r) => {
        setName(r.data.user?.name || "");
        setIsSuper(r.data.role === "super_admin");
      })
      .catch(() => {});

    api.get("/analytics").then((r) => setStats(r.data.summary)).catch(() => {});
    api.get("/contact-messages").then((r) => setUnreadMsg(r.data.unread || 0)).catch(() => {});
  }, []);

  const cards = [
    { val: stats?.doctors ?? "—", label: "Həkim", icon: "stethoscope", color: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.28)" },
    { val: stats?.patients ?? "—", label: "Pasiyent", icon: "users", color: "#059669", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.28)" },
    { val: stats?.departments ?? "—", label: "Şöbə", icon: "building", color: "#7C3AED", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.28)" },
    { val: stats?.appointments ?? "—", label: "Randevu", icon: "calendar", color: "#EA580C", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.28)" },
  ];

  const modules = isSuper
    ? [...MODULES, { to: "/admin/admins", icon: "shield", title: "Administratorlar", desc: "Admin hesablarını yaradın və rolları idarə edin", tag: "Super Admin" }]
    : MODULES;

  return (
    <>
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
          }}>
            {isSuper ? "SUPER ADMİN PANELİ" : "İDARƏETMƏ PANELİ"}
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
            Xoş gəldiniz{name ? `, ${name}` : ""}
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 560 }}>
            Şöbələri, həkim heyətini və pasiyent qeydiyyatlarını mərkəzləşdirilmiş idarə edin.
          </p>
        </div>

        {/* Statistika kartları */}
        <div className="admin-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 18, padding: "20px 22px",
              display: "flex", alignItems: "center", gap: 16
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: c.bg, border: `1px solid ${c.border}`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS[c.icon]} />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--text-dark)", lineHeight: 1 }}>{c.val}</div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-light)", fontWeight: 700, marginTop: 5 }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Diqqət tələb edən */}
        {(stats?.pending > 0 || unreadMsg > 0) && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 18, padding: "18px 22px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap"
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: "0.94rem", fontWeight: 800, margin: 0 }}>Diqqət tələb edir</p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-mid)", margin: "3px 0 0" }}>
                {stats?.pending > 0 && `${stats.pending} randevu təsdiq gözləyir`}
                {stats?.pending > 0 && unreadMsg > 0 && " · "}
                {unreadMsg > 0 && `${unreadMsg} oxunmamış müraciət`}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {unreadMsg > 0 && (
                <Link to="/admin/messages" style={{
                  padding: "9px 18px", borderRadius: 10, textDecoration: "none",
                  background: "var(--primary)", color: "#FFFFFF",
                  fontSize: "0.82rem", fontWeight: 800
                }}>
                  Mesajlara bax
                </Link>
              )}
              <Link to="/admin/analytics" style={{
                padding: "9px 18px", borderRadius: 10, textDecoration: "none",
                border: "1px solid var(--border)", background: "var(--bg)",
                color: "var(--text-dark)", fontSize: "0.82rem", fontWeight: 800
              }}>
                Analitika
              </Link>
            </div>
          </div>
        )}

        {/* Modullar */}
        <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: "0 0 14px", color: "var(--text-dark)" }}>
          İdarəetmə Modulları
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 20, padding: 24, textDecoration: "none",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                boxShadow: "0 3px 14px rgba(0,0,0,0.04)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 14px 32px rgba(198,40,40,0.11)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 3px 14px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: "var(--primary-light)", border: "1px solid var(--secondary-light)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d={ICONS[m.icon]} />
                    </svg>
                  </div>

                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "4px 12px",
                    borderRadius: 20, background: "var(--primary-light)",
                    color: "var(--primary)", border: "1px solid var(--secondary-light)"
                  }}>
                    {m.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.08rem", fontWeight: 800, margin: "0 0 6px", color: "var(--text-dark)" }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-light)", lineHeight: 1.6, margin: "0 0 18px" }}>
                  {m.desc}
                </p>
              </div>

              <div style={{
                paddingTop: 14, borderTop: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: "0.82rem", fontWeight: 800, color: "var(--primary)"
              }}>
                <span>İdarə et</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}