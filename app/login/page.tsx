"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email.trim() || !password || busy) return;
    setBusy(true);
    setErr("");
    try {
      const res = await signIn("credentials", { email: email.trim(), password, redirect: false });
      if (!res?.ok) return setErr("Wrong email or password. Try again or start your journey below.");
      const session = await fetch("/api/auth/session").then((r) => r.json());
      const id = session?.user?.id as string | undefined;
      const role = (session?.user as { role?: string } | undefined)?.role ?? "STUDENT";
      if (!id || id === "local-amina") {
        // Dev seed user has no real dashboard data.
        localStorage.removeItem("edupal_user");
        return setErr("Dev account has no dashboard yet — create yours via Start your journey.");
      }
      localStorage.setItem("edupal_user", id);
      localStorage.setItem("edupal_role", role);
      router.push(role === "TEACHER" ? `/teacher?userId=${id}` : `/dashboard?userId=${id}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "24px auto", padding: "0 16px", color: "#333A45" }}>
      <div style={{ background: "#fff", border: "2px solid #1E242E", borderRadius: 16, padding: 20, boxShadow: "6px 6px 0 #0F766E" }}>
        <h1 style={{ color: "#1E242E", fontSize: 22, margin: "0 0 12px" }}>Welcome back</h1>
        <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>EMAIL</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com"
          style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #1E242E", padding: "0 12px", fontSize: 16, margin: "6px 0 12px", boxSizing: "border-box" }} />
        <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>PASSWORD</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••"
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #1E242E", padding: "0 12px", fontSize: 16, margin: "6px 0 12px", boxSizing: "border-box" }} />
        {err && <p style={{ fontSize: 14, color: "#DC2626" }}>{err}</p>}
        <button onClick={submit} disabled={busy}
          style={{ display: "block", width: "100%", height: 48, borderRadius: 10, border: "2px solid #1E242E", background: "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "4px 4px 0 #1E242E" }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p style={{ fontSize: 14, marginTop: 12 }}>
          <a href="/signup" style={{ color: "#0F766E", fontWeight: 700 }}>New here? Start your journey</a>
        </p>
        <p style={{ fontSize: 12, color: "#5F6E7F" }}>New accounts are created during onboarding with your level, exam and subjects.</p>
      </div>
    </main>
  );
}
