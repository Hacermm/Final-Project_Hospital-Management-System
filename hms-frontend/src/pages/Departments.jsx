import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext.jsx";
import Navbar from "../components/Navbar";

const CATEGORIES = [
  { id: "all", label: "Bütün Şöbələr", icon: "" },
  { id: "terapiya", label: "Terapiya & Daxili", icon: "" },
  { id: "cerrahiyye", label: "Cərrahiyyə", icon: "" },
  { id: "diaqnostika", label: "Diaqnostika & Lab", icon: "" },
];

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    api
      .get("/departments")
      .then((res) => setDepartments(res.data.data || []))
      .catch(() => setError("Şöbələr yüklənə bilmədi."))
      .finally(() => setLoading(false));
  }, []);

  const filteredDepts = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategory === "all") return true;

    const nameLower = d.name.toLowerCase();
    if (selectedCategory === "cerrahiyye") {
      return nameLower.includes("cərrah") || nameLower.includes("əməliyyat") || nameLower.includes("travma");
    }
    if (selectedCategory === "diaqnostika") {
      return nameLower.includes("lab") || nameLower.includes("rentgen") || nameLower.includes("ultrasəs") || nameLower.includes("radiologiya");
    }
    if (selectedCategory === "terapiya") {
      return !nameLower.includes("cərrah") && !nameLower.includes("lab");
    }
    return true;
  });

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>
      <Navbar />

    
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
            top: "-20%",
            left: "10%",
            width: "420px",
            height: "420px",
            background: "radial-gradient(circle, rgba(239, 83, 80, 0.22) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(198, 40, 40, 0.2) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div className="responsive-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 40, alignItems: "center" }}>
            
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 30,
                  padding: "6px 18px",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: "0.9rem" }}></span>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.8px", color: "#FFCDD2", textTransform: "uppercase" }}>
                  NovaCare Tibb Mərkəzi
                </span>
              </div>

              <h1 style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 18, letterSpacing: "-1px", color: "#FFFFFF" }}>
                Klinik Şöbələr və <br />
                <span style={{ color: "#FFCDD2" }}>
                  Poliklinik Xidmətlərimiz
                </span>
              </h1>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: 560, marginBottom: 32 }}>
                Beynəlxalq keyfiyyət standartlarına cavab verən, son texnoloji diaqnostika avadanlıqları ilə təchiz olunmuş ixtisaslaşdırılmış tibbi şöbələrimizi kəşf edin.
              </p>

         
              <div style={{ display: "flex", gap: 12, maxWidth: 520, position: "relative" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <svg
                    style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.7 }}
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
                    placeholder="Şöbə adı və ya xidmət üzrə axtarış..."
                    style={{
                      width: "100%",
                      padding: "14px 18px 14px 46px",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.22)",
                      background: "rgba(0, 0, 0, 0.35)",
                      color: "#FFFFFF",
                      fontSize: "0.92rem",
                      outline: "none",
                      backdropFilter: "blur(12px)",
                      transition: "all 0.25s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FFCDD2")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.22)")}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(255,255,255,0.15)",
                        border: "none",
                        color: "#FFFFFF",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      
                    </button>
                  )}
                </div>
              </div>
            </div>


            <div style={{ display: "flex", justifySelf: "end", width: "100%", maxWidth: 380 }}>
              <div
                style={{
                  background: "rgba(35, 6, 6, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  borderRadius: 24,
                  padding: 28,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(16px)",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, pb: 16, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #C62828 0%, #B71C1C 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
                    
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: "0.98rem", color: "#FFFFFF" }}>Yüksək Tibbi Standart</h4>
                    <span style={{ fontSize: "0.76rem", color: "#FFCDD2", fontWeight: 700 }}>Beynəlxalq Akreditasiya</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "1.2rem" }}></span>
                    <div>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#FFFFFF" }}>3D Tomoqrafiya & Ultra-Müasir Lab</div>
                      <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.75)" }}>Dəqiq diaqnostika</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "1.2rem" }}></span>
                    <div>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#FFFFFF" }}>24/7 Təcili Cərrahi Qəbul</div>
                      <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.75)" }}>Növbəsiz təcili yardım</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "1.2rem" }}></span>
                    <div>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#FFFFFF" }}>Təcrübəli Həkim Qrupu</div>
                      <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.75)" }}>Fərdi müalicə planı</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

       
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 44, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.14)" }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 14,
                    fontSize: "0.86rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.25s",
                    border: isSelected ? "1px solid #FFCDD2" : "1px solid rgba(255,255,255,0.18)",
                    background: isSelected ? "linear-gradient(135deg, #C62828 0%, #B71C1C 100%)" : "rgba(0, 0, 0, 0.35)",
                    color: "#FFFFFF",
                    boxShadow: isSelected ? "0 4px 14px rgba(198, 40, 40, 0.4)" : "none",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

   
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 24px 80px", width: "100%", flex: 1 }}>
        {loading && (
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-light)", fontWeight: 700, fontSize: "0.95rem" }} className="animate-pulse">
            Şöbələr yüklənir...
          </div>
        )}

        {error && (
          <div className="ac-card" style={{ padding: 32, textAlign: "center", maxWidth: 480, margin: "40px auto", color: "var(--primary)", fontWeight: 800 }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {filteredDepts.map((dept) => (
              <div key={dept.id} className="ac-card" style={{ padding: 30, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ width: 54, height: 54, background: "var(--primary-light)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                      
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--primary)", background: "var(--primary-light)", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--secondary-light)" }}>
                      {dept.doctors_count || 0} HƏKİM
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 10 }}>{dept.name}</h2>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-light)", lineHeight: 1.65, marginBottom: 24 }}>
                    {dept.description || "Ən müasir diaqnostika avadanlıqları və təcrübəli həkim heyəti ilə pasiyent müayinəsi."}
                  </p>
                </div>

                <div style={{ pt: 16, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <span style={{ color: "var(--text-light)", fontSize: "0.8rem", fontWeight: 600 }}>NovaCare Hospital</span>
                  <Link
                    to="/doctors"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--primary)", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}
                  >
                    Həkimlərə Bax →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredDepts.length === 0 && (
          <div className="ac-card" style={{ padding: "60px 30px", textAlign: "center", maxWidth: 440, margin: "40px auto" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}></div>
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: 8 }}>Şöbə Tapılmadı</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>Axtarışınıza və ya seçilmiş kateqoriyaya uyğun heç bir tibbi şöbə tapılmadı.</p>
          </div>
        )}
      </main>

   
      <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 14 }}>Həkim Müayinəsinə Yazılın</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem", lineHeight: 1.65, marginBottom: 28 }}>
            İstədiyiniz şöbə üzrə mütəxəssis seçin və onlayn randevu təyin edin.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/patient/book" style={{ background: "#FFFFFF", color: "var(--primary)", fontWeight: 800, padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              Randevu Al
            </Link>
            <Link to="/doctors" style={{ background: "transparent", border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: 700, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem" }}>
              Bütün Həkimlər
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