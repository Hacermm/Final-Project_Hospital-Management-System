import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";

export default function ResetPassword() {
  const [form, setForm] = useState({ email: "", code: "", password: "", password_confirmation: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/reset-password", form);
      setMessage(` ${res.data.message}`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta baş verdi.";
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
            minHeight: 520,
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
                Yeni Parol Təyin Et
              </h2>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
                Emailinizə göndərilmiş 6 rəqəmli bərpa kodunu daxil edərək yeni parolunuzu təyin edin.
              </p>
            </div>
          </div>

          {/* Side Tabs Navigation */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            <Link
              to="/login"
              style={{
                padding: "13px 20px",
                borderRadius: 14,
                background: "#FFFFFF",
                color: "#991B1B",
                fontWeight: 900,
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
                textDecoration: "none",
                textAlign: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              ← GİRİŞƏ QAYIT (LOGIN)
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
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7F1D1D 0%, #C62828 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                boxShadow: "0 8px 24px rgba(198, 40, 40, 0.35)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--primary)", letterSpacing: "-0.5px" }}>
              Yeni Parol Təyin Et
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginTop: 4, fontWeight: 600 }}>
              Kodu və yeni parolu daxil edin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                Email Ünvanı *
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-dark)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              />
            </div>

            {/* Code */}
            <div>
              <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                6 Rəqəmli Bərpa Kodu *
              </label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="123456"
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--primary)",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  letterSpacing: "4px",
                  textAlign: "center",
                  outline: "none",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                Yeni Parol *
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-dark)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              />
            </div>

            {/* Password Confirmation */}
            <div>
              <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                Parol Təkrarı *
              </label>
              <input
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-dark)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              />
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
                marginTop: 6,
              }}
            >
              {loading ? "YENİLƏNİR..." : "PAROLU DƏYİŞ "}
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: 14,
                padding: "12px 16px",
                borderRadius: 12,
                fontSize: "0.82rem",
                fontWeight: 700,
                textAlign: "center",
                background: message.startsWith("") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                color: message.startsWith("") ? "#059669" : "#dc2626",
                border: message.startsWith("") ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {message}
            </p>
          )}

          {/* Bottom Footer Redirect */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              textAlign: "center",
              fontSize: "0.84rem",
              color: "var(--text-light)",
            }}
          >
            <Link to="/login" style={{ fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
              ← Giriş səhifəsinə qayıt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}