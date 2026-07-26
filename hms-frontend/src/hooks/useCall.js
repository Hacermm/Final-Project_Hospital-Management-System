import { useCallback, useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { createEcho } from "../lib/echo";

const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const sanitizeSdp = (sdp) => {
  if (!sdp) return "";
  let str = typeof sdp === "string" ? sdp : String(sdp);
  
  // Unescape backslash-escaped newlines (e.g. "\\r\\n", "\\n" -> "\r\n")
  str = str.replace(/\\r\\n/g, "\r\n").replace(/\\n/g, "\n").replace(/\\r/g, "\r");

  const lines = str.split(/\r\n|\r|\n/);
  return lines.map((l) => l.trim()).filter(Boolean).join("\r\n") + "\r\n";
};

const parsePayload = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }
  return payload;
};

const formatSessionDescription = (rawDesc) => {
  const desc = parsePayload(rawDesc);
  if (!desc) return null;

  const type = desc.type || "offer";
  const sdp = sanitizeSdp(desc.sdp || desc);

  return new RTCSessionDescription({
    type,
    sdp,
  });
};

export function useCall(meId) {
  const [callState, setCallState] = useState("idle");
  const [peer, setPeer] = useState(null);
  const [error, setError] = useState("");

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const echoRef = useRef(null);
  const pendingIce = useRef([]);
  const peerRef = useRef(null);
  const incomingOfferRef = useRef(null);

  const sendSignal = (toUserId, type, payload = null) =>
    api.post("/call/signal", { to_user_id: toUserId, type, payload });

  useEffect(() => {
    const el = document.createElement("audio");
    el.autoplay = true;
    el.style.display = "none";
    document.body.appendChild(el);
    remoteAudioRef.current = el;

    return () => {
      el.srcObject = null;
      el.remove();
      remoteAudioRef.current = null;
    };
  }, []);

  const cleanup = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pendingIce.current = [];
    incomingOfferRef.current = null;
    peerRef.current = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    setCallState("idle");
    setPeer(null);
  }, []);

  const setPeerBoth = (p) => {
    peerRef.current = p;
    setPeer(p);
  };

  const createPeer = useCallback((otherUserId) => {
    const pc = new RTCPeerConnection(ICE_CONFIG);

    pc.onicecandidate = (e) => {
      if (e.candidate) sendSignal(otherUserId, "ice", e.candidate);
    };

    pc.ontrack = (e) => {
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = e.streams[0];
    };

    pc.onconnectionstatechange = () => {
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        cleanup();
      }
    };

    pcRef.current = pc;
    return pc;
  }, [cleanup]);

  const getMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    localStreamRef.current = stream;
    return stream;
  };

  const startCall = async (userId, userName) => {
    setError("");
    try {
      setPeerBoth({ id: userId, name: userName });
      setCallState("calling");

      const stream = await getMic();
      const pc = createPeer(userId);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await sendSignal(userId, "offer", { type: offer.type, sdp: offer.sdp });
   } catch (err) {
      console.error("ZƏNG XƏTASI (startCall):", err?.name, err?.message, err);
      setError("Zəng başlamadı: " + (err?.message || err?.name || "naməlum"));
      cleanup();
    }
  };

  const acceptCall = useCallback(async () => {
    const offer = incomingOfferRef.current;
    const p = peerRef.current;
    if (!offer || !p) return;

    try {
      const stream = await getMic();
      const pc = createPeer(p.id);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      await pc.setRemoteDescription(formatSessionDescription(offer));

      for (const c of pendingIce.current) {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      }
      pendingIce.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await sendSignal(p.id, "answer", { type: answer.type, sdp: answer.sdp });

      setCallState("active");
    } catch (err) {
      console.error("ZƏNG XƏTASI (acceptCall):", err?.name, err?.message, err);
      setError("Qəbul edilmədi: " + (err?.message || err?.name || "naməlum"));
      if (p) sendSignal(p.id, "reject");
      cleanup();
    
    }
  }, [createPeer, cleanup]);

  const rejectCall = () => {
    if (peerRef.current) sendSignal(peerRef.current.id, "reject");
    cleanup();
  };

  const endCall = () => {
    if (peerRef.current) sendSignal(peerRef.current.id, "end");
    cleanup();
  };

  useEffect(() => {
    if (!meId) return;

    if (!echoRef.current) echoRef.current = createEcho();
    const channelName = `user.${meId}`;
    const channel = echoRef.current.private(channelName);

    channel.listen(".call.signal", async (e) => {
      const pc = pcRef.current;

      if (e.type === "offer") {
        if (pcRef.current) {
          sendSignal(e.from_user_id, "reject");
          return;
        }
        incomingOfferRef.current = e.payload;
        setPeerBoth({ id: e.from_user_id, name: e.from_name });
        setCallState("incoming");
      }

      else if (e.type === "answer" && pc) {
        await pc.setRemoteDescription(formatSessionDescription(e.payload));
        for (const c of pendingIce.current) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        pendingIce.current = [];
        setCallState("active");
      }

      else if (e.type === "ice") {
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(e.payload));
        } else {
          pendingIce.current.push(e.payload);
        }
      }

      else if (e.type === "reject") {
        setError("Zəng rədd edildi və ya cavabsız qaldı.");
        cleanup();
      }

      else if (e.type === "end") {
        cleanup();
      }
    });

    return () => {
      echoRef.current?.leave(channelName);
    };
  }, [meId, cleanup]);

  return {
    callState,
    peer,
    error,
    startCall,
    accept: acceptCall,
    reject: rejectCall,
    end: endCall,
    clearError: () => setError(""),
  };
}