import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Home() {
  const [stats, setStats] = useState({ doctors: 0, departments: 0 });

  useEffect(() => {
    Promise.all([api.get("/doctors"), api.get("/departments")]).then(
      ([doc, dept]) => {
        setStats({
          doctors: doc.data.data.length,
          departments: dept.data.data.length,
        });
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="bg-blue-600 text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            HMS Xəstəxana
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Sağlamlığınız bizim prioritetimizdir. Peşəkar həkimlər, müasir texnologiya.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
              Qeydiyyatdan keç
            </Link>
            <Link to="/doctors" className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Həkimlərə bax
            </Link>
          </div>
        </div>
      </section>

   
      <section className="max-w-4xl mx-auto -mt-10 px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">{stats.doctors}</p>
            <p className="text-gray-600 text-sm">Həkim</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{stats.departments}</p>
            <p className="text-gray-600 text-sm">Şöbə</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">24/7</p>
            <p className="text-gray-600 text-sm">Xidmət</p>
          </div>
        </div>
      </section>

      
      <section className="max-w-5xl mx-auto py-16 px-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Xidmətlərimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📅", title: "Onlayn Randevu", desc: "İstədiyiniz həkimə rahat randevu alın" },
            { icon: "💬", title: "Canlı Söhbət", desc: "Həkiminizlə real vaxtda əlaqə saxlayın" },
            { icon: "📋", title: "Tibbi Qeydlər", desc: "Diaqnoz və reseptlərinizə istənilən vaxt baxın" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

   
      <section className="bg-white py-12 px-8 text-center">
        <p className="text-gray-600 mb-4">Bütün şöbələrimizi kəşf edin</p>
        <Link to="/departments" className="text-blue-600 font-medium hover:underline">
          Şöbələrə bax →
        </Link>
      </section>
    </div>
  );
}