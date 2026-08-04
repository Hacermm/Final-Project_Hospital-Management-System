export default function CallOverlay({ callState, peer, error, onAccept, onReject, onEnd, onClearError }) {
  
  if (callState === "idle" && error) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-rose-600/95 text-white px-6 py-3.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-4 animate-fade-in-up border border-rose-500/50">
        <span className="text-sm font-semibold">{error}</span>
        <button onClick={onClearError} className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10" title="Bağla"></button>
      </div>
    );
  }

  if (callState === "idle") return null;

  const getInitials = (name) =>
    name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  const label = {
    calling: "Zəng edilir...",
    incoming: "Gələn tibbi video-zəng",
    active: "Canlı danışıq gedir",
  }[callState];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-xl flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="card-dark p-10 max-w-sm w-full text-center flex flex-col items-center shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Soft glow indicator */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative mb-7">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg border border-white/20">
            {getInitials(peer?.name)}
          </div>
          {(callState === "calling" || callState === "incoming") && (
            <div className="absolute -inset-2 rounded-2xl border-2 border-blue-400/40 animate-ping" />
          )}
        </div>

        <h2 className="text-2xl font-black text-white mb-1.5">{peer?.name || "Pasiyent / Həkim"}</h2>
        <p className="text-slate-300 text-sm font-medium mb-4">{label}</p>

        {callState === "active" && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Bağlantı şifrələnib
          </div>
        )}

        {callState !== "active" && <div className="mb-8" />}

        {/* Actions */}
        <div className="flex items-center justify-center gap-8 w-full">
          {callState === "incoming" && (
            <button
              onClick={onAccept}
              className="w-16 h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
              title="Qəbul et"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
          )}

          <button
            onClick={callState === "incoming" ? onReject : onEnd}
            className="w-16 h-16 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            title={callState === "incoming" ? "Rədd et" : "Bitir"}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(135deg)" }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}