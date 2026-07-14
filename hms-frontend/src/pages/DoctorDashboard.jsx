import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Həkim Paneli</h1>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Çıxış
          </button>
        </div>
        <p className="text-gray-600">Xoş gəldin!</p>
      </div>
    </div>
  );
}