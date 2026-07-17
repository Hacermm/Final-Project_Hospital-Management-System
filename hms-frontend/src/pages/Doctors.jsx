import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/doctors"), api.get("/departments")])
      .then(([docRes, deptRes]) => {
        setDoctors(docRes.data.data);
        setDepartments(deptRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

 
  const filtered = doctors.filter((doc) => {
    const matchDept = !selectedDept || doc.department?.id === Number(selectedDept);
    const matchSearch =
      !search ||
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Yüklənir...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Həkimlərimiz</h1>

    
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ad və ya ixtisas üzrə axtar..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Bütün şöbələr</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">
                👨‍⚕️
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{doc.name}</h2>
              <p className="text-blue-600 text-sm font-medium mb-2">{doc.specialization}</p>
              {doc.department && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mb-3">
                  {doc.department.name}
                </span>
              )}
              <p className="text-gray-600 text-sm mb-3">{doc.bio || "—"}</p>
              <div className="flex justify-between text-sm text-gray-700 border-t pt-3">
                <span>{doc.experience_years} il təcrübə</span>
                <span className="font-semibold">{doc.consultation_fee} ₼</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Uyğun həkim tapılmadı.</p>
        )}
      </div>
    </div>
  );
}