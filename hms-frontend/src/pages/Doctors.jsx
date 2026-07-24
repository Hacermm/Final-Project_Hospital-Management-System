import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/doctors"), api.get("/departments")])
      .then(([docRes, deptRes]) => {
        setDoctors(docRes.data.data);
        setDepartments(deptRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((doc) => {
    const matchDept = !selectedDept || doc.department?.id === Number(selectedDept);
    const matchSearch = !search || doc.name?.toLowerCase().includes(search.toLowerCase()) || doc.specialization?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/></svg>
          Yüklənir...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8M12 18v4M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M18 12h4M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"/></svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">HMS</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/departments" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5">Şöbələr</Link>
            <Link to="/login" className="hms-btn text-sm !py-2 !px-5">Giriş</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">Həkimlərimiz</h1>
          <p className="text-slate-500">Peşəkar və təcrübəli həkim komandamız</p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-3 animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ad və ya ixtisas üzrə axtar..." className="hms-input !pl-10" />
          </div>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="hms-select md:w-56">
            <option value="">Bütün şöbələr</option>
            {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
          </select>
        </div>

        {/* Doctor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {filtered.map((doc) => (
            <div key={doc.id} className="glass-card p-6 hover:border-indigo-500/20 hover:translate-y-[-3px] group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110">
                  👨‍⚕️
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-white truncate">{doc.name}</h2>
                  <p className="text-indigo-400 text-sm font-medium">{doc.specialization}</p>
                </div>
              </div>
              {doc.department && (
                <span className="hms-badge bg-slate-700/50 text-slate-400 mb-3 inline-block">{doc.department.name}</span>
              )}
              <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">{doc.bio || "—"}</p>
              <div className="flex justify-between text-sm border-t border-white/5 pt-3.5">
                <span className="text-slate-400">{doc.experience_years} il təcrübə</span>
                <span className="font-semibold text-emerald-400">{doc.consultation_fee} ₼</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-slate-500 text-center mt-16">Uyğun həkim tapılmadı.</p>
        )}
      </div>
    </div>
  );
}