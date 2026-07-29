import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_LINKS = [
  { to: "/departments", label: "Şöbələr" },
  { to: "/doctors", label: "Həkimlər" },
  { to: "/about", label: "Haqqımızda" },
  { to: "/contact", label: "Əlaqə" },
];

const FALLBACK_AVATARS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824813572-9d5d5907ed7a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80",
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    Promise.all([api.get("/doctors"), api.get("/departments")])
      .then(([docRes, deptRes]) => {
        setDoctors(docRes.data.data || []);
        setDepartments(deptRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((doc) => {
    const matchDept = !selectedDept || doc.department?.id === Number(selectedDept);
    const matchSearch =
      !search ||
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleBook = (docId, e) => {
    if (e) e.stopPropagation();
    if (!token) navigate("/login");
    else if (role === "patient") navigate(`/patient/book?doctor_id=${docId}`);
    else alert("Randevu almaq üçün pasiyent hesabınızla giriş etməlisiniz.");
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
                  color: l.to === "/doctors" ? "var(--primary)" : "var(--text-mid)",
                  background: l.to === "/doctors" ? "var(--primary-light)" : "transparent",
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
                  if (l.to !== "/doctors") {
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
          padding: "64px 0 72px",
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
            <span style={{ fontSize: "0.9rem" }}>👨‍⚕️</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.8px", color: "#FFCDD2", textTransform: "uppercase" }}>
              PEŞƏKAR MÜTƏXƏSSİS HEYƏTİ
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 18, letterSpacing: "-1px", color: "#FFFFFF" }}>
            Həkimlərimiz Və <br />
            <span style={{ color: "#FFCDD2" }}>Təcrübəli Mütəxəssislər</span>
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: 640 }}>
            NovaCare hospitalında fəaliyyət göstərən yüksək ixtisaslı həkimlərimizi axtarın, təcrübələri ilə tanış olun və birbaşa onlayn randevu alın.
          </p>

       
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1.5fr 1fr auto", gap: 14, maxWidth: 800, background: "rgba(0,0,0,0.35)", padding: 12, borderRadius: 20, border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}>
            <div style={{ position: "relative" }}>
              <svg
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.7 }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Həkim adı və ya ixtisas sahəsi..."
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(30, 6, 6, 0.85)",
                color: "#FFFFFF",
                fontSize: "0.88rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="" style={{ background: "#2e0505" }}>Bütün Şöbələr</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id} style={{ background: "#2e0505" }}>{d.name}</option>
              ))}
            </select>

            {(search || selectedDept) && (
              <button
                onClick={() => { setSearch(""); setSelectedDept(""); }}
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>
      </section>


      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 24px 80px", width: "100%", flex: 1 }}>
        {loading && (
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-light)", fontWeight: 700, fontSize: "0.95rem" }} className="animate-pulse">
            Həkimlər yüklənir...
          </div>
        )}

        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 28 }}>
            {filtered.map((doc, index) => {
              const photoUrl = doc.photo_url || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length];
              
              return (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                  className="group"
                  style={{
                    position: "relative",
                    background: "linear-gradient(180deg, #EDF4FB 0%, #E3EDF8 100%)",
                    borderRadius: 24,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    justify: "space-between",
                    height: 380,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(15, 41, 99, 0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.08)";
                  }}
                >
           
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #E64A19 0%, #D84315 100%)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justify: "center",
                      zIndex: 10,
                      boxShadow: "0 4px 12px rgba(230, 74, 25, 0.4)",
                      transition: "transform 0.25s ease, background 0.25s ease",
                    }}
                    className="group-hover:scale-110"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>

     
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: 320,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt={doc.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 20%",
                        transition: "transform 0.35s ease",
                      }}
                      className="group-hover:scale-105"
                    />
                  </div>

              
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(15, 41, 99, 0.92)",
                      backdropFilter: "blur(6px)",
                      color: "#FFFFFF",
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      justify: "space-between",
                      opacity: 0,
                      pointerEvents: "none",
                      transition: "opacity 0.25s ease",
                      zIndex: 20,
                    }}
                    className="group-hover:opacity-100 group-hover:pointer-events-auto"
                  >
                    <div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#FFCDD2", background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20, display: "inline-block", marginBottom: 10 }}>
                        {doc.department?.name || "Tibb Mərkəzi"}
                      </span>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 4 }}>
                        {doc.name}
                      </h3>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#90CAF9", marginBottom: 14 }}>
                        {doc.specialization}
                      </p>
                      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {doc.bio || `${doc.name} NovaCare tibb mərkəzində pasiyentlərə peşəkar xidmət göstərir.`}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "rgba(255,255,255,0.9)", marginBottom: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                        <span>Təcrübə: <strong>{doc.experience_years} il</strong></span>
                        <span>Qəbul: <strong style={{ color: "#FFCDD2" }}>{doc.consultation_fee} AZN</strong></span>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <Link
                          to={`/doctors/${doc.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.4)",
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            textDecoration: "none",
                            background: "rgba(255,255,255,0.1)",
                          }}
                        >
                          Ətraflı
                        </Link>
                        <button
                          onClick={(e) => handleBook(doc.id, e)}
                          style={{
                            padding: "8px",
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #E64A19 0%, #D84315 100%)",
                            color: "#FFFFFF",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Randevu Al
                        </button>
                      </div>
                    </div>
                  </div>

               
                  <div
                    style={{
                      background: "linear-gradient(180deg, #0F2963 0%, #0A1E4A 100%)",
                      padding: "14px 16px",
                      textAlign: "center",
                      width: "100%",
                      zIndex: 5,
                      position: "relative",
                      borderTop: "3px solid #E64A19",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        padding: 0,
                        fontSize: "0.88rem",
                        fontWeight: 900,
                        color: "#FFFFFF",
                        letterSpacing: "0.6px",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {doc.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="ac-card" style={{ padding: "60px 30px", textAlign: "center", maxWidth: 440, margin: "40px auto" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: 8 }}>Həkim Tapılmadı</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: 20 }}>Axtarış meyarlarınıza uyğun heç bir mütəxəssis tapılmadı.</p>
            <button
              onClick={() => { setSearch(""); setSelectedDept(""); }}
              className="ac-btn"
              style={{ padding: "10px 24px", fontSize: "0.85rem" }}
            >
              Sıfırla
            </button>
          </div>
        )}
      </main>

    
      <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 14 }}>Həkiminizlə Onlayn Əlaqə Saxlayın</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem", lineHeight: 1.65, marginBottom: 28 }}>
            Saniyələr ərzində randevu təyin edin və ya canlı çat vasitəsilə həkiminizə suallarınızı ünvanlayın.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/patient/book" style={{ background: "#FFFFFF", color: "var(--primary)", fontWeight: 800, padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              Randevu Al
            </Link>
            <Link to="/chat" style={{ background: "transparent", border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: 700, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem" }}>
              Canlı Çat
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