import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Xəta baş verdi."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Parolu unutdunuz?
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Email daxil edin, bərpa kodu göndərəcəyik.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Göndərilir..." : "Kod göndər"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Kodu aldın?{" "}
          <Link to="/reset-password" className="text-blue-600 hover:underline">
            Parolu sıfırla
          </Link>
        </p>
      </div>
    </div>
  );
}