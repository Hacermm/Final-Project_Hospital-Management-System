import { useState } from "react";
import api from "../lib/api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified");

  const verifyMessages = {
    success: { text: " Email uğurla təsdiqləndi! İndi giriş edə bilərsiniz.", ok: true },
    already: { text: "ℹ Email artıq təsdiqlənib. Giriş edə bilərsiniz.", ok: true },
    invalid: { text: " Təsdiq linki etibarsız və ya vaxtı bitib.", ok: false },
  };
  const verifyMsg = verifyMessages[verified];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      const role = res.data.role;
      if (role === "super_admin") navigate("/admin/super");
      else if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor");
      else navigate("/patient");
    } catch (err) {
      console.error("Login Error:", err);
      let msg = "Giriş xətası baş verdi. Email və parolu yoxlayın.";
      if (!err.response) {
        msg = "Serverə qoşulmaq mümkün olmadı. Lütfən backend serverinin işlədiyini yoxlayın.";
      } else if (err.response.data?.errors?.email?.[0]) {
        msg = err.response.data.errors.email[0];
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      }
      setMessage(` ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #160202 0%, #2e0505 45%, #7F1D1D 85%, #B71C1C 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="ac-theme-toggle"
        title={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
        style={{ position: "absolute", top: 20, right: 20, zIndex: 30 }}
      >
        {theme === "dark" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Main Card Wrapper */}
      <div
        className="responsive-hero-grid"
        style={{
          maxWidth: 960,
          width: "100%",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* LEFT PANEL — Burgundy Banner */}
        <div
          style={{
            background: "linear-gradient(145deg, #7F1D1D 0%, #991B1B 50%, #B71C1C 100%)",
            color: "#FFFFFF",
            padding: "44px 36px",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            position: "relative",
            overflow: "hidden",
            minHeight: 480,
          }}
        >
          {/* Geometric Pattern Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              pointerEvents: "none",
            }}
          />

          {/* Top Brand Header */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.5px", display: "block" }}>NovaCare</span>
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#FFCDD2", letterSpacing: "1px", textTransform: "uppercase", display: "block" }}>Hospital</span>
              </div>
            </Link>

            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#FFFFFF", marginBottom: 12, lineHeight: 1.2 }}>
                Xoş Gəlmisiniz!
              </h2>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
                NovaCare tibb platformasında 24/7 onlayn həkim müayinələrinizi və elektron tibbi qeydlərinizi rahatlıqla idarə edin.
              </p>
            </div>
          </div>

          {/* Side Tabs Navigation */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            <div
              style={{
                padding: "13px 20px",
                borderRadius: 14,
                background: "#FFFFFF",
                color: "#991B1B",
                fontWeight: 900,
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C62828" }} />
              GİRİŞ (LOGIN)
            </div>

            <Link
              to="/register"
              style={{
                padding: "13px 20px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
                textDecoration: "none",
                textAlign: "center",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s",
              }}
            >
              QEYDİYYATDAN KEÇ (SIGN UP)
            </Link>
          </div>

          {/* Bottom copyright */}
          <div style={{ position: "relative", zIndex: 2, marginTop: 24, fontSize: "0.74rem", color: "rgba(255,255,255,0.6)" }}>
            © 2026 NovaCare Hospital System
          </div>
        </div>

        {/* RIGHT PANEL — Clean Form Area */}
        <div
          style={{
            background: "var(--surface)",
            color: "var(--text-dark)",
            padding: "44px 40px",
            display: "flex",
            flexDirection: "column",
            justify: "center",
          }}
        >
          {/* Top Avatar Circle Badge */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7F1D1D 0%, #C62828 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                boxShadow: "0 8px 24px rgba(198, 40, 40, 0.35)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--primary)", letterSpacing: "-0.5px" }}>
              Giriş (Login)
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: 4, fontWeight: 600 }}>
              NovaCare rəqəmsal şəxsi kabinetinizə daxil olun
            </p>
          </div>

          {verifyMsg && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                fontSize: "0.82rem",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 20,
                background: verifyMsg.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                color: verifyMsg.ok ? "#059669" : "#dc2626",
                border: verifyMsg.ok ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {verifyMsg.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email Field */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                Email Ünvanı *
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--primary)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  style={{
                    width: "100%",
                    padding: "13px 16px 13px 44px",
                    borderRadius: 12,
                    border: "1.5px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-dark)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Parol *
                </label>
                <Link to="/forgot-password" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
                  Parolu unutdunuz?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--primary)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "13px 44px",
                    borderRadius: 12,
                    border: "1.5px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-dark)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="ac-btn"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                fontSize: "0.92rem",
                fontWeight: 800,
                letterSpacing: "0.5px",
                marginTop: 8,
              }}
            >
              {loading ? "GİRİŞ EDİLİR..." : "GİRİŞ ET "}
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: 16,
                padding: "12px 16px",
                borderRadius: 12,
                fontSize: "0.82rem",
                fontWeight: 700,
                textAlign: "center",
                background: "rgba(239,68,68,0.1)",
                color: "#dc2626",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {message}
            </p>
          )}

          {/* Bottom Footer Redirect */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid var(--border)",
              textAlign: "center",
              fontSize: "0.84rem",
              color: "var(--text-light)",
            }}
          >
            Hesabınız yoxdur?{" "}
            <Link to="/register" style={{ fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
              Qeydiyyatdan keçin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}