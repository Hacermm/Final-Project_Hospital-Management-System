import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const days = [
  { value: "monday", label: "Bazar ertəsi" },
  { value: "tuesday", label: "Çərşənbə axşamı" },
  { value: "wednesday", label: "Çərşənbə" },
  { value: "thursday", label: "Cümə axşamı" },
  { value: "friday", label: "Cümə" },
  { value: "saturday", label: "Şənbə" },
  { value: "sunday", label: "Bazar" },
];

export default function DoctorSchedule() {
  const [doctorId, setDoctorId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ day_of_week: "monday", start_time: "09:00", end_time: "17:00" });
  const [message, setMessage] = useState("");

  const loadSchedules = (id) => {
    api.get(`/doctors/${id}/schedules`).then((r) => setSchedules(r.data.data));
  };

  useEffect(() => {
    api.get("/me").then((r) => {
      const id = r.data.user?.doctor?.id;
      if (id) {
        setDoctorId(id);
        loadSchedules(id);
      }
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post(`/doctors/${doctorId}/schedules`, { ...form, is_available: true });
      setMessage("✅ Qrafik əlavə olundu");
      loadSchedules(doctorId);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta";
      setMessage(`❌ ${msg}`);
    }
  };

  const remove = async (id) => {
    if (!confirm("Bu qrafiki silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/schedules/${id}`);
      setMessage("✅ Qrafik silindi");
      loadSchedules(doctorId);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta"}`);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">İş Qrafikim</h1>
          <Link to="/doctor/appointments" className="text-blue-600 hover:underline">
            ← Randevularım
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Yeni iş günü əlavə et</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="day_of_week" value={form.day_of_week} onChange={handleChange} className={inputClass}>
              {days.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <input name="start_time" type="time" value={form.start_time} onChange={handleChange} className={inputClass} />
            <input name="end_time" type="time" value={form.end_time} onChange={handleChange} className={inputClass} />
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Əlavə et
          </button>
        </form>

        {message && <p className="mb-4 text-sm font-medium">{message}</p>}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {schedules.map((s) => (
            <div key={s.id} className="flex justify-between items-center px-6 py-4 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-800">
                  {days.find((d) => d.value === s.day_of_week)?.label}
                </p>
                <p className="text-sm text-gray-600">{s.start_time} — {s.end_time}</p>
              </div>
              <button onClick={() => remove(s.id)} className="text-red-600 hover:underline text-sm">
                Sil
              </button>
            </div>
          ))}
          {schedules.length === 0 && (
            <p className="text-gray-500 text-center py-8">Hələ iş qrafiki əlavə etməmisiniz.</p>
          )}
        </div>
      </div>
    </div>
  );
}