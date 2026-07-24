import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Home() {
  const [stats, setStats] = useState({ doctors: 0, departments: 0 });

  useEffect(() => {
    Promise.all([api.get("/doctors"), api.get("/departments")]).then(
      ([doc, dept]) => {
        setStats({
          doctors: doc.data.data.length,
          departments: dept.data.data.length,
        });
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v8M12 18v4M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M18 12h4M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">HMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/departments" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5">
              Şöbələr
            </Link>
            <Link to="/doctors" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5">
              Həkimlər
            </Link>
            <Link to="/login" className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 border border-white/10">
              Giriş
            </Link>
            <Link to="/register" className="hms-btn text-sm !py-2 !px-5">
              Qeydiyyat
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Müasir Tibb Texnologiyaları
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Sağlamlığınız
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> bizim prioritetimizdir</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Peşəkar həkimlər, müasir texnologiya ilə sağlamlığınızı idarə edin. 
            Onlayn randevu, canlı söhbət və tibbi qeydlər bir klikdə.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="hms-btn !text-base !py-3.5 !px-8 animate-pulse-glow">
              Qeydiyyatdan keç
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/doctors" className="hms-btn-ghost hms-btn !text-base !py-3.5 !px-8 !bg-white/5 !text-slate-300 border border-white/10">
              Həkimlərə bax
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 -mt-4 relative z-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="glass-card p-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stats.doctors}</p>
            <p className="text-slate-500 text-sm mt-1 font-medium">Həkim</p>
          </div>
          <div className="border-x border-white/5">
            <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stats.departments}</p>
            <p className="text-slate-500 text-sm mt-1 font-medium">Şöbə</p>
          </div>
          <div>
            <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">24/7</p>
            <p className="text-slate-500 text-sm mt-1 font-medium">Xidmət</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Xidmətlərimiz</h2>
        <p className="text-slate-500 text-center mb-12 max-w-lg mx-auto">Tibbi xidmətlərimizin bütün imkanlarından yararlanın</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
          {[
            { icon: "📅", title: "Onlayn Randevu", desc: "İstədiyiniz həkimə rahat randevu alın", gradient: "from-indigo-500/20 to-blue-500/20" },
            { icon: "💬", title: "Canlı Söhbət", desc: "Həkiminizlə real vaxtda əlaqə saxlayın", gradient: "from-purple-500/20 to-pink-500/20" },
            { icon: "📋", title: "Tibbi Qeydlər", desc: "Diaqnoz və reseptlərinizə istənilən vaxt baxın", gradient: "from-emerald-500/20 to-teal-500/20" },
          ].map((s, i) => (
            <div key={i} className="glass-card p-7 text-center hover:border-indigo-500/20 hover:translate-y-[-4px] group cursor-default">
              <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6 text-center">
        <div className="glass-card max-w-3xl mx-auto p-10">
          <p className="text-slate-400 mb-5 text-lg">Bütün şöbələrimizi kəşf edin</p>
          <Link to="/departments" className="hms-btn !text-base !py-3 !px-8">
            Şöbələrə bax →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-600">
          © 2026 HMS Xəstəxana İdarəetmə Sistemi. Bütün hüquqlar qorunur.
        </div>
      </footer>
    </div>
  );
}