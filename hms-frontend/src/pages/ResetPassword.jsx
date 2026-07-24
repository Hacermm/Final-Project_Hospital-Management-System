import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function ResetPassword() {
  const [form, setForm] = useState({ email: "", code: "", password: "", password_confirmation: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/reset-password", form);
      setMessage(`✅ ${res.data.message}`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta baş verdi.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600/15 rounded-full blur-[100px]" />
      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Yeni parol təyin et</h1>
          <p className="text-sm text-slate-500 mt-1">Bərpa kodunu və yeni parolu daxil edin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" className="hms-input" />
          <input name="code" value={form.code} onChange={handleChange} required placeholder="6 rəqəmli kod" maxLength={6} className="hms-input tracking-[0.3em] text-center" />
          <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Yeni parol" className="hms-input" />
          <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="Yeni parolu təkrarla" className="hms-input" />
          <button type="submit" disabled={loading} className="hms-btn w-full !py-3 !bg-gradient-to-r !from-emerald-600 !to-teal-600 hover:!from-emerald-500 hover:!to-teal-500">
            {loading ? "Yenilənir..." : "Parolu dəyiş"}
          </button>
        </form>
        {message && <p className={`mt-4 text-center text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">← Girişə qayıt</Link>
        </p>
      </div>
    </div>
  );
}