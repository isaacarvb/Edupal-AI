"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const input: React.CSSProperties = { width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 15, margin: "6px 0 10px", boxSizing: "border-box" };
const group: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, marginBottom: 12 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

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

  // Two-factor auth state
  const [tfEnabled, setTFEnabled] = useState(false);
  const [tfSetupStep, setTFSetupStep] = useState<"none" | "show" | "verify">("none");
  const [tfSecret, setTFSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  // Delete account state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

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

  // ---------- Two-factor authentication ----------
  async function toggle2FA() {
    if (tfEnabled) {
      await disable2FA();
    } else {
      await enable2FA();
    }
  }

  async function enable2FA() {
    setMsg("");
    const res = await fetch("/api/auth/totp/setup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || "Failed to start setup.");
    setTFSecret(d.secret);
    setTFSetupStep("show");
  }

  async function verify2FA() {
    if (!verifyCode.trim()) return setMsg("Enter the 6-digit code.");
    const res = await fetch("/api/auth/totp/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token: verifyCode.trim(), secret: tfSecret })
    });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || "Invalid code.");
    setTFEnabled(true);
    setTFSetupStep("none");
    setVerifyCode("");
    setTFSecret("");
    setMsg("Two-factor authentication enabled ✓");
  }

  async function disable2FA() {
    if (!window.confirm("Disable two-factor authentication? You'll only need your password to log in.")) return;
    const res = await fetch("/api/auth/totp/disable", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || "Failed.");
    setTFEnabled(false);
    setMsg("Two-factor authentication disabled.");
  }

  async function copySecret() {
    await navigator.clipboard.writeText(tfSecret);
    setMsg("Secret copied to clipboard.");
  }

  async function showRecoveryCodes() {
    const res = await fetch("/api/auth/totp/codes", { method: "GET", headers: { "Content-Type": "application/json" } });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || "Failed.");
    setRecoveryCodes(d.codes || []);
    setMsg("Recovery codes shown above — save them safely.");
  }

  // ---------- Delete account ----------
  async function startDelete() {
    setConfirmDeleteOpen(true);
  }

  async function doDeleteAccount() {
    if (confirmText !== "DELETE") return setMsg("Type DELETE to confirm.");
    const res = await fetch("/api/auth/delete-account", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || "Failed to delete account.");
    setMsg("Account deleted. Redirecting...");
    localStorage.removeItem("edupal_user");
    localStorage.removeItem("edupal_role");
    setTimeout(() => window.location.href = "/login", 1500);
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
        <label style={{ fontSize: 13, fontWeight: 800 }}>Display name</label>
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

      <div style={group}>
        <h2 style={{ fontSize: 16, margin: "0 0 8px", color: "#1E242E" }}>Security</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800 }}>Two-factor authentication</span>
          <Toggle on={tfEnabled} onClick={toggle2FA} label="Two-factor auth" />
        </div>
        {tfEnabled ? (
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button onClick={disable2FA} style={{ height: 40, borderRadius: 8, border: 0, background: "#DC2626", color: "#fff", fontWeight: 700, padding: "0 14px", cursor: "pointer" }}>Disable 2FA</button>
            <button onClick={showRecoveryCodes} style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", color: "#333A45", padding: "0 14px", cursor: "pointer" }}>Show recovery codes</button>
          </div>
        ) : (
          <button onClick={enable2FA} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>Enable two-factor authentication</button>
        )}
        {tfSetupStep === "show" && (
          <div style={{ ...card, marginTop: 12 }}>
            <h2 style={{ fontSize: 16, margin: "0 0 8px", color: "#1E242E" }}>Set up authenticator app</h2>
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
              Open Google Authenticator, Authy, or similar app and scan the QR code or enter the key manually:
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ fontFamily: "monospace", fontSize: 13, padding: "8px 12px", background: "#F1F5F9", borderRadius: 8, flex: 1 }}>{tfSecret}</div>
              <button onClick={copySecret} style={{ height: 40, borderRadius: 8, border: 0, background: "#1E242E", color: "#fff", fontWeight: 700, padding: "0 14px", cursor: "pointer" }}>Copy</button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} placeholder="6-digit code" style={{ ...input, flex: 1 }} />
              <button onClick={verify2FA} style={{ height: 44, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>Verify &amp; enable</button>
            </div>
            <p style={{ fontSize: 12, color: "#5F6E7F", marginTop: 6 }}>
              Save your recovery codes somewhere safe — you can use them if you lose access to your authenticator app.
            </p>
          </div>
        )}
      </div>

      <div style={group}>
        <h2 style={{ fontSize: 16, margin: "0 0 8px", color: "#1E242E" }}>Danger zone</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 8px" }}>
          Permanently delete your EduPal AI account and all your data (practice history, streak, notes, etc.). This cannot be undone.
        </p>
        <button onClick={startDelete} style={{ height: 44, borderRadius: 10, border: "1px solid #DC2626", color: "#DC2626", fontWeight: 700, padding: "0 20px", cursor: "pointer" }}>Delete my account</button>
        {confirmDeleteOpen && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 8 }}>
              Type <strong>"DELETE"</strong> to confirm permanent deletion of your account:
            </p>
            <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Type DELETE" style={input} />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => setConfirmDeleteOpen(false)} style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", color: "#333A45", padding: "0 14px", cursor: "pointer" }}>Cancel</button>
              <button onClick={doDeleteAccount} disabled={confirmText !== "DELETE"} style={{ height: 40, borderRadius: 8, border: 0, background: "#DC2626", color: "#fff", fontWeight: 700, padding: "0 14px", cursor: "pointer" }}>Permanently delete</button>
            </div>
          </div>
        )}
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