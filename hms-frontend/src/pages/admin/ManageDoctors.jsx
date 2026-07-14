import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

const emptyForm = {
  name: "", email: "", password: "", password_confirmation: "",
  department_id: "", specialization: "", bio: "",
  experience_years: "", consultation_fee: "", phone: "",
};

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const load = () => {
    api.get("/doctors").then((res) => setDoctors(res.data.data));
    api.get("/departments").then((res) => setDepartments(res.data.data));
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editId) {
        await api.put(`/doctors/${editId}`, form);
        setMessage("✅ Həkim yeniləndi");
      } else {
        await api.post("/doctors", form);
        setMessage("✅ Həkim əlavə olundu");
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

  const startEdit = (doc) => {
    setForm({
      ...emptyForm,
      name: doc.name || "",
      email: doc.email || "",
      department_id: doc.department?.id || "",
      specialization: doc.specialization || "",
      bio: doc.bio || "",
      experience_years: doc.experience_years || "",
      consultation_fee: doc.consultation_fee || "",
      phone: doc.phone || "",
    });
    setEditId(doc.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu həkimi silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/doctors/${id}`);
      setMessage("✅ Həkim silindi");
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
          <h1 className="text-3xl font-bold text-gray-800">Həkim İdarəetməsi</h1>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Çıxış
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">
            {editId ? "Həkimi redaktə et" : "Yeni həkim əlavə et"}
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

            <input name="specialization" value={form.specialization} onChange={handleChange} required placeholder="İxtisas (məs. Kardioloq)" className={inputClass} />

            <select name="department_id" value={form.department_id} onChange={handleChange} className={inputClass}>
              <option value="">Şöbə seçin</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <input name="experience_years" type="number" value={form.experience_years} onChange={handleChange} placeholder="Təcrübə (il)" className={inputClass} />
            <input name="consultation_fee" type="number" step="0.01" value={form.consultation_fee} onChange={handleChange} placeholder="Müayinə haqqı" className={inputClass} />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className={inputClass} />
            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className={`${inputClass} md:col-span-2`} />
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
                <th className="px-6 py-3">İxtisas</th>
                <th className="px-6 py-3">Şöbə</th>
                <th className="px-6 py-3">Haqq</th>
                <th className="px-6 py-3">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} className="border-t">
                  <td className="px-6 py-3 font-medium">{doc.name}</td>
                  <td className="px-6 py-3">{doc.specialization}</td>
                  <td className="px-6 py-3 text-gray-600">{doc.department?.name || "—"}</td>
                  <td className="px-6 py-3">{doc.consultation_fee} ₼</td>
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => startEdit(doc)} className="text-blue-600 hover:underline text-sm">Redaktə</button>
                    <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:underline text-sm">Sil</button>
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