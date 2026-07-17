import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function BookAppointment() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/departments").then((r) => setDepartments(r.data.data));
    api.get("/doctors").then((r) => setDoctors(r.data.data));
  }, []);

  const filteredDoctors = selectedDept
    ? doctors.filter((d) => d.department?.id === Number(selectedDept))
    : doctors;

  useEffect(() => {
    if (!selectedDoctor || !date) {
      return;
    }

    let cancelled = false;   

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot("");
      try {
        const res = await api.get(`/doctors/${selectedDoctor}/slots?date=${date}`);
        if (!cancelled) setSlots(res.data.slots);
      } catch {
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    fetchSlots();

    return () => { cancelled = true; };  
  }, [selectedDoctor, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/appointments", {
        doctor_id: selectedDoctor,
        appointment_date: date,
        appointment_time: selectedSlot,
        reason,
      });
      setMessage("✅ Randevu uğurla alındı! Həkim təsdiqini gözləyin.");
      setTimeout(() => navigate("/patient/appointments"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta baş verdi.";
      setMessage(`❌ ${msg}`);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Randevu Al</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. Şöbə seçin</label>
            <select
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setSelectedDoctor(""); }}
              className={inputClass}
            >
              <option value="">Bütün şöbələr</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Həkim seçin</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Həkim seçin...</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization} ({d.consultation_fee} ₼)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">3. Tarix seçin</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {selectedDoctor && date && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">4. Boş saat seçin</label>
              {loadingSlots ? (
                <p className="text-gray-500 text-sm">Yüklənir...</p>
              ) : slots.length === 0 ? (
                <p className="text-orange-600 text-sm bg-orange-50 p-3 rounded-lg">
                 Bu həkimin seçilmiş tarixdə iş saatı yoxdur. Başqa tarix və ya həkim seçin.
                </p>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-lg text-sm font-medium border transition ${
                        selectedSlot === slot
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">5. Şikayətiniz (istəyə bağlı)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Məsələn: Ürəyimdə ağrı var..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={!selectedSlot}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedSlot ? `Randevu al — ${date} ${selectedSlot}` : "Saat seçin"}
          </button>

          {message && <p className="text-center text-sm font-medium">{message}</p>}
        </form>
      </div>
    </div>
  );
}