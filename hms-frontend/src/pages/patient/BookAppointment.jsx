import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
export default function BookAppointment() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/departments").then((r) => setDepartments(r.data.data));
    api.get("/doctors").then((r) => setDoctors(r.data.data));
  }, []);

  const filteredDoctors = selectedDept ? doctors.filter((d) => d.department?.id === Number(selectedDept)) : doctors;

  useEffect(() => {
    if (!selectedDoctor || !date) return;
    let cancelled = false;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot("");
      try {
        const res = await api.get(`/doctors/${selectedDoctor}/slots?date=${date}`);
        if (!cancelled) setSlots(res.data.slots);
      } catch {
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };
    fetchSlots();
    return () => { cancelled = true; };
  }, [selectedDoctor, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/appointments", { doctor_id: selectedDoctor, appointment_date: date, appointment_time: selectedSlot, reason });
      setMessage(" Randevu uğurla alındı! Həkim təsdiqini gözləyin.");
      setTimeout(() => navigate("/patient/appointments"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta baş verdi.";
      setMessage(` ${msg}`);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px 80px", width: "100%", flex: 1, boxSizing: "border-box" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <Link to="/patient" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--primary)", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            ← Pasiyent Kabinetinə Qayıt
          </Link>
        </div>

        {/* Title Card */}
        <div className="ac-card" style={{ padding: "32px 36px", marginBottom: 28, background: "linear-gradient(135deg, #7F1D1D 0%, #B71C1C 100%)", color: "#FFFFFF" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-0.5px" }}>Həkim Qəbuluna Yazılın</h1>
          <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.85)", margin: 0 }}>
            İstədiyiniz tibbi şöbə və mütəxəssisi seçərək uyğun iş saatına onlayn randevu təyin edin.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="ac-card" style={{ padding: "36px 32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Step 1: Department */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                1. Tibbi Şöbə Seçin
              </label>
              <select
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setSelectedDoctor(""); }}
                className="ac-input"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, fontWeight: 700 }}
              >
                <option value="">Bütün şöbələr</option>
                {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
              </select>
            </div>

            {/* Step 2: Doctor */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                2. Həkim Seçin *
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
                className="ac-input"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, fontWeight: 700 }}
              >
                <option value="">Həkim seçin...</option>
                {filteredDoctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization} ({d.consultation_fee} ₼)
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Date */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                3. Randevu Tarixi *
              </label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                required
                className="ac-input"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, fontWeight: 700 }}
              />
            </div>

            {/* Step 4: Time Slot */}
            {selectedDoctor && date && (
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                  4. Uyğun İş Saatı Seçin *
                </label>
                {loadingSlots ? (
                  <p style={{ color: "var(--text-light)", fontSize: "0.88rem", fontWeight: 700 }}>
                    İş saatları yüklənir...
                  </p>
                ) : slots.length === 0 ? (
                  <div style={{ padding: "16px", borderRadius: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#d97706", fontSize: "0.85rem", fontWeight: 700 }}>
                    Bu həkimin seçilmiş tarixdə iş saatı yoxdur. Başqa tarix və ya həkim seçin.
                  </div>
                ) : (
                  <div className="responsive-2x2-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
                    {slots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: "12px",
                            borderRadius: 12,
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                            background: isSelected ? "var(--primary)" : "var(--bg)",
                            color: isSelected ? "#FFFFFF" : "var(--text-dark)",
                            boxShadow: isSelected ? "0 4px 12px rgba(198,40,40,0.3)" : "none",
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Complaint / Reason */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                5. Şikayətiniz və Qeydləriniz (istəyə bağlı)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Məsələn: Ürək nahiyəsində ağrılar və təngnəfəslik var..."
                className="ac-input"
                rows={3}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, fontWeight: 600, resize: "vertical" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedSlot}
              className="ac-btn"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 12,
                fontSize: "0.95rem",
                fontWeight: 900,
                letterSpacing: "0.5px",
                marginTop: 8,
              }}
            >
              {selectedSlot ? `RANDEVU AL — ${date} ${selectedSlot}` : "LÜTFƏN SAAT SEÇİN"}
            </button>

            {message && (
              <p
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  textAlign: "center",
                  background: message.startsWith("") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  color: message.startsWith("") ? "#059669" : "#dc2626",
                  border: message.startsWith("") ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
                }}
              >
                {message}
              </p>
            )}

          </form>
        </div>

      </main>
    </>
  );
}
