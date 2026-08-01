import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import Navbar from "../components/Navbar";

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
      <Navbar />

      {/* ═══════ PREMIUM CONTACT HERO ═══════ */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a0303 0%, #2d0606 35%, #8B1A1A 75%, #C62828 100%)", color: "#FFFFFF", padding: "56px 0 64px" }}>

        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "-80px", left: "-60px", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.22) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,30,30,0.25) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="responsive-hero-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* LEFT */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 40, padding: "5px 18px", marginBottom: 24, backdropFilter: "blur(8px)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
              <span style={{ fontSize: "0.73rem", fontWeight: 800, letterSpacing: "0.9px", color: "#FFCDD2", textTransform: "uppercase" }}>24/7 DƏSTƏK VƏ RANDEVU</span>
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 3.8vw, 3rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: 18, letterSpacing: "-1.2px" }}>
              Bizə Yazın,
              <span style={{ display: "block", background: "linear-gradient(90deg, #FFCDD2, #FF8A80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Əlaqə Saxlayın</span>
            </h1>

            <p style={{ fontSize: "0.97rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", maxWidth: 440, marginBottom: 28 }}>
              NovaCare Healthcare komandası ilə əlaqə saxlayın, suallarınızı verin və ya təcili yardım xidmətimizdən yararlananın.
            </p>

            {/* Quick contact chips */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="tel:+994123456789" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 30, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFFFFF", fontSize: "0.84rem", fontWeight: 700, textDecoration: "none", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >
                📞 +994 (12) 345 67 89
              </a>
              <a href="mailto:info@novacare.az" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 30, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: "0.84rem", fontWeight: 600, textDecoration: "none", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.16)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              >
                ✉️ info@novacare.az
              </a>
            </div>
          </div>

          {/* RIGHT — contact info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "📍", title: "Ünvan", val: "Bakı, Nərimanov r., Atatürk pr. 58", sub: "Bakı Metroya 5 dəqiqə" },
              { icon: "🕑", title: "İş Saatları", val: "B.e — Cuma: 08:00 – 20:00", sub: "Şənbə – Bazar: 10:00 – 16:00" },
              { icon: "🚨", title: "Təcili Xidmət", val: "+994 (12) 999 00 11", sub: "24 saat, 7 gün aktiv" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 16,
                padding: "16px 20px",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.16)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.3 }}>{item.val}</div>
                  <div style={{ fontSize: "0.72rem", color: "#FFCDD2", marginTop: 3 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 80px", width: "100%", flex: 1 }}>
        <div className="responsive-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 36, alignItems: "start" }}>
          
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

                <div className="responsive-2x2-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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

                <div className="responsive-2x2-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
          <div className="ac-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 16 }}>
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
