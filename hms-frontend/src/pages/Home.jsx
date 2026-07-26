import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_LINKS = [
  { to: "/departments", label: "Şöbələr" },
  { to: "/doctors", label: "Həkimlər" },
  { to: "/about", label: "Haqqımızda" },
  { to: "/contact", label: "Əlaqə" },
];

const SERVICES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Onlayn Randevu",
    desc: "İstənilən ixtisas üzrə təcrübəli həkimlərlə rahat randevu təyin edin, vaxtınıza qənaət edin.",
    link: "/patient/book",
    badge: "Sürətli",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Canlı Söhbət & Konsultasiya",
    desc: "Həkiminizlə real vaxt rejimində mesajlaşın, suallarınızı dərhal ünvanlayın.",
    link: "/chat",
    badge: "Canlı",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z" />
      </svg>
    ),
    title: "Süni İntellekt (AI) Assistent",
    desc: "Simptomlarınızı analiz edən və sizə tövsiyələr verən ağıllı tibbi köməkçi.",
    link: "/ai",
    badge: "AI 24/7",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Elektron Tibbi Qeydlər",
    desc: "Diaqnozlar, təyin olunan reseptlər və keçmiş müayinə tarixçəniz tək bir platformada.",
    link: "/patient/history",
    badge: "Təhlükəsiz",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Laboratoriya Nəticələri",
    desc: "Analizlərinizin cavablarını onlayn olaraq izləyin, PDF formatında yükləyin.",
    link: "/patient/lab-tests",
    badge: "Onlayn",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Peşəkar Tibb Heyəti",
    desc: "Yüksək ixtisaslı, təcrübəli və qayğıkeş həkimlərimiz hər an xidmətinizdədir.",
    link: "/doctors",
    badge: "Təcrübəli",
  },
];

const STEPS = [
  { num: "01", title: "Qeydiyyat & Hesab", desc: "Platformada saniyələr ərzində pulsuz hesab yaradın." },
  { num: "02", title: "Həkim & Vaxt Seçimi", desc: "Uyğun ixtisaslı həkimi və sizə əlverişli vaxtı seçin." },
  { num: "03", title: "Müayinə & Konsultasiya", desc: "Klinikamızda və ya onlayn olaraq həkim qəbulunda olun." },
  { num: "04", title: "Qeydlər & Bərpa", desc: "Reseptlərinizə baxın və müalicə prosesini izləyin." },
];

const REVIEWS = [
  {
    name: "Leyla Məmmədova",
    role: "Xəstə",
    comment: "HMS sistemi sayəsində həkimimə növbə gözləmədən randevu aldım. Analiz nəticələrim dərhal şəxsi kabinetimə yükləndi. Çox razı qaldım!",
    stars: 5,
  },
  {
    name: "Elvin Əliyev",
    role: "Xəstə",
    comment: "AI Assistent xidməti mükəmməldir. Simptomlarımı yazan kimi məni doğru şöbəyə yönləndirdi. Müasir xəstəxana idarəetmə sistemi!",
    stars: 5,
  },
  {
    name: "Nigar Həsənova",
    role: "Xəstə",
    comment: "Həkimlə canlı çat vasitəsilə suallarıma tez cavab tapdım. İnterfeys çox rahat və gözəldir.",
    stars: 5,
  },
];

export default function Home() {
  const [stats, setStats] = useState({ doctors: 0, departments: 0 });
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    Promise.all([api.get("/doctors"), api.get("/departments")])
      .then(([doc, dept]) =>
        setStats({
          doctors: doc.data.data ? doc.data.data.length : 0,
          departments: dept.data.data ? dept.data.data.length : 0,
        })
      )
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease" }}>

   
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
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} style={{ color: "var(--text-mid)", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none", padding: "8px 16px", borderRadius: 8, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "var(--primary-light)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-mid)"; e.currentTarget.style.background = "transparent"; }}>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <Link to="/login" style={{ color: "var(--text-dark)", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", padding: "10px 20px", border: "1.5px solid var(--border)", borderRadius: 10, transition: "all 0.2s", background: "var(--surface)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dark)"; }}>
              Giriş
            </Link>
            <Link to="/register" className="ac-btn" style={{ padding: "10px 22px", fontSize: "0.88rem" }}>
              Qeydiyyat
            </Link>
          </div>
        </div>
      </nav>

    
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #180303 0%, #C62828 65%, #B71C1C 100%)", color: "#FFFFFF", padding: "80px 0 100px" }}>
        
       
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          mixBlendMode: "luminosity",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 48, alignItems: "center" }}>
          
          <div className="animate-fade-in-up">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, padding: "6px 18px", marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, background: "#EF5350", borderRadius: "50%", display: "inline-block" }} className="animate-pulse" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.6px", color: "#FFFFFF" }}>MÜASİR TİBB & YÜKSƏK XİDMƏT</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-1px" }}>
              Sağlamlığınız — <br />
              <span style={{ color: "#FFCDD2" }}>Bizim Ən Böyük Prioritetimizdir</span>
            </h1>

            <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", marginBottom: 36, maxWidth: 540 }}>
              Sertifikatlaşdırılmış peşəkar həkimlər, onlayn randevu, canlı söhbət, AI assistent və tam elektron tibbi qeydlər – hamısı tək platformada.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <Link to="/register" style={{
                background: "#FFFFFF",
                color: "#C62828",
                fontWeight: 800,
                fontSize: "0.95rem",
                padding: "14px 32px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transition: "all 0.25s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FFEBEE"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Qeydiyyatdan Keç →
              </Link>

              <Link to="/doctors" style={{
                background: "rgba(255,255,255,0.12)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "14px 28px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.3)",
                textDecoration: "none",
                backdropFilter: "blur(10px)",
                transition: "all 0.25s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}>
                Həkimləri Kəşf Et
              </Link>
            </div>

            <div style={{ display: "flex", gap: 24, marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.15)", fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#EF5350", fontWeight: 900 }}>✓</span> Ani Randevu
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#EF5350", fontWeight: 900 }}>✓</span> 100% Məxfilik
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#EF5350", fontWeight: 900 }}>✓</span> 24/7 Dəstək
              </div>
            </div>
          </div>

         
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "var(--surface)",
              color: "var(--text-dark)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "var(--shadow-lg)",
              width: "100%",
              maxWidth: 420,
              border: "1px solid var(--border)",
              transition: "all 0.3s ease"
            }} className="animate-float">
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-dark)" }}>Təcrübəli Həkim Qəbulu</h4>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>Peşəkar tibbi xidmət</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--bg)", borderRadius: 16, padding: 18, border: "1px solid var(--border)", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Mümkün Xidmətlər:</span>
                  <span style={{ color: "var(--primary)", fontWeight: 700 }}>Aktiv</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 8, fontSize: "0.76rem", fontWeight: 600, color: "var(--text-dark)" }}>Kardiologiya</span>
                  <span style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 8, fontSize: "0.76rem", fontWeight: 600, color: "var(--text-dark)" }}>Nevrologiya</span>
                  <span style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 8, fontSize: "0.76rem", fontWeight: 600, color: "var(--text-dark)" }}>Pediatriya</span>
                </div>
              </div>

              <Link to="/patient/book" className="ac-btn" style={{ display: "block", textAlign: "center", width: "100%" }}>
                Randevu Təyin Et
              </Link>
            </div>
          </div>

        </div>
      </section>

   
      <section style={{ maxWidth: 1240, margin: "-40px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <div style={{ background: "var(--surface)", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", transition: "all 0.3s ease" }}>
          {[
            { num: stats.doctors ? `${stats.doctors}+` : "25+", label: "Həkim Heyəti", sub: "İxtisaslaşmış Mütəxəssislər" },
            { num: stats.departments ? `${stats.departments}+` : "12+", label: "Tibbi Şöbələr", sub: "Müasir Avadanlıqla" },
            { num: "24/7", label: "Təcili Xidmət", sub: "Daimi Tibbi Dəstək" },
            { num: "99.4%", label: "Məmnuniyyət", sub: "Xəstə Rəyləri" },
          ].map((st, i) => (
            <div key={i} style={{ padding: "28px 20px", textAlign: "center", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1.1 }}>{st.num}</div>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-dark)", marginTop: 6 }}>{st.label}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: 2 }}>{st.sub}</div>
            </div>
          ))}
        </div>
      </section>


      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="ac-section-label">TİBBİ XİDMƏTLƏR</span>
          <h2 className="ac-section-title">Sağlamlığınız üçün Hərtərəfli Həllər</h2>
          <p className="ac-section-sub">HMS sistemi vasitəsilə bütün tibbi ehtiyaclarınızı rəqəmsal olaraq idarə edin.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {SERVICES.map((s, idx) => (
            <div key={idx} className="ac-card" style={{ padding: 30, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ width: 54, height: 54, background: "var(--primary-light)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", background: "var(--primary-light)", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--secondary-light)" }}>
                    {s.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-light)", lineHeight: 1.65, marginBottom: 24 }}>{s.desc}</p>
              </div>

              <Link to={s.link} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--primary)", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", transition: "gap 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.gap = "10px"}
                onMouseLeave={e => e.currentTarget.style.gap = "6px"}>
                Keçid Et →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ background: "linear-gradient(135deg, #18181C 0%, #27272A 100%)", borderRadius: 24, padding: "52px 40px", color: "#FFFFFF", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 40, alignItems: "center", border: "1px solid var(--border)", boxShadow: "0 16px 40px rgba(0,0,0,0.2)" }}>
          <div>
            <span style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: "1px" }}>
              RƏQƏMSAL SƏHİYYƏ
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 16, marginBottom: 14, color: "#FFFFFF" }}>Süni İntellekt (AI) & Canlı Konsultasiya</h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: 28 }}>
              Simptomlarınız barədə şübhəniz var? Bizim AI Assistentimiz sizə ilk tibbi tövsiyələri verməyə hazırdır. Həmçinin həkiminizlə dərhal canlı çata başlaya bilərsiniz.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to="/ai" className="ac-btn" style={{ padding: "12px 24px", fontSize: "0.9rem" }}>
                🤖 AI Assistentlə Danış
              </Link>
              <Link to="/chat" style={{ background: "transparent", border: "1.5px solid var(--secondary)", color: "var(--secondary)", fontWeight: 700, padding: "12px 24px", borderRadius: 10, textDecoration: "none", fontSize: "0.9rem", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--secondary)"; e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--secondary)"; }}>
                💬 Canlı Çat
              </Link>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, background: "var(--secondary)", borderRadius: "50%" }} />
              <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#FFFFFF" }}>AI Sağlamlıq İcmalı</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
              "Baş ağrısı və hərarət hiss edirsinizsə, dərhal temperaturunuzu ölçün və müvafiq Terapevt həkimə müraciət edin."
            </p>
          </div>
        </div>
      </section>

    
      <section style={{ background: "var(--surface)", padding: "80px 24px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", transition: "all 0.3s ease" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ac-section-label">PROSES</span>
            <h2 className="ac-section-title">Müalicə və Qəbul Addımları</h2>
            <p className="ac-section-sub">Sadə 4 addımda tibbi xidmətlərimizdən yararlanın.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {STEPS.map((st, i) => (
              <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 18, padding: 30, position: "relative", transition: "all 0.3s ease" }}>
                <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "var(--secondary)", lineHeight: 1, marginBottom: 14 }}>{st.num}</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-dark)", marginBottom: 8 }}>{st.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-light)", lineHeight: 1.6 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="ac-section-label">XƏSTƏ RƏYLƏRİ</span>
          <h2 className="ac-section-title">Bizi Seçənlərin Fikirləri</h2>
          <p className="ac-section-sub">Xəstələrimizin məmnuniyyəti bizim ən böyük mükafatımızdır.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className="ac-card" style={{ padding: 28 }}>
              <div style={{ color: "var(--secondary)", fontSize: "1.1rem", marginBottom: 12 }}>
                {"★".repeat(r.stars)}
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", lineHeight: 1.65, fontStyle: "italic", marginBottom: 20 }}>
                "{r.comment}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", color: "#FFFFFF", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-dark)" }}>{r.name}</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

   
      <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 16 }}>Sağlamlığınızı Təxirə Salmayın</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.05rem", lineHeight: 1.65, marginBottom: 32 }}>
            Saniyələr ərzində hesab açın, həkiminizi seçin və onlayn randevu təyin edin.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ background: "#FFFFFF", color: "var(--primary)", fontWeight: 800, padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              İndi Qeydiyyatdan Keç
            </Link>
            <Link to="/departments" style={{ background: "transparent", border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: 700, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem" }}>
              Şöbələrimizə Bax
            </Link>
          </div>
        </div>
      </section>

   
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