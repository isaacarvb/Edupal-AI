"use client";

import { useState } from "react";
import { isJuniorClass, isSeniorClass } from "@/lib/syllabus";

export default function SchoolSession() {
  const [step, setStep] = useState<"code" | "name" | "done">("code");
  const [schoolCode, setSchoolCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [department, setDepartment] = useState("");
  const [school, setSchool] = useState<{ id: string; name: string; code: string; active: number; expires_at: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const verifyCode = async () => {
    if (!schoolCode.trim()) return setMsg("Enter school code.");
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch(`/api/school/verify-code?code=${encodeURIComponent(schoolCode.trim())}`);
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Invalid school code.");
      if (!d.school.active) return setMsg("School subscription is inactive. Contact your admin.");
      if (d.school.expires_at && Date.parse(d.school.expires_at) <= Date.now()) {
        return setMsg("School subscription has expired. Contact your admin to renew.");
      }
      setSchool(d.school);
      setStep("name");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error verifying code.");
    } finally {
      setBusy(false);
    }
  };

  const enterSession = async () => {
    if (!studentName.trim()) return setMsg("Enter your name.");
    if (!className.trim()) return setMsg("Enter your class.");
    // Department is required for SSS students only. isSeniorClass/isJuniorClass
    // avoid the old "JSS2 contains ss" mistake.
    const isSSS = isSeniorClass(className) || (!isJuniorClass(className) && !!department.trim());
    if (isSSS && !department.trim()) return setMsg("Department is required for senior secondary students.");
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/school/session-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: school!.id, studentName: studentName.trim(), className: className.trim(), department: department.trim() })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed to start session.");
      // Store session in localStorage with 2-hour expiry
      const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
      localStorage.setItem("edupal_school_session", JSON.stringify({
        schoolId: school!.id,
        schoolName: school!.name,
        studentName: studentName.trim(),
        className: className.trim(),
        department: d.department ?? department.trim(),
        sessionId: d.sessionId,
        userId: d.userId,
        expiresAt
      }));
      // The real linked account powers every profile/practice API, exactly as
      // it does for a self-signup student.
      localStorage.setItem("edupal_user", d.userId ?? d.sessionId);
      localStorage.setItem("edupal_role", "SCHOOL_STUDENT");
      setMsg("Session started! Redirecting…");
      setStep("done");
      setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to start session.");
    } finally {
      setBusy(false);
    }
  };

  if (step === "code") {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>School Access</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F" }}>Enter your school code to begin.</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24 }}>
          <input value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} placeholder="School code (e.g. FAI-2026-K4R9)"
            style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 16px", fontSize: 16, marginBottom: 12 }} />
          {msg && <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 12 }}>{msg}</p>}
          <button onClick={verifyCode} disabled={busy}
            style={{ width: "100%", height: 48, borderRadius: 10, border: 0, background: busy ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Verifying…" : "Enter School"}
          </button>
        </div>
      </main>
    );
  }

  if (step === "name") {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", margin: "0 0 8px" }}>{school?.name}</h1>
          <div style={{ fontSize: 13, color: "#5F6E7F", fontFamily: "monospace" }}>{school?.code}</div>
          <p style={{ fontSize: 13, color: "#5F6E7F", marginTop: 8 }}>Enter your name, class, and department to access EduPal.</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24 }}>
          <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Your full name"
            style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 16px", fontSize: 16, marginBottom: 12 }} />
          <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Your class (e.g. SS2A)"
            style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 16px", fontSize: 16, marginBottom: 12 }} />
          <select value={department} onChange={(e) => setDepartment(e.target.value)}
            style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 16px", fontSize: 16, marginBottom: 12, background: "#fff", color: department ? "#333A45" : "#5F6E7F" }}>
            <option value="">Department (SSS only — leave blank for JSS)</option>
            <option value="Science">Science</option>
            <option value="Art">Art</option>
            <option value="Commercial">Commercial</option>
          </select>
          {msg && <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 12 }}>{msg}</p>}
          <button onClick={enterSession} disabled={busy}
            style={{ width: "100%", height: 48, borderRadius: 10, border: 0, background: busy ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Starting…" : "Start Session"}
          </button>
          <p style={{ fontSize: 12, color: "#5F6E7F", marginTop: 12, textAlign: "center" }}>
            Your name, class, and department must match the school roster exactly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#166534", marginBottom: 16 }}>✓ Session Started</div>
      <p style={{ fontSize: 14, color: "#5F6E7F" }}>Welcome, {studentName} ({className}) to {school?.name}.</p>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginTop: 16 }}>Redirecting to your dashboard…</p>
    </main>
  );
}
