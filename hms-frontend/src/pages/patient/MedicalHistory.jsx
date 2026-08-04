import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/medical-records")
      .then((r) => setRecords(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const downloadPdf = async (recordId) => {
    setMessage("");
    try {
      const response = await api.get(`/medical-records/${recordId}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resept-${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage(" PDF yüklənə bilmədi.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 80px", width: "100%", flex: 1, boxSizing: "border-box" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: 24 }}>
          <Link to="/patient" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--primary)", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            ← Pasiyent Kabinetinə Qayıt
          </Link>
        </div>

        {/* Title Header Card */}
        <div className="ac-card" style={{ padding: "28px 32px", marginBottom: 28 }}>
          <div style={{ display: "flex", justify: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                Tibbi Tarixçəm Və Reseptlər
              </h1>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)", margin: 0 }}>
                Diaqnozlarınız, həkimləriniz tərəfindən yazılmış reseptlər və müalicə planları
              </p>
            </div>
            <span style={{ padding: "6px 16px", borderRadius: 20, fontSize: "0.82rem", fontWeight: 900, background: "var(--primary-light)", color: "var(--primary)" }}>
              {records.length} Tibbi Qeyd
            </span>
          </div>
        </div>

        {message && (
          <p
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              fontSize: "0.88rem",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 20,
              background: "rgba(239,68,68,0.1)",
              color: "#dc2626",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            {message}
          </p>
        )}

        {/* Medical Records List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-light)", fontWeight: 700, fontSize: "0.95rem" }} className="animate-pulse">
              Tibbi tarixçə yüklənir...
            </div>
          )}

          {!loading && records.length === 0 && (
            <div className="ac-card" style={{ padding: "60px 32px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}></div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 8 }}>
                Hələ Tibbi Tarixçə Qeydiniz Yoxdur
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)" }}>
                Həkim müayinəsindən keçdikdən sonra diaqnozlarınız və reseptləriniz burada əks olunacaq.
              </p>
            </div>
          )}

          {!loading && records.map((r) => (
            <div key={r.id} className="ac-card" style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                    Diaqnoz: {r.diagnosis}
                  </h3>
                  <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--primary)", margin: "0 0 4px 0" }}>
                    {r.doctor?.name} — {r.doctor?.specialization}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>
                     Tarix: {r.date}
                  </p>
                </div>

                <button
                  onClick={() => downloadPdf(r.id)}
                  className="ac-btn"
                  style={{
                    padding: "10px 20px",
                    fontSize: "0.84rem",
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                   RESEPTİ PDF YÜKLƏ
                </button>
              </div>

              {r.notes && (
                <div style={{ padding: "14px 18px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--text-mid)", fontStyle: "italic", marginBottom: 16 }}>
                  Həkim Qeydi: {r.notes}
                </div>
              )}

              {r.prescriptions?.length > 0 && (
                <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 900, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
                    Təyin Olunmuş Dərmanlar & Resept
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {r.prescriptions.map((p) => (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem", background: "var(--bg)", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "1.1rem" }}></span>
                        <span style={{ fontWeight: 800, color: "var(--primary)" }}>{p.medicine}</span>
                        {p.dosage && <span style={{ color: "var(--text-mid)", fontWeight: 600 }}>— {p.dosage}</span>}
                        {p.duration && <span style={{ color: "var(--text-light)", fontSize: "0.78rem" }}>({p.duration})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
