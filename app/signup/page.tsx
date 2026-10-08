"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const input: React.CSSProperties = { width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px", boxSizing: "border-box" };

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = params.get("ref") ?? "";

  async function submit() {
    if (busy) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, referredBy: ref || undefined })
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.error || "Something went wrong");
      localStorage.setItem("edupal_user", data.userId);
      localStorage.setItem("edupal_role", data.role ?? "STUDENT");
      localStorage.setItem("edupal_role", data.role ?? "STUDENT");
      router.push(data.role === "TEACHER" ? `/teacher?userId=${data.userId}` : `/onboarding?userId=${data.userId}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", color: "#333A45" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", background: "#fff", border: "2px solid #1E242E", borderRadius: 16, padding: 24, boxShadow: "6px 6px 0 #0F766E" }}>
        <h1 style={{ color: "#1E242E", fontSize: 24, margin: "0 0 4px" }}>Create your account</h1>
        <p style={{ fontSize: 14, color: "#5F6E7F", margin: "0 0 12px" }}>Step 1 of 2 — your study plan comes next.</p>
        {ref !== "" && <p style={{ fontSize: 14, background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "8px 12px" }}>🎁 Invited by a classmate — they earn bonus questions when you join!</p>}
        <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>I AM A…</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={input}>
          <option value="STUDENT">Student — practice + exams</option>
          <option value="TEACHER">Teacher — manage a class</option>
        </select>
        <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>FULL NAME</label>
        <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amina Bello" />
        <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>EMAIL ADDRESS</label>
        <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>PASSWORD</label>
        <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" onKeyDown={(e) => e.key === "Enter" && submit()} />
        {err && <p style={{ fontSize: 14, color: "#DC2626" }}>{err}</p>}
        <button onClick={submit} disabled={busy}
          style={{ display: "block", width: "100%", height: 52, borderRadius: 12, border: "2px solid #1E242E", background: "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "4px 4px 0 #1E242E" }}>
          {busy ? "Creating…" : "Create account & continue"}
        </button>
        <p style={{ fontSize: 14, marginTop: 12 }}>Already have an account? <a href="/login" style={{ color: "#0F766E", fontWeight: 700 }}>Sign in</a></p>
      </div>
    </main>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <SignupInner />
    </Suspense>
  );
}
