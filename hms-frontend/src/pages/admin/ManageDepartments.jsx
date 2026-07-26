import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";
export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const load = () => { api.get("/departments").then((res) => setDepartments(res.data.data)); };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editId) { await api.put(`/departments/${editId}`, form); setMessage("✅ Şöbə yeniləndi"); }
      else { await api.post("/departments", form); setMessage("✅ Şöbə əlavə olundu"); }
      setForm({ name: "", description: "" }); setEditId(null); load();
    } catch (err) { setMessage(`❌ ${err.response?.data?.message || "Xəta"}`); }
  };

  const startEdit = (dept) => { setForm({ name: dept.name, description: dept.description || "" }); setEditId(dept.id); };

  const handleDelete = async (id) => {
    if (!confirm("Bu şöbəni silmək istəyirsiniz?")) return;
    try { await api.delete(`/departments/${id}`); setMessage("✅ Şöbə silindi"); load(); }
    catch (err) { setMessage(`❌ ${err.response?.data?.message || "Xəta"}`); }
  };

  const logout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-[#0f172a]">     <Navbar />
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <h1 className="text-lg font-bold text-white">Şöbə İdarəetməsi</h1>
          </div>
          <button onClick={logout} className="hms-btn hms-btn-danger text-sm !py-2 !px-4">Çıxış</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 space-y-4 animate-fade-in-up">
          <h2 className="font-semibold text-white">{editId ? "Şöbəni redaktə et" : "Yeni şöbə əlavə et"}</h2>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Şöbə adı" className="hms-input" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Təsvir (istəyə bağlı)" className="hms-input" rows="2" />
          <div className="flex gap-2">
            <button type="submit" className="hms-btn">{editId ? "Yenilə" : "Əlavə et"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: "", description: "" }); }} className="hms-btn hms-btn-ghost">Ləğv et</button>}
          </div>
        </form>

        {message && <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}

        {/* Table */}
        <div className="glass-card overflow-hidden animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          <table className="hms-table">
            <thead><tr><th>Ad</th><th>Təsvir</th><th>Həkim</th><th>Əməliyyat</th></tr></thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="font-medium text-white">{dept.name}</td>
                  <td className="text-slate-500 text-sm">{dept.description || "—"}</td>
                  <td><span className="hms-badge bg-indigo-500/10 text-indigo-400">{dept.doctors_count}</span></td>
                  <td className="space-x-3">
                    <button onClick={() => startEdit(dept)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Redaktə</button>
                    <button onClick={() => handleDelete(dept.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Sil</button>
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