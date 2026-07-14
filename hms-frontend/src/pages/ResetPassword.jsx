import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/reset-password", form);
      setMessage(`✅ ${res.data.message}`);
      setTimeout(() => navigate("/login"), 2000);
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
          Yeni parol təyin et
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="6 rəqəmli kod"
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none tracking-widest text-center"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Yeni parol"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            placeholder="Yeni parolu təkrarla"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Yenilənir..." : "Parolu dəyiş"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline">
            Girişə qayıt
          </Link>
        </p>
      </div>
    </div>
  );
}