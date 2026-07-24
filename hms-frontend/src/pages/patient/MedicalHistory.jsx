import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/medical-records").then((r) => setRecords(r.data.data)).finally(() => setLoading(false));
  }, []);

  const downloadPdf = async (recordId) => {
    setMessage("");
    try {
      const response = await api.get(`/medical-records/${recordId}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a"); link.href = url; link.setAttribute("download", `resept-${recordId}.pdf`);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
    } catch { setMessage("❌ PDF yüklənə bilmədi."); }
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
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to="/patient" className="text-slate-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="text-lg font-bold text-white">Tibbi Tarixçəm</h1>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {message && <p className="mb-4 text-sm font-medium hms-message-error">{message}</p>}

        <div className="space-y-5 stagger-children">
          {records.map((r) => (
            <div key={r.id} className="glass-card p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">{r.diagnosis}</h3>
                  <p className="text-sm text-indigo-400">{r.doctor?.name} — {r.doctor?.specialization}</p>
                  <p className="text-sm text-slate-500">📅 {r.date}</p>
                </div>
                <button onClick={() => downloadPdf(r.id)} className="hms-btn text-sm !py-2 !px-4">📄 PDF yüklə</button>
              </div>

              {r.notes && <p className="text-sm text-slate-500 italic mb-3">Qeyd: {r.notes}</p>}

              {r.prescriptions?.length > 0 && (
                <div className="border-t border-white/5 pt-3">
                  <p className="text-sm font-medium text-slate-400 mb-2">Reseptlər:</p>
                  <div className="space-y-1.5">
                    {r.prescriptions.map((p) => (
                      <div key={p.id} className="text-sm text-slate-500 flex gap-2 items-center">
                        <span className="font-medium text-emerald-400">💊 {p.medicine}</span>
                        {p.dosage && <span>— {p.dosage}</span>}
                        {p.duration && <span className="text-slate-600">({p.duration})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {records.length === 0 && <p className="text-slate-500 text-center mt-16">Hələ tibbi qeydiniz yoxdur.</p>}
      </div>
    </div>
  );
}