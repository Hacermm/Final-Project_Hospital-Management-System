import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/departments")
      .then((res) => setDepartments(res.data.data))
      .catch(() => setError("Şöbələr yüklənə bilmədi."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/></svg>
          Yüklənir...
        </div>
      </div>
    );

  if (error)
    return <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8M12 18v4M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M18 12h4M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"/></svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">HMS</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/doctors" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5">Həkimlər</Link>
            <Link to="/login" className="hms-btn text-sm !py-2 !px-5">Giriş</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">Şöbələrimiz</h1>
          <p className="text-slate-500">Xəstəxanamızın bütün ixtisaslaşmış şöbələri</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {departments.map((dept) => (
            <div key={dept.id} className="glass-card p-6 hover:border-indigo-500/20 hover:translate-y-[-3px] group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">{dept.name}</h2>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{dept.description || "Təsvir yoxdur"}</p>
              <span className="hms-badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {dept.doctors_count} həkim
              </span>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <p className="text-slate-500 text-center mt-16">Hələ şöbə yoxdur.</p>
        )}
      </div>
    </div>
  );
}