import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";

const menus = {
  patient: [
    { to: "/patient", label: "PANEL", icon: "📊" },
    { to: "/patient/book", label: "RANDEVU AL", icon: "📅" },
    { to: "/patient/appointments", label: "RANDEVULARIM", icon: "📋" },
    { to: "/patient/history", label: "TİBBİ TARİXÇƏ", icon: "🩺" },
    { to: "/patient/lab-tests", label: "LAB NƏTİCƏLƏRİ", icon: "🧪" },
    { to: "/chat", label: "MESAJLAR", icon: "💬", badge: true },
  ],
  doctor: [
    { to: "/doctor", label: "PANEL", icon: "📊" },
    { to: "/doctor/appointments", label: "RANDEVULARIM", icon: "📋" },
    { to: "/doctor/schedule", label: "İŞ QRAFİKİ", icon: "🕒" },
    { to: "/doctor/records/new", label: "TİBBİ QEYD YAZ", icon: "📝" },
    { to: "/doctor/lab-tests", label: "LAB NƏTİCƏLƏRİ", icon: "🧪" },
    { to: "/chat", label: "MESAJLAR", icon: "💬", badge: true },
  ],
  admin: [
    { to: "/admin", label: "PANEL", icon: "📊" },
    { to: "/admin/doctors", label: "HƏKİMLƏR", icon: "👨‍⚕️" },
    { to: "/admin/patients", label: "XƏSTƏLƏR", icon: "🏥" },
    { to: "/admin/departments", label: "ŞÖBƏLƏR", icon: "🏢" },
  ],
  super_admin: [
    { to: "/admin/super", label: "SUPER PANEL", icon: "⚡" },
    { to: "/admin/doctors", label: "HƏKİMLƏR", icon: "👨‍⚕️" },
    { to: "/admin/patients", label: "XƏSTƏLƏR", icon: "🏥" },
    { to: "/admin/departments", label: "ŞÖBƏLƏR", icon: "🏢" },
  ],
  guest: [
    { to: "/", label: "ANA SƏHİFƏ" },
    { to: "/about", label: "HAQQIMIZDA" },
    { to: "/doctors", label: "HƏKİMLƏR" },
    { to: "/departments", label: "MÜALİCƏ VƏ ŞÖBƏLƏR" },
    { to: "/contact", label: "ƏLAQƏ" },
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
      <div style={{ background: "linear-gradient(90deg, #180303 0%, #C62828 100%)" }} className="hidden lg:block text-white text-xs py-2.5 border-b border-white/10 w-full">
        <div className="site-container flex items-center justify-between font-medium">
          <div className="flex items-center gap-6 text-slate-200">
            <a href="tel:+994123456789" className="flex items-center gap-2 transition font-bold" style={{ color: "#EF5350" }}>
              <span>📞 TƏCİLİ YARDIM:</span> +994 (12) 345 67 89
            </a>
            <span className="text-white/20">|</span>
            <a href="mailto:info@novacare.az" className="flex items-center gap-2 hover:text-white transition">
              <span>✉️</span> info@novacare.az
            </a>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <span>📍</span> Bakı ş., Azərbaycan
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider text-red-200 bg-red-500/20 border border-red-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
              24/7 ONLINE RANDEVU XİDMƏTİ
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className="ac-nav"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: scrolled ? "var(--shadow-md)" : "var(--shadow-xs)",
        }}
      >
        <div className="site-container">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to={token ? links[0].to : "/"} className="flex items-center gap-3 shrink-0 group">
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
                    NovaCare<span style={{ color: "var(--secondary)" }}> Hospital</span>
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--secondary)" }}></span>
                </div>
                <span className="text-[9.5px] font-black tracking-[0.24em] uppercase mt-0.5" style={{ color: "var(--primary)" }}>
                  TİBB MƏRKƏZİ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((l) => {
                const isActive = location.pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="relative px-3.5 py-2 rounded-xl text-[13px] font-extrabold tracking-wide transition-all duration-200 flex items-center gap-1.5"
                    style={{
                      color: isActive ? "var(--primary)" : "var(--text-mid)",
                      background: isActive ? "var(--primary-light)" : "transparent",
                    }}
                  >
                    {l.icon && <span className="text-sm">{l.icon}</span>}
                    <span>{l.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full" style={{ background: "var(--secondary)" }}></span>
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
                    className="px-4 py-2.5 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all hover:bg-red-500/10"
                    style={{ color: "var(--text-dark)" }}
                  >
                    GİRİŞ
                  </Link>
                  <Link to="/register" style={{ background: "var(--primary)", color: "#FFFFFF", padding: "10px 20px", borderRadius: 10, fontSize: "0.8rem", fontWeight: 800, textDecoration: "none" }} className="hover:opacity-90 transition-opacity">
                    RANDEVU ALIN
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Trigger Toggle */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border border-slate-200 text-slate-800 bg-white shadow-sm"
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
            <div className="lg:hidden pb-6 space-y-2 border-t border-slate-200 pt-4 animate-scale-in">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all"
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

              <div className="pt-4 space-y-2 border-t border-slate-200">
                {token ? (
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2 text-red-600 bg-red-50"
                  >
                    <span>🚪</span> ÇIXIŞ ET
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block text-center px-4 py-3 rounded-xl text-sm font-extrabold bg-slate-100 text-slate-700"
                    >
                      GİRİŞ
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="block text-center text-white font-bold !py-3.5 !rounded-xl w-full"
                      style={{ background: "var(--primary)" }}
                    >
                      RANDEVU ALIN
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