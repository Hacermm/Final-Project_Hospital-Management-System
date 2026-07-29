import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/register", form);
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta baş verdi.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #001f3f 0%, #003b6d 100%)" }}>
  
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-scale-in apollo-card-dark p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3.5 mb-6 group">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #003b6d 0%, #001f3f 100%)", border: "2px solid #fdb931" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fdb931" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white leading-none">
                NovaCare<span style={{ color: "#EF5350" }}> Hospital</span>
              </span>
              <span className="text-[10px] font-black tracking-[0.24em] uppercase mt-1 text-slate-300">
                TİBB MƏRKƏZİ
              </span>
            </div>
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-white">Qeydiyyat</h1>
          <p className="text-xs text-slate-300 mt-1.5 font-normal">NovaCare Hospital pasiyent portala qoşulun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">Ad Soyad *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Əli Məmmədov"
              className="apollo-input !bg-white/10 !border-white/20 !text-white placeholder:!text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">Email Ünvanı *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
              className="apollo-input !bg-white/10 !border-white/20 !text-white placeholder:!text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">Parol *</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="apollo-input !bg-white/10 !border-white/20 !text-white placeholder:!text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">Parol Təkrarı *</label>
            <input
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="apollo-input !bg-white/10 !border-white/20 !text-white placeholder:!text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-apollo-gold w-full !py-3.5 text-xs font-bold shadow-xl mt-2 disabled:opacity-50"
          >
            {loading ? "Qeydiyyat edilir..." : "QEYDİYYATDAN KEÇ ➔"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 p-3 rounded-xl text-center text-xs font-bold border animate-fade-in ${
              message.startsWith("✅")
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                : "bg-red-500/20 border-red-500/40 text-red-200"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-slate-300 space-y-2.5">
          <p>
            Artıq hesabınız var?{" "}
            <Link to="/login" className="font-extrabold text-amber-300 hover:underline">
              Giriş edin
            </Link>
          </p>
          <p>
            <Link to="/" className="text-slate-400 hover:text-white transition">
              ← Ana səhifəyə qayıt
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}