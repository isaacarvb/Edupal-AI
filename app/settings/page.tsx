"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const input: React.CSSProperties = { width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 15, margin: "6px 0 10px", boxSizing: "border-box" };
const group: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, marginBottom: 12 };

function SettingsInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("SIMPLE");
  const [lite, setLite] = useState(false);
  const [dark, setDark] = useState(false);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [exam, setExam] = useState("");
  const [department, setDepartment] = useState("");
  const [examStart, setExamStart] = useState("");
  const [examEnd, setExamEnd] = useState("");
  const [notConfirmed, setNotConfirmed] = useState(false);
  const [schedMsg, setSchedMsg] = useState("");
  const [schedBusy, setSchedBusy] = useState(false);

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
    setLite(localStorage.getItem("edupal_lite") === "1");
    setDark(localStorage.getItem("edupal_theme") === "dark");
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    if (id) {
      fetch(`/api/profile?userId=${id}`).then((r) => r.json()).then((d) => {
        if (d.profile) {
          setName(d.profile.name ?? "");
          setLanguage(d.profile.language ?? "SIMPLE");
          setExam(d.profile.exam ?? "");
          setDepartment(d.profile.department ?? "");
          setExamStart(d.profile.examStart ?? "");
          setExamEnd(d.profile.examEnd ?? "");
          setNotConfirmed(Number(d.profile.datesConfirmed ?? 1) === 0);
        }
      });
    }
  }, [params]);

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/profile", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...body })
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  async function saveName() {
    if (!name.trim()) return setMsg("Name can't be empty.");
    const r = await post({ name: name.trim() });
    setMsg(r.ok ? "Name updated ✓" : r.data.error || "Failed.");
  }

  async function saveLang() {
    const r = await post({ language });
    setMsg(r.ok ? "Explanation mode saved." : "Could not save.");
  }

  async function changePw() {
    if (next !== confirm) return setMsg("New passwords don't match.");
    const r = await post({ currentPassword: cur, newPassword: next });
    if (!r.ok) return setMsg(r.data.error || "Failed.");
    setCur("");
    setNext("");
    setConfirm("");
    setMsg("Password changed ✓");
  }

  async function saveSchedule() {
    if (!notConfirmed && examStart && examEnd && examEnd < examStart) {
      return setSchedMsg("End date cannot be before start date.");
    }
    setSchedMsg("");
    setSchedBusy(true);
    try {
      const r = await post({
        examStart: notConfirmed ? null : examStart || null,
        examEnd: notConfirmed ? null : examEnd || null,
        datesConfirmed: !notConfirmed
      });
      setSchedMsg(r.ok ? "Schedule saved ✓ — dashboard and countdown updated." : r.data.error || "Could not save.");
    } finally {
      setSchedBusy(false);
    }
  }

  function toggleLite() {
    setLite((v) => {
      localStorage.setItem("edupal_lite", v ? "0" : "1");
      window.dispatchEvent(new Event("edupal-lite"));
      return !v;
    });
  }

  function toggleDark() {
    setDark((v) => {
      localStorage.setItem("edupal_theme", v ? "light" : "dark");
      window.dispatchEvent(new Event("edupal-theme"));
      return !v;
    });
  }

  function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
        <span style={{ fontSize: 15 }}>{label}</span>
        <button onClick={onClick} aria-label={label}
          style={{ width: 52, height: 28, borderRadius: 999, border: "1px solid #CBD5E1", background: on ? "#0F766E" : "#E2E8F0", cursor: "pointer", position: "relative" }}>
          <span style={{ position: "absolute", top: 2, left: on ? 26 : 2, width: 22, height: 22, borderRadius: 999, background: "#fff", transition: "left 0.2s ease" }} />
        </button>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 22 }}>Settings</h1>

      <div style={group}>
        <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>Account</h2>
        <label style={{ fontSize: 13, fontWeight: 700 }}>Display name</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ ...input, marginBottom: 0, flex: 1 }} />
          <button onClick={saveName} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 18px", cursor: "pointer" }}>Save</button>
        </div>
        <h3 style={{ fontSize: 14, margin: "16px 0 4px" }}>Change password</h3>
        <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Current password" style={input} />
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password (6+ chars)" style={input} />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" style={input} />
        <button onClick={changePw} style={{ height: 44, borderRadius: 10, border: 0, background: "#1E242E", color: "#fff", fontWeight: 700, padding: "0 20px", cursor: "pointer" }}>Update password</button>
        {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
      </div>

      <div style={group}>
        <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>Examination schedule</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 8px" }}>
          {exam ? `${exam}${department ? ` • ${department} department` : ""}` : "No exam set yet."} Update your dates here whenever the official timetable is released — no need for a new account.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>Start date</label>
            <input type="date" value={examStart} disabled={notConfirmed} onChange={(e) => setExamStart(e.target.value)} style={input} />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>End date</label>
            <input type="date" value={examEnd} disabled={notConfirmed} onChange={(e) => setExamEnd(e.target.value)} style={input} />
          </div>
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, margin: "0 0 8px", cursor: "pointer" }}>
          <input type="checkbox" checked={notConfirmed} onChange={(e) => setNotConfirmed(e.target.checked)} style={{ width: 18, height: 18 }} />
          My dates are not yet confirmed
        </label>
        <button onClick={saveSchedule} disabled={schedBusy} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 20px", cursor: "pointer", opacity: schedBusy ? 0.6 : 1 }}>
          {schedBusy ? "Saving…" : "Save schedule"}
        </button>
        {schedMsg && <p style={{ fontSize: 14 }}>{schedMsg}</p>}
        <p style={{ fontSize: 13, margin: "8px 0 0" }}>
          <a href={`/onboarding?userId=${userId}`} style={{ color: "#0F766E", fontWeight: 700 }}>Need to change exam, department or subjects? Redo setup</a>
        </p>
      </div>

      <div style={group}>
        <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>Preferences</h2>
        <label style={{ fontSize: 13, fontWeight: 700 }}>Explanation language</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ ...input, marginBottom: 0, flex: 1 }}>
            <option value="SIMPLE">Simple English</option>
            <option value="PIDGIN">Pidgin</option>
          </select>
          <button onClick={saveLang} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 18px", cursor: "pointer" }}>Save</button>
        </div>
        <Toggle on={dark} onClick={toggleDark} label="Dark mode (Appearance)" />
        <Toggle on={lite} onClick={toggleLite} label="Reduced data mode (text-only)" />
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
