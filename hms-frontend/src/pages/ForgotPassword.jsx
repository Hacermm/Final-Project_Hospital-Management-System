import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta baş verdi."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-600/15 rounded-full blur-[100px]" />
      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Parolu unutdunuz?</h1>
          <p className="text-sm text-slate-500 mt-1">Email daxil edin, bərpa kodu göndərəcəyik.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" className="hms-input" />
          <button type="submit" disabled={loading} className="hms-btn w-full !py-3 !bg-gradient-to-r !from-amber-600 !to-orange-600 hover:!from-amber-500 hover:!to-orange-500">
            {loading ? "Göndərilir..." : "Kod göndər"}
          </button>
        </form>
        {message && <p className={`mt-4 text-center text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">
          Kodu aldın?{" "}<Link to="/reset-password" className="text-indigo-400 hover:text-indigo-300 font-medium">Parolu sıfırla</Link>
        </p>
      </div>
    </div>
  );
}