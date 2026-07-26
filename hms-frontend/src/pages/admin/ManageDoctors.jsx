import { useEffect, useState } from "react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

const emptyForm = { name: "", email: "", password: "", password_confirmation: "", department_id: "", specialization: "", bio: "", experience_years: "", consultation_fee: "", phone: "" };

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);

  const load = () => {
    api.get("/doctors").then((res) => setDoctors(res.data.data));
    api.get("/departments").then((res) => setDepartments(res.data.data));
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") data.append(key, value);
    });
    if (photo) data.append("photo", photo);

    try {
      if (editId) {
        data.append("_method", "PUT");
        await api.post(`/doctors/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Həkim yeniləndi");
      } else {
        await api.post("/doctors", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Həkim əlavə olundu");
      }
      setForm(emptyForm);
      setPhoto(null);
      setEditId(null);
      e.target.reset();
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Həkim İdarəetməsi</h1>

        <form onSubmit={handleSubmit} className="glass-card p-4 md:p-6 mb-6 animate-fade-in-up">
          <h2 className="font-semibold text-white mb-4">
            {editId ? "Həkimi redaktə et" : "Yeni həkim əlavə et"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Ad Soyad" className="hms-input" />
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="hms-input" />

            {!editId && (
              <>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Parol" className="hms-input" />
                <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required placeholder="Parolu təkrarla" className="hms-input" />
              </>
            )}

            <input name="specialization" value={form.specialization} onChange={handleChange} required placeholder="İxtisas (məs. Kardioloq)" className="hms-input" />

            <select name="department_id" value={form.department_id} onChange={handleChange} className="hms-select">
              <option value="">Şöbə seçin</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <input name="experience_years" type="number" value={form.experience_years} onChange={handleChange} placeholder="Təcrübə (il)" className="hms-input" />
            <input name="consultation_fee" type="number" step="0.01" value={form.consultation_fee} onChange={handleChange} placeholder="Müayinə haqqı" className="hms-input" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className="hms-input" />

            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className="hms-input md:col-span-2" rows="2" />

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-1.5">Şəkil (JPG, PNG — max 2MB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="hms-btn">{editId ? "Yenilə" : "Əlavə et"}</button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm(emptyForm); setPhoto(null); }}
                className="hms-btn hms-btn-ghost"
              >
                Ləğv et
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "hms-message-success" : "hms-message-error"}`}>
            {message}
          </p>
        )}

        <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="overflow-x-auto">
            <table className="hms-table min-w-[640px]">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>İxtisas</th>
                  <th>Şöbə</th>
                  <th>Haqq</th>
                  <th>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        {doc.photo_url ? (
                          <img
                            src={doc.photo_url}
                            alt={doc.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-sm shrink-0">
                            👨‍⚕️
                          </div>
                        )}
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td className="text-indigo-400">{doc.specialization}</td>
                    <td className="text-slate-500">{doc.department?.name || "—"}</td>
                    <td className="text-emerald-400 font-medium whitespace-nowrap">{doc.consultation_fee} ₼</td>
                    <td>
                      <div className="flex items-center gap-4">
                        <button onClick={() => startEdit(doc)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                          Redaktə
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {doctors.length === 0 && (
            <p className="text-slate-500 text-center py-10">Hələ həkim yoxdur.</p>
          )}
        </div>
      </div>
    </div>
  );
}