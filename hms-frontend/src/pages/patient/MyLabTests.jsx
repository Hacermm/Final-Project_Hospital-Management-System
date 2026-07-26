import { useEffect, useState } from "react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function MyLabTests() {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/lab-tests")
      .then((r) => setLabTests(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const download = async (id, fileName) => {
    setMessage("");
    try {
      const res = await api.get(`/lab-tests/${id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage("❌ Endirilə bilmədi");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Lab Nəticələrim</h1>

        {message && <p className="mb-4 text-sm font-medium hms-message-error">{message}</p>}

        {loading ? (
          <div className="flex items-center gap-3 text-slate-400 justify-center py-16">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
            </svg>
            Yüklənir...
          </div>
        ) : (
          <div className="glass-card overflow-hidden animate-fade-in-up">
            {labTests.map((t) => (
              <div
                key={t.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 md:px-6 py-4 border-b border-white/5 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white">🔬 {t.title}</p>
                  <p className="text-sm text-slate-500">{t.doctor} — {t.date}</p>
                  {t.description && <p className="text-sm text-slate-600">{t.description}</p>}
                </div>
                <button
                  onClick={() => download(t.id, t.file_name)}
                  className="hms-btn text-sm !py-2 !px-4 shrink-0 self-start sm:self-auto"
                >
                  📄 Endir
                </button>
              </div>
            ))}

            {labTests.length === 0 && (
              <p className="text-slate-500 text-center py-12">Hələ lab nəticəniz yoxdur.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}