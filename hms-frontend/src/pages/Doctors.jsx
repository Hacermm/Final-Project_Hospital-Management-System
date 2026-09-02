import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";


const FALLBACK_AVATARS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824813572-9d5d5907ed7a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80",
];

export default function Doctors() {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedDept, setSelectedDept] = useState(searchParams.get("department") || "");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
    else alert(t("Randevu almaq üçün pasiyent hesabınızla giriş etməlisiniz."));
  };

  return (
    
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Səhifə Başlığı və Axtarış Paneli */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 10px", width: "100%" }}>
        <div style={{ marginBottom: 28 }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "5px 16px", fontSize: "0.72rem", fontWeight: 800,
            letterSpacing: "1px", color: "var(--primary)", marginBottom: 12,
          }}>
            {t("PEŞƏKAR MÜTƏXƏSSİS HEYƏTİ")}
          </span>

          <h1 style={{
            fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 900,
            lineHeight: 1.2, letterSpacing: "-0.8px", color: "var(--text-dark)", marginBottom: 8,
          }}>
            {t("Həkimlərimiz")}
          </h1>

          <p style={{ fontSize: "0.98rem", color: "var(--text-mid)", maxWidth: 560 }}>
            {t("İxtisas üzrə həkim axtarın, təcrübələri ilə tanış olun və birbaşa randevu alın.")}
          </p>
        </div>

        {/* Axtarış paneli */}
        <div className="responsive-search-panel" style={{
          background: "var(--surface)",
          borderRadius: 20,
          padding: "20px 24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)",
          border: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr auto",
          gap: 16,
          alignItems: "center",
        }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.45 }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Həkim adı və ya ixtisas...")}
              className="ac-input"
              style={{ paddingLeft: 42 }}
            />
          </div>

          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="ac-input" style={{ cursor: "pointer" }}>
            <option value="">{t("Bütün Şöbələr")}</option>
            {departments.map((d) => (<option key={d.id} value={d.id}>{t(d.name)}</option>))}
          </select>

          <div style={{ fontSize: "0.85rem", color: "var(--text-light)", fontWeight: 700, whiteSpace: "nowrap", textAlign: "center" }}>
            {filtered.length} {t("həkim")}
            {(search || selectedDept) && (
              <button
                onClick={() => { setSearch(""); setSelectedDept(""); }}
                style={{ display: "block", marginTop: 4, background: "none", border: "none", color: "var(--primary)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
              >
                {t("Sıfırla")}
              </button>
            )}
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px", width: "100%", flex: 1 }}>
        {loading && (
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-light)", fontWeight: 700, fontSize: "0.95rem" }} className="animate-pulse">
            {t("Həkimlər yüklənir...")}
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
                      justifyContent: "center",
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
                        {doc.department?.name ? t(doc.department.name) : t("Tibb Mərkəzi")}
                      </span>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 4 }}>
                        {doc.name}
                      </h3>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#90CAF9", marginBottom: 14 }}>
                        {doc.specialization ? t(doc.specialization) : ""}
                      </p>
                      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {doc.bio ? t(doc.bio) : `${doc.name} ${t("NovaCare tibb mərkəzində pasiyentlərə peşəkar xidmət göstərir.")}`}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "rgba(255,255,255,0.9)", marginBottom: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                        <span>{t("Təcrübə:")} <strong>{doc.experience_years} {t("il")}</strong></span>
                        <span>{t("Qəbul:")} <strong style={{ color: "#FFCDD2" }}>{doc.consultation_fee} AZN</strong></span>
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
                          {t("Ətraflı")}
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
                          {t("Randevu Al")}
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
            <div style={{ fontSize: "3rem", marginBottom: 16 }}></div>
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: 8 }}>{t("Həkim Tapılmadı")}</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: 20 }}>{t("Axtarış meyarlarınıza uyğun heç bir mütəxəssis tapılmadı.")}</p>
            <button
              onClick={() => { setSearch(""); setSelectedDept(""); }}
              className="ac-btn"
              style={{ padding: "10px 24px", fontSize: "0.85rem" }}
            >
              {t("Sıfırla")}
            </button>
          </div>
        )}
      </main>

    
      <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)", color: "#FFFFFF", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 14 }}>{t("Həkiminizlə Onlayn Əlaqə Saxlayın")}</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem", lineHeight: 1.65, marginBottom: 28 }}>
            {t("Saniyələr ərzində randevu təyin edin və ya canlı çat vasitəsilə həkiminizə suallarınızı ünvanlayın.")}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/patient/book" style={{ background: "#FFFFFF", color: "var(--primary)", fontWeight: 800, padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              {t("Randevu Al")}
            </Link>
            <Link to="/chat" style={{ background: "transparent", border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: 700, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: "0.95rem" }}>
              {t("Canlı Çat")}
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
                {t("Müasir xəstəxana idarəetmə sistemi — peşəkar həkimlər, onlayn randevu və rəqəmsal səhiyyə xidmətləri.")}
              </p>
            </div>

            <div>
              <div className="ac-footer-title">{t("Xidmətlər")}</div>
              <Link to="/departments" className="ac-footer-link">{t("Şöbələr")}</Link>
              <Link to="/doctors" className="ac-footer-link">{t("Həkimlər")}</Link>
              <Link to="/patient/book" className="ac-footer-link">{t("Randevu Al")}</Link>
              <Link to="/ai" className="ac-footer-link">{t("AI")}</Link>
            </div>

            <div>
              <div className="ac-footer-title">{t("Platforma")}</div>
              <Link to="/about" className="ac-footer-link">{t("Haqqımızda")}</Link>
              <Link to="/contact" className="ac-footer-link">{t("Əlaqə")}</Link>
              <Link to="/login" className="ac-footer-link">{t("Giriş")}</Link>
              <Link to="/register" className="ac-footer-link">{t("Qeydiyyat")}</Link>
            </div>

            <div>
              <div className="ac-footer-title">{t("Əlaqə")}</div>
              <a href="tel:+994123456789" className="ac-footer-link">+994 (12) 345 67 89</a>
              <a href="mailto:info@novacare.az" className="ac-footer-link">info@novacare.az</a>
              <span className="ac-footer-link" style={{ cursor: "default" }}>{t("Bakı ş., Azərbaycan")}</span>
            </div>
          </div>

          <div className="ac-footer-bottom">
            {t("© 2026 NovaCare Hospital. Bütün hüquqlar qorunur.")}
          </div>
        </div>
      </footer>

    </div>
  );
}

