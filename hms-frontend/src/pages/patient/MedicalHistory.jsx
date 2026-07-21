import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/medical-records")
      .then((r) => setRecords(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const downloadPdf = async (recordId) => {
    setMessage("");
    try {
      const response = await api.get(`/medical-records/${recordId}/pdf`, {
        responseType: "blob",   
      });

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

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Yüklənir...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tibbi Tarixçəm</h1>

        {message && <p className="mb-4 text-sm font-medium">{message}</p>}

        <div className="space-y-5">
          {records.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{r.diagnosis}</h3>
                  <p className="text-sm text-gray-600">
                    {r.doctor?.name} — {r.doctor?.specialization}
                  </p>
                  <p className="text-sm text-gray-500">📅 {r.date}</p>
                </div>
                <button
                  onClick={() => downloadPdf(r.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                >
                  📄 PDF yüklə
                </button>
              </div>

              {r.notes && (
                <p className="text-sm text-gray-600 italic mb-3">Qeyd: {r.notes}</p>
              )}

              {r.prescriptions?.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Reseptlər:</p>
                  <div className="space-y-1">
                    {r.prescriptions.map((p) => (
                      <div key={p.id} className="text-sm text-gray-600 flex gap-2">
                        <span className="font-medium">💊 {p.medicine}</span>
                        {p.dosage && <span>— {p.dosage}</span>}
                        {p.duration && <span>({p.duration})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Hələ tibbi qeydiniz yoxdur.</p>
        )}
      </div>
    </div>
  );
}