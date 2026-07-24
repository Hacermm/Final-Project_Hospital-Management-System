import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/register", form);
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta baş verdi.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 -left-20 w-72 h-72 bg-indigo-600/15 rounded-full blur-[100px]" />

      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Qeydiyyat</h1>
          <p className="text-sm text-slate-500 mt-1">HMS-ə qoşulun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ad Soyad"
            className="hms-input"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            className="hms-input"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Parol (ən azı 8 simvol)"
            className="hms-input"
          />
          <input
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            placeholder="Parolu təkrarla"
            className="hms-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="hms-btn w-full !py-3 !bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-500 hover:!to-pink-500"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/>
                </svg>
                Gözləyin...
              </span>
            ) : "Qeydiyyatdan keç"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Artıq hesabın var?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Giriş et
          </Link>
        </p>
      </div>
    </div>
  );
}