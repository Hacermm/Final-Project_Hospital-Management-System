import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};
const statusLabels = { pending: "Gözləyir", confirmed: "Təsdiqlənib", completed: "Tamamlanıb", cancelled: "Ləğv edilib" };

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => { api.get("/appointments").then((r) => setAppointments(r.data.data)); };
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("Bu randevunu ləğv etmək istəyirsiniz?")) return;
    try { await api.put(`/appointments/${id}`, { status: "cancelled" }); setMessage("✅ Randevu ləğv edildi"); load(); }
    catch (err) { setMessage(`❌ ${err.response?.data?.message || "Xəta"}`); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/patient" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <h1 className="text-lg font-bold text-white">Randevularım</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/patient/book" className="hms-btn text-sm !py-2 !px-4">+ Yeni randevu</Link>
            <Link to="/patient/history" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Tibbi tarixçəm <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {message && <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}

        <div className="space-y-4 stagger-children">
          {appointments.map((a) => (
            <div key={a.id} className="glass-card p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white">{a.doctor?.name}</h3>
                  <span className={`hms-badge border ${statusStyles[a.status]}`}>{statusLabels[a.status]}</span>
                </div>
                <p className="text-sm text-indigo-400">{a.doctor?.specialization}</p>
                <p className="text-sm text-slate-500 mt-1">📅 {a.date} — 🕐 {a.time}</p>
                {a.reason && <p className="text-sm text-slate-600 mt-1 italic">"{a.reason}"</p>}
              </div>
              {["pending", "confirmed"].includes(a.status) && (
                <button onClick={() => cancel(a.id)} className="text-red-400 hover:text-red-300 text-sm font-medium shrink-0">Ləğv et</button>
              )}
            </div>
          ))}
        </div>

        {appointments.length === 0 && <p className="text-slate-500 text-center mt-16">Hələ randevunuz yoxdur.</p>}
      </div>
    </div>
  );
}