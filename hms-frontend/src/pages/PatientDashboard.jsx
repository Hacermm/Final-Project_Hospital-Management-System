import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("future");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    Promise.all([
      api.get("/me").catch(() => ({ data: { user: null } })),
      api.get("/appointments").catch(() => ({ data: { data: [] } })),
      api.get("/lab-tests").catch(() => ({ data: { data: [] } })),
      api.get("/medical-records").catch(() => ({ data: { data: [] } })),
    ])
      .then(([meRes, appRes, labRes, medRes]) => {
        setUser(meRes.data.user || meRes.data || null);
        setAppointments(appRes.data.data || []);
        setLabTests(labRes.data.data || []);
        setMedicalRecords(medRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const futureAppointments = appointments.filter(a => a.date >= todayStr && a.status !== "cancelled");
  const pastAppointments = appointments.filter(a => a.date < todayStr || a.status === "completed" || a.status === "cancelled");

  const statusStyles = {
    pending: { bg: "rgba(245, 158, 11, 0.12)", color: "#d97706", border: "1px solid rgba(245, 158, 11, 0.3)" },
    confirmed: { bg: "rgba(16, 185, 129, 0.12)", color: "#059669", border: "1px solid rgba(16, 185, 129, 0.3)" },
    completed: { bg: "rgba(59, 130, 246, 0.12)", color: "#2563eb", border: "1px solid rgba(59, 130, 246, 0.3)" },
    cancelled: { bg: "rgba(239, 68, 68, 0.12)", color: "#dc2626", border: "1px solid rgba(239, 68, 68, 0.3)" },
  };
  const statusLabels = { pending: "Gözləyir", confirmed: "Təsdiqlənib", completed: "Tamamlanıb", cancelled: "Ləğv edilib" };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg)",
        color: "var(--text-dark)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: "background 0.3s ease",
      }}
    >
      {/* ═ ═ ═ ═ ═ ═ ═ LEFT SIDEBAR ═ ═ ═ ═ ═ ═ ═ */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: "linear-gradient(180deg, #7F1D1D 0%, #991B1B 45%, #B71C1C 100%)",
          color: "#FFFFFF",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          justify: "space-between",
          borderRight: "1px solid rgba(255,255,255,0.12)",
          boxSizing: "border-box",
        }}
      >
        <div>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, textDecoration: "none" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7F1D1D" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.5px", display: "block" }}>NovaCare</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#FFCDD2", letterSpacing: "1px", textTransform: "uppercase", display: "block" }}>Patient Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { to: "/patient", label: "Pasiyent Portalı", icon: "📊", active: true },
              { to: "/patient/book", label: "Randevu Al", icon: "📅" },
              { to: "/patient/appointments", label: "Randevularım", icon: "📋" },
              { to: "/patient/history", label: "Tibbi Tarixçəm", icon: "🩺" },
              { to: "/patient/lab-tests", label: "Lab Nəticələri", icon: "🧪" },
              { to: "/chat", label: "Mesajlar", icon: "💬" },
              { to: "/ai", label: "AI Tibbi Assistent", icon: "🤖" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  background: item.active ? "#FFFFFF" : "transparent",
                  color: item.active ? "#7F1D1D" : "rgba(255,255,255,0.85)",
                  boxShadow: item.active ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Support Card */}
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>🩺</div>
          <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 4 }}>24/7 Tibbi Dəstək</h4>
          <p style={{ fontSize: "0.72rem", color: "#FFCDD2", lineHeight: 1.5, marginBottom: 12 }}>Suallarınız olduqda AI Assistent və ya həkimlərinizlə dərhal əlaqə saxlayın.</p>
          <Link
            to="/ai"
            style={{
              display: "block",
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              background: "#FFFFFF",
              color: "#7F1D1D",
              fontWeight: 800,
              fontSize: "0.76rem",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
            }}
          >
            AI MƏSLƏHƏT AL
          </Link>
        </div>
      </aside>

      {/* ═ ═ ═ ═ ═ ═ ═ MAIN CONTENT AREA ═ ═ ═ ═ ═ ═ ═ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        
        {/* Top Header Ribbon */}
        <header
          style={{
            height: 72,
            padding: "0 32px",
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-dark)", letterSpacing: "-0.3px", margin: 0 }}>
            Pasiyent Profili (Patient Profile)
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={toggleTheme} className="ac-theme-toggle" title={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}>
              {theme === "dark" ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <Link
              to="/patient/book"
              className="ac-btn"
              style={{
                padding: "10px 20px",
                fontSize: "0.85rem",
                fontWeight: 800,
                whiteSpace: "nowrap",
                textDecoration: "none",
                borderRadius: 10,
              }}
            >
              + RAND EVU AL
            </Link>

            <button
              onClick={logout}
              style={{
                padding: "9px 16px",
                borderRadius: 10,
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#dc2626",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              🚪 Çıxış
            </button>
          </div>
        </header>

        {/* Dashboard Main Scrollable Area */}
        <main style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 32, flex: 1, boxSizing: "border-box" }}>
          
          {/* TOP 3 CARDS GRID (Matching screenshot) */}
          <div className="responsive-dash-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            
            {/* CARD 1: Patient Avatar & Contact */}
            <div
              className="ac-card"
              style={{
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justify: "space-between",
                minHeight: 240,
                boxSizing: "border-box",
              }}
            >
              <div style={{ position: "relative", marginBottom: 12 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "var(--primary-light)",
                    border: "3px solid var(--secondary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.4rem",
                    overflow: "hidden",
                  }}
                >
                  {user?.photo_url ? (
                    <img src={user.photo_url} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <span style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#10b981", border: "2px solid var(--surface)" }} title="Aktiv pasiyent" />
              </div>

              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 4 }}>
                  {user?.name || "Pasiyent Məmmədova"}
                </h3>
                <p style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--primary)", marginBottom: 2 }}>
                  {user?.phone || "+994 (50) 123 45 67"}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>
                  {user?.email || "patient@novacare.az"}
                </p>
              </div>

              <div style={{ width: "100%", paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "center", gap: 10, marginTop: 12 }}>
                <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 800, background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--secondary-light)" }}>
                  ID: #PAS-{user?.id || "1024"}
                </span>
                <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 800, background: "rgba(16,185,129,0.1)", color: "#059669", border: "1px solid rgba(16,185,129,0.3)" }}>
                  Sığortalı
                </span>
              </div>
            </div>

            {/* CARD 2: General Information */}
            <div
              className="ac-card"
              style={{
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                minHeight: 240,
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 16 }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-dark)", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                  <span>📋</span> Ümumi Məlumatlar
                </h4>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", cursor: "pointer" }}>Düzəliş Et</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Doğum Tarixi:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>15.08.1992</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Ünvan:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>Bakı ş., Nərimanov r.</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Qeydiyyat Tarixi:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>2024-01-10</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Cins:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>Qadın / Kişi</span>
                </div>
              </div>

              <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-light)", marginTop: 12 }}>
                <span>Son yenilənmə: Bu gün</span>
                <span style={{ color: "#059669", fontWeight: 800 }}>✓ Təsdiqlənib</span>
              </div>
            </div>

            {/* CARD 3: Anamnesis & Health Summary */}
            <div
              className="ac-card"
              style={{
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                minHeight: 240,
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 16 }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-dark)", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                  <span>🩺</span> Anamnez Və Sağlamlıq
                </h4>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", cursor: "pointer" }}>Təfərrüat</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Allergiyalar:</span>
                  <span style={{ fontWeight: 800, color: "#d97706" }}>Penisilin, Toz</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Xroniki Xəstəliklər:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>Yoxdur</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Qan Qrupu:</span>
                  <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 900, background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--secondary-light)" }}>
                    A(II) Rh+
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Keçirilmiş Xəstəliklər:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>Bronxit (2023)</span>
                </div>
              </div>

              <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-light)", marginTop: 12 }}>
                <span>Tibbi Kart statusu:</span>
                <span style={{ color: "var(--primary)", fontWeight: 900 }}>Aktiv</span>
              </div>
            </div>

          </div>

          {/* BOTTOM MAIN SECTION: 2 COLUMNS (Appointments on Left, Files/Notes on Right) */}
          <div className="responsive-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 28, alignItems: "start" }}>
            
            {/* LEFT COLUMN: Appointments Tabs & Items */}
            <div className="ac-card" style={{ padding: "32px 28px" }}>
              
              {/* Tab Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setActiveTab("future")}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 12,
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: activeTab === "future" ? "none" : "1px solid var(--border)",
                      background: activeTab === "future" ? "var(--primary)" : "var(--bg)",
                      color: activeTab === "future" ? "#FFFFFF" : "var(--text-mid)",
                      boxShadow: activeTab === "future" ? "0 4px 12px rgba(198,40,40,0.3)" : "none",
                    }}
                  >
                    Gələcək Qəbullar ({futureAppointments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 12,
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: activeTab === "past" ? "none" : "1px solid var(--border)",
                      background: activeTab === "past" ? "var(--primary)" : "var(--bg)",
                      color: activeTab === "past" ? "#FFFFFF" : "var(--text-mid)",
                      boxShadow: activeTab === "past" ? "0 4px 12px rgba(198,40,40,0.3)" : "none",
                    }}
                  >
                    Keçmiş Qəbullar ({pastAppointments.length})
                  </button>
                </div>

                <Link to="/patient/book" style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
                  + Yeni Randevu
                </Link>
              </div>

              {/* Appointment List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {loading && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-light)", fontWeight: 700, fontSize: "0.88rem" }} className="animate-pulse">
                    Randevular yüklənir...
                  </div>
                )}

                {!loading && activeTab === "future" && futureAppointments.length === 0 && (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>📅</div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-light)", marginBottom: 16 }}>
                      Gələcək planlaşdırılmış randevunuz yoxdur.
                    </p>
                    <Link to="/patient/book" className="ac-btn" style={{ padding: "10px 24px", fontSize: "0.84rem", textDecoration: "none" }}>
                      Həkim Qəbuluna Yazılın
                    </Link>
                  </div>
                )}

                {!loading && activeTab === "past" && pastAppointments.length === 0 && (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>📋</div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-light)" }}>
                      Keçmiş randevu tarixçəsi tapılmadı.
                    </p>
                  </div>
                )}

                {(activeTab === "future" ? futureAppointments : pastAppointments).map((app) => {
                  const style = statusStyles[app.status] || statusStyles.pending;
                  return (
                    <div
                      key={app.id}
                      style={{
                        padding: "16px 20px",
                        borderRadius: 16,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 14,
                            background: "var(--primary-light)",
                            border: "1px solid var(--secondary-light)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            shrink: 0,
                          }}
                        >
                          <span style={{ fontSize: "0.82rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1 }}>
                            {app.date?.split("-")[2] || "15"}
                          </span>
                          <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "var(--text-light)", textTransform: "uppercase", marginTop: 2 }}>
                            {app.date?.split("-")[1] || "AVQ"}
                          </span>
                        </div>

                        <div>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-dark)", margin: "0 0 2px 0" }}>
                            {app.doctor?.name || "Dr. Həkim Məmmədov"}
                          </h4>
                          <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)", margin: "0 0 4px 0" }}>
                            {app.doctor?.specialization || "Kardiologiya / Poliklinika"}
                          </p>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                            🕐 {app.time || "10:00"} — {app.reason || "Müayinə"}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 800, background: style.bg, color: style.color, border: style.border }}>
                          {statusLabels[app.status] || app.status}
                        </span>
                        <Link to="/chat" style={{ padding: "8px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", fontSize: "0.9rem", textDecoration: "none" }} title="Həkimlə Mesajlaş">
                          💬
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Lab Files & Doctor Notes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              
              {/* Lab Files Card */}
              <div className="ac-card" style={{ padding: "28px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 18 }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-dark)", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                    <span>🧪</span> Lab Analizləri & Sənədlər
                  </h4>
                  <Link to="/patient/lab-tests" style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
                    Bütün PDF-lər
                  </Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { name: "Qanın_Ümumi_Analizi.pdf", date: "2026-07-28" },
                    { name: "Kardiologiya_EKQ_Nəticə.pdf", date: "2026-07-20" },
                    { name: "Həkim_Resepti_v2.pdf", date: "2026-07-15" },
                  ].map((file, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                        <span style={{ fontSize: "1.2rem", color: "var(--primary)" }}>📄</span>
                        <div style={{ overflow: "hidden" }}>
                          <p style={{ fontWeight: 800, color: "var(--text-dark)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {file.name}
                          </p>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>{file.date}</span>
                        </div>
                      </div>
                      <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 900, background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--secondary-light)" }}>
                        PDF
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Notes Card */}
              <div className="ac-card" style={{ padding: "28px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 18 }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-dark)", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                    <span>📝</span> Həkim Təyinatları Və Qeydlər
                  </h4>
                  <Link to="/patient/history" style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
                    Ətraflı
                  </Link>
                </div>

                <div style={{ padding: "14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)", fontSize: "0.82rem" }}>
                  <p style={{ fontWeight: 800, color: "var(--text-dark)", marginBottom: 4, margin: "0 0 4px 0" }}>
                    Profilaktik Tibbi Müayinə
                  </p>
                  <p style={{ color: "var(--text-light)", fontSize: "0.78rem", lineHeight: 1.5, margin: 0 }}>
                    Növbəti check-up müayinəsi üçün kardioloq qəbuluna yazılmağınız tövsiyə olunur.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}