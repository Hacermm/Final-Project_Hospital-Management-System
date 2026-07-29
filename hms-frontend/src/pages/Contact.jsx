import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_LINKS = [
  { to: "/departments", label: "Şöbələr" },
  { to: "/doctors", label: "Həkimlər" },
  { to: "/about", label: "Haqqımızda" },
  { to: "/contact", label: "Əlaqə" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>

      <div style={{ background: "var(--surface)", color: "var(--text-dark)", padding: "8px 0", fontSize: "0.8rem", borderBottom: "1px solid var(--border)", transition: "all 0.3s ease" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="tel:+994123456789" style={{ color: "var(--secondary)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              TƏCİLİ: +994 (12) 345 67 89
            </a>
            <a href="mailto:info@hms.az" style={{ color: "var(--text-mid)", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              info@novacare.az
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--secondary-light)", padding: "3px 12px", borderRadius: 20, fontWeight: 700, fontSize: "0.72rem" }}>
              <span style={{ width: 6, height: 6, background: "var(--secondary)", borderRadius: "50%", display: "inline-block" }} className="animate-pulse" />
              24/7 ONLAYN TİBBİ XİDMƏT
            </span>
          </div>
        </div>
      </div>

      <nav style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100, boxShadow: "var(--shadow-xs)", transition: "all 0.3s ease" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", height: 74, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(198,40,40,0.3)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.5px", display: "block", lineHeight: 1 }}>NovaCare</span>
              <span style={{ fontSize: "0.66rem", fontWeight: 700, color: "var(--text-light)", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginTop: 2 }}>Hospital</span>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  color: l.to === "/contact" ? "var(--primary)" : "var(--text-mid)",
                  background: l.to === "/contact" ? "var(--primary-light)" : "transparent",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.background = "var(--primary-light)";
                }}
                onMouseLeave={(e) => {
                  if (l.to !== "/contact") {
                    e.currentTarget.style.color = "var(--text-mid)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={toggleTheme}
              className="ac-theme-toggle"
              title={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
              aria-label="Theme Toggle"
            >
              {theme === "dark" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <Link
              to="/login"
              style={{
                color: "var(--text-dark)",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
                padding: "10px 20px",
                border: "1.5px solid var(--border)",
                borderRadius: 10,
                transition: "all 0.2s",
                background: "var(--surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-dark)";
              }}
            >
              Giriş
            </Link>
            <Link to="/register" className="ac-btn" style={{ padding: "10px 22px", fontSize: "0.88rem" }}>
              Qeydiyyat
            </Link>
          </div>
        </div>
      </nav>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #160202 0%, #2e0505 40%, #B71C1C 100%)",
          color: "#FFFFFF",
          padding: "72px 0 80px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            mixBlendMode: "luminosity",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 255, 255, 0.12)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: 30, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontSize: "0.9rem" }}>📞</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.8px", color: "#FFCDD2", textTransform: "uppercase" }}>
              24/7 DƏSTƏK VƏ RANDEVU MƏRKƏZİ
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 18, letterSpacing: "-1px", color: "#FFFFFF" }}>
            Bizə Yazın Və Ya <br />
            <span style={{ color: "#FFCDD2" }}>Əlaqə Saxlayın</span>
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: 640 }}>
            NovaCare Healthcare komandası ilə əlaqə saxlayın, suallarınızı verin, rəylərinizi bildirin və ya təcili yardım xidmətimizdən yararlanın.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 24px 80px", width: "100%", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 36, alignItems: "start" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="ac-card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 24 }}>
                Klinika Məlumatları
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", shrink: 0 }}>
                    📍
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-dark)", fontWeight: 800, fontSize: "0.9rem", marginBottom: 2 }}>Ünvan:</strong>
                    <span style={{ color: "var(--text-mid)", fontSize: "0.88rem" }}>Bakı şəhəri, Nərimanov r., Atatürk pr. 58</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", shrink: 0 }}>
                    📞
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-dark)", fontWeight: 800, fontSize: "0.9rem", marginBottom: 2 }}>Təcili Əlaqə:</strong>
                    <a href="tel:+994123456789" style={{ color: "var(--primary)", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}>
                      +994 (12) 345 67 89
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", shrink: 0 }}>
                    ✉️
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-dark)", fontWeight: 800, fontSize: "0.9rem", marginBottom: 2 }}>E-Poçt Ünvanı:</strong>
                    <a href="mailto:info@hms.az" style={{ color: "var(--primary)", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}>
                      info@hms.az
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", shrink: 0 }}>
                    🕒
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-dark)", fontWeight: 800, fontSize: "0.9rem", marginBottom: 2 }}>İş Rejimi:</strong>
                    <span style={{ color: "var(--text-mid)", fontSize: "0.88rem" }}>Bazar ertəsi - Şənbə: 08:30 - 19:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #18181C 0%, #27272A 100%)", border: "1px solid var(--border)", borderRadius: 20, padding: 28, color: "#FFFFFF" }}>
              <span style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "0.72rem", fontWeight: 800, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                TƏCİLİ YARDIM
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: 14, marginBottom: 8, color: "#FFFFFF" }}>24/7 Qaynar Xətt Və WhatsApp</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.86rem", lineHeight: 1.6, marginBottom: 20 }}>
                Təcili hallarda və ya canlı məsləhət üçün dəstək mərkəzimiz WhatsApp üzərindən 24/7 aktivdir.
              </p>
              <a
                href="https://wa.me/994123456789"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#25D366",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  padding: "12px",
                  borderRadius: 12,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37,211,102,0.3)",
                }}
              >
                💬 WhatsApp İlə Yazın
              </a>
            </div>
          </div>

          <div className="ac-card" style={{ padding: 36 }}>
            {submitted ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 900, fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  ✓
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 12 }}>Mesajınız Göndərildi!</h2>
                <p style={{ fontSize: "0.92rem", color: "var(--text-light)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 28px" }}>
                  Müraciətiniz üçün təşəkkür edirik. NovaCare komandası qısa zamanda sizinlə əlaqə saxlayacaq.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="ac-btn"
                  style={{ padding: "12px 28px", fontSize: "0.88rem" }}
                >
                  Yeni Mesaj Göndər
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--primary)", background: "var(--primary-light)", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--secondary-light)", display: "inline-block", marginBottom: 8 }}>
                    MÜRACİƏT FORMASI
                  </span>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-dark)" }}>Bizə Online Yazın</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      Ad Və Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Əli Məmmədov"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      E-Poçt Ünvanı *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@domain.com"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      Telefon Nömrəsi *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+994 50 123 45 67"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      Mövzu
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Mövzu seçin</option>
                      <option value="appointment">Randevu Məlumatı</option>
                      <option value="checkup">Check-Up Paketləri</option>
                      <option value="feedback">Təklif Və Rəy</option>
                      <option value="other">Digər</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                    Mesajınız *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Müraciətinizi detal qeyd edin..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "1.5px solid var(--border)",
                      background: "var(--bg)",
                      color: "var(--text-dark)",
                      fontSize: "0.88rem",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>

                <button type="submit" className="ac-btn" style={{ padding: "14px", fontSize: "0.9rem", width: "100%", marginTop: 8 }}>
                  MESAJI GÖNDƏR →
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <footer className="ac-footer">
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, background: "var(--primary)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <span style={{ fontWeight: 900, color: "#FFFFFF", fontSize: "1.2rem" }}>NovaCare</span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 300 }}>
                Müasir xəstəxana idarəetmə sistemi — peşəkar həkimlər, onlayn randevu və rəqəmsal səhiyyə xidmətləri.
              </p>
            </div>

            <div>
              <div className="ac-footer-title">Xidmətlər</div>
              <Link to="/departments" className="ac-footer-link">Şöbələr</Link>
              <Link to="/doctors" className="ac-footer-link">Həkimlər</Link>
              <Link to="/patient/book" className="ac-footer-link">Randevu Al</Link>
              <Link to="/ai" className="ac-footer-link">AI Assistent</Link>
            </div>

            <div>
              <div className="ac-footer-title">Platforma</div>
              <Link to="/about" className="ac-footer-link">Haqqımızda</Link>
              <Link to="/contact" className="ac-footer-link">Əlaqə</Link>
              <Link to="/login" className="ac-footer-link">Giriş</Link>
              <Link to="/register" className="ac-footer-link">Qeydiyyat</Link>
            </div>

            <div>
              <div className="ac-footer-title">Əlaqə</div>
              <a href="tel:+994123456789" className="ac-footer-link">+994 (12) 345 67 89</a>
              <a href="mailto:info@novacare.az" className="ac-footer-link">info@novacare.az</a>
              <span className="ac-footer-link" style={{ cursor: "default" }}>Bakı ş., Azərbaycan</span>
            </div>
          </div>

          <div className="ac-footer-bottom">
            © 2026 NovaCare Hospital. Bütün hüquqlar qorunur.
          </div>
        </div>
      </footer>

    </div>
  );
}
