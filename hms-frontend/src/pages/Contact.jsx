import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import { SettingsContext } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const { settings } = useContext(SettingsContext);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      const msg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        t("Mesaj göndərilə bilmədi. Bir azdan cəhd edin.");
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-dark)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background-color 0.3s ease, color 0.3s ease", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Qısa, açıq başlıq */}
      <section style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "48px 24px 40px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", background: "var(--primary-light)",
            border: "1px solid var(--secondary-light)", borderRadius: 30,
            padding: "5px 16px", fontSize: "0.74rem", fontWeight: 800,
            letterSpacing: "1px", color: "var(--primary)", marginBottom: 14,
          }}>
            {t("24/7 DƏSTƏK")}
          </span>
          <h1 style={{
            fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", fontWeight: 900,
            color: "var(--text-dark)", letterSpacing: "-1px", margin: 0, lineHeight: 1.15
          }}>
            {t("Əlaqə")}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-mid)", marginTop: 10, maxWidth: 560 }}>
            {t("Suallarınızı verin, təklif bildirin və ya təcili yardım xidmətimizdən yararlanın.")}
          </p>

          {/* Sürətli əlaqə — kiçik chip-lər */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            <a href={`tel:${settings?.clinic_phone?.replace(/[^0-9+]/g, '') || "+994123456789"}`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 30,
              background: "var(--primary)", color: "#FFFFFF",
              fontSize: "0.85rem", fontWeight: 700, textDecoration: "none",
            }}>
              📞 {settings?.clinic_phone || "+994 (12) 345 67 89"}
            </a>
            <a href={`https://wa.me/${settings?.clinic_whatsapp || "994123456789"}`} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 30,
              background: "#25D366", color: "#FFFFFF",
              fontSize: "0.85rem", fontWeight: 700, textDecoration: "none",
            }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 80px", width: "100%", flex: 1 }}>
        <div className="responsive-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 36, alignItems: "start" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="ac-card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)", borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 24 }}>
                {t("Klinika Məlumatları")}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                    📍
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-dark)", fontWeight: 800, fontSize: "0.9rem", marginBottom: 2 }}>{t("Ünvan:")}</strong>
                    <span style={{ color: "var(--text-mid)", fontSize: "0.88rem" }}>
                      {settings?.clinic_address || t("Bakı şəhəri, Nərimanov r., Atatürk pr. 58")}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                    🚨
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-dark)", fontWeight: 800, fontSize: "0.9rem", marginBottom: 2 }}>{t("Təcili Əlaqə:")}</strong>
                    <a href={`tel:${settings?.clinic_phone?.replace(/[^0-9+]/g, '') || "+994123456789"}`} style={{ color: "var(--primary)", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}>
                      {settings?.clinic_phone || "+994 (12) 345 67 89"}
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                    🕐
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-dark)", fontWeight: 800, fontSize: "0.9rem", marginBottom: 2 }}>{t("İş Rejimi:")}</strong>
                    <span style={{ color: "var(--text-mid)", fontSize: "0.88rem" }}>
                      {settings?.clinic_working_hours || t("Bazar ertəsi - Şənbə: 08:30 - 19:00")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #18181C 0%, #27272A 100%)", border: "1px solid var(--border)", borderRadius: 20, padding: 28, color: "#FFFFFF" }}>
              <span style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "0.72rem", fontWeight: 800, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                {t("TƏCİLİ YARDIM")}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: 14, marginBottom: 8, color: "#FFFFFF" }}>{t("24/7 Qaynar Xətt Və WhatsApp")}</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.86rem", lineHeight: 1.6, marginBottom: 20 }}>
                {t("Təcili hallarda və ya canlı məsləhət üçün dəstək mərkəzimiz WhatsApp üzərindən 24/7 aktivdir.")}
              </p>
              <a
                href={`https://wa.me/${settings?.clinic_whatsapp || "994123456789"}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#25D366",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  padding: "12px",
                  borderRadius: 12,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37,211,102,0.3)",
                }}
              >
                 {t("WhatsApp İlə Yazın")}
              </a>
            </div>
          </div>

          <div className="ac-card" style={{ padding: 36 }}>
            {submitted ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 900, fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  ✅
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: 12 }}>{t("Mesajınız Göndərildi!")}</h2>
                <p style={{ fontSize: "0.92rem", color: "var(--text-light)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 28px" }}>
                  {t("Müraciətiniz üçün təşəkkür edirik. NovaCare komandası qısa zamanda sizinlə əlaqə saxlayacaq.")}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="ac-btn"
                  style={{ padding: "12px 28px", fontSize: "0.88rem" }}
                >
                  {t("Yeni Mesaj Göndər")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--primary)", background: "var(--primary-light)", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--secondary-light)", display: "inline-block", marginBottom: 8 }}>
                    {t("MÜRACİƏT FORMASI")}
                  </span>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-dark)" }}>{t("Bizə Online Yazın")}</h2>
                </div>

                <div className="responsive-2x2-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      {t("Ad Və Soyad *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t("Əli Məmmədov")}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      {t("E-Poçt Ünvanı *")}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@domain.com"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div className="responsive-2x2-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      {t("Telefon Nömrəsi *")}
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+994 50 123 45 67"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                      {t("Mövzu")}
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-dark)",
                        fontSize: "0.88rem",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">{t("Mövzu seçin")}</option>
                      <option value="appointment">{t("Randevu Məlumatı")}</option>
                      <option value="checkup">{t("Check-Up Paketləri")}</option>
                      <option value="feedback">{t("Təklif Və Rəy")}</option>
                      <option value="other">{t("Digər")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                    {t("Mesajınız *")}
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t("Müraciətinizi detal qeyd edin...")}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "1.5px solid var(--border)",
                      background: "var(--bg)",
                      color: "var(--text-dark)",
                      fontSize: "0.88rem",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>

                {error && (
                  <p style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textAlign: "center" }}>
                    ❌ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="ac-btn"
                  style={{ padding: "14px", fontSize: "0.9rem", width: "100%", marginTop: 8, opacity: sending ? 0.6 : 1 }}
                >
                  {sending ? t("GÖNDƏRİLİR...") : t("MESAJI GÖNDƏR →")}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <footer className="ac-footer">
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <div className="ac-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, background: "var(--primary)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <span style={{ fontWeight: 900, color: "#FFFFFF", fontSize: "1.2rem" }}>NovaCare</span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 300 }}>
                {t("Müasir xəstəxana idarəetmə sistemi — peşəkar həkimlər, onlayn randevu və rəqəmsal səhiyyə xidmətləri.")}
              </p>
            </div>

            <div>
              <div className="ac-footer-title">{t("Xidmətlər")}</div>
              <Link to="/departments" className="ac-footer-link">{t("Şöbələr")}</Link>
              <Link to="/doctors" className="ac-footer-link">{t("Həkimlər")}</Link>
              <Link to="/patient/book" className="ac-footer-link">{t("Randevu Al")}</Link>
              <Link to="/ai" className="ac-footer-link">{t("AI")}</Link>
            </div>

            <div>
              <div className="ac-footer-title">{t("Platforma")}</div>
              <Link to="/about" className="ac-footer-link">{t("Haqqımızda")}</Link>
              <Link to="/contact" className="ac-footer-link">{t("Əlaqə")}</Link>
              <Link to="/login" className="ac-footer-link">{t("Giriş")}</Link>
              <Link to="/register" className="ac-footer-link">{t("Qeydiyyat")}</Link>
            </div>

            <div>
              <div className="ac-footer-title">{t("Əlaqə")}</div>
              <a href="tel:+994123456789" className="ac-footer-link">+994 (12) 345 67 89</a>
              <a href="mailto:info@novacare.az" className="ac-footer-link">info@novacare.az</a>
              <span className="ac-footer-link" style={{ cursor: "default" }}>{t("Bakı ş., Azərbaycan")}</span>
            </div>
          </div>

          <div className="ac-footer-bottom">
            {t("© 2026 NovaCare Hospital. Bütün hüquqlar qorunur.")}
          </div>
        </div>
      </footer>

    </div>
  );
}
