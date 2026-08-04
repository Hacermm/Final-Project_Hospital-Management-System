import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";

const menus = {
  patient: [
    { to: "/patient", label: "Panel", icon: "" },
    { to: "/patient/book", label: "Randevu Al", icon: "" },
    { to: "/patient/appointments", label: "Randevularım", icon: "" },
    { to: "/patient/history", label: "Tibbi Tarixçə", icon: "" },
    { to: "/patient/lab-tests", label: "Lab Nəticələri", icon: "" },
    { to: "/chat", label: "Mesajlar", icon: "", badge: true },
  ],
  doctor: [
    { to: "/doctor", label: "Panel", icon: "" },
    { to: "/doctor/appointments", label: "Randevularım", icon: "" },
    { to: "/doctor/schedule", label: "İş Qrafiki", icon: "" },
    { to: "/doctor/records/new", label: "Tibbi Qeyd Yaz", icon: "" },
    { to: "/doctor/lab-tests", label: "Lab Nəticələri", icon: "" },
    { to: "/chat", label: "Mesajlar", icon: "", badge: true },
  ],
  admin: [
    { to: "/admin", label: "Panel", icon: "" },
    { to: "/admin/doctors", label: "Həkimlər", icon: "" },
    { to: "/admin/patients", label: "Xəstələr", icon: "" },
    { to: "/admin/departments", label: "Şöbələr", icon: "" },
  ],
  super_admin: [
    { to: "/admin/super", label: "Super Panel", icon: "" },
    { to: "/admin/doctors", label: "Həkimlər", icon: "" },
    { to: "/admin/patients", label: "Xəstələr", icon: "" },
    { to: "/admin/departments", label: "Şöbələr", icon: "" },
  ],
  guest: [
    { to: "/departments", label: "Şöbələr" },
    { to: "/doctors", label: "Həkimlər" },
    { to: "/about", label: "Niyə NovaCare?" },
    { to: "/contact", label: "Əlaqə" },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const links = token ? (menus[role] || menus.guest) : menus.guest;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!token) return;
    const load = () => {
      api.get("/unread-count")
        .then((r) => setUnread(r.data.total || 0))
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [token, location.pathname]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 w-full">
      {/* Top Ribbon */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", transition: "all 0.3s ease" }} className="hidden lg:block text-xs py-2 w-full">
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }} className="flex items-center justify-between font-medium">
          <div className="flex items-center gap-6">
            <a href="tel:+994123456789" style={{ color: "var(--secondary)", fontWeight: 700 }} className="flex items-center gap-2 transition">
              <span> TƏCİLİ:</span> +994 (12) 345 67 89
            </a>
            <span style={{ color: "var(--border)" }}>|</span>
            <a href="mailto:info@novacare.az" style={{ color: "var(--text-mid)" }} className="flex items-center gap-2 transition hover:opacity-80">
              <span></span> info@novacare.az
            </a>
            <span style={{ color: "var(--border)" }}>|</span>
            <span style={{ color: "var(--text-mid)" }} className="flex items-center gap-1.5">
              <span></span> Bakı ş., Azərbaycan
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span style={{ background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--secondary-light)" }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <span style={{ background: "var(--secondary)" }} className="w-1.5 h-1.5 rounded-full animate-ping"></span>
              24/7 ONLAYN TİBBİ XİDMƏT
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          boxShadow: scrolled ? "var(--shadow-md)" : "var(--shadow-xs)",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <div className="flex items-center justify-between h-18 py-3">
            
            {/* Logo */}
            <Link to={token ? links[0].to : "/"} className="flex items-center gap-3 shrink-0 group text-decoration-none">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", border: "2px solid var(--secondary)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-display font-extrabold text-2xl tracking-tight leading-none" style={{ color: "var(--primary)" }}>
                    NovaCare
                  </span>
                </div>
                <span className="text-[9.5px] font-black tracking-[0.24em] uppercase mt-0.5" style={{ color: "var(--text-light)" }}>
                  Hospital
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {links.map((l) => {
                const isActive = location.pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="relative px-4 py-2 rounded-xl text-[14px] font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 text-decoration-none"
                    style={{
                      color: isActive ? "var(--primary)" : "var(--text-mid)",
                      background: isActive ? "var(--primary-light)" : "transparent",
                    }}
                  >
                    {l.icon && <span className="text-sm">{l.icon}</span>}
                    <span>{l.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full" style={{ background: "var(--primary)" }}></span>
                    )}
                    {l.badge && unread > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1.5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce" style={{ background: "var(--primary)" }}>
                        {unread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={toggleTheme}
                className="ac-theme-toggle"
                title={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
                aria-label="Theme Toggle"
              >
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {token ? (
                <button
                  onClick={logout}
                  className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-sm text-red-600 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  ÇIXIŞ
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    to="/login"
                    style={{
                      color: "var(--text-dark)",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      textDecoration: "none",
                      padding: "9px 18px",
                      border: "1.5px solid var(--border)",
                      borderRadius: 10,
                      background: "var(--surface)",
                    }}
                    className="transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Giriş
                  </Link>
                  <Link to="/register" className="ac-btn" style={{ padding: "10px 22px", fontSize: "0.88rem" }}>
                    Qeydiyyat
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Trigger Toggle */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden mobile-menu-btn w-11 h-11 rounded-xl flex items-center justify-center ac-theme-toggle"
                aria-label="Menyu"
              >
                {open ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                )}
              </button>
            </div>

          </div>

          {/* Mobile Menu */}
          {open && (
            <div className="lg:hidden pb-6 space-y-2 pt-4 animate-scale-in" style={{ borderTop: "1px solid var(--border)" }}>
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-decoration-none"
                  style={{
                    color: location.pathname === l.to ? "var(--primary)" : "var(--text-dark)",
                    background: location.pathname === l.to ? "var(--primary-light)" : "var(--bg)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {l.icon && <span>{l.icon}</span>}
                    <span>{l.label}</span>
                  </div>
                  {l.badge && unread > 0 && (
                    <span className="min-w-[20px] h-[20px] px-1.5 rounded-full text-white text-[11px] font-bold flex items-center justify-center" style={{ background: "var(--primary)" }}>
                      {unread}
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-4 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
                {token ? (
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2"
                    style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
                  >
                    <span></span> ÇIXIŞ ET
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block text-center px-4 py-3 rounded-xl text-sm font-bold transition-all text-decoration-none"
                      style={{ background: "var(--bg)", color: "var(--text-dark)", border: "1px solid var(--border)" }}
                    >
                      Giriş
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="block text-center text-white font-bold !py-3 !rounded-xl w-full text-decoration-none"
                      style={{ background: "var(--primary)" }}
                    >
                      Qeydiyyat
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </nav>
    </header>
  );
}