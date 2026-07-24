import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";

const emptyForm = { name: "", email: "", password: "", password_confirmation: "", department_id: "", specialization: "", bio: "", experience_years: "", consultation_fee: "", phone: "" };

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const load = () => { api.get("/doctors").then((res) => setDoctors(res.data.data)); api.get("/departments").then((res) => setDepartments(res.data.data)); };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage("");
    try {
      if (editId) { await api.put(`/doctors/${editId}`, form); setMessage("✅ Həkim yeniləndi"); }
      else { await api.post("/doctors", form); setMessage("✅ Həkim əlavə olundu"); }
      setForm(emptyForm); setEditId(null); load();
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta";
      setMessage(`❌ ${msg}`);
    }
  };

  const startEdit = (doc) => {
    setForm({ ...emptyForm, name: doc.name || "", email: doc.email || "", department_id: doc.department?.id || "", specialization: doc.specialization || "", bio: doc.bio || "", experience_years: doc.experience_years || "", consultation_fee: doc.consultation_fee || "", phone: doc.phone || "" });
    setEditId(doc.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu həkimi silmək istəyirsiniz?")) return;
    try { await api.delete(`/doctors/${id}`); setMessage("✅ Həkim silindi"); load(); }
    catch (err) { setMessage(`❌ ${err.response?.data?.message || "Xəta"}`); }
  };

  const logout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <h1 className="text-lg font-bold text-white">Həkim İdarəetməsi</h1>
          </div>
          <button onClick={logout} className="hms-btn hms-btn-danger text-sm !py-2 !px-4">Çıxış</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 animate-fade-in-up">
          <h2 className="font-semibold text-white mb-4">{editId ? "Həkimi redaktə et" : "Yeni həkim əlavə et"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Ad Soyad" className="hms-input" />
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="hms-input" />
            {!editId && (<>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Parol" className="hms-input" />
              <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="Parolu təkrarla" className="hms-input" />
            </>)}
            <input name="specialization" value={form.specialization} onChange={handleChange} required placeholder="İxtisas (məs. Kardioloq)" className="hms-input" />
            <select name="department_id" value={form.department_id} onChange={handleChange} className="hms-select">
              <option value="">Şöbə seçin</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </select>
            <input name="experience_years" type="number" value={form.experience_years} onChange={handleChange} placeholder="Təcrübə (il)" className="hms-input" />
            <input name="consultation_fee" type="number" step="0.01" value={form.consultation_fee} onChange={handleChange} placeholder="Müayinə haqqı" className="hms-input" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className="hms-input" />
            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className="hms-input md:col-span-2" rows="2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="hms-btn">{editId ? "Yenilə" : "Əlavə et"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }} className="hms-btn hms-btn-ghost">Ləğv et</button>}
          </div>
        </form>

        {message && <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}

        <div className="glass-card overflow-hidden animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          <table className="hms-table">
            <thead><tr><th>Ad</th><th>İxtisas</th><th>Şöbə</th><th>Haqq</th><th>Əməliyyat</th></tr></thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td className="font-medium text-white">{doc.name}</td>
                  <td className="text-indigo-400">{doc.specialization}</td>
                  <td className="text-slate-500">{doc.department?.name || "—"}</td>
                  <td className="text-emerald-400 font-medium">{doc.consultation_fee} ₼</td>
                  <td className="space-x-3">
                    <button onClick={() => startEdit(doc)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Redaktə</button>
                    <button onClick={() => handleDelete(doc.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Sil</button>
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