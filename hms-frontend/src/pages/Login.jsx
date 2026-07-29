import { useState } from "react";
import api from "../lib/api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified");

  const verifyMessages = {
    success: { text: "✅ Email uğurla təsdiqləndi! İndi giriş edə bilərsiniz.", ok: true },
    already: { text: "ℹ️ Email artıq təsdiqlənib. Giriş edə bilərsiniz.", ok: true },
    invalid: { text: "❌ Təsdiq linki etibarsız və ya vaxtı bitib.", ok: false },
  };
  const verifyMsg = verifyMessages[verified];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      const role = res.data.role;
      if (role === "super_admin") navigate("/admin/super");
      else if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor");
      else navigate("/patient");
    } catch (err) {
      console.error("Login Error:", err);
      let msg = "Giriş xətası baş verdi. Email və parolu yoxlayın.";
      if (!err.response) {
        msg = "Serverə qoşulmaq mümkün olmadı. Lütfən backend serverinin işlədiyini (port 8000) yoxlayın.";
      } else if (err.response.data?.errors?.email?.[0]) {
        msg = err.response.data.errors.email[0];
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      }
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #180303 0%, #C62828 65%, #B71C1C 100%)" }}>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-2xl border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3.5 mb-6 group">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #C62828 0%, #B71C1C 100%)", border: "2px solid #EF5350" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-2xl tracking-tight text-[#C62828] leading-none">
                NovaCare<span style={{ color: "#EF5350" }}> Hospital</span>
              </span>
              <span className="text-[10px] font-black tracking-[0.24em] uppercase mt-1 text-slate-500">
                TİBB MƏRKƏZİ
              </span>
            </div>
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-slate-900">Hesabınıza Giriş</h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">NovaCare Hospital rəqəmsal şəxsi kabinetinizə daxil olun</p>
        </div>

        {verifyMsg && (
          <div
            className={`mb-5 px-4 py-3 rounded-xl text-center text-xs font-bold animate-fade-in border ${
              verifyMsg.ok
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {verifyMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Ünvanı</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="ac-input"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="ac-input"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Link to="/forgot-password" className="text-xs font-bold text-[#C62828] hover:underline">
              Parolu unutdunuz?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ac-btn w-full !py-3.5 text-xs font-bold shadow-xl mt-2 disabled:opacity-50"
          >
            {loading ? "Giriş Edilir..." : "GİRİŞ ET ➔"}
          </button>
        </form>

        {message && (
          <p className="mt-4 p-3 rounded-xl text-center text-xs font-bold bg-red-50 border border-red-200 text-red-700 animate-fade-in">
            {message}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-600 space-y-2.5">
          <p>
            Hesabınız yoxdur?{" "}
            <Link to="/register" className="font-extrabold text-[#C62828] hover:underline">
              Qeydiyyatdan keçin
            </Link>
          </p>
          <p>
            <Link to="/" className="text-slate-500 hover:text-slate-900 transition">
              ← Ana səhifəyə qayıt
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}