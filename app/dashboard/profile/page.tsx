"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type P = { name: string | null; email: string; avatar: string | null; level: string; exam: string; examDate: string | null; language: string };

function ProfileInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [p, setP] = useState<P | null>(null);
  const [language, setLanguage] = useState("SIMPLE");
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  function load(id: string) {
    fetch(`/api/profile?userId=${id}`).then((r) => r.json()).then((d) => {
      if (d.profile) {
        setP(d.profile);
        setLanguage(d.profile.language ?? "SIMPLE");
      }
    });
  }

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (id) load(id);
  }, [params]);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 180000) return setMsg("Image too big — under ~180KB please.");
    const r = new FileReader();
    r.onload = async () => {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, avatar: r.result })
      });
      setMsg(res.ok ? "Photo updated." : "Upload failed.");
      if (res.ok) load(userId);
    };
    r.readAsDataURL(f);
  }

  async function saveLang() {
    const res = await fetch("/api/profile", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, language })
    });
    setMsg(res.ok ? "Explanation mode saved." : "Could not save.");
  }

  async function changePw() {
    setMsg("");
    if (next !== confirm) return setMsg("New passwords don't match.");
    const res = await fetch("/api/profile", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, currentPassword: cur, newPassword: next })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Failed.");
    setCur("");
    setNext("");
    setConfirm("");
    setMsg("Password changed ✓");
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;
  if (!p) return <main style={{ padding: 20 }}>Loading…</main>;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My profile</h1>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, marginBottom: 12, display: "flex", gap: 14, alignItems: "center" }}>
        {p.avatar
          ? <img src={p.avatar} alt="Profile" style={{ width: 64, height: 64, borderRadius: 999, objectFit: "cover" }} />
          : <span style={{ width: 64, height: 64, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, fontSize: 24, textAlign: "center", lineHeight: "64px" }}>{(p.name ?? "S").charAt(0).toUpperCase()}</span>}
        <div>
          <strong style={{ fontSize: 18 }}>{p.name ?? "Student"}</strong>
          <div style={{ fontSize: 13, color: "#5F6E7F" }}>{p.email} • {p.level} • {p.exam}{p.examDate ? ` • ${p.examDate}` : ""}</div>
          <label style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, cursor: "pointer" }}>
            Change photo
            <input type="file" accept="image/*" onChange={pick} style={{ display: "none" }} />
          </label>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>Explanation mode</h2>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 15 }}>
          <option value="SIMPLE">Simple English</option>
          <option value="PIDGIN">Pidgin</option>
        </select>
        <button onClick={saveLang} style={{ marginTop: 8, height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 20px", cursor: "pointer" }}>Save</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>Change password</h2>
        <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Current password" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 15, marginBottom: 8, boxSizing: "border-box" }} />
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password (6+ chars)" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 15, marginBottom: 8, boxSizing: "border-box" }} />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 15, marginBottom: 8, boxSizing: "border-box" }} />
        {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
        <button onClick={changePw} style={{ height: 44, borderRadius: 10, border: 0, background: "#1E242E", color: "#fff", fontWeight: 700, padding: "0 20px", cursor: "pointer" }}>Update password</button>
      </div>
    </main>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <ProfileInner />
    </Suspense>
  );
}
