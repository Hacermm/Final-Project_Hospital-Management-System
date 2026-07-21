import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function WriteMedicalRecord() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { medicine: "", dosage: "", duration: "", instructions: "" },
  ]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/appointments").then((r) => {
      const confirmed = r.data.data.filter((a) => a.status === "confirmed");
      setAppointments(confirmed);
    });
  }, []);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: "", dosage: "", duration: "", instructions: "" }]);
  };

  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescription = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validPrescriptions = prescriptions.filter((p) => p.medicine.trim());

    try {
      await api.post("/medical-records", {
        appointment_id: selectedAppt,
        diagnosis,
        notes,
        prescriptions: validPrescriptions,
      });
      setMessage("✅ Tibbi qeyd yaradıldı! Randevu tamamlandı.");
      setTimeout(() => navigate("/doctor/appointments"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta";
      setMessage(`❌ ${msg}`);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tibbi Qeyd Yaz</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Randevu seçin (təsdiqlənmiş)</label>
            <select
              value={selectedAppt}
              onChange={(e) => setSelectedAppt(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Randevu seçin...</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.patient?.name} — {a.date} {a.time}
                </option>
              ))}
            </select>
            {appointments.length === 0 && (
              <p className="text-sm text-orange-600 mt-1">
                Təsdiqlənmiş randevu yoxdur. Əvvəlcə randevunu təsdiqləyin.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diaqnoz</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              placeholder="Məsələn: Yüksək qan təzyiqi"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Əlavə qeydlər (istəyə bağlı)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tövsiyələr, müşahidələr..."
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Reseptlər</label>
              <button type="button" onClick={addPrescription} className="text-blue-600 text-sm hover:underline">
                + Dərman əlavə et
              </button>
            </div>

            {prescriptions.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Dərman adı"
                    value={p.medicine}
                    onChange={(e) => updatePrescription(i, "medicine", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    placeholder="Doza (məs. 100mg)"
                    value={p.dosage}
                    onChange={(e) => updatePrescription(i, "dosage", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    placeholder="Müddət (məs. 7 gün)"
                    value={p.duration}
                    onChange={(e) => updatePrescription(i, "duration", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    placeholder="Təlimat (məs. gündə 1 dəfə)"
                    value={p.instructions}
                    onChange={(e) => updatePrescription(i, "instructions", e.target.value)}
                    className={inputClass}
                  />
                </div>
                {prescriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrescription(i)}
                    className="text-red-600 text-sm mt-2 hover:underline"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Qeydi yadda saxla və randevunu tamamla
          </button>

          {message && <p className="text-center text-sm font-medium">{message}</p>}
        </form>
      </div>
    </div>
  );
}