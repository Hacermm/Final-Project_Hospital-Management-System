import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";

const emptyForm = { name: "", email: "", password: "", password_confirmation: "", date_of_birth: "", gender: "", blood_group: "", address: "", phone: "", emergency_contact: "" };

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const load = () => { api.get("/patients").then((res) => setPatients(res.data.data)); };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage("");
    try {
      if (editId) { await api.put(`/patients/${editId}`, form); setMessage("✅ Xəstə yeniləndi"); }
      else { await api.post("/patients", form); setMessage("✅ Xəstə əlavə olundu"); }
      setForm(emptyForm); setEditId(null); load();
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta";
      setMessage(`❌ ${msg}`);
    }
  };

  const startEdit = (p) => {
    setForm({ ...emptyForm, name: p.name || "", email: p.email || "", date_of_birth: p.date_of_birth || "", gender: p.gender || "", blood_group: p.blood_group || "", address: p.address || "", phone: p.phone || "", emergency_contact: p.emergency_contact || "" });
    setEditId(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu xəstəni silmək istəyirsiniz?")) return;
    try { await api.delete(`/patients/${id}`); setMessage("✅ Xəstə silindi"); load(); }
    catch (err) { setMessage(`❌ ${err.response?.data?.message || "Xəta"}`); }
  };

  const logout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <h1 className="text-lg font-bold text-white">Xəstə İdarəetməsi</h1>
          </div>
          <button onClick={logout} className="hms-btn hms-btn-danger text-sm !py-2 !px-4">Çıxış</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 animate-fade-in-up">
          <h2 className="font-semibold text-white mb-4">{editId ? "Xəstəni redaktə et" : "Yeni xəstə əlavə et"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Ad Soyad" className="hms-input" />
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="hms-input" />
            {!editId && (<>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Parol" className="hms-input" />
              <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="Parolu təkrarla" className="hms-input" />
            </>)}
            <div>
              <label className="block text-xs text-slate-500 mb-1">Doğum tarixi</label>
              <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} max={new Date().toISOString().split("T")[0]} min="1900-01-01" className="hms-input" />
            </div>
            <select name="gender" value={form.gender} onChange={handleChange} className="hms-select">
              <option value="">Cins seçin</option>
              <option value="male">Kişi</option>
              <option value="female">Qadın</option>
              <option value="other">Digər</option>
            </select>
            <input name="blood_group" value={form.blood_group} onChange={handleChange} placeholder="Qan qrupu (A+)" className="hms-input" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className="hms-input" />
            <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} placeholder="Təcili əlaqə" className="hms-input" />
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="Ünvan" className="hms-input md:col-span-2" rows="2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="hms-btn">{editId ? "Yenilə" : "Əlavə et"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }} className="hms-btn hms-btn-ghost">Ləğv et</button>}
          </div>
        </form>

        {message && <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}

        <div className="glass-card overflow-hidden animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          <table className="hms-table">
            <thead><tr><th>Ad</th><th>Email</th><th>Qan qrupu</th><th>Telefon</th><th>Əməliyyat</th></tr></thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-white">{p.name}</td>
                  <td className="text-slate-500 text-sm">{p.email}</td>
                  <td><span className="hms-badge bg-red-500/10 text-red-400">{p.blood_group || "—"}</span></td>
                  <td className="text-slate-500 text-sm">{p.phone || "—"}</td>
                  <td className="space-x-3">
                    <button onClick={() => startEdit(p)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Redaktə</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}