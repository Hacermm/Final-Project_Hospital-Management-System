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
      setLoadingSlots(true); setSelectedSlot("");
      try { const res = await api.get(`/doctors/${selectedDoctor}/slots?date=${date}`); if (!cancelled) setSlots(res.data.slots); }
      catch { if (!cancelled) setSlots([]); }
      finally { if (!cancelled) setLoadingSlots(false); }
    };
    fetchSlots();
    return () => { cancelled = true; };
  }, [selectedDoctor, date]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage("");
    try {
      await api.post("/appointments", { doctor_id: selectedDoctor, appointment_date: date, appointment_time: selectedSlot, reason });
      setMessage("✅ Randevu uğurla alındı! Həkim təsdiqini gözləyin.");
      setTimeout(() => navigate("/patient/appointments"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta baş verdi.";
      setMessage(`❌ ${msg}`);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/patient" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="text-lg font-bold text-white">Randevu Al</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 animate-fade-in-up">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">1. Şöbə seçin</label>
            <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedDoctor(""); }} className="hms-select">
              <option value="">Bütün şöbələr</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">2. Həkim seçin</label>
            <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required className="hms-select">
              <option value="">Həkim seçin...</option>
              {filteredDoctors.map((d) => (<option key={d.id} value={d.id}>{d.name} — {d.specialization} ({d.consultation_fee} ₼)</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">3. Tarix seçin</label>
            <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} required className="hms-input" />
          </div>

          {selectedDoctor && date && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">4. Boş saat seçin</label>
              {loadingSlots ? (
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/></svg>
                  Yüklənir...
                </p>
              ) : slots.length === 0 ? (
                <div className="glass-card-light p-4 text-amber-400 text-sm">
                  Bu həkimin seçilmiş tarixdə iş saatı yoxdur. Başqa tarix və ya həkim seçin.
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {slots.map((slot) => (
                    <button key={slot} type="button" onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl text-sm font-medium border ${
                        selectedSlot === slot
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          : "bg-transparent text-slate-400 border-white/10 hover:border-indigo-500/20 hover:text-indigo-400"
                      }`}>
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">5. Şikayətiniz (istəyə bağlı)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Məsələn: Ürəyimdə ağrı var..." className="hms-input" rows="2" />
          </div>

          <button type="submit" disabled={!selectedSlot} className="hms-btn w-full !py-3">
            {selectedSlot ? `Randevu al — ${date} ${selectedSlot}` : "Saat seçin"}
          </button>

          {message && <p className={`text-center text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
}