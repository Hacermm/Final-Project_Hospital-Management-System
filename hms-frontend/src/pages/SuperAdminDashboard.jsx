import { Link, useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/login"); };

  const menuItems = [
    { to: "/admin/departments", icon: "🏥", title: "Şöbə İdarəetməsi", desc: "Şöbələri əlavə edin, redaktə edin və ya silin", badge: "Şöbələr" },
    { to: "/admin/doctors", icon: "👨‍⚕️", title: "Həkim İdarəetməsi", desc: "Bütün mütəxəssis həkim hesabları və qiymətləri", badge: "Həkimlər" },
    { to: "/admin/patients", icon: "👤", title: "Xəstə İdarəetməsi", desc: "Bütün pasiyent profilləri və bazası", badge: "Pasiyentlər" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #003b6d 0%, #001f3f 100%)", border: "1.5px solid #fdb931" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fdb931" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                Nova<span style={{ color: "#005691" }}>Care</span>
              </span>
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-0.5">Sistem Nəzarəti</span>
            </div>
            <span className="apollo-badge apollo-badge-gold ml-2">SUPER ADMİN</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-apollo-outline !py-2 !px-3.5 text-xs font-bold">
              ← Səhifəyə Keç
            </Link>
            <button onClick={logout} className="btn-apollo-outline !py-2 !px-3.5 text-xs font-bold !text-red-600 !border-red-200 hover:!bg-red-50">
              🚪 Çıxış
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12 flex-1 w-full space-y-8">
        <div className="apollo-card p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #001f3f 0%, #003b6d 100%)" }}>
          <div className="relative z-10 space-y-2">
            <span className="apollo-badge apollo-badge-gold">SUPER İDARƏÇİ</span>
            <h1 className="font-display text-3xl font-extrabold text-white">NovaCare Super Admin Paneli</h1>
            <p className="text-sm text-slate-200 max-w-xl font-normal">
              Hospital sisteminin bütün poliklinikalarını, heyyət hesablarını və məlumat bazalarını tam idarə edin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-container">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="apollo-card p-7 hover:-translate-y-1.5 transition-all group block flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-slate-900 flex items-center justify-center text-2xl font-bold group-hover:bg-amber-400 transition-colors shadow-sm">
                    {item.icon}
                  </div>
                  <span className="apollo-badge apollo-badge-gold">{item.badge}</span>
                </div>
                <h3 className="font-display font-extrabold text-slate-900 text-lg mb-1.5 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6 font-normal">{item.desc}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>İdarə et</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}