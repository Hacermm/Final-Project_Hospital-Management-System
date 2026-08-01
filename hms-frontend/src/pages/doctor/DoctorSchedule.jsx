import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";
const days = [
  { value: "monday", label: "Bazar ertəsi" }, { value: "tuesday", label: "Çərşənbə axşamı" },
  { value: "wednesday", label: "Çərşənbə" }, { value: "thursday", label: "Cümə axşamı" },
  { value: "friday", label: "Cümə" }, { value: "saturday", label: "Şənbə" }, { value: "sunday", label: "Bazar" },
];

export default function DoctorSchedule() {
  const [doctorId, setDoctorId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ day_of_week: "monday", start_time: "09:00", end_time: "17:00" });
  const [message, setMessage] = useState("");

  const loadSchedules = (id) => { api.get(`/doctors/${id}/schedules`).then((r) => setSchedules(r.data.data)); };

  useEffect(() => {
    api.get("/me").then((r) => { const id = r.data.user?.doctor?.id; if (id) { setDoctorId(id); loadSchedules(id); } });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage("");
    try { await api.post(`/doctors/${doctorId}/schedules`, { ...form, is_available: true }); setMessage("✅ Qrafik əlavə olundu"); loadSchedules(doctorId); }
    catch (err) { const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta"; setMessage(`❌ ${msg}`); }
  };

  const remove = async (id) => {
    if (!confirm("Bu qrafiki silmək istəyirsiniz?")) return;
    try { await api.delete(`/schedules/${id}`); setMessage("✅ Qrafik silindi"); loadSchedules(doctorId); }
    catch (err) { setMessage(`❌ ${err.response?.data?.message || "Xəta"}`); }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", transition: "background-color 0.3s ease" }}>      <Navbar />
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", transition: "background-color 0.3s ease" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/doctor/appointments" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <h1 className="text-lg font-bold text-white">İş Qrafikim</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 animate-fade-in-up">
          <h2 className="font-semibold text-white mb-4">Yeni iş günü əlavə et</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select name="day_of_week" value={form.day_of_week} onChange={handleChange} className="hms-select">
              {days.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <input name="start_time" type="time" value={form.start_time} onChange={handleChange} className="hms-input" />
            <input name="end_time" type="time" value={form.end_time} onChange={handleChange} className="hms-input" />
          </div>
          <button type="submit" className="hms-btn mt-4">Əlavə et</button>
        </form>

        {message && <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}

        <div className="glass-card overflow-hidden animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          {schedules.map((s) => (
            <div key={s.id} className="flex justify-between items-center px-6 py-4 border-b border-white/5 last:border-0">
              <div>
                <p className="font-medium text-white">{days.find((d) => d.value === s.day_of_week)?.label}</p>
                <p className="text-sm text-slate-500">{s.start_time} — {s.end_time}</p>
              </div>
              <button onClick={() => remove(s.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Sil</button>
            </div>
          ))}
          {schedules.length === 0 && <p className="text-slate-500 text-center py-10">Hələ iş qrafiki əlavə etməmisiniz.</p>}
        </div>
      </div>
    </div>
  );
}
