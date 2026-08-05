import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
export default function MyLabTests() {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/lab-tests")
      .then((r) => setLabTests(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const download = async (id, fileName) => {
    setMessage("");
    try {
      const res = await api.get(`/lab-tests/${id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage(" PDF faylı endirilə bilmədi.");
    }
  };

  return (
    <>
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
                Laboratoriya Analiz Nəticələri
              </h1>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)", margin: 0 }}>
                Həkimləriniz tərəfindən verilmiş laboratoriya müayinələrinin elektron PDF sənədləri
              </p>
            </div>
            <span style={{ padding: "6px 16px", borderRadius: 20, fontSize: "0.82rem", fontWeight: 900, background: "var(--primary-light)", color: "var(--primary)" }}>
              {labTests.length} Analiz
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

        {/* Lab Tests List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-light)", fontWeight: 700, fontSize: "0.95rem" }} className="animate-pulse">
              Analizlər yüklənir...
            </div>
          )}

          {!loading && labTests.length === 0 && (
            <div className="ac-card" style={{ padding: "60px 32px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}></div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 8 }}>
                Hələ Laboratoriya Analiziniz Yoxdur
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)" }}>
                Analiz nəticələriniz hazır olduqda həkiminiz tərəfindən sistemə PDF olaraq əlavə ediləcəkdir.
              </p>
            </div>
          )}

          {!loading && labTests.map((t) => (
            <div
              key={t.id}
              className="ac-card"
              style={{
                padding: "20px 24px",
                display: "flex",
                justify: "space-between",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, overflow: "hidden" }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: "var(--primary-light)",
                    border: "1px solid var(--secondary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    shrink: 0,
                  }}
                >
                  
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 900, color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--primary)", margin: "0 0 4px 0" }}>
                    {t.doctor} — {t.date}
                  </p>
                  {t.description && (
                    <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: 0 }}>
                      {t.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => download(t.id, t.file_name)}
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
                 PDF ENDİR
              </button>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
