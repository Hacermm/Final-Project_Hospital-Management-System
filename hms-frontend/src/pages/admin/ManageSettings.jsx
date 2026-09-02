import { useState, useContext, useEffect } from 'react';
import api from '../../lib/api';
import { SettingsContext } from '../../context/SettingsContext';

export default function ManageSettings() {
  const { settings, fetchSettings, updateSettingsLocally } = useContext(SettingsContext);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const notify = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post('/settings', { settings: formData });
      notify('Tənzimləmələr uğurla yadda saxlanıldı.', true);
      updateSettingsLocally(formData);
    } catch (err) {
      notify(err.response?.data?.message || 'Xəta baş verdi.', false);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 12,
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-dark)", fontSize: "0.88rem", outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block", fontSize: "0.75rem", fontWeight: 800,
    color: "var(--text-dark)", marginBottom: 6,
    textTransform: "uppercase", letterSpacing: "0.4px",
  };

  if (!settings) return <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-light)" }}>Yüklənir...</p>;

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 64px", width: "100%", flex: 1 }}>
      
      {/* Başlıq */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
        <div>
          <span style={{
            display: "inline-block", background: "#EEF2FF",
            border: "1px solid rgba(79,70,229,0.25)", borderRadius: 30,
            padding: "4px 14px", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.8px", color: "#4F46E5", marginBottom: 12
          }}>
            SİSTEM TƏNZİMLƏMƏLƏRİ
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.8px", color: "var(--text-dark)" }}>
            Ümumi Tənzimləmələr
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-mid)", margin: "8px 0 0", maxWidth: 520 }}>
            Klinika məlumatları və əlaqə vasitələrini buradan idarə edə bilərsiniz.
          </p>
        </div>
      </div>

      {toast && (
        <div style={{
          marginBottom: 20, padding: "13px 18px", borderRadius: 12,
          fontSize: "0.87rem", fontWeight: 700,
          background: toast.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${toast.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
          color: toast.ok ? "#047857" : "#B91C1C",
        }}>
          {toast.ok ? "✓" : "✕"} {toast.text}
        </div>
      )}

      <form
        onSubmit={handleSave}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20, padding: 32,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Klinika Ünvanı *</label>
            <input
              name="clinic_address"
              value={formData.clinic_address || ''}
              onChange={handleChange}
              required
              placeholder="Məsələn: Bakı şəhəri..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Qısa Ünvan (Footer üçün) *</label>
            <input
              name="clinic_short_address"
              value={formData.clinic_short_address || ''}
              onChange={handleChange}
              required
              placeholder="Məsələn: Bakı ş., Azərbaycan"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Telefon Nömrəsi *</label>
            <input
              name="clinic_phone"
              value={formData.clinic_phone || ''}
              onChange={handleChange}
              required
              placeholder="+994 (12) 345 67 89"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp Nömrəsi (Zəng üçün) *</label>
            <input
              name="clinic_whatsapp"
              value={formData.clinic_whatsapp || ''}
              onChange={handleChange}
              required
              placeholder="994501234567"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div>
            <label style={labelStyle}>E-Poçt Ünvanı *</label>
            <input
              type="email"
              name="clinic_email"
              value={formData.clinic_email || ''}
              onChange={handleChange}
              required
              placeholder="info@novacare.az"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>İş Rejimi *</label>
            <input
              name="clinic_working_hours"
              value={formData.clinic_working_hours || ''}
              onChange={handleChange}
              required
              placeholder="Bazar ertəsi - Şənbə: 08:30 - 19:00"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "14px 28px", borderRadius: 12, border: "none",
              background: saving ? "var(--border)" : "#6366F1",
              color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 800,
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? "Yadda Saxlanılır..." : "Yadda Saxla"}
          </button>
        </div>
      </form>
    </main>
  );
}
