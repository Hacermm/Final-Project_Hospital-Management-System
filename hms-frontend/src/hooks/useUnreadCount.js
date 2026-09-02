import { useState, useEffect, useRef } from "react";
import api from "../lib/api";
import { createEcho } from "../lib/echo";

export function useUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const echoRef = useRef(null);

  useEffect(() => {
    let channel = null;
    let userId = null;

    const init = async () => {
      try {
        const me = await api.get("/me");
        userId = me.data.user.id;

        const r = await api.get("/unread-count");
        setUnreadCount(r.data.total || 0);

        if (!echoRef.current) echoRef.current = createEcho();

        channel = echoRef.current.private(`user.${userId}`);
        channel.listen(".message.sent", () => {
          // Gələn yeni mesaj olduqda sayğacı artırırıq
          setUnreadCount(prev => prev + 1);
        });

      } catch (error) {
        console.error("Failed to fetch unread count", error);
      }
    };

    init();
    
    // Yoxlama məqsədilə, əmin olmaq üçün hər 30 saniyədən bir yoxlayırıq. (Fallback)
    const interval = setInterval(async () => {
        try {
          const r = await api.get("/unread-count");
          setUnreadCount(r.data.total || 0);
        } catch(e){}
    }, 30000);

    return () => {
      clearInterval(interval);
      if (channel && userId) {
        echoRef.current?.leave(`user.${userId}`);
      }
    };
  }, []);

  return unreadCount;
}
