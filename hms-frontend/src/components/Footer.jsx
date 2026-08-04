import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, #001935 0%, #000e1f 100%)" }} className="text-white border-t border-slate-800 relative overflow-hidden w-full">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="site-container pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10 text-left">
          
          {/* Brand & Overview */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, #002d58 0%, #001935 100%)", border: "2px solid #fdb931" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fdb931" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white leading-none">
                  Nova<span style={{ color: "#fdb931" }}>Care</span>
                </span>
                <span className="text-[9.5px] font-black tracking-[0.24em] uppercase mt-0.5 text-slate-300">
                  HEALTHCARE & HOSPITALS
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-normal">
              NovaCare Healthcare — Apollo tibbi mükəmməllik konsepsiyasına əsaslanan, qabaqcıl diaqnostika, fərdiləşdirilmiş xəstə xidməti və mütəxəssis həkim heyəti ilə fəaliyyət göstərən hospital şəbəkəsidir.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="tel:+994125000000"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-slate-900 shadow-md"
                style={{ background: "#fdb931" }}
              >
                <span> TƏCİLİ:</span> +994 (12) 500 00 00
              </a>
              <a
                href="https://wa.me/994125000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
              >
                <span></span> WhatsApp
              </a>
            </div>
          </div>

          {/* Clinical Specialties */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs tracking-wider uppercase border-b border-white/10 pb-2.5" style={{ color: "#fdb931" }}>Tibbi İxtisaslar</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/departments" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Kardiologiya Və Ürək Cərrahiyyəsi</Link></li>
              <li><Link to="/departments" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Onkologiya Və Şüa Müalicəsi</Link></li>
              <li><Link to="/departments" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Nevrologiya Və Neyrocərrahiyyə</Link></li>
              <li><Link to="/departments" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Ortopediya Və Oynaqlar</Link></li>
              <li><Link to="/departments" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Pediatriya Və Uşaq Sağlamlığı</Link></li>
              <li><Link to="/departments" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Kompleks Check-Up Müayinə</Link></li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-xs tracking-wider uppercase border-b border-white/10 pb-2.5" style={{ color: "#fdb931" }}>Sürətli Keçidlər</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Ana Səhifə</Link></li>
              <li><Link to="/about" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Haqqımızda</Link></li>
              <li><Link to="/doctors" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Həkimlərimiz</Link></li>
              <li><Link to="/departments" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Şöbələr</Link></li>
              <li><Link to="/contact" className="hover:text-amber-300 transition-colors flex items-center gap-2"><span>•</span> Əlaqə Və Ünvan</Link></li>
            </ul>
          </div>

          {/* Hospital Address & Emergency */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs tracking-wider uppercase border-b border-white/10 pb-2.5" style={{ color: "#fdb931" }}>Ünvan Və İş Rejimi</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <span className="text-amber-300 shrink-0 mt-0.5"></span>
                <span>Bakı şəhəri, Nərimanov r., Atatürk pr. 58</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-300 shrink-0"></span>
                <span>+994 (12) 500 00 00 / 24/7 Qaynar Xətt</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-300 shrink-0"></span>
                <span>info@novacare.az</span>
              </p>
              <div className="pt-2">
                <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                    <span></span> JCI Beynəlxalq Sertifikatı
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Dünya standartlarına uyğun pasiyent təhlükəsizliyi.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 NOVACARE HEALTHCARE & HOSPITALS. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center gap-4 font-medium text-[11px]">
            <span className="hover:text-white cursor-pointer transition">Məxfilik Siyasəti</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition">İstifadə Şərtləri</span>
          </div>
        </div>
      </div>

      {/* Floating Action Bar for Mobile */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around py-2.5 px-2 text-xs font-bold text-white shadow-2xl border-t border-white/10"
        style={{ background: "#001935" }}
      >
        <a href="tel:+994125000000" className="flex flex-col items-center gap-0.5 active:scale-95 transition" style={{ color: "#fdb931" }}>
          <span className="text-base"></span><span className="text-[10px]">Təcili</span>
        </a>
        <a href="https://wa.me/994125000000" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-0.5 text-emerald-400 active:scale-95 transition">
          <span className="text-base"></span><span className="text-[10px]">WhatsApp</span>
        </a>
        <Link to="/doctors" className="flex flex-col items-center gap-0.5 text-sky-400 active:scale-95 transition">
          <span className="text-base"></span><span className="text-[10px]">Həkimlər</span>
        </Link>
        <Link to="/register" className="flex flex-col items-center gap-0.5 active:scale-95 transition" style={{ color: "#fdb931" }}>
          <span className="text-base"></span><span className="text-[10px]">Randevu</span>
        </Link>
      </div>
    </footer>
  );
}
