import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import Navbar from "../components/Navbar";

export default function About() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>
      <Navbar />

    
      {/* ═══════ PREMIUM ABOUT HERO ═══════ */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a0303 0%, #2d0606 35%, #8B1A1A 75%, #C62828 100%)", color: "#FFFFFF", padding: "72px 0 96px" }}>

        {/* Diagonal stripe pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.06,
          backgroundImage: "repeating-linear-gradient(45deg, #FFFFFF 0px, #FFFFFF 1px, transparent 1px, transparent 20px)",
        }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "-100px", right: "-60px", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,30,30,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="responsive-hero-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "center" }}>

          {/* LEFT */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 40, padding: "6px 20px", marginBottom: 28, backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: "0.85rem" }}>🏆</span>
              <span style={{ fontSize: "0.74rem", fontWeight: 800, letterSpacing: "1px", color: "#FFCDD2", textTransform: "uppercase" }}>RƏQƏMSAL TİBB MƏRKƏZİ</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1.5px" }}>
              Sağlamlığınızın
              <span style={{ display: "block", background: "linear-gradient(90deg, #FFCDD2, #FF8A80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Həqiqi Ortağı</span>
              Biz Əlaqəyiqə</h1>

            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.82)", maxWidth: 480, marginBottom: 36 }}>
              Beynəlxalq səhiyyə standartlarına əsaslanan qabaqcıl diaqnostika, fərdiləşdirilmiş müaəlicə protokolları və 24/7 rəqəmsal xəstəxana idarəetmə platforması — NovaCare.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="/doctors" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, background: "#FFFFFF", color: "#C62828", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Həkimləri Görün →
              </a>
              <a href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, background: "transparent", color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.35)", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                Əlaqə Saxlayın
              </a>
            </div>
          </div>

          {/* RIGHT — 2x2 achievement cards */}
          <div className="responsive-2x2-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: "🏆", val: "2019", label: "Quruluş ili", sub: "6 ildən artıq təcrübə" },
              { icon: "👨‍⚕️", val: "50+", label: "Mütəxəssis", sub: "Sertifikatlı həkimlər" },
              { icon: "📊", val: "12K+", label: "Pasiyent", sub: "Məmun pasiyentlər" },
              { icon: "⏰", val: "24/7", label: "Xidmət", sub: "Dəyim hazırıq" },
            ].map((card, i) => (
              <div key={i} style={{
                background: i % 2 === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 20,
                padding: "24px 20px",
                transform: i === 1 || i === 2 ? "translateY(16px)" : "translateY(0)",
                transition: "transform 0.3s ease",
              }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{card.icon}</div>
                <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>{card.val}</div>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#FFCDD2", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS FLOATING CARD */}
      <main style={{ flex: 1 }}>
        <section style={{ maxWidth: 1240, margin: "-32px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
          <div className="responsive-dash-grid" style={{ background: "var(--surface)", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", transition: "all 0.3s ease" }}>
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
