import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const load = () => {
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
        await api.put(`/departments/${editId}`, form);
        setMessage("✅ Şöbə yeniləndi");
      } else {
        await api.post("/departments", form);
        setMessage("✅ Şöbə əlavə olundu");
      }
      setForm({ name: "", description: "" });
      setEditId(null);
      load();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta"}`);
    }
  };

  const startEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description || "" });
    setEditId(dept.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu şöbəni silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/departments/${id}`);
      setMessage("✅ Şöbə silindi");
      load();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta"}`);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Şöbə İdarəetməsi</h1>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Çıxış
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700">
            {editId ? "Şöbəni redaktə et" : "Yeni şöbə əlavə et"}
          </h2>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Şöbə adı"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Təsvir (istəyə bağlı)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              {editId ? "Yenilə" : "Əlavə et"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm({ name: "", description: "" }); }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
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
                <th className="px-6 py-3">Təsvir</th>
                <th className="px-6 py-3">Həkim</th>
                <th className="px-6 py-3">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="border-t">
                  <td className="px-6 py-3 font-medium">{dept.name}</td>
                  <td className="px-6 py-3 text-gray-600 text-sm">{dept.description || "—"}</td>
                  <td className="px-6 py-3">{dept.doctors_count}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => startEdit(dept)} className="text-blue-600 hover:underline text-sm">
                      Redaktə
                    </button>
                    <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:underline text-sm">
                      Sil
                    </button>
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