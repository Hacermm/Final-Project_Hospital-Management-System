import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import api from "../../lib/api";
const PIE_COLORS = ["#F59E0B", "#C62828", "#10B981", "#94A3B8"];

const ICONS = {
  stethoscope: "M11 2v2M6 2v2M6 4v5a5 5 0 0 0 10 0V4M11 14v2a5 5 0 0 0 10 0v-2M21 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  building: "M3 21h18M5 21V7l8-4v18M19 21V11l-6-4",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
  alert: "M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.get("/analytics")
      .then((r) => setData(r.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const cards = data ? [
    { label: "Həkim", value: data.summary.doctors, icon: "stethoscope", color: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.28)" },
    { label: "Pasiyent", value: data.summary.patients, icon: "users", color: "#059669", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.28)" },
    { label: "Şöbə", value: data.summary.departments, icon: "building", color: "#7C3AED", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.28)" },
    { label: "Ümumi randevu", value: data.summary.appointments, icon: "calendar", color: "#DC2626", bg: "rgba(220,38,38,0.12)", border: "rgba(220,38,38,0.28)" },
    { label: "Bugünkü randevu", value: data.summary.appointments_today, icon: "clock", color: "#DC2626", bg: "rgba(220,38,38,0.12)", border: "rgba(220,38,38,0.28)" },
    { label: "Təsdiq gözləyən", value: data.summary.pending, icon: "alert", warn: true, color: "#EA580C", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.28)" },
    { label: "Tibbi qeyd", value: data.summary.medical_records, icon: "file", color: "var(--primary)", bg: "var(--primary-light)", border: "var(--secondary-light)" },
    { label: "İstifadəçi", value: data.summary.users, icon: "user", color: "var(--primary)", bg: "var(--primary-light)", border: "var(--secondary-light)" },
  ] : [];

  const axisStyle = { fill: "var(--text-light)", fontSize: 12, fontWeight: 600 };

  const tooltipStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--text-dark)",
    fontSize: 13,
    fontWeight: 700,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  };

  const panelStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: 22,
  };

  const panelTitle = {
    fontSize: "1rem", fontWeight: 900, margin: "0 0 4px", color: "var(--text-dark)",
  };

  const panelSub = {
    fontSize: "0.8rem", color: "var(--text-light)", margin: "0 0 18px",
  };

  return (
    <>
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 64px", width: "100%", flex: 1 }}>

        {/* Başlıq */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.8px", color: "var(--primary)", marginBottom: 12
          }}>
            HESABAT VƏ GÖSTƏRİCİLƏR
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px" }}>
            Analitika
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 560 }}>
            Bütün göstəricilər canlı verilənlər bazasından hesablanır.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "80px 0", color: "var(--text-light)", fontWeight: 700 }}>
            Yüklənir...
          </p>
        ) : failed || !data ? (
          <div style={{ ...panelStyle, padding: "60px 30px", textAlign: "center" }}>
            <p style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 6px" }}>Məlumat yüklənə bilmədi</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)", margin: 0 }}>
              Serverlə əlaqəni yoxlayın və səhifəni yeniləyin.
            </p>
          </div>
        ) : (
          <>
            {/* Statistika kartları */}
            <div className="an-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              {cards.map((c) => (
                <div key={c.label} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 18, padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                      stroke={c.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d={ICONS[c.icon]} />
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: "1.6rem", fontWeight: 900, lineHeight: 1,
                      color: c.warn && c.value > 0 ? c.color : "var(--text-dark)",
                    }}>
                      {c.value}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-light)", fontWeight: 700, marginTop: 5 }}>
                      {c.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Aylıq randevular */}
            <div style={{ ...panelStyle, marginBottom: 20 }}>
              <h2 style={panelTitle}>Son 6 Ay Üzrə Randevular</h2>
              <p style={panelSub}>Aylıq randevu dinamikası</p>

              <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={data.monthly} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C62828" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#C62828" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
                  <Area type="monotone" dataKey="count" name="Randevu" stroke="#C62828" strokeWidth={2.5} fill="url(#areaFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* İki qrafik */}
            <div className="an-charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

              <div style={panelStyle}>
                <h2 style={panelTitle}>Randevu Statusları</h2>
                <p style={panelSub}>Ümumi paylanma</p>

                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Pie
                      data={data.by_status}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={88}
                      innerRadius={54}
                      paddingAngle={3}
                      label={({ value }) => value}
                      labelLine={false}
                    >
                      {data.by_status.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="var(--surface)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, fontWeight: 700, color: "var(--text-mid)" }}
                      iconType="circle"
                      iconSize={9}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={panelStyle}>
                <h2 style={panelTitle}>Şöbələr Üzrə Yük</h2>
                <p style={panelSub}>Şöbə başına randevu sayı</p>

                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={data.by_department} layout="vertical" margin={{ top: 6, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={96} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--primary-light)" }} />
                    <Bar dataKey="appointments" name="Randevu" fill="#C62828" radius={[0, 8, 8, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ən aktiv həkimlər */}
            <div style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ ...panelTitle, margin: 0 }}>Ən Aktiv Həkimlər</h2>
                <p style={{ ...panelSub, margin: "4px 0 0" }}>Randevu sayına görə sıralama</p>
              </div>

              {data.top_doctors.length === 0 ? (
                <p style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-light)", fontSize: "0.88rem" }}>
                  Hələ randevu qeydə alınmayıb.
                </p>
              ) : (
                data.top_doctors.map((d, i) => {
                  const max = data.top_doctors[0]?.count || 1;
                  const pct = Math.round((d.count / max) * 100);
                  return (
                    <div key={i} style={{
                      padding: "14px 22px", borderBottom: "1px solid var(--border)",
                      display: "flex", alignItems: "center", gap: 16,
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: i === 0 ? "var(--primary)" : "var(--primary-light)",
                        color: i === 0 ? "#FFFFFF" : "var(--primary)",
                        border: i === 0 ? "none" : "1px solid var(--secondary-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.82rem", fontWeight: 900,
                      }}>
                        {i + 1}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "0.92rem", fontWeight: 800, margin: 0, color: "var(--text-dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {d.name}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: "2px 0 6px" }}>
                          {d.specialization}
                        </p>

                        {/* Progress */}
                        <div style={{ height: 5, borderRadius: 4, background: "var(--bg)", overflow: "hidden" }}>
                          <div style={{
                            width: `${pct}%`, height: "100%", borderRadius: 4,
                            background: "linear-gradient(90deg, #C62828, #8B1A1A)",
                          }} />
                        </div>
                      </div>

                      <span style={{
                        fontSize: "0.8rem", fontWeight: 900, flexShrink: 0, whiteSpace: "nowrap",
                        color: "var(--primary)", background: "var(--primary-light)",
                        border: "1px solid var(--secondary-light)",
                        padding: "5px 13px", borderRadius: 20,
                      }}>
                        {d.count} randevu
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}