import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";

const DEPT_ICONS = {
  Kardiologiya: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  Nevrologiya: "M12 2a3 3 0 0 0-3 3 3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 3 3 3 3 0 0 0 6 0 3 3 0 0 0 3-3v-1a3 3 0 0 0 0-6V8a3 3 0 0 0-3-3 3 3 0 0 0-3-3z",
  Pediatriya: "M9 12h.01M15 12h.01M10 16s.8 1 2 1 2-1 2-1M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
  Ortopediya: "M6 4v6a6 6 0 0 0 12 0V4M6 20v-6a6 6 0 0 1 12 0v6",
  Terapiya: "M22 12h-4l-3 9L9 3l-3 9H2",
  Oftalmologiya: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    return matchesSearch;
  });

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Qısa, açıq başlıq — digər səhifələrdən fərqli */}
      <section style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "48px 24px 40px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
            <div>
              <span style={{
                display: "inline-block", background: "var(--primary-light)",
                border: "1px solid var(--secondary-light)", borderRadius: 30,
                padding: "5px 16px", fontSize: "0.74rem", fontWeight: 800,
                letterSpacing: "1px", color: "var(--primary)", marginBottom: 14,
              }}>
                KLİNİK ŞÖBƏLƏR
              </span>
              <h1 style={{
                fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", fontWeight: 900,
                color: "var(--text-dark)", letterSpacing: "-1px", margin: 0, lineHeight: 1.15
              }}>
                Şöbələrimiz
              </h1>
              <p style={{ fontSize: "1rem", color: "var(--text-mid)", marginTop: 10, maxWidth: 520 }}>
                İxtisaslaşdırılmış tibbi şöbələrimizi kəşf edin və uyğun həkimə randevu alın.
              </p>
            </div>

            {/* Axtarış — sağda */}
            <div style={{ position: "relative", minWidth: 280, flex: "0 1 340px" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.45 }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Şöbə axtar..."
                className="ac-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
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
                    <div style={{ width: 54, height: 54, background: "var(--primary-light)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={DEPT_ICONS[dept.name] || "M22 12h-4l-3 9L9 3l-3 9H2"} />
                      </svg>
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

                <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <span style={{ color: "var(--text-light)", fontSize: "0.8rem", fontWeight: 600 }}>NovaCare Hospital</span>
                  <Link
                    to={`/doctors?department=${dept.id}`}
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
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: 8 }}>Şöbə Tapılmadı</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>Axtarışınıza uyğun heç bir tibbi şöbə tapılmadı.</p>
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