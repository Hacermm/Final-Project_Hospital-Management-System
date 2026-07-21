import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function UploadLabTest() {
  const [patients, setPatients] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [form, setForm] = useState({ patient_id: "", title: "", description: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () => {
    api.get("/patients").then((r) => setPatients(r.data.data));
    api.get("/lab-tests").then((r) => setLabTests(r.data.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!file) { setMessage("❌ Fayl seçin"); return; }

    const data = new FormData();
    data.append("patient_id", form.patient_id);
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("file", file);

    setUploading(true);
    try {
      await api.post("/lab-tests", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Fayl yükləndi");
      setForm({ patient_id: "", title: "", description: "" });
      setFile(null);
      e.target.reset();
      load();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta";
      setMessage(`❌ ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const download = async (id, fileName) => {
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

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Lab Nəticələri</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Yeni nəticə yüklə</h2>

          <select
            value={form.patient_id}
            onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
            required
            className={inputClass}
          >
            <option value="">Xəstə seçin...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Başlıq (məs. Qan analizi)"
            className={inputClass}
          />

          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Təsvir (istəyə bağlı)"
            className={inputClass}
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">Fayl (PDF, JPG, PNG — max 5MB)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {uploading ? "Yüklənir..." : "Yüklə"}
          </button>

          {message && <p className="text-sm font-medium">{message}</p>}
        </form>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <h2 className="font-semibold text-gray-700 px-6 py-4 border-b">Yüklənmiş nəticələr</h2>
          {labTests.map((t) => (
            <div key={t.id} className="flex justify-between items-center px-6 py-4 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-800">{t.title}</p>
                <p className="text-sm text-gray-600">{t.patient} — {t.date}</p>
                {t.description && <p className="text-sm text-gray-500">{t.description}</p>}
              </div>
              <button onClick={() => download(t.id, t.file_name)} className="text-blue-600 hover:underline text-sm">
                📄 Endir
              </button>
            </div>
          ))}
          {labTests.length === 0 && (
            <p className="text-gray-500 text-center py-8">Hələ nəticə yoxdur.</p>
          )}
        </div>
      </div>
    </div>
  );
}