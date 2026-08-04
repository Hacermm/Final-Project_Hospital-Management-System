import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";
export default function WriteMedicalRecord() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState([{ medicine: "", dosage: "", duration: "", instructions: "" }]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/appointments").then((r) => { setAppointments(r.data.data.filter((a) => a.status === "confirmed")); });
  }, []);

  const addPrescription = () => { setPrescriptions([...prescriptions, { medicine: "", dosage: "", duration: "", instructions: "" }]); };
  const removePrescription = (index) => { setPrescriptions(prescriptions.filter((_, i) => i !== index)); };
  const updatePrescription = (index, field, value) => { const updated = [...prescriptions]; updated[index][field] = value; setPrescriptions(updated); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage("");
    const validPrescriptions = prescriptions.filter((p) => p.medicine.trim());
    try {
      await api.post("/medical-records", { appointment_id: selectedAppt, diagnosis, notes, prescriptions: validPrescriptions });
      setMessage(" Tibbi qeyd yaradıldı! Randevu tamamlandı.");
      setTimeout(() => navigate("/doctor/appointments"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta";
      setMessage(` ${msg}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", transition: "background-color 0.3s ease" }}> <Navbar />
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", transition: "background-color 0.3s ease" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/doctor/appointments" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="text-lg font-bold text-white">Tibbi Qeyd Yaz</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 animate-fade-in-up">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Randevu seçin (təsdiqlənmiş)</label>
            <select value={selectedAppt} onChange={(e) => setSelectedAppt(e.target.value)} required className="hms-select">
              <option value="">Randevu seçin...</option>
              {appointments.map((a) => (<option key={a.id} value={a.id}>{a.patient?.name} — {a.date} {a.time}</option>))}
            </select>
            {appointments.length === 0 && <p className="text-sm text-amber-400 mt-1">Təsdiqlənmiş randevu yoxdur.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Diaqnoz</label>
            <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required placeholder="Məsələn: Yüksək qan təzyiqi" className="hms-input" rows="2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Əlavə qeydlər (istəyə bağlı)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tövsiyələr, müşahidələr..." className="hms-input" rows="2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-slate-400">Reseptlər</label>
              <button type="button" onClick={addPrescription} className="text-indigo-400 text-sm hover:text-indigo-300 font-medium">+ Dərman əlavə et</button>
            </div>
            {prescriptions.map((p, i) => (
              <div key={i} className="glass-card-light p-4 mb-3">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Dərman adı" value={p.medicine} onChange={(e) => updatePrescription(i, "medicine", e.target.value)} className="hms-input" />
                  <input placeholder="Doza (məs. 100mg)" value={p.dosage} onChange={(e) => updatePrescription(i, "dosage", e.target.value)} className="hms-input" />
                  <input placeholder="Müddət (məs. 7 gün)" value={p.duration} onChange={(e) => updatePrescription(i, "duration", e.target.value)} className="hms-input" />
                  <input placeholder="Təlimat (məs. gündə 1 dəfə)" value={p.instructions} onChange={(e) => updatePrescription(i, "instructions", e.target.value)} className="hms-input" />
                </div>
                {prescriptions.length > 1 && <button type="button" onClick={() => removePrescription(i)} className="text-red-400 text-sm mt-2 hover:text-red-300">Sil</button>}
              </div>
            ))}
          </div>

          <button type="submit" className="hms-btn w-full !py-3">Qeydi yadda saxla və randevunu tamamla</button>
          {message && <p className={`text-center text-sm font-medium ${message.startsWith("") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
