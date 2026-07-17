import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};
const statusLabels = {
  pending: "Gözləyir",
  confirmed: "Təsdiqlənib",
  completed: "Tamamlanıb",
  cancelled: "Ləğv edilib",
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const load = () => {
    api.get("/appointments").then((r) => setAppointments(r.data.data));
  };
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setMessage(`✅ Status yeniləndi: ${statusLabels[status]}`);
      load();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta"}`);
    }
  };

  const filtered = filter === "all"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Randevularım</h1>
          <Link to="/doctor/schedule" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            İş qrafikim
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === s ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "Hamısı" : statusLabels[s]}
            </button>
          ))}
        </div>

        {message && <p className="mb-4 text-sm font-medium">{message}</p>}

        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-800">{a.patient?.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[a.status]}`}>
                      {statusLabels[a.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">📅 {a.date} — 🕐 {a.time}</p>
                  {a.reason && <p className="text-sm text-gray-500 mt-1">Şikayət: "{a.reason}"</p>}
                </div>

                <div className="flex gap-2">
                  {a.status === "pending" && (
                    <>
                      <button onClick={() => changeStatus(a.id, "confirmed")} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                        Təsdiqlə
                      </button>
                      <button onClick={() => changeStatus(a.id, "cancelled")} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700">
                        Ləğv et
                      </button>
                    </>
                  )}
                  {a.status === "confirmed" && (
                    <button onClick={() => changeStatus(a.id, "completed")} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                      Tamamla
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Randevu yoxdur.</p>
        )}
      </div>
    </div>
  );
}