import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";
export default function UploadLabTest() {
  const [patients, setPatients] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [form, setForm] = useState({ patient_id: "", title: "", description: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () => { api.get("/patients").then((r) => setPatients(r.data.data)); api.get("/lab-tests").then((r) => setLabTests(r.data.data)); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage("");
    if (!file) { setMessage("❌ Fayl seçin"); return; }
    const data = new FormData();
    data.append("patient_id", form.patient_id); data.append("title", form.title); data.append("description", form.description); data.append("file", file);
    setUploading(true);
    try {
      await api.post("/lab-tests", data, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("✅ Fayl yükləndi"); setForm({ patient_id: "", title: "", description: "" }); setFile(null); e.target.reset(); load();
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Xəta";
      setMessage(`❌ ${msg}`);
    } finally { setUploading(false); }
  };

  const download = async (id, fileName) => {
    try {
      const res = await api.get(`/lab-tests/${id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a"); link.href = url; link.setAttribute("download", fileName);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
    } catch { setMessage("❌ Endirilə bilmədi"); }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", transition: "background-color 0.3s ease" }}>      <Navbar />
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", transition: "background-color 0.3s ease" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/doctor" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="text-lg font-bold text-white">Lab Nəticələri</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 space-y-4 animate-fade-in-up">
          <h2 className="font-semibold text-white">Yeni nəticə yüklə</h2>
          <select value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required className="hms-select">
            <option value="">Xəstə seçin...</option>
            {patients.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Başlıq (məs. Qan analizi)" className="hms-input" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Təsvir (istəyə bağlı)" className="hms-input" rows="2" />
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Fayl (PDF, JPG, PNG — max 5MB)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} required
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer file:font-medium file:text-sm" />
          </div>
          <button type="submit" disabled={uploading} className="hms-btn">{uploading ? "Yüklənir..." : "Yüklə"}</button>
          {message && <p className={`text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>{message}</p>}
        </form>

        <div className="glass-card overflow-hidden animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          <h2 className="font-semibold text-white px-6 py-4 border-b border-white/5">Yüklənmiş nəticələr</h2>
          {labTests.map((t) => (
            <div key={t.id} className="flex justify-between items-center px-6 py-4 border-b border-white/5 last:border-0">
              <div>
                <p className="font-medium text-white">🔬 {t.title}</p>
                <p className="text-sm text-slate-500">{t.patient} — {t.date}</p>
                {t.description && <p className="text-sm text-slate-600">{t.description}</p>}
              </div>
              <button onClick={() => download(t.id, t.file_name)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">📄 Endir</button>
            </div>
          ))}
          {labTests.length === 0 && <p className="text-slate-500 text-center py-10">Hələ nəticə yoxdur.</p>}
        </div>
      </div>
    </div>
  );
}
