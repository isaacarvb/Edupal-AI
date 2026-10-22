"use client";
import { useEffect, useMemo, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type TopicRow = { name: string; index: number };
type SubjRow = { level: "SSS" | "JSS"; name: string; topics: TopicRow[] };
type Access = "FREE" | "UNLIMITED" | "HIDDEN";

export default function AdminNotesAccess() {
  const [subjects, setSubjects] = useState<SubjRow[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Access>>({});
  const [pick, setPick] = useState<string>("");
  const [msg, setMsg] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/notes-access?adminId=${aid()}`).then(async (r) => {
      const d = await r.json();
      if (r.ok) {
        setSubjects(d.subjects ?? []);
        setOverrides(d.overrides ?? {});
        setPick((p) => p || (d.subjects?.[0] ? keyOf(d.subjects[0]) : ""));
      }
    });
  }
  useEffect(load, []);

  function keyOf(s: SubjRow) {
    return `${s.level}|${s.name}`;
  }
  function topicKey(s: SubjRow, t: TopicRow) {
    return `${s.level}|${s.name}|${t.name}`;
  }

  const subject = useMemo(() => subjects.find((s) => keyOf(s) === pick) ?? null, [subjects, pick]);

  // Default policy mirror: first non-hidden topic is free, the rest unlimited.
  function defaultFor(s: SubjRow, t: TopicRow): Access {
    const firstVisible = s.topics.find((x) => overrides[topicKey(s, x)] !== "HIDDEN");
    return t.name === firstVisible?.name ? "FREE" : "UNLIMITED";
  }

  async function setAccess(s: SubjRow, t: TopicRow, value: string) {
    const key = topicKey(s, t);
    setBusyKey(key);
    setMsg("");
    try {
      const res = await fetch("/api/admin/notes-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: aid(), key, access: value === "" ? null : value })
      });
      const d = await res.json();
      if (res.ok) {
        setOverrides(d.overrides ?? {});
        const label = value === "" ? "back to default" : value === "FREE" ? "FREE for everyone" : value === "HIDDEN" ? "HIDDEN" : "Unlimited only";
        setMsg(`“${t.name}” → ${label}. Live on the user side now.`);
      } else {
        setMsg(d.error || "Failed.");
      }
    } finally {
      setBusyKey(null);
    }
  }

  const selStyle = (v: string): React.CSSProperties => ({
    height: 38,
    borderRadius: 8,
    border: `2px solid ${v === "HIDDEN" ? "#DC2626" : v === "UNLIMITED" ? "#F59E0B" : v === "FREE" ? "#0F766E" : "#CBD5E1"}`,
    background: v === "HIDDEN" ? "#FEF2F2" : v === "UNLIMITED" ? "#FFFBEB" : "#fff",
    fontSize: 13,
    fontWeight: 700,
    padding: "0 8px",
    cursor: "pointer"
  });

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>📚 Notes Access</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>
        Lock, unlock or hide every topic. <strong>Default</strong> = first visible topic of each subject is free for everyone, the rest need Unlimited.
        Changes go live on student screens within seconds — no redeploy.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 800 }}>
          Subject
          <select
            value={pick}
            onChange={(e) => { setPick(e.target.value); setMsg(""); }}
            style={{ display: "block", width: "100%", height: 46, marginTop: 6, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 15, fontWeight: 700 }}
          >
            <optgroup label="Senior Secondary">
              {subjects.filter((s) => s.level === "SSS").map((s) => <option key={keyOf(s)} value={keyOf(s)}>{s.name}</option>)}
            </optgroup>
            <optgroup label="Junior Secondary">
              {subjects.filter((s) => s.level === "JSS").map((s) => <option key={keyOf(s)} value={keyOf(s)}>{s.name}</option>)}
            </optgroup>
          </select>
        </label>
      </div>

      {subject && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
          <strong>{subject.level === "JSS" ? "Junior" : "Senior"} — {subject.name}</strong>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 10px" }}>{subject.topics.length} topics</p>
          {subject.topics.map((t) => {
            const key = topicKey(subject, t);
            const v: string = overrides[key] ?? "";
            const effective: string = v === "" ? defaultFor(subject, t) : v;
            return (
              <div key={key} className="arow" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", padding: "10px 0", borderTop: "1px solid #F1F5F9" }}>
                <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>
                    {effective === "HIDDEN" ? "👁 " : effective === "UNLIMITED" ? "🔒 " : "🔓 "}
                    {t.index + 1}. {t.name}
                  </span>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>
                    {v === "" ? `default → ${defaultFor(subject, t) === "FREE" ? "Free for everyone" : "Unlimited only"}` : "overridden by you"}
                  </div>
                </div>
                <select value={v} disabled={busyKey === key} onChange={(e) => setAccess(subject, t, e.target.value)} style={selStyle(effective)}>
                  <option value="">Default</option>
                  <option value="FREE">🔓 Free for everyone</option>
                  <option value="UNLIMITED">🔒 Unlimited only</option>
                  <option value="HIDDEN">👁 Hidden</option>
                </select>
              </div>
            );
          })}
        </div>
      )}

      {msg && (
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0F766E", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 8, padding: "10px 14px", marginTop: 12 }}>
          {msg}
        </p>
      )}

      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <AdminButton variant="ghost" onClick={load}>Reload</AdminButton>
      </div>
    </main>
  );
}
