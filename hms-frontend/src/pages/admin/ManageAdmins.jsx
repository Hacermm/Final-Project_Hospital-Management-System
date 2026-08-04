import { useEffect, useState } from "react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

const emptyForm = { name: "", email: "", password: "", password_confirmation: "", role: "admin" };

const roleLabels = { admin: "Admin", super_admin: "Super Admin" };

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/admins")
      .then((r) => setAdmins(r.data.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/admins", form);
      setMessage(" Admin yaradıldı");
      setForm(emptyForm);
      load();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta";
      setMessage(` ${msg}`);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admins/${id}`, { role });
      setMessage(" Rol yeniləndi");
      load();
    } catch (err) {
      setMessage(` ${err.response?.data?.message || "Xəta"}`);
    }
  };

  const remove = async (id, name) => {
    if (!confirm(`"${name}" hesabını silmək istəyirsiniz?`)) return;
    try {
      await api.delete(`/admins/${id}`);
      setMessage(" Admin silindi");
      load();
    } catch (err) {
      setMessage(` ${err.response?.data?.message || "Xəta"}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", transition: "background-color 0.3s ease" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-white mb-1">Admin İdarəetməsi</h1>
        <p className="text-slate-500 text-sm mb-6">Sistem administratorlarını yaradın və rollarını idarə edin</p>

        <form onSubmit={handleSubmit} className="glass-card p-4 md:p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Yeni admin əlavə et</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Ad Soyad" className="hms-input" />
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="hms-input" />
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Parol (min 8, hərf+rəqəm)" className="hms-input" />
            <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="Parolu təkrarla" className="hms-input" />

            <select name="role" value={form.role} onChange={handleChange} className="hms-select md:col-span-2">
              <option value="admin">Admin — həkim/xəstə/şöbə idarəetməsi</option>
              <option value="super_admin">Super Admin — tam səlahiyyət</option>
            </select>
          </div>

          <button type="submit" className="hms-btn mt-4">Əlavə et</button>
        </form>

        {message && (
          <p className={`mb-4 text-sm font-medium ${message.startsWith("") ? "hms-message-success" : "hms-message-error"}`}>
            {message}
          </p>
        )}

      
        <div className="glass-card overflow-hidden">
          <h2 className="font-semibold text-white px-4 md:px-6 py-4 border-b border-white/5">
            Sistem administratorları
          </h2>

          {loading ? (
            <p className="text-slate-400 text-center py-10">Yüklənir...</p>
          ) : (
            admins.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 md:px-6 py-4 border-b border-white/5 last:border-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {a.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-medium truncate">{a.name}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      a.role === "super_admin"
                        ? "bg-purple-500/15 text-purple-400"
                        : "bg-indigo-500/15 text-indigo-400"
                    }`}>
                      {roleLabels[a.role]}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs">{a.email} • {a.created_at}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={a.role}
                    onChange={(e) => changeRole(a.id, e.target.value)}
                    className="bg-slate-800/60 border border-white/5 rounded-lg text-xs text-slate-300 px-2 py-1.5 focus:outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>

                  <button onClick={() => remove(a.id, a.name)} className="text-red-400 hover:text-red-300 text-sm font-medium">
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}

          {!loading && admins.length === 0 && (
            <p className="text-slate-500 text-center py-10">Admin yoxdur.</p>
          )}
        </div>

        <p className="text-[11px] text-slate-600 mt-3">
          ⓘ Öz hesabınızı silə və ya rolunuzu dəyişə bilməzsiniz. Sistemdə ən azı bir super admin qalmalıdır.
        </p>
      </div>
    </div>
  );
}
