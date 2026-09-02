import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useUnreadCount } from "../hooks/useUnreadCount";

export default function DoctorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const unreadCount = useUnreadCount();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { to: "/doctor", label: "Həkim Paneli" },
    { to: "/doctor/appointments", label: "Randevular" },
    { to: "/doctor/schedule", label: "İş Qrafikim" },
    { to: "/doctor/records/new", label: "Tibbi Qeydlər" },
    { to: "/doctor/lab-tests", label: "Lab Nəticələri" },
    { to: "/chat", label: "Mesajlar" },
    { to: "/ai", label: "AI Assistent" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg)",
        color: "var(--text-dark)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: "background 0.3s ease",
      }}
    >
      {/* ═ ═ ═ ═ ═ ═ ═ LEFT SIDEBAR ═ ═ ═ ═ ═ ═ ═ */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: "linear-gradient(180deg, #7F1D1D 0%, #991B1B 45%, #B71C1C 100%)",
          color: "#FFFFFF",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255,255,255,0.12)",
          boxSizing: "border-box",
        }}
      >
        <div>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, textDecoration: "none" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: theme === "dark" ? "rgba(0,0,0,0.3)" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme === "dark" ? "#FFFFFF" : "#7F1D1D"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.5px", display: "block" }}>NovaCare</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#FFCDD2", letterSpacing: "1px", textTransform: "uppercase", display: "block" }}>Doctor Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {menuItems.map((item) => {
              const isActive = item.to === "/doctor" ? location.pathname === "/doctor" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 12,
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    background: isActive ? (theme === "dark" ? "rgba(0,0,0,0.3)" : "#FFFFFF") : "transparent",
                    color: isActive ? (theme === "dark" ? "#FFFFFF" : "#7F1D1D") : "rgba(255,255,255,0.85)",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span>{item.label}</span>
                  </div>
                  {item.to === "/chat" && unreadCount > 0 && (
                    <span style={{
                      background: theme === "dark" ? "#EF4444" : "#DC2626",
                      color: "#FFFFFF",
                      fontSize: "0.7rem",
                      fontWeight: 900,
                      padding: "2px 8px",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Support Card */}
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          <div style={{ fontSize: "1.3rem", marginBottom: 6 }}></div>
          <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 4 }}>IT Dəstək</h4>
          <p style={{ fontSize: "0.72rem", color: "#FFCDD2", lineHeight: 1.5, marginBottom: 12 }}>Sistemlə bağlı problemlər üçün admin ilə əlaqə saxlayın.</p>
          <Link
            to="/chat"
            style={{
              display: "block",
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              background: theme === "dark" ? "rgba(0,0,0,0.3)" : "#FFFFFF",
              color: theme === "dark" ? "#FFFFFF" : "#7F1D1D",
              fontWeight: 800,
              fontSize: "0.76rem",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
            }}
          >
            MESAJ YAZ
          </Link>
        </div>
      </aside>

      {/* ═ ═ ═ ═ ═ ═ ═ MAIN CONTENT AREA ═ ═ ═ ═ ═ ═ ═ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        
        {/* Top Header Ribbon */}
        <header
          style={{
            height: 72,
            padding: "0 32px",
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-dark)", letterSpacing: "-0.3px", margin: 0 }}>
            Həkim Portalı
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={toggleTheme} className="ac-theme-toggle" title={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}>
              {theme === "dark" ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <Link
              to="/doctor/schedule"
              className="ac-btn"
              style={{
                padding: "10px 20px",
                fontSize: "0.85rem",
                fontWeight: 800,
                whiteSpace: "nowrap",
                textDecoration: "none",
                borderRadius: 10,
              }}
            >
              QRAFİKİ YENİLƏ
            </Link>

            <button
              onClick={logout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                borderRadius: "30px",
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#dc2626",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              ÇIXIŞ
            </button>
          </div>
        </header>

        {/* Nested Routes Content */}
        <Outlet />

      </div>
    </div>
  );
}
