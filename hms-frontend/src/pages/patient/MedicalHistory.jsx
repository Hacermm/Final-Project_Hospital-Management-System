import { useEffect, useState } from "react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/medical-records")
      .then((r) => setRecords(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const downloadPdf = async (recordId) => {
    setMessage("");
    try {
      const response = await api.get(`/medical-records/${recordId}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resept-${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage("❌ PDF yüklənə bilmədi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Tibbi Tarixçəm</h1>

        {message && <p className="mb-4 text-sm font-medium hms-message-error">{message}</p>}

        {loading ? (
          <div className="flex items-center gap-3 text-slate-400 justify-center py-16">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
            </svg>
            Yüklənir...
          </div>
        ) : (
          <>
            <div className="space-y-5 stagger-children">
              {records.map((r) => (
                <div key={r.id} className="glass-card p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-lg">{r.diagnosis}</h3>
                      <p className="text-sm text-indigo-400">
                        {r.doctor?.name} — {r.doctor?.specialization}
                      </p>
                      <p className="text-sm text-slate-500">📅 {r.date}</p>
                    </div>
                    <button
                      onClick={() => downloadPdf(r.id)}
                      className="hms-btn text-sm !py-2 !px-4 shrink-0 self-start"
                    >
                      📄 PDF yüklə
                    </button>
                  </div>

                  {r.notes && <p className="text-sm text-slate-500 italic mb-3">Qeyd: {r.notes}</p>}

                  {r.prescriptions?.length > 0 && (
                    <div className="border-t border-white/5 pt-3">
                      <p className="text-sm font-medium text-slate-400 mb-2">Reseptlər:</p>
                      <div className="space-y-1.5">
                        {r.prescriptions.map((p) => (
                          <div key={p.id} className="text-sm text-slate-500 flex flex-wrap gap-2 items-center">
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

            {records.length === 0 && (
              <p className="text-slate-500 text-center mt-16">Hələ tibbi qeydiniz yoxdur.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}