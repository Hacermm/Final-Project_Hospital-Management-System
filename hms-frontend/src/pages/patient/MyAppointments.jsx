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

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => {
    api.get("/appointments").then((r) => setAppointments(r.data.data));
  };
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("Bu randevunu ləğv etmək istəyirsiniz?")) return;
    try {
      await api.put(`/appointments/${id}`, { status: "cancelled" });
      setMessage("✅ Randevu ləğv edildi");
      load();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Randevularım</h1>
          <Link to="/patient/book" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Yeni randevu
          </Link>
          <Link to="/patient/history" className="text-blue-600 hover:underline">
            Tibbi tarixçəm →
        </Link>
        </div>

        {message && <p className="mb-4 text-sm font-medium">{message}</p>}

        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-800">{a.doctor?.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[a.status]}`}>
                    {statusLabels[a.status]}
                  </span>
                </div>
                <p className="text-sm text-blue-600">{a.doctor?.specialization}</p>
                <p className="text-sm text-gray-600 mt-1">
                  📅 {a.date} — 🕐 {a.time}
                </p>
                {a.reason && <p className="text-sm text-gray-500 mt-1">"{a.reason}"</p>}
              </div>

              {["pending", "confirmed"].includes(a.status) && (
                <button
                  onClick={() => cancel(a.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Ləğv et
                </button>
              )}
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Hələ randevunuz yoxdur.</p>
        )}
      </div>
    </div>
  );
}