import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_LINKS = [
  { to: "/departments", label: "Şöbələr" },
  { to: "/doctors", label: "Həkimlər" },
  { to: "/about", label: "Haqqımızda" },
  { to: "/contact", label: "Əlaqə" },
];

export default function About() {
  const { theme, toggleTheme } = useTheme();

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
              info@hms.az
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
              <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.5px", display: "block", lineHeight: 1 }}>HMS</span>
              <span style={{ fontSize: "0.66rem", fontWeight: 700, color: "var(--text-light)", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginTop: 2 }}>Sağlamlıq Sistemi</span>
            </div>
          </Link>

       
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  color: l.to === "/about" ? "var(--primary)" : "var(--text-mid)",
                  background: l.to === "/about" ? "var(--primary-light)" : "transparent",
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
                  if (l.to !== "/about") {
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
          padding: "80px 0 90px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          textAlign: "center",
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

        <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 255, 255, 0.12)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: 30, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontSize: "0.9rem" }}>🏆</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.8px", color: "#FFCDD2", textTransform: "uppercase" }}>
              RƏQƏMSAL TİBB MƏRKƏZİ
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-1px", color: "#FFFFFF" }}>
            NovaCare Healthcare <br />
            <span style={{ color: "#FFCDD2" }}>Haqqımızda Və Missiyamız</span>
          </h1>

          <p style={{ fontSize: "1.08rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: 680, margin: "0 auto" }}>
            Beynəlxalq səhiyyə standartlarına əsaslanan qabaqcıl diaqnostika, fərdiləşdirilmiş müalicə protokolları və 24/7 rəqəmsal xəstəxana idarəetmə platforması.
          </p>
        </div>
      </section>

      
      <main style={{ flex: 1 }}>
        <section style={{ maxWidth: 1240, margin: "-40px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
          <div style={{ background: "var(--surface)", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", transition: "all 0.3s ease" }}>
            {[
              { val: "15+", label: "İxtisaslaşmış Şöbə", icon: "🏥" },
              { val: "50+", label: "Mütəxəssis Həkim", icon: "👨‍⚕️" },
              { val: "24/7", label: "Təcili Tibbi Yardım", icon: "🚨" },
              { val: "100%", label: "Keyfiyyət Sertifikatı", icon: "🏆" },
            ].map((stat, idx) => (
              <div key={idx} style={{ padding: "32px 20px", textAlign: "center", borderRight: idx < 3 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}>{stat.icon}</span>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1.1 }}>{stat.val}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", marginTop: 6, textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

    
        <section style={{ maxWidth: 1240, margin: "80px auto 60px", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="ac-section-label">ÜSTÜNLÜKLƏRİMİZ</span>
            <h2 className="ac-section-title">Sağlamlığınız Üçün Müasir Yanaşma</h2>
            <p className="ac-section-sub">NovaCare Hospital pasiyent yönümlü tibbi xidmət və yüksək texnoloji alətlər təqdim edir.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <div className="ac-card" style={{ padding: 32 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: 20 }}>
                🎯
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 12 }}>Tibbi Mükəmməllik</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-light)", lineHeight: 1.65 }}>
                NovaCare pasiyentlərinə beynəlxalq protokollara cavab verən, şəffaf və yüksək dəqiqlikli diaqnostik xidmət təqdim edir.
              </p>
            </div>

            <div className="ac-card" style={{ padding: 32 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: 20 }}>
                🌐
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 12 }}>Rəqəmsal Portal Xidməti</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-light)", lineHeight: 1.65 }}>
                Portalımız vasitəsilə 24/7 onlayn randevu almaq, analiz və laboratoriya cavablarını yükləmək və həkimlərlə birbaşa əlaqə saxlamaq mümkündür.
              </p>
            </div>

            <div className="ac-card" style={{ padding: 32 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: 20 }}>
                🤖
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 12 }}>Süni İntellekt Dəstəyi</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-light)", lineHeight: 1.65 }}>
                İnteqrasiya olunmuş AI Asistent simptomlarınızı ilkin qiymətləndirir və sizi dərhal müvafiq həkim ixtisasına yönləndirir.
              </p>
            </div>
          </div>
        </section>

     
        <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", padding: "72px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 16 }}>Sağlamlığınızı NovaCare-ə Əmanət Edin</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.05rem", lineHeight: 1.65, marginBottom: 32 }}>
              Peşəkar mütəxəssislərimizlə tanış olun və dərhal onlayn randevu yaradın.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/doctors" style={{ background: "#FFFFFF", color: "var(--primary)", fontWeight: 800, padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                Həkimlərimiz →
              </Link>
              <Link to="/contact" style={{ background: "transparent", border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: 700, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem" }}>
                Əlaqə Və Ünvan
              </Link>
            </div>
          </div>
        </section>
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
                <span style={{ fontWeight: 900, color: "#FFFFFF", fontSize: "1.2rem" }}>HMS</span>
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
              <a href="mailto:info@hms.az" className="ac-footer-link">info@hms.az</a>
              <span className="ac-footer-link" style={{ cursor: "default" }}>Bakı ş., Azərbaycan</span>
            </div>
          </div>

          <div className="ac-footer-bottom">
            © 2026 HMS Xəstəxana İdarəetmə Sistemi. Bütün hüquqlar qorunur.
          </div>
        </div>
      </footer>

    </div>
  );
}
