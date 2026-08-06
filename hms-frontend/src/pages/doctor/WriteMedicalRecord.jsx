import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

const emptyPrescription = { medicine: "", dosage: "", duration: "", instructions: "" };

export default function WriteMedicalRecord() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState([{ ...emptyPrescription }]);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/appointments")
      .then((r) => setAppointments((r.data.data || []).filter((a) => a.status === "confirmed")))
      .catch(() => {});
  }, []);

  const notify = (text, ok = true) => setToast({ text, ok });

  const addPrescription = () => setPrescriptions([...prescriptions, { ...emptyPrescription }]);
  const removePrescription = (i) => setPrescriptions(prescriptions.filter((_, idx) => idx !== i));
  const updatePrescription = (i, field, value) => {
    const updated = [...prescriptions];
    updated[i][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setSaving(true);

    const valid = prescriptions.filter((p) => p.medicine.trim());

    try {
      await api.post("/medical-records", {
        appointment_id: selectedAppt,
        diagnosis,
        notes,
        prescriptions: valid,
      });
      notify("Tibbi qeyd yaradıldı. Randevu tamamlandı olaraq işarələndi.", true);
      setTimeout(() => navigate("/doctor/appointments"), 1600);
    } catch (err) {
      const msg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Qeyd yaradıla bilmədi";
      notify(msg, false);
      setSaving(false);
    }
  };

  const selected = appointments.find((a) => String(a.id) === String(selectedAppt));

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 12,
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-dark)", fontSize: "0.88rem", outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block", fontSize: "0.75rem", fontWeight: 800,
    color: "var(--text-dark)", marginBottom: 6,
    textTransform: "uppercase", letterSpacing: "0.4px",
  };

  return (
    <>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
          }}>
            TİBBİ SƏNƏDLƏŞMƏ
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
            Tibbi Qeyd Yaz
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 560 }}>
            Diaqnoz və reseptlər pasiyentin tibbi tarixçəsinə əlavə olunur və PDF kimi yüklənə bilir.
          </p>
        </div>

        {toast && (
          <div style={{
            marginBottom: 20, padding: "13px 18px", borderRadius: 12,
            fontSize: "0.87rem", fontWeight: 700,
            background: toast.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${toast.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: toast.ok ? "#047857" : "#B91C1C",
          }}>
            {toast.ok ? "✓" : "✕"} {toast.text}
          </div>
        )}

        {appointments.length === 0 ? (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "60px 30px", textAlign: "center"
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" style={{ opacity: 0.5, marginBottom: 14 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />
            </svg>
            <p style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 6px" }}>Təsdiqlənmiş randevu yoxdur</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", margin: "0 0 20px" }}>
              Qeyd yazmaq üçün əvvəlcə randevunu təsdiqləməlisiniz.
            </p>
            <button
              onClick={() => navigate("/doctor/appointments")}
              style={{
                padding: "11px 24px", borderRadius: 12, border: "none",
                background: "var(--primary)", color: "#FFFFFF",
                fontSize: "0.86rem", fontWeight: 800, cursor: "pointer",
              }}
            >
              Randevulara keç
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* 1 — Randevu */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 8, background: "var(--primary)",
                  color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>1</span>
                <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Randevu seçin</h2>
              </div>

              <select
                value={selectedAppt}
                onChange={(e) => setSelectedAppt(e.target.value)}
                required
                style={{ ...inputStyle, fontWeight: 700, cursor: "pointer" }}
              >
                <option value="">Təsdiqlənmiş randevu seçin...</option>
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.patient?.name} — {a.date} {a.time}
                  </option>
                ))}
              </select>

              {selected && (
                <div style={{
                  marginTop: 14, padding: "14px 18px", borderRadius: 14,
                  background: "var(--primary-light)", border: "1px solid var(--secondary-light)",
                  display: "flex", alignItems: "center", gap: 14
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
                    color: "#FFFFFF", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "0.9rem", fontWeight: 900
                  }}>
                    {selected.patient?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.92rem", fontWeight: 800, margin: 0, color: "var(--text-dark)" }}>
                      {selected.patient?.name}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-mid)", margin: "3px 0 0" }}>
                      {selected.date} · {selected.time}
                      {selected.reason && ` · “${selected.reason}”`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2 — Diaqnoz */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 8, background: "var(--primary)",
                  color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>2</span>
                <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Diaqnoz və qeydlər</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Diaqnoz *</label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                    rows="2"
                    placeholder="Məsələn: Arterial hipertoniya (I dərəcə)"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Əlavə qeydlər</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                    placeholder="Tövsiyələr, müşahidələr, növbəti müayinə tarixi..."
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>
            </div>

            {/* 3 — Reseptlər */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: 8, background: "var(--primary)",
                    color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>3</span>
                  <h2 style={{ fontSize: "1rem", fontWeight: 900, margin: 0 }}>Reseptlər</h2>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>(istəyə bağlı)</span>
                </div>

                <button
                  type="button"
                  onClick={addPrescription}
                  style={{
                    padding: "7px 15px", borderRadius: 10,
                    border: "1px dashed var(--primary)", background: "var(--primary-light)",
                    color: "var(--primary)", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
                  }}
                >
                  + Dərman əlavə et
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {prescriptions.map((p, i) => (
                  <div key={i} style={{
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: 14, padding: 16
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)" }}>
                        💊 Dərman {i + 1}
                      </span>
                      {prescriptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePrescription(i)}
                          style={{
                            background: "none", border: "none", color: "#B91C1C",
                            fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", padding: 0,
                          }}
                        >
                          Sil
                        </button>
                      )}
                    </div>

                    <div className="presc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input placeholder="Dərman adı" value={p.medicine} onChange={(e) => updatePrescription(i, "medicine", e.target.value)} style={inputStyle} />
                      <input placeholder="Doza (100 mg)" value={p.dosage} onChange={(e) => updatePrescription(i, "dosage", e.target.value)} style={inputStyle} />
                      <input placeholder="Müddət (7 gün)" value={p.duration} onChange={(e) => updatePrescription(i, "duration", e.target.value)} style={inputStyle} />
                      <input placeholder="Təlimat (gündə 1 dəfə)" value={p.instructions} onChange={(e) => updatePrescription(i, "instructions", e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: "14px 0 0", lineHeight: 1.5 }}>
                ⓘ Yalnız dərman adı doldurulmuş sətirlər yadda saxlanılır.
              </p>
            </div>

            {/* Göndər */}
            <button
              type="submit"
              disabled={saving || !selectedAppt}
              style={{
                width: "100%", padding: "15px", borderRadius: 14, border: "none",
                background: saving || !selectedAppt
                  ? "var(--border)"
                  : "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
                color: "#FFFFFF", fontSize: "0.94rem", fontWeight: 800,
                cursor: saving || !selectedAppt ? "default" : "pointer",
                boxShadow: saving || !selectedAppt ? "none" : "0 8px 24px rgba(198,40,40,0.25)",
              }}
            >
              {saving ? "Yadda saxlanılır..." : "Qeydi yadda saxla və randevunu tamamla"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
