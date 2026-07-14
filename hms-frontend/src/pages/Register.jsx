import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/register", form);
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Xəta baş verdi.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          HMS — Qeydiyyat
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ad Soyad"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Parol (ən azı 8 simvol)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            placeholder="Parolu təkrarla"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Gözləyin..." : "Qeydiyyatdan keç"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Artıq hesabın var?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Giriş et
          </Link>
        </p>
      </div>
    </div>
  );
}