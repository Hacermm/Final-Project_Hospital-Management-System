import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("future");
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

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

  const handleEditClick = () => {
    setEditForm({
      name: user?.name || "",
      phone: user?.patient?.phone || "",
      date_of_birth: user?.patient?.date_of_birth ? user.patient.date_of_birth.split("T")[0] : "",
      gender: user?.patient?.gender || "",
      blood_group: user?.patient?.blood_group || "",
      address: user?.patient?.address || "",
      allergies: user?.patient?.allergies || "",
      chronic_diseases: user?.patient?.chronic_diseases || "",
      past_diseases: user?.patient?.past_diseases || "",
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/profile", editForm);
      setUser(res.data.user);
      setShowEditModal(false);
    } catch (error) {
      alert("Xəta baş verdi: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

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
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Yüklənir...</p>
      </div>
    );
  }

  return (
    <>
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
                    <span></span>
                  )}
                </div>
                <span style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#10b981", border: "2px solid var(--surface)" }} title="Aktiv pasiyent" />
              </div>

              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 4 }}>
                  {user?.name || "Qeyd olunmayıb"}
                </h3>
                <p style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--primary)", marginBottom: 2 }}>
                  {user?.patient?.phone || user?.phone || "Qeyd olunmayıb"}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>
                  {user?.email || "Qeyd olunmayıb"}
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
                  <span></span> Ümumi Məlumatlar
                </h4>
                <span onClick={handleEditClick} style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", cursor: "pointer" }}>Düzəliş Et</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Doğum Tarixi:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>{user?.patient?.date_of_birth ? user.patient.date_of_birth.split("T")[0] : "Qeyd olunmayıb"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Ünvan:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>{user?.patient?.address || "Qeyd olunmayıb"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Qeydiyyat Tarixi:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>
                    {user?.created_at ? String(user.created_at).split("T")[0].split(" ")[0] : "Qeyd olunmayıb"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Cins:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>
                    {user?.patient?.gender === 'male' ? 'Kişi' : user?.patient?.gender === 'female' ? 'Qadın' : user?.patient?.gender === 'other' ? 'Digər' : 'Qeyd olunmayıb'}
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-light)", marginTop: 12 }}>
                <span>Son yenilənmə: Bu gün</span>
                <span style={{ color: "#059669", fontWeight: 800 }}> Təsdiqlənib</span>
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
                  <span></span> Anamnez Və Sağlamlıq
                </h4>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", cursor: "pointer" }}>Təfərrüat</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Allergiyalar:</span>
                  <span style={{ fontWeight: 800, color: user?.patient?.allergies ? "#d97706" : "var(--text-dark)" }}>
                    {user?.patient?.allergies || "Qeyd olunmayıb"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Xroniki Xəstəliklər:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>
                    {user?.patient?.chronic_diseases || "Qeyd olunmayıb"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Qan Qrupu:</span>
                  <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 900, background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--secondary-light)" }}>
                    {user?.patient?.blood_group || "Qeyd olunmayıb"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 600 }}>Keçirilmiş Xəstəliklər:</span>
                  <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>
                    {user?.patient?.past_diseases || "Qeyd olunmayıb"}
                  </span>
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
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}></div>
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
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}></div>
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
                             {app.time || "10:00"} — {app.reason || "Müayinə"}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 800, background: style.bg, color: style.color, border: style.border }}>
                          {statusLabels[app.status] || app.status}
                        </span>
                        <Link to="/chat" style={{ padding: "8px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", fontSize: "0.9rem", textDecoration: "none" }} title="Həkimlə Mesajlaş">
                          
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
                    <span></span> Lab Analizləri & Sənədlər
                  </h4>
                  <Link to="/patient/lab-tests" style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
                    Bütün PDF-lər
                  </Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {labTests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "16px", color: "var(--text-light)", fontSize: "0.85rem" }}>
                      Heç bir analiz nəticəsi tapılmadı.
                    </div>
                  ) : (
                    labTests.slice(0, 3).map((test) => (
                      <div
                        key={test.id}
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
                          <span style={{ fontSize: "1.2rem", color: "var(--primary)" }}></span>
                          <div style={{ overflow: "hidden" }}>
                            <p style={{ fontWeight: 800, color: "var(--text-dark)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {test.title || "Analiz Nəticəsi"}
                            </p>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>
                              {test.date || "Tarix yoxdur"}
                            </span>
                          </div>
                        </div>
                        {test.file_path && (
                          <a href={test.file_url || "#"} target="_blank" rel="noreferrer" style={{ padding: "3px 8px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 900, background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--secondary-light)", textDecoration: "none" }}>
                            PDF
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Doctor Notes Card */}
              <div className="ac-card" style={{ padding: "28px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 18 }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-dark)", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                    <span></span> Həkim Təyinatları Və Qeydlər
                  </h4>
                  <Link to="/patient/history" style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
                    Ətraflı
                  </Link>
                </div>

                {medicalRecords.length === 0 ? (
                  <div style={{ padding: "14px", borderRadius: 12, border: "1px dashed var(--border)", background: "transparent", fontSize: "0.82rem", textAlign: "center", color: "var(--text-light)" }}>
                    Hələ heç bir həkim qeydi yoxdur.
                  </div>
                ) : (
                  <div style={{ padding: "14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)", fontSize: "0.82rem" }}>
                    <p style={{ fontWeight: 800, color: "var(--text-dark)", marginBottom: 4, margin: "0 0 4px 0" }}>
                      {medicalRecords[0].doctor?.name || "Həkim"} - {medicalRecords[0].diagnosis}
                    </p>
                    <p style={{ color: "var(--text-light)", fontSize: "0.78rem", lineHeight: 1.5, margin: 0 }}>
                      {medicalRecords[0].treatment}
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </main>

        {showEditModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div className="ac-card" style={{ padding: "24px", width: "90%", maxWidth: 500, background: "var(--bg)", borderRadius: 16, maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ marginTop: 0, marginBottom: 16, color: "var(--text-dark)" }}>Profildə Düzəliş Et</h3>
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Ad Soyad</label>
                  <input required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Telefon</label>
                  <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Doğum Tarixi</label>
                  <input type="date" value={editForm.date_of_birth} onChange={e => setEditForm({...editForm, date_of_birth: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Cins</label>
                  <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }}>
                    <option value="">Seçin...</option>
                    <option value="male">Kişi</option>
                    <option value="female">Qadın</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Qan Qrupu</label>
                  <input value={editForm.blood_group} onChange={e => setEditForm({...editForm, blood_group: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Ünvan</label>
                  <input value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                
                <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "8px 0" }} />
                
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Allergiyalar (Məs: Penisilin, Toz)</label>
                  <input value={editForm.allergies} onChange={e => setEditForm({...editForm, allergies: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Xroniki Xəstəliklər</label>
                  <input value={editForm.chronic_diseases} onChange={e => setEditForm({...editForm, chronic_diseases: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Keçirilmiş Xəstəliklər</label>
                  <input value={editForm.past_diseases} onChange={e => setEditForm({...editForm, past_diseases: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dark)", boxSizing: "border-box" }} />
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                  <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-dark)", cursor: "pointer" }}>Ləğv et</button>
                  <button type="submit" disabled={saving} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontWeight: "bold", cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saxlanılır..." : "Yadda Saxla"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  );
}