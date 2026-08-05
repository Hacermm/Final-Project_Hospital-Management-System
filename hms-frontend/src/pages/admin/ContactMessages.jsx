import { useEffect, useState } from "react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

const subjectLabels = {
  appointment: "Randevu Məlumatı",
  checkup: "Check-Up Paketləri",
  feedback: "Təklif və Rəy",
  other: "Digər",
};

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [message, setMessage] = useState("");

  const load = () => {
    api.get("/contact-messages")
      .then((r) => {
        setMessages(r.data.data);
        setUnread(r.data.unread);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggleOpen = async (m) => {
    setOpenId(openId === m.id ? null : m.id);

    // açılanda oxundu işarələ
    if (openId !== m.id && !m.is_read) {
      try {
        await api.put(`/contact-messages/${m.id}`);
        load();
      } catch { /* səssiz */ }
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Bu mesajı silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/contact-messages/${id}`);
      setMessage("✅ Mesaj silindi");
      load();
    } catch {
      setMessage("❌ Silinə bilmədi");
    }
  };

  const filtered = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Əlaqə Mesajları</h1>
            <p className="text-slate-500 text-sm">
              Saytdan gələn müraciətlər
              {unread > 0 && <span className="text-amber-400 font-medium"> · {unread} oxunmamış</span>}
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { id: "all", label: "Hamısı" },
              { id: "unread", label: `Oxunmamış (${unread})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {message && <p className="mb-4 text-sm font-medium text-slate-300">{message}</p>}

        {loading ? (
          <p className="text-slate-400 text-center py-16">Yüklənir...</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((m) => (
              <div
                key={m.id}
                onClick={() => toggleOpen(m)}
                className={`glass-card p-4 md:p-5 cursor-pointer transition ${
                  !m.is_read ? "border-l-2 border-l-amber-400" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold truncate ${m.is_read ? "text-slate-300" : "text-white"}`}>
                        {m.name}
                      </p>
                      {!m.is_read && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold">
                          YENİ
                        </span>
                      )}
                      {m.subject && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400">
                          {subjectLabels[m.subject] || m.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{m.email} · {m.date}</p>

                    {openId !== m.id && (
                      <p className="text-sm text-slate-400 mt-2 truncate">{m.message}</p>
                    )}
                  </div>

                  <button
                    onClick={(e) => remove(m.id, e)}
                    className="text-red-400 hover:text-red-300 text-sm shrink-0"
                  >
                    Sil
                  </button>
                </div>

                {openId === m.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {m.message}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={`mailto:${m.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        ✉️ Email yaz
                      </a>
                      {m.phone && (
                        <a
                          href={`tel:${m.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-emerald-400 hover:text-emerald-300"
                        >
                          📞 {m.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-slate-500 text-center py-16">
                {filter === "unread" ? "Oxunmamış mesaj yoxdur." : "Hələ mesaj yoxdur."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
