"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SettingsInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [language, setLanguage] = useState("SIMPLE");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);

  async function save() {
    setMsg("");
    if (!userId) return setMsg("No account found — finish onboarding first.");
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, language })
    });
    const data = await res.json();
    setMsg(res.ok ? "Saved." : data.error || "Could not save.");
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 22 }}>Settings</h1>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16 }}>
        <label>Study language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}
          style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px" }}>
          <option value="SIMPLE">Simple English</option>
          <option value="PIDGIN">Pidgin</option>
        </select>
        {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
        <button onClick={save} style={{ height: 48, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 24px", cursor: "pointer" }}>Save</button>
      </div>
    </main>
  );
}

export default function Settings() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <SettingsInner />
    </Suspense>
  );
}
