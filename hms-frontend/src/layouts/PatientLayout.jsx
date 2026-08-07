import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { to: "/patient", label: "Pasiyent Portalı", icon: "" },
    { to: "/patient/book", label: "Randevu Al", icon: "" },
    { to: "/patient/appointments", label: "Randevularım", icon: "" },
    { to: "/patient/history", label: "Tibbi Tarixçəm", icon: "" },
    { to: "/patient/lab-tests", label: "Lab Nəticələri", icon: "" },
    { to: "/patient/reviews", label: "Rəylərim", icon: "" },
    { to: "/chat", label: "Mesajlar", icon: "" },
    { to: "/ai", label: "AI Tibbi Assistent", icon: "" },
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
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#FFCDD2", letterSpacing: "1px", textTransform: "uppercase", display: "block" }}>Patient Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {menuItems.map((item) => {
              const isActive = item.to === "/patient" ? location.pathname === "/patient" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: "flex",
                    alignItems: "center",
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
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
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
          <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 4 }}>24/7 Tibbi Dəstək</h4>
          <p style={{ fontSize: "0.72rem", color: "#FFCDD2", lineHeight: 1.5, marginBottom: 12 }}>Suallarınız olduqda AI Assistent və ya həkimlərinizlə dərhal əlaqə saxlayın.</p>
          <Link
            to="/ai"
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
            AI MƏSLƏHƏT AL
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
            Pasiyent Portalı
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
              to="/patient/book"
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
              + RANDEVU AL
            </Link>

            <button
              onClick={logout}
              style={{
                padding: "9px 16px",
                borderRadius: 10,
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#dc2626",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
               Çıxış
            </button>
          </div>
        </header>

        {/* Nested Routes Content */}
        <Outlet />

      </div>
    </div>
  );
}
