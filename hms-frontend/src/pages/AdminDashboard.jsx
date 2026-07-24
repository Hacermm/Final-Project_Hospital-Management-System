import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/login"); };

  const menuItems = [
    { to: "/admin/departments", icon: "🏥", title: "Şöbə İdarəetməsi", desc: "Şöbələri əlavə edin, redaktə edin", gradient: "from-indigo-500/20 to-blue-500/20" },
    { to: "/admin/doctors", icon: "👨‍⚕️", title: "Həkim İdarəetməsi", desc: "Həkimləri idarə edin", gradient: "from-purple-500/20 to-pink-500/20" },
    { to: "/admin/patients", icon: "👤", title: "Xəstə İdarəetməsi", desc: "Xəstələri idarə edin", gradient: "from-emerald-500/20 to-teal-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8M12 18v4M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M18 12h4M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"/></svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">HMS</span>
            <span className="hms-badge bg-amber-500/10 text-amber-400 border border-amber-500/20 ml-2">Admin</span>
          </div>
          <button onClick={logout} className="hms-btn hms-btn-danger text-sm !py-2 !px-4">Çıxış</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Paneli ⚙️</h1>
          <p className="text-slate-500">Xəstəxana resurslarını idarə edin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} className="glass-card p-6 hover:border-indigo-500/20 hover:translate-y-[-3px] group block">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110`}>{item.icon}</div>
              <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}