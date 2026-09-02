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
    incoming: "Gələn tibbi zəng",
    active: "Canlı danışıq gedir",
  }[callState];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-2xl flex flex-col items-center justify-center px-6 transition-all duration-500 animate-fade-in">
      <div className="relative p-10 max-w-sm w-full text-center flex flex-col items-center rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-visible">
        {/* Soft glow indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Avatar */}
        <div className="relative mb-8 z-10">
          {(callState === "calling" || callState === "incoming") && (
            <>
              <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute -inset-4 rounded-full border border-blue-400/20 animate-pulse" />
            </>
          )}
          
          {peer?.photo ? (
            <img 
              src={peer.photo} 
              alt={peer.name} 
              className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-white/10 relative z-10"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl border-4 border-white/10 relative z-10">
              {getInitials(peer?.name)}
            </div>
          )}
        </div>

        <h2 className="text-3xl font-black text-white mb-2 tracking-tight z-10">{peer?.name || "Pasiyent / Həkim"}</h2>
        <p className="text-blue-200/80 text-sm font-medium mb-6 uppercase tracking-widest z-10">{label}</p>

        {callState === "active" && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 z-10 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
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