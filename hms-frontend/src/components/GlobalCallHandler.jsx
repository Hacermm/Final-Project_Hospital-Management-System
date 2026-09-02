import { useEffect, useState, createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/api";
import { useCall } from "../hooks/useCall";
import CallOverlay from "./CallOverlay";

export const CallContext = createContext(null);

export function useGlobalCall() {
  return useContext(CallContext);
}

export default function GlobalCallHandler({ children }) {
  const [meId, setMeId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchMe = async () => {
      if (!localStorage.getItem("token")) {
        setMeId(null);
        return;
      }
      if (meId) return; // Already fetched
      
      try {
        const res = await api.get("/me");
        setMeId(res.data.user.id);
      } catch (err) {
        setMeId(null);
      }
    };
    fetchMe();
  }, [location.pathname, meId]);

  const callManager = useCall(meId);

  // Auto clear missed call toast after 10 seconds
  useEffect(() => {
    if (callManager.missedCall) {
      const t = setTimeout(() => {
        callManager.clearMissedCall();
      }, 10000);
      return () => clearTimeout(t);
    }
  }, [callManager.missedCall]);

  return (
    <CallContext.Provider value={callManager}>
      {children}
      <CallOverlay
        callState={callManager.callState}
        peer={callManager.peer}
        error={callManager.error}
        onAccept={callManager.accept}
        onReject={callManager.reject}
        onEnd={callManager.end}
        onClearError={callManager.clearError}
      />
      {callManager.missedCall && (
        <div className="fixed top-6 right-6 z-[200] bg-white border-l-4 border-rose-500 shadow-xl rounded-lg p-4 flex items-start gap-4 max-w-sm animate-fade-in">
          <div className="bg-rose-100 p-2 rounded-full text-rose-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 16.05A3.13 3.13 0 0 0 16.89 16c1.19-.08 2.06.31 3.11 1 1.25.82 2 2.18 2 3.65a1 1 0 0 1-1 1h-7.5"/>
              <path d="M4 21.65a1 1 0 0 1-1-1c0-1.47.75-2.83 2-3.65 1.05-.69 1.92-1.08 3.11-1a3.13 3.13 0 0 1 .89.05"/>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              <line x1="2" y1="2" x2="22" y2="22"/>
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-sm">Buraxılmış zəng</h4>
            <p className="text-gray-600 text-xs mt-0.5">
              Sizə <b>{callManager.missedCall.name}</b> tərəfindən zəng gəlmişdi.
            </p>
          </div>
          <button onClick={callManager.clearMissedCall} className="text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}
    </CallContext.Provider>
  );
}
