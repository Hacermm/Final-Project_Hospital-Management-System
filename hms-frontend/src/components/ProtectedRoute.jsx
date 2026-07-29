import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../lib/api";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState(token ? "checking" : "guest"); // checking | allowed | denied | guest

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    api.get("/me")
      .then((r) => {
        if (cancelled) return;

        const realRole = r.data.role;

        localStorage.setItem("role", realRole);

        if (!allowedRole) {
          setStatus("allowed");
          return;
        }

        const ok =
          realRole === allowedRole ||
          (allowedRole === "admin" && realRole === "super_admin");

        setStatus(ok ? "allowed" : "denied");
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.clear();
        setStatus("guest");
      });

    return () => {
      cancelled = true;
    };
  }, [token, allowedRole]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="60"
              strokeDashoffset="20"
              strokeLinecap="round"
            />
          </svg>
          Yoxlanılır...
        </div>
      </div>
    );
  }

  if (status === "guest") return <Navigate to="/login" replace />;
  if (status === "denied") return <Navigate to="/" replace />;

  return children;
}