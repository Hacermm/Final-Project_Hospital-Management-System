import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext.jsx";
import Navbar from "../components/Navbar";

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
      <Navbar />


      {/* ═══════ PREMIUM HERO ═══════ */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a0303 0%, #2d0606 35%, #8B1A1A 75%, #C62828 100%)", color: "#FFFFFF", padding: "64px 0 64px" }}>

        {/* Dot grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }} />

        {/* Glowing orbs */}
        <div style={{ position: "absolute", top: "-80px", right: "20%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.28) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "0", left: "-60px", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,40,40,0.22) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div className="responsive-hero-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* LEFT — text */}
          <div style={{ paddingBottom: 64 }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 40, padding: "6px 18px", marginBottom: 24, backdropFilter: "blur(8px)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "1px", color: "#FFCDD2", textTransform: "uppercase" }}>PEŞƏKAR MÜTƏXƏSSİS HEYƏTİ</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: 20, letterSpacing: "-1.5px" }}>
              Həkimlərimizi
              <span style={{ display: "block", background: "linear-gradient(90deg, #FFCDD2, #FF8A80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tanıyın &amp; Randevu</span>
              Alın
            </h1>

            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", maxWidth: 460, marginBottom: 32 }}>
              NovaCare-də fəaliyyət göstərən 50+ ixtisaslı həkimləri axtarın, təcrübələri ilə tanış olun və birbaşa onlayn randevu Alın.
            </p>

            {/* Mini stats row */}
            <div className="responsive-stats-row" style={{ display: "flex", gap: 0, marginBottom: 0 }}>
              {[
                { val: "50+", label: "Həkim" },
                { val: "15+", label: "Şöbə" },
                { val: "24/7", label: "Xidmət" },
                { val: "98%", label: "Məmnuniyyət" },
              ].map((s, i) => (
                <div key={i} style={{ paddingRight: 28, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none", paddingLeft: i > 0 ? 28 : 0 }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — decorative visual */}
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 0, height: 340 }}>

            {/* Main card — doctor illustration */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 220,
              height: 300,
              borderRadius: "24px 24px 0 0",
              background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}>
              <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="28" r="20" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <circle cx="40" cy="24" r="10" fill="rgba(255,255,255,0.3)" />
                <path d="M14 72c0-14.36 11.64-26 26-26s26 11.64 26 26" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M40 52v14M34 58h12" stroke="rgba(255,200,200,0.9)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#FFFFFF" }}>Dr. Mütəxəssis</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)", marginTop: 4 }}>Kardiologiya</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FDB931", fontSize: "0.8rem" }}>★</span>)}
              </div>
            </div>

            {/* Floating card — top left */}
            <div style={{
              position: "absolute",
              top: 24,
              left: 0,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: "14px 18px",
              minWidth: 150,
              animation: "floatSlow 3s ease-in-out infinite"
            }}>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Bu Həftə</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", marginTop: 4 }}>142</div>
              <div style={{ fontSize: "0.72rem", color: "#FFCDD2", fontWeight: 600 }}>Randevu Alındı</div>
            </div>

            {/* Floating card — top right */}
            <div style={{
              position: "absolute",
              top: 80,
              right: 0,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "floatSlow 3.5s ease-in-out infinite"
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>✓</div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>ONLINE</div>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#FFFFFF" }}>18 Həkim</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH PANEL — clean floating card overlapping hero */}
      <section style={{ maxWidth: 1240, margin: "-36px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <div className="responsive-search-panel" style={{
          background: "var(--surface)",
          borderRadius: 20,
          padding: "24px 28px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          border: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr auto",
          gap: 14,
          alignItems: "center",
          transition: "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
        }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.45 }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Həkim adı və ya ixtisas sahəsi..." className="ac-input" style={{ paddingLeft: 42 }} />
          </div>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="ac-input" style={{ cursor: "pointer" }}>
            <option value="">Bütün Şöbələr</option>
            {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
          </select>
          {(search || selectedDept) ? (
            <button onClick={() => { setSearch(""); setSelectedDept(""); }} style={{ padding: "12px 20px", borderRadius: 10, background: "var(--primary-light)", border: "1px solid var(--secondary-light)", color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}>✕ Sıfırla</button>
          ) : (
            <button className="ac-btn" style={{ padding: "12px 22px", fontSize: "0.85rem", whiteSpace: "nowrap" }}>Axtar</button>
          )}
        </div>
      </section>


      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px", width: "100%", flex: 1 }}>
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

