import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/login"); };

  const menuItems = [
    { to: "/admin/departments", icon: "", title: "Şöbə İdarəetməsi", desc: "Klinika poliklinika və şöbələrini yaratmaq və yeniləmək", badge: "Şöbələr" },
    { to: "/admin/doctors", icon: "", title: "Həkim İdarəetməsi", desc: "Mütəxəssis həkim hesabları, profil və haqq məlumatları", badge: "Həkimlər" },
    { to: "/admin/patients", icon: "", title: "Xəstə İdarəetməsi", desc: "Pasiyent siyahısı və qeydiyyatlarının idarəsi", badge: "Pasiyentlər" },
  ];

  return (
    <div className="ac-dash-wrap">
      <nav className="ac-dash-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", border: "1.5px solid var(--secondary)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-tight leading-none" style={{ color: "var(--primary)" }}>
                NovaCare<span style={{ color: "var(--secondary)" }}> Hospital</span>
              </span>
              <span className="text-[10px] font-black tracking-widest uppercase mt-0.5" style={{ color: "var(--text-light)" }}>İdarəçi Portalı</span>
            </div>
            <span className="apollo-badge apollo-badge-gold ml-2">ADMİN</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="ac-theme-toggle" title={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}>
              {theme === "dark" ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <Link to="/" className="btn-apollo-outline !py-2 !px-3.5 text-xs font-bold">
              ← Əsas Səhifə
            </Link>
            <button onClick={logout} className="btn-apollo-outline !py-2 !px-3.5 text-xs font-bold" style={{ color: "#ef4444", borderColor: "#fca5a5" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
               Çıxış
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12 flex-1 w-full space-y-8">
        <div className="apollo-card p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #C62828 0%, #B71C1C 100%)" }}>
          <div className="relative z-10 space-y-2">
            <span className="apollo-badge" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)", color: "#FFFFFF" }}>ADMİNİSTRASİYA</span>
            <h1 className="font-display text-3xl font-extrabold text-white">NovaCare İdarəetmə Paneli</h1>
            <p className="text-sm text-red-100 max-w-xl font-normal">
              Poliklinikalar, həkim heyəti və pasiyent məlumatlarını mərkəzləşdirilmiş idarə edin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="apollo-card p-7 hover:-translate-y-1.5 group block flex flex-col justify-between"
              style={{ textDecoration: "none" }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-colors shadow-sm"
                    style={{ background: "var(--primary-light)" }}>
                    {item.icon}
                  </div>
                  <span className="apollo-badge apollo-badge-gold">{item.badge}</span>
                </div>
                <h3 className="font-display font-extrabold text-lg mb-1.5 group-hover:opacity-80 transition-opacity" style={{ color: "var(--text-dark)" }}>{item.title}</h3>
                <p className="text-xs leading-relaxed mb-6 font-normal" style={{ color: "var(--text-light)" }}>{item.desc}</p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold" style={{ borderTop: "1px solid var(--border)", color: "var(--primary)" }}>
                <span>İdarə et</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}