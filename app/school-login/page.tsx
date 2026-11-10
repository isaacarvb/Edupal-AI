"use client";

import { useState } from "react";

export default function SchoolLogin() {
  const [mode, setMode] = useState<"admin" | "teacher">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      if (mode === "admin") {
        const res = await fetch("/api/school/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const d = await res.json();
        if (!res.ok) return setMsg(d.error || "Login failed.");
        localStorage.setItem("edupal_school", JSON.stringify({ id: d.schoolId, code: d.code, name: d.name, email: d.email }));
        setMsg("Login successful. Redirecting…");
        setTimeout(() => { window.location.href = "/school/dashboard"; }, 1000);
      } else {
        const res = await fetch("/api/school/teacher-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const d = await res.json();
        if (!res.ok) return setMsg(d.error || "Login failed.");
        localStorage.setItem("edupal_user", d.userId);
        localStorage.setItem("edupal_role", "SCHOOL_TEACHER");
        setMsg("Login successful. Redirecting…");
        setTimeout(() => { window.location.href = `/teacher/dashboard?userId=${d.userId}`; }, 1000);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 20, color: "#333A45" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, background: "rgba(16,185,129,0.18)", border: "1px solid #10B981", color: "#10B981", padding: "8px 22px", borderRadius: 999, display: "inline-block", marginBottom: 16 }}>
          SCHOOL LOGIN
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>Sign In to Your School</h1>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>
          Enter your email and password.
        </p>
      </div>

      {/* Mode toggle: School Admin | Teacher (mirrors individual login page) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setMode("admin")}
          style={{
            flex: 1, height: 44, borderRadius: 10,
            border: "2px solid #1E242E",
            background: mode === "admin" ? "#0F766E" : "#fff",
            color: mode === "admin" ? "#fff" : "#1E242E",
            fontWeight: 800, fontSize: 14, cursor: "pointer"
          }}>
          School Admin
        </button>
        <button
          onClick={() => setMode("teacher")}
          style={{
            flex: 1, height: 44, borderRadius: 10,
            border: "2px solid #1E242E",
            background: mode === "teacher" ? "#0F766E" : "#fff",
            color: mode === "teacher" ? "#fff" : "#1E242E",
            fontWeight: 800, fontSize: 14, cursor: "pointer"
          }}>
          Teacher
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, textTransform: "uppercase" }}>
              {mode === "admin" ? "School Email" : "Teacher Email"}
            </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={mode === "admin" ? "admin@faithacademy.edu.ng" : "teacher@faithacademy.edu.ng"}
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, textTransform: "uppercase" }}>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••"
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
          </div>
          {msg && <p style={{ fontSize: 13, color: msg.startsWith("Login") ? "#166534" : "#DC2626", marginTop: 8 }}>{msg}</p>}
          <button type="submit" disabled={busy}
            style={{ width: "100%", height: 48, borderRadius: 10, border: 0, background: busy ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>
          Don't have an account? <a href="/school-register" style={{ color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Register your school</a>
        </p>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>
          Individual student? <a href="/login" style={{ color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Student login</a>
        </p>
      </div>
    </main>
  );
}
