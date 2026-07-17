import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

const emptyForm = {
  name: "", email: "", password: "", password_confirmation: "",
  date_of_birth: "", gender: "", blood_group: "",
  address: "", phone: "", emergency_contact: "",
};

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const load = () => {
    api.get("/patients").then((res) => setPatients(res.data.data));
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editId) {
        await api.put(`/patients/${editId}`, form);
        setMessage("✅ Xəstə yeniləndi");
      } else {
        await api.post("/patients", form);
        setMessage("✅ Xəstə əlavə olundu");
      }
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta";
      setMessage(`❌ ${msg}`);
    }
  };

  const startEdit = (p) => {
    setForm({
      ...emptyForm,
      name: p.name || "",
      email: p.email || "",
      date_of_birth: p.date_of_birth || "",
      gender: p.gender || "",
      blood_group: p.blood_group || "",
      address: p.address || "",
      phone: p.phone || "",
      emergency_contact: p.emergency_contact || "",
    });
    setEditId(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu xəstəni silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/patients/${id}`);
      setMessage("✅ Xəstə silindi");
      load();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta"}`);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Xəstə İdarəetməsi</h1>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Çıxış
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">
            {editId ? "Xəstəni redaktə et" : "Yeni xəstə əlavə et"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Ad Soyad" className={inputClass} />
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className={inputClass} />

            {!editId && (
              <>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Parol" className={inputClass} />
                <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="Parolu təkrarla" className={inputClass} />
              </>
            )}

            <div>
           <label className="block text-sm text-gray-600 mb-1">Doğum tarixi</label>
            <input
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                min="1900-01-01"
                className={inputClass}
              />
            </div>

            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              <option value="">Cins seçin</option>
              <option value="male">Kişi</option>
              <option value="female">Qadın</option>
              <option value="other">Digər</option>
            </select>

            <input name="blood_group" value={form.blood_group} onChange={handleChange} placeholder="Qan qrupu (A+)" className={inputClass} />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className={inputClass} />
            <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} placeholder="Təcili əlaqə" className={inputClass} />
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="Ünvan" className={`${inputClass} md:col-span-2`} />
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              {editId ? "Yenilə" : "Əlavə et"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
                Ləğv et
              </button>
            )}
          </div>
        </form>

        {message && <p className="mb-4 text-sm font-medium">{message}</p>}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Ad</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Qan qrupu</th>
                <th className="px-6 py-3">Telefon</th>
                <th className="px-6 py-3">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-6 py-3 font-medium">{p.name}</td>
                  <td className="px-6 py-3 text-gray-600 text-sm">{p.email}</td>
                  <td className="px-6 py-3">{p.blood_group || "—"}</td>
                  <td className="px-6 py-3 text-sm">{p.phone || "—"}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => startEdit(p)} className="text-blue-600 hover:underline text-sm">Redaktə</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}