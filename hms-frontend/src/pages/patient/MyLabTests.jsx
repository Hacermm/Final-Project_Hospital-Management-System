import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function MyLabTests() {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/lab-tests").then((r) => setLabTests(r.data.data)).finally(() => setLoading(false));
  }, []);

  const download = async (id, fileName) => {
    setMessage("");
    try {
      const res = await api.get(`/lab-tests/${id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a"); link.href = url; link.setAttribute("download", fileName);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
    } catch { setMessage("❌ Endirilə bilmədi"); }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/></svg>
          Yüklənir...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/patient" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="text-lg font-bold text-white">Lab Nəticələrim</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {message && <p className="mb-4 text-sm font-medium hms-message-error">{message}</p>}

        <div className="glass-card overflow-hidden animate-fade-in-up">
          {labTests.map((t) => (
            <div key={t.id} className="flex justify-between items-center px-6 py-4 border-b border-white/5 last:border-0">
              <div>
                <p className="font-medium text-white">🔬 {t.title}</p>
                <p className="text-sm text-slate-500">{t.doctor} — {t.date}</p>
                {t.description && <p className="text-sm text-slate-600">{t.description}</p>}
              </div>
              <button onClick={() => download(t.id, t.file_name)} className="hms-btn text-sm !py-2 !px-4">📄 Endir</button>
            </div>
          ))}
          {labTests.length === 0 && <p className="text-slate-500 text-center py-12">Hələ lab nəticəniz yoxdur.</p>}
        </div>
      </div>
    </div>
  );
}