import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext.jsx";
import Navbar from "../components/Navbar";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    api.get("/doctors")
      .then((res) => {
        const found = res.data.data?.find((d) => String(d.id) === String(id));
        found ? setDoctor(found) : setError("Həkim tapılmadı.");
      })
      .catch(() => setError("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!token) navigate("/login");
    else if (role === "patient") navigate(`/patient/book?doctor_id=${doctor.id}`);
    else alert("Randevu almaq üçün pasiyent hesabınızla giriş etməlisiniz.");
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>
      <Navbar />

    
      <div style={{ background: "linear-gradient(135deg, #160202 0%, #2e0505 40%, #B71C1C 100%)", padding: "40px 0", color: "#FFFFFF" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <Link to="/doctors" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 700, color: "#FFCDD2", textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Həkimlər siyahısına qayıt
          </Link>
        </div>
      </div>

    
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 24px 80px", width: "100%", flex: 1 }}>
        {loading && (
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-light)", fontWeight: 700, fontSize: "0.95rem" }} className="animate-pulse">
            Həkim məlumatları yüklənir...
          </div>
        )}

        {error && (
          <div className="ac-card" style={{ padding: 40, textAlign: "center", maxWidth: 440, margin: "40px auto" }}>
            <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)", marginBottom: 16 }}>{error}</p>
            <Link to="/doctors" className="ac-btn" style={{ padding: "10px 24px", fontSize: "0.85rem" }}>Həkimlərə bax</Link>
          </div>
        )}

        {!loading && !error && doctor && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        
         
            <div className="ac-card" style={{ padding: 36, display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", borderTop: "4px solid var(--primary)" }}>
              <div style={{ position: "relative", shrink: 0 }}>
                {doctor.photo_url ? (
                  <img src={doctor.photo_url} alt={doctor.name} style={{ width: 160, height: 160, borderRadius: 20, objectFit: "cover", border: "1px solid var(--border)" }} />
                ) : (
                  <div style={{ width: 160, height: 160, borderRadius: 20, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>👨‍⚕️</div>
                )}
                <span style={{ position: "absolute", bottom: -8, right: 8, padding: "4px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 800, background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} className="animate-pulse" />
                  Qəbul Açıqdır
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  {doctor.department && (
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--primary)", background: "var(--primary-light)", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--secondary-light)", display: "inline-block", marginBottom: 8 }}>
                      {doctor.department.name}
                    </span>
                  )}
                  <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-dark)", letterSpacing: "-0.5px" }}>{doctor.name}</h1>
                  <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--secondary)", marginTop: 2 }}>{doctor.specialization}</p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: "16px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
                  <div style={{ color: "var(--text-mid)" }}>
                    🏆 Təcrübə: <strong style={{ color: "var(--text-dark)" }}>{doctor.experience_years} İl</strong>
                  </div>
                  <div style={{ color: "var(--text-mid)" }}>
                    💳 Qəbul Haqqı: <strong style={{ color: "var(--primary)", fontWeight: 900 }}>{doctor.consultation_fee} AZN</strong>
                  </div>
                  <div style={{ color: "var(--text-mid)" }}>
                    📍 Otaq: <strong style={{ color: "var(--text-dark)" }}>{doctor.room_number || "204"}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <button onClick={handleBook} className="ac-btn" style={{ padding: "12px 28px", fontSize: "0.9rem" }}>
                    📅 Onlayn Randevu Al
                  </button>
                  <a href="tel:+994123456789" style={{ padding: "12px 24px", borderRadius: 12, border: "1.5px solid var(--border)", color: "var(--text-dark)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", background: "var(--surface)" }}>
                    📞 Zəng Et
                  </a>
                </div>
              </div>
            </div>

    
            <div className="responsive-hero-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div className="ac-card" style={{ padding: 32 }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--primary)" }}>📄</span> Həkim Haqqında
                  </h2>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-mid)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {doctor.bio || `${doctor.name} NovaCare Healthcare Group-da ${doctor.specialization} sahəsində ${doctor.experience_years} ildən artıq peşəkar təcrübəyə malikdir.`}
                  </p>
                </div>

                <div className="ac-card" style={{ padding: 32 }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--primary)" }}>🎓</span> Təhsil Və Akkreditasiya
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { t: "Tibb Universiteti Və Rezidentura", d: "İxtisaslaşma dərəcəsi" },
                      { t: "NovaCare Beynəlxalq Sertifikat", d: "JCI standartlarına uyğun müalicə protokolları" },
                    ].map((e, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ fontWeight: 900, color: "var(--primary)", marginTop: 2 }}>✓</span>
                        <div>
                          <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--text-dark)" }}>{e.t}</strong>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>{e.d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div className="ac-card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-dark)", borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--primary)" }}>🗓️</span> Qəbul Qrafiki
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem" }}>
                    {[
                      { d: "B.ertəsi - Cümə", t: "09:00 - 17:00" },
                      { d: "Şənbə", t: "10:00 - 14:00" },
                      { d: "Bazar", t: "İstirahət" },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                        <span style={{ color: "var(--text-mid)" }}>{r.d}</span>
                        <span style={{ fontWeight: 800, color: i < 2 ? "var(--primary)" : "var(--text-light)" }}>{r.t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #18181C 0%, #27272A 100%)", borderRadius: 20, padding: 28, color: "#FFFFFF", border: "1px solid var(--border)" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 8, color: "#FFFFFF" }}>NovaCare 24/7 Dəstək</h4>
                  <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.78)", marginBottom: 20, lineHeight: 1.5 }}>Randevu və təcili məsləhət üçün dəstək mərkəzimiz zənglərinizi qəbul edir.</p>
                  <a href="tel:+994123456789" style={{ display: "block", textAlign: "center", background: "#FFFFFF", color: "var(--primary)", fontWeight: 900, fontSize: "0.88rem", padding: "12px", borderRadius: 12, textDecoration: "none" }}>
                    📞 +994 (12) 345 67 89
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}
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
