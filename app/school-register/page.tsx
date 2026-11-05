"use client";

import { useState } from "react";

export default function SchoolRegister() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [students, setStudents] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const generateCode = (schoolName: string): string => {
    const prefix = schoolName.trim().slice(0, 3).toUpperCase().padEnd(3, "X");
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/school/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, location, email, password, students: Number(students) || 0 })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Registration failed.");
      // Store school session
      localStorage.setItem("edupal_school", JSON.stringify({ id: d.schoolId, code: d.code, name: d.name, email }));
      setMsg(`Registered! School code: ${d.code}. Redirecting…`);
      setTimeout(() => { window.location.href = "/school/subscription"; }, 1500);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 20, color: "#333A45" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, background: "rgba(16,185,129,0.18)", border: "1px solid #10B981", color: "#10B981", padding: "8px 22px", borderRadius: 999, display: "inline-block", marginBottom: 16 }}>
          SCHOOL REGISTRATION
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>Register Your School</h1>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>
          Create your school account. Your email and password will be your school login.
        </p>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, textTransform: "uppercase" }}>School Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Faith Academy"
                style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, textTransform: "uppercase" }}>Number of Students</label>
              <input value={students} onChange={(e) => setStudents(e.target.value)} type="number" min={1} placeholder="e.g. 200"
                style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, textTransform: "uppercase" }}>Address / Location</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 12 Allen Avenue, Ikeja"
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, textTransform: "uppercase" }}>School Email (Login)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@faithacademy.edu.ng"
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, textTransform: "uppercase" }}>Password (Login)</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••"
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
          </div>
          {msg && <p style={{ fontSize: 13, color: msg.startsWith("Registered") ? "#166534" : "#DC2626", marginTop: 8 }}>{msg}</p>}
          <button type="submit" disabled={busy}
            style={{ width: "100%", height: 48, borderRadius: 10, border: 0, background: busy ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Creating Account…" : "Register School"}
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>
          Already registered? <a href="/school-login" style={{ color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Sign in to your school</a>
        </p>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>
          Not a school? <a href="/signup" style={{ color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Register as individual student</a>
        </p>
      </div>
    </main>
  );
}
