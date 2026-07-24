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

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const load = () => { api.get("/appointments").then((r) => setAppointments(r.data.data)); };
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try { await api.put(`/appointments/${id}`, { status }); setMessage(`✅ Status yeniləndi: ${statusLabels[status]}`); load(); }
    catch (err) { setMessage(`❌ ${err.response?.data?.message || "Xəta"}`); }
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/doctor" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <h1 className="text-lg font-bold text-white">Randevularım</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/doctor/schedule" className="hms-btn text-sm !py-2 !px-4">İş qrafikim</Link>
            <Link to="/doctor/records/new" className="hms-btn hms-btn-success text-sm !py-2 !px-4">Tibbi qeyd yaz</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap animate-fade-in-up">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${filter === s ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-transparent text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300"}`}>
              {s === "all" ? "Hamısı" : statusLabels[s]}
            </button>
          ))}
        </div>

        {message && <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}

        <div className="space-y-4 stagger-children">
          {filtered.map((a) => (
            <div key={a.id} className="glass-card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-white">{a.patient?.name}</h3>
                    <span className={`hms-badge border ${statusStyles[a.status]}`}>{statusLabels[a.status]}</span>
                  </div>
                  <p className="text-sm text-slate-500">📅 {a.date} — 🕐 {a.time}</p>
                  {a.reason && <p className="text-sm text-slate-600 mt-1 italic">"{a.reason}"</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  {a.status === "pending" && (<>
                    <button onClick={() => changeStatus(a.id, "confirmed")} className="hms-btn hms-btn-success text-xs !py-1.5 !px-3">Təsdiqlə</button>
                    <button onClick={() => changeStatus(a.id, "cancelled")} className="hms-btn hms-btn-danger text-xs !py-1.5 !px-3">Ləğv et</button>
                  </>)}
                  {a.status === "confirmed" && (
                    <button onClick={() => changeStatus(a.id, "completed")} className="hms-btn text-xs !py-1.5 !px-3">Tamamla</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-slate-500 text-center mt-16">Randevu yoxdur.</p>}
      </div>
    </div>
  );
}