import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#ef4444"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics")
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = data ? [
    { label: "Həkimlər", value: data.summary.doctors, color: "text-indigo-400" },
    { label: "Xəstələr", value: data.summary.patients, color: "text-emerald-400" },
    { label: "Şöbələr", value: data.summary.departments, color: "text-purple-400" },
    { label: "Ümumi randevu", value: data.summary.appointments, color: "text-sky-400" },
    { label: "Bugünkü randevu", value: data.summary.appointments_today, color: "text-amber-400" },
    { label: "Təsdiq gözləyən", value: data.summary.pending, color: "text-orange-400" },
    { label: "Tibbi qeyd", value: data.summary.medical_records, color: "text-teal-400" },
    { label: "İstifadəçi", value: data.summary.users, color: "text-pink-400" },
  ] : [];

  const axisStyle = { fill: "#94a3b8", fontSize: 12 };
  const tooltipStyle = {
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#e2e8f0",
    fontSize: 13,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", transition: "background-color 0.3s ease" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-white mb-1">Analitika</h1>
        <p className="text-slate-500 text-sm mb-6">Sistemin ümumi statistikası və göstəriciləri</p>

        {loading ? (
          <p className="text-slate-400 text-center py-20">Yüklənir...</p>
        ) : !data ? (
          <p className="text-red-400 text-center py-20">Məlumat yüklənə bilmədi.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              {cards.map((c) => (
                <div key={c.label} className="glass-card p-4 md:p-5">
                  <p className={`text-2xl md:text-3xl font-bold ${c.color}`}>{c.value}</p>
                  <p className="text-slate-400 text-xs md:text-sm mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-4 md:p-6 mb-6">
              <h2 className="font-semibold text-white mb-4">Son 6 ay üzrə randevular</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.monthly}>
                  <defs>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="count" name="Randevu" stroke="#6366f1" strokeWidth={2} fill="url(#colorApp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-semibold text-white mb-4">Randevu statusları</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={data.by_status}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={3}
                      label={({ value }) => `${value}`} >
                      {data.by_status.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-4 md:p-6">
                <h2 className="font-semibold text-white mb-4">Şöbələr üzrə randevular</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.by_department} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={100} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="appointments" name="Randevu" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <h2 className="font-semibold text-white px-4 md:px-6 py-4 border-b border-white/5">
                Ən aktiv həkimlər
              </h2>
              {data.top_doctors.map((d, i) => (
                <div key={i} className="flex items-center gap-4 px-4 md:px-6 py-3.5 border-b border-white/5 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium truncate">{d.name}</p>
                    <p className="text-slate-500 text-xs">{d.specialization}</p>
                  </div>
                  <span className="text-emerald-400 font-semibold shrink-0">{d.count} randevu</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
