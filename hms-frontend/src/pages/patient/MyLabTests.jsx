import { useEffect, useState } from "react";
import api from "../../lib/api";

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

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Yüklənir...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Lab Nəticələrim</h1>

        {message && <p className="mb-4 text-sm font-medium">{message}</p>}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {labTests.map((t) => (
            <div key={t.id} className="flex justify-between items-center px-6 py-4 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-800">🔬 {t.title}</p>
                <p className="text-sm text-gray-600">{t.doctor} — {t.date}</p>
                {t.description && <p className="text-sm text-gray-500">{t.description}</p>}
              </div>
              <button onClick={() => download(t.id, t.file_name)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                📄 Endir
              </button>
            </div>
          ))}
          {labTests.length === 0 && (
            <p className="text-gray-500 text-center py-10">Hələ lab nəticəniz yoxdur.</p>
          )}
        </div>
      </div>
    </div>
  );
}