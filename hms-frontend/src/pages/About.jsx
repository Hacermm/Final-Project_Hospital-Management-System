import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";

export default function About() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/doctors").catch(() => ({ data: { data: [] } })),
      api.get("/departments").catch(() => ({ data: { data: [] } })),
    ]).then(([docRes, deptRes]) => {
      setDoctors(docRes.data?.data || []);
      setDepartments(deptRes.data?.data || []);
    });
  }, []);


  const docCount = doctors.length > 0 ? doctors.length : 50;
  const deptCount = departments.length > 0 ? departments.length : 15;

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* 1. HERO BÖLMƏSİ (İki sütunlu, vizuallı və 4 kiçik kartlı) */}
        <section style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #1a0303 0%, #2d0606 35%, #8B1A1A 75%, #C62828 100%)",
          color: "#FFFFFF",
          padding: "64px 24px 80px"
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }} />
          <div style={{ position: "absolute", top: "-80px", right: "15%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div className="responsive-hero-grid" style={{
            maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2,
            display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center"
          }}>
            {/* SOL TƏRƏF */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 40, padding: "6px 20px", marginBottom: 24, backdropFilter: "blur(8px)" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, letterSpacing: "1px", color: "#FFCDD2", textTransform: "uppercase" }}>NİYƏ NOVACARE?</span>
              </div>

              <h1 style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: 20, letterSpacing: "-1.5px" }}>
                Sağlamlığınızın
                <span style={{ display: "block", background: "linear-gradient(90deg, #FFCDD2, #FF8A80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Rəqəmsal Gələcəyi
                </span>
              </h1>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: 520, marginBottom: 32, fontWeight: 500 }}>
                Səhiyyə xidmətini hər kəs üçün əlçatan və şəffaf etmək missiyası ilə, xəstə və həkim arasındakı məsafəni ən müasir rəqəmsal həllərlə aradan qaldırırıq.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
                <Link to="/patient/book" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "#FFFFFF", color: "#C62828", fontWeight: 800, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                  Randevu Al →
                </Link>
                <Link to="/doctors" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "transparent", color: "#FFFFFF", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.35)", backdropFilter: "blur(8px)" }}>
                  Həkimlərimiz
                </Link>
              </div>

              {/* 2. MİSSİYA ALT KARTLAR (4 kiçik kart) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {[
                  { title: "24/7 Xidmət", sub: "Fasiləsiz onlayn sistem" },
                  { title: "AI Assistent", sub: "Ağıllı ilkin yönləndirmə" },
                  { title: "Onlayn Randevu", sub: "30 saniyəyə təsdiq" },
                  { title: "Təhlükəsiz Tarixçə", sub: "RBAC mühafizəli arxiv" }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 14,
                    padding: "12px 16px",
                    backdropFilter: "blur(8px)"
                  }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#FFFFFF" }}>{item.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAĞ TƏRƏF (Hospital vizualı + Floating cards) */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <div style={{
                position: "relative",
                width: "100%",
                maxWidth: 460,
                height: 380,
                borderRadius: 24,
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3)"
              }}>
                <img
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80"
                  alt="NovaCare Mərkəzi"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(26,3,3,0.85) 100%)" }} />

                <div style={{ position: "absolute", bottom: 20, left: 24, right: 24 }}>
                  <div style={{ fontSize: "0.75rem", color: "#FFCDD2", fontWeight: 700, letterSpacing: "1px" }}>RƏQƏMSAL XƏSTƏXANA İNFRASTRUKTURU</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#FFFFFF", marginTop: 4 }}>NovaCare Tibb &amp; Texnologiya</div>
                </div>
              </div>

              {/* Floating card top-right */}
              <div style={{
                position: "absolute",
                top: 24,
                right: -10,
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 16,
                padding: "12px 18px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.2)"
              }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>FƏAL HƏKİMLƏR</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: 2 }}>{docCount}+ Mütəxəssis</div>
              </div>

              {/* Floating card bottom-left */}
              <div style={{
                position: "absolute",
                bottom: -20,
                left: -10,
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 16,
                padding: "14px 20px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.2)"
              }}>
                <div style={{ fontSize: "0.7rem", color: "#FFCDD2", fontWeight: 700 }}>RƏQƏMSAL ARXİV</div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>100% Onlayn PDF Nəticələr</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. BİZİM ÜSTÜNLÜKLƏRİMİZ (Real Hospital Hissi & Counters) */}
        <section style={{ maxWidth: 1240, margin: "40px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
          <div className="responsive-dash-grid" style={{
            background: "var(--surface)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)"
          }}>
            {[
              { val: `${docCount}+`, label: "İxtisaslı Həkim" },
              { val: `${deptCount}+`, label: "Tibb Şöbəsi" },
              { val: "24/7", label: "Onlayn Platforma" },
              { val: "99%", label: "Məmnuniyyət" },
            ].map((stat, idx) => (
              <div key={idx} style={{
                padding: "32px 20px",
                textAlign: "center",
                borderRight: idx < 3 ? "1px solid var(--border)" : "none"
              }}>
                <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1.1 }}>{stat.val}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dark)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. PROBLEM → NOVACARE (Səhifənin ən yaxşı hissəsi, SVG ikonlarla) */}
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 24px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{
              display: "inline-block", background: "var(--primary-light)",
              border: "1px solid var(--secondary-light)", borderRadius: 30,
              padding: "5px 16px", fontSize: "0.75rem", fontWeight: 800,
              letterSpacing: "1px", color: "var(--primary)", marginBottom: 14,
            }}>
              MÜQAYİSƏ
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 900, color: "var(--text-dark)", marginBottom: 12, letterSpacing: "-1px" }}>
              Ənənəvi Yanaşma vs NovaCare
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-mid)", maxWidth: 620, margin: "0 auto" }}>
              Köhnəlmiş xəstəxana prosedurları ilə müasir rəqəmsal platformamızın real üstünlüklərini müqayisə edin.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
            alignItems: "stretch"
          }}>
            {/* ƏNƏNƏVİ YANAŞMA */}
            <div style={{
              background: "var(--surface)",
              borderRadius: 24,
              border: "1px solid var(--border)",
              padding: "36px 32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 24
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", paddingBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(120,120,120,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-mid)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-mid)" }}>Ənənəvi Yanaşma</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginTop: 2 }}>Klassik xəstəxana növbələri və kağız proseslər</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {[
                  {
                    title: "Telefon & Zəng Növbəsi",
                    desc: "Randevu üçün zəng xətlərində gözləmək, uyğun saatı çətinliklə tapmaq",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    )
                  },
                  {
                    title: "Kağız Resept İtki Riski",
                    desc: "Sənəd və reseptlərin fiziki daşınması, itməsi və arxivenməməsi",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    )
                  },
                  {
                    title: "Analiz Üçün Klinikaya Gəlmək",
                    desc: "Laboratoriya cavablarını əldə etmək üçün yenidən klinikaya getmək",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    )
                  },
                  {
                    title: "Sual Üçün Qəbul Gözləmək",
                    desc: "Həkimlə əlaqənin yalnız fiziki qəbul və ya zəng saatı mümkün olması",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(220,53,69,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-dark)" }}>{item.title}</div>
                      <div style={{ fontSize: "0.84rem", color: "var(--text-light)", marginTop: 4 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NOVACARE */}
            <div style={{
              background: "linear-gradient(180deg, var(--surface) 0%, var(--surface) 100%)",
              borderRadius: 24,
              border: "2px solid var(--primary)",
              padding: "36px 32px",
              boxShadow: "0 16px 40px rgba(198, 40, 40, 0.12)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              position: "relative"
            }}>
              <div style={{ position: "absolute", top: 16, right: 24, background: "var(--primary)", color: "#FFFFFF", padding: "4px 12px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.5px" }}>
                RƏQƏMSAL HƏLL
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", paddingBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--primary)" }}>NovaCare</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-mid)", marginTop: 2 }}>Tam onlayn və sürətli xəstəxana idarəetmə platforması</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {[
                  {
                    title: "Onlayn 30 Saniyəyə Təsdiqləmə",
                    desc: "Boş saatları dərhal görün, istədiyiniz vaxt bir toxunuşla randevunu təsdiqləyin",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    )
                  },
                  {
                    title: "Rəqəmsal PDF Arxiv",
                    desc: "Resept, diaqnoz və həkim rəyləri anında PDF formatında kabinetinizə yazılır",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                      </svg>
                    )
                  },
                  {
                    title: "Nəticələr Şəxsi Kabinetdə",
                    desc: "Laboratoriya və müayinə cavablarına 24/7 onlayn çıxış və yükləmə imkanı",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><polyline points="12 11 12 17 15 14"/>
                      </svg>
                    )
                  },
                  {
                    title: "Canlı Çat & AI Asistent",
                    desc: "Süni intellekt köməkçisi və həkimlərlə birbaşa real-vaxt rəqəmsal əlaqə",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(40,167,69,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-dark)" }}>{item.title}</div>
                      <div style={{ fontSize: "0.84rem", color: "var(--text-mid)", marginTop: 4 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. DƏYƏRLƏRİMİZ (Premium Outline SVG İkonlar) */}
        <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 24px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{
                display: "inline-block", background: "var(--primary-light)",
                border: "1px solid var(--secondary-light)", borderRadius: 30,
                padding: "5px 16px", fontSize: "0.75rem", fontWeight: 800,
                letterSpacing: "1px", color: "var(--primary)", marginBottom: 14,
              }}>
                PRİNSİPLƏRİMİZ
              </span>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 900, color: "var(--text-dark)", marginBottom: 12, letterSpacing: "-1px" }}>
                Dəyərlərimiz
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-mid)", maxWidth: 580, margin: "0 auto" }}>
                Hər bir qərarımızın və texnoloji yeniliyin arxasında dayanan təməl prinsiplər.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
              {[
                {
                  title: "Məxfilik",
                  text: "Tibbi məlumatlar və şəxsi tarixçə sistemdə qorunur və rol əsaslı icazə (RBAC) sayəsində yalnız aidiyyəti şəxslər tərəfindən görünür.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  )
                },
                {
                  title: "Əlçatanlıq",
                  text: "24/7 fəaliyyət göstərən platformaya istənilən cihazdan daxil olun, harada olursunuzsa olun həkiminizlə rəqəmsal əlaqə saxlayın.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  )
                },
                {
                  title: "Şəffaflıq",
                  text: "Həkimlərin təcrübəsi, ixtisası, xidmət şərtləri və randevu saatları haqqında məlumatlar hər kəs üçün açıq və aydındır.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  )
                },
                {
                  title: "Texnologiya & AI",
                  text: "Real vaxt mesajlaşma, səsli zəng infrastrukturu və süni intellekt dəstəkli ilkin diaqnostika asistenti.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  )
                }
              ].map((val, idx) => (
                <div key={idx} style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "32px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: "var(--primary-light)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {val.icon}
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)" }}>{val.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-light)", lineHeight: 1.65 }}>{val.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. NECƏ İŞLƏYİR? — tünd band, birləşmiş timeline */}
        <section style={{
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          color: "#FFFFFF",
          padding: "88px 24px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }} />

          <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span style={{
                display: "inline-block", background: "rgba(239,68,68,0.18)",
                border: "1px solid rgba(239,68,68,0.35)", borderRadius: 30,
                padding: "5px 16px", fontSize: "0.75rem", fontWeight: 800,
                letterSpacing: "1px", color: "#FCA5A5", marginBottom: 14,
              }}>
                PROSES
              </span>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 900, marginBottom: 12, letterSpacing: "-1px" }}>
                Necə İşləyir?
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: 580, margin: "0 auto" }}>
                Səhiyyə platformasından yararlanmaq üçün 4 ardıcıl addım.
              </p>
            </div>

            <div style={{ position: "relative" }}>
              {/* birləşdirici xətt */}
              <div className="timeline-line" style={{
                position: "absolute",
                top: 26,
                left: "12%",
                right: "12%",
                height: 2,
                background: "linear-gradient(90deg, rgba(239,68,68,0.5), rgba(255,255,255,0.15))",
                zIndex: 0
              }} />

              <div className="responsive-timeline-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 24,
                position: "relative",
                zIndex: 2
              }}>
                {[
                  { num: "1", title: "Qeydiyyat", desc: "Təhlükəsiz pasiyent hesabı yaradın və email-inizi təsdiqləyin." },
                  { num: "2", title: "Həkim Seçimi", desc: "İxtisas üzrə mütəxəssisi tapın, təcrübəsi və qəbul haqqı ilə tanış olun." },
                  { num: "3", title: "Randevu Al", desc: "Boş saatlardan birini seçin — sistem anında təsdiqləyir." },
                  { num: "4", title: "Nəticələrə Bax", desc: "Diaqnoz, resept və analizlər şəxsi kabinetinizdə, PDF formatında." }
                ].map((step, idx) => (
                  <div key={idx} style={{ textAlign: "center" }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: "50%",
                      background: "linear-gradient(135deg, #C62828, #8B1A1A)",
                      border: "3px solid #18181b",
                      color: "#FFFFFF",
                      fontSize: "1.3rem", fontWeight: 900,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 20px",
                      boxShadow: "0 0 0 4px rgba(198,40,40,0.2)"
                    }}>
                      {step.num}
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 8 }}>{step.title}</h3>
                    <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 220, margin: "0 auto" }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* 8. HOSPITAL GALLERY (Hospital, Reception, MRI, Laboratory, Operation Room) */}
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{
              display: "inline-block", background: "var(--primary-light)",
              border: "1px solid var(--secondary-light)", borderRadius: 30,
              padding: "5px 16px", fontSize: "0.75rem", fontWeight: 800,
              letterSpacing: "1px", color: "var(--primary)", marginBottom: 14,
            }}>
              QALEREYA VƏ MÜHİT
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 900, color: "var(--text-dark)", marginBottom: 12, letterSpacing: "-1px" }}>
              Xəstəxanamızla Tanış Olun
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-mid)", maxWidth: 580, margin: "0 auto" }}>
              Müasir avadanlıqlar, rahat qəbul otaqları və yüksək texnoloji diaqnostika şöbələrimiz.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { title: "Hospital Building", img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80", sub: "Mərkəzi Bina" },
              { title: "Reception", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80", sub: "Qəbul & Qeydiyyat" },
              { title: "MRI & Diagnostics", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80", sub: "Rəqəmsal Müayinə" },
              { title: "Laboratory", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80", sub: "Avtomatlaşdırılmış Analiz" }
            ].map((pic, idx) => (
              <div key={idx} style={{
                position: "relative",
                height: 240,
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
              }}>
                <img src={pic.img} alt={pic.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />
                <div style={{ position: "absolute", bottom: 18, left: 20, right: 20 }}>
                  <div style={{ fontSize: "0.75rem", color: "#FFCDD2", fontWeight: 700, textTransform: "uppercase" }}>{pic.sub}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>{pic.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. PATIENT REVIEWS (3 Rəy Kartı, ulduzlarla) */}
        <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 24px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{
                display: "inline-block", background: "var(--primary-light)",
                border: "1px solid var(--secondary-light)", borderRadius: 30,
                padding: "5px 16px", fontSize: "0.75rem", fontWeight: 800,
                letterSpacing: "1px", color: "var(--primary)", marginBottom: 14,
              }}>
                PASİYENT RƏYLƏRİ
              </span>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 900, color: "var(--text-dark)", marginBottom: 12, letterSpacing: "-1px" }}>
                Pasiyentlərimiz Nə Deyir?
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {[
                {
                  stars: "★★★★★",
                  text: "NovaCare-də xidmət çox sürətli idi. Növbə gözləmədən onlayn randevumla birbaşa həkim qəbuluna düşdüm.",
                  author: "Rəşad Quliyev",
                  role: "Pasiyent"
                },
                {
                  stars: "★★★★★",
                  text: "Həkimlər çox peşəkardır. Bütün müayinə və analiz nəticələrini PDF şəkildə kabinetdən anında yükləyə bildim.",
                  author: "Səbinə Əliyeva",
                  role: "Pasiyent"
                },
                {
                  stars: "★★★★★",
                  text: "Online sistem əladır. Hem AI Asistent, həm də canlı saat təqvimi randevu almağı çox asanlaşdırır.",
                  author: "Kamran Məmmədli",
                  role: "Pasiyent"
                }
              ].map((rev, idx) => (
                <div key={idx} style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 20
                }}>
                  <div>
                    <div style={{ color: "#FDB931", fontSize: "1.1rem", marginBottom: 12 }}>
                      {rev.stars}
                    </div>
                    <p style={{ fontSize: "0.98rem", color: "var(--text-dark)", lineHeight: 1.65, fontStyle: "italic" }}>
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-dark)" }}>{rev.author}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: 2 }}>{rev.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      

        {/* 10. FOOTER-DƏN ƏVVƏL BÖYÜK CTA */}
        <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "1.5px", color: "#FFCDD2", marginBottom: 12, textTransform: "uppercase" }}>
              HAZIRSINIZ?
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, marginBottom: 18, letterSpacing: "-1px" }}>
              Sağlamlığınızı NovaCare-ə Etibar Edin
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.08rem", lineHeight: 1.65, marginBottom: 36 }}>
              İstər birbaşa onlayn randevu alın, istərsə də ixtisaslı həkim heyətimizlə tanış olun.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/patient/book" style={{ background: "#FFFFFF", color: "var(--primary)", fontWeight: 800, padding: "15px 36px", borderRadius: 14, textDecoration: "none", fontSize: "1rem", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                Randevu Al
              </Link>
              <Link to="/doctors" style={{ background: "transparent", border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: 700, padding: "15px 32px", borderRadius: 14, textDecoration: "none", fontSize: "1rem" }}>
                Həkimləri Görün →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
