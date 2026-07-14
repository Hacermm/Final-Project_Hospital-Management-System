import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/departments")
      .then((res) => setDepartments(res.data.data)) 
      .catch(() => setError("Şöbələr yüklənə bilmədi."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Yüklənir...</div>;

  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Şöbələrimiz</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{dept.name}</h2>
              <p className="text-gray-600 text-sm mb-4">
                {dept.description || "Təsvir yoxdur"}
              </p>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                {dept.doctors_count} həkim
              </span>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Hələ şöbə yoxdur.</p>
        )}
      </div>
    </div>
  );
}