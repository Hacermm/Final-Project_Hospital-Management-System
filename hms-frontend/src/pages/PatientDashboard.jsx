import { Link, useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/login"); };

  const menuItems = [
    { to: "/patient/book", icon: "📅", title: "Randevu Al", desc: "Həkim seçin, vaxt ayırın", gradient: "from-indigo-500/20 to-blue-500/20" },
    { to: "/patient/appointments", icon: "📋", title: "Randevularım", desc: "Aktiv randevulara baxın", gradient: "from-purple-500/20 to-pink-500/20" },
    { to: "/patient/history", icon: "🏥", title: "Tibbi Tarixçəm", desc: "Diaqnoz və reseptlər", gradient: "from-emerald-500/20 to-teal-500/20" },
    { to: "/patient/lab-tests", icon: "🔬", title: "Lab Nəticələrim", desc: "Analiz nəticələrinə baxın", gradient: "from-amber-500/20 to-orange-500/20" },
    { to: "/chat", icon: "💬", title: "Mesajlar", desc: "Həkiminizlə söhbət edin", gradient: "from-cyan-500/20 to-sky-500/20" },
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
          </div>
          <button onClick={logout} className="hms-btn hms-btn-danger text-sm !py-2 !px-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Çıxış
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">Xoş gəldiniz! 👋</h1>
          <p className="text-slate-500">Patient panelindən xidmətlərə keçid edin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} className="glass-card p-6 hover:border-indigo-500/20 hover:translate-y-[-3px] group block">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
              <div className="mt-4 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 flex items-center gap-1">
                Keçid et <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}