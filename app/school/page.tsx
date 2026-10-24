"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };
const input: React.CSSProperties = { height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 14, width: "100%", boxSizing: "border-box" };

type SchoolInfo = {
  id: string; name: string; code: string; status: "ACTIVE" | "EXPIRED" | "INACTIVE";
  access: boolean; expiresAt: string | null; maxSeats: number;
};
type Credential = { name: string; className: string; email: string; password: string };

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : iso;
}

// Lines of "Full Name, Class" (header row optional) — matches what every
// school's class list looks like in a spreadsheet.
function parseRoster(text: string): { name: string; class: string }[] {
  const out: { name: string; class: string }[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length < 1) continue;
    const name = (parts[0] ?? "").replace(/^"|"$/g, "").trim();
    const cls = (parts[1] ?? "").replace(/^"|"$/g, "").trim();
    if (!name || /^name$/i.test(name)) continue; // skip header
    out.push({ name, class: cls });
  }
  return out;
}

export default function SchoolPortal() {
  const [userId, setUserId] = useState<string | null>(null);
  const [info, setInfo] = useState<null | { school: SchoolInfo; groupName: string; staff: { name: string; email: string }; members: number; classes: { className: string; n: number }[] }>(null);
  const [denied, setDenied] = useState(false);
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [creds, setCreds] = useState<Credential[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [roster, setRoster] = useState<{ name: string; className: string; email: string; joinedAt: string }[]>([]);
  const [tab, setTab] = useState<"overview" | "roster" | "notes">("overview");
  const [ov, setOv] = useState<null | {
    summary: { total: number; activeWeek: number; answers: number; avgStreak: number };
    weak: { subject: string; topic: string; students: number; accuracy: number }[];
    classes: { className: string; students: number; activeWeek: number; avgStreak: number }[];
    top: { name: string; className: string; answers: number }[];
  }>(null);
  const [pendingNotes, setPendingNotes] = useState<Array<{ id: string; teacherName: string; className: string; subject: string; topic: string; body: string; createdAt: string }>>([]);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return setDenied(true);
    fetch(`/api/school?userId=${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) return setDenied(true);
        setInfo(d);
      })
      .catch(() => setDenied(true));
    fetch(`/api/school/overview?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setOv(d))
      .catch(() => {});
    fetch(`/api/school/roster?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setRoster(d.roster ?? []))
      .catch(() => {});
    fetch(`/api/school/lesson-notes?userId=${id}&status=pending`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPendingNotes(d.notes ?? []))
      .catch(() => {});
  }, []);

  async function upload() {
    if (!userId || busy) return;
    const students = parseRoster(paste);
    if (!students.length) return setMsg("Paste rows like:  Ada Obi, SS2");
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/school/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, students })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Upload failed.");
      setCreds(d.credentials ?? []);
      setPaste("");
      setMsg(`${d.created} student account${d.created === 1 ? "" : "s"} created${d.skipped?.length ? ` (${d.skipped.length} skipped)` : ""}. Print or download the logins below — passwords are shown only once.`);
      fetch(`/api/school/roster?userId=${userId}`).then((r) => r.json()).then((x) => setRoster(x.roster ?? [])).catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  async function reviewNote(noteId: string, status: "approved" | "rejected") {
    if (!userId || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/school/lesson-notes", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, noteId, status })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Review failed.");
      setMsg(`Note ${status}.`);
      setPendingNotes(pendingNotes.filter((n) => n.id !== noteId));
      fetch(`/api/school/lesson-notes?userId=${userId}&status=pending`)
        .then((r) => r.json()).then((d) => setPendingNotes(d.notes ?? [])).catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  async function onFile(f: File) {
    const text = await f.text();
    setPaste(text);
  }

  function downloadCsv() {
    if (!creds) return;
    const lines = ["Class,Name,Login email,Password", ...creds.map((c) => `"${c.className}","${c.name}",${c.email},${c.password}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${info?.school.code ?? "school"}-logins.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function copyCsv() {
    if (!creds) return;
    const text = ["Class\tName\tLogin email\tPassword", ...creds.map((c) => `${c.className}\t${c.name}\t${c.email}\t${c.password}`)].join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (denied) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ color: "#1E242E", fontSize: 20, margin: "0 0 8px" }}>🏫 School Portal</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>
            This area is for school staff accounts. If your school is subscribed to EduPal, ask your EduPal contact to set up your staff login, then sign in at <strong>/login</strong>.
          </p>
        </div>
      </main>
    );
  }

  if (!info) {
    return <main style={{ padding: 32, color: "#333A45" }}>Loading school portal…</main>;
  }

  const { school } = info;
  const statusColor = school.status === "ACTIVE" ? "#16A34A" : school.status === "EXPIRED" ? "#DC2626" : "#F59E0B";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ ...card, background: "#1E242E", color: "#fff", border: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>{school.name}</h1>
          <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999, background: statusColor, color: "#fff" }}>{school.status}</span>
        </div>
        {info.groupName && <p style={{ fontSize: 13, color: "#A7F3D0", margin: "6px 0 0" }}>Network: {info.groupName}</p>}
        <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>SCHOOL CODE</div><div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 2 }}>{school.code}</div></div>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>STUDENTS</div><div style={{ fontWeight: 800, fontSize: 16 }}>{info.members} / {school.maxSeats}</div></div>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>SUBSCRIPTION</div><div style={{ fontWeight: 800, fontSize: 16 }}>{school.expiresAt ? `till ${fmtDate(school.expiresAt)}` : "no end date"}</div></div>
        </div>
        {info.classes.length > 0 && (
          <p style={{ fontSize: 13, color: "#CBD5E1", marginTop: 12, marginBottom: 0 }}>
            Classes: {info.classes.map((c) => `${c.className || "Unassigned"} (${c.n})`).join(" · ")}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["overview", "roster", "notes"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ height: 40, borderRadius: 999, border: tab === t ? 0 : "1px solid #CBD5E1", background: tab === t ? "#0F766E" : "#fff",
              color: tab === t ? "#fff" : "#333A45", fontWeight: 700, padding: "0 18px", cursor: "pointer", fontSize: 14 }}>
            {t === "overview" ? "Overview" : t === "roster" ? "Students & logins" : "Lesson Notes"}
          </button>
        ))}
        <a href={`/school/classroom?userId=${userId ?? ""}`} style={{ height: 40, borderRadius: 999, border: "1px solid #1E242E", background: "#1E242E", color: "#fff",
          fontWeight: 700, padding: "0 18px", fontSize: 14, display: "flex", alignItems: "center", marginLeft: "auto", textDecoration: "none" }}>
          🖥 Classroom mode
        </a>
      </div>

      {tab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 12 }}>
            {[
              { label: "Students", value: ov ? String(ov.summary.total) : "…" },
              { label: "Active this week", value: ov ? String(ov.summary.activeWeek) : "…" },
              { label: "Answers this week", value: ov ? String(ov.summary.answers) : "…" },
              { label: "Average streak", value: ov ? `${ov.summary.avgStreak} days` : "…" }
            ].map((s) => (
              <div key={s.label} style={{ ...card, margin: 0, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#0F766E" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#5F6E7F", fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={card}>
            <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 8px" }}>🎯 Weakest topics across the school</h2>
            {ov && ov.weak.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ov.weak.map((w) => (
                  <div key={`${w.subject}-${w.topic}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                    <span style={{ flex: 1 }}><strong>{w.topic}</strong> <span style={{ color: "#5F6E7F" }}>· {w.subject}</span></span>
                    <span style={{ fontSize: 12, color: "#5F6E7F" }}>{w.students} student{w.students === 1 ? "" : "s"}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: w.accuracy < 50 ? "#DC2626" : "#F59E0B", minWidth: 42, textAlign: "right" }}>{w.accuracy}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No weak topics recorded yet — they appear once students start practising.</p>
            )}
          </div>

          {(ov?.classes?.length ?? 0) > 0 && (
            <div style={card}>
              <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 8px" }}>🏫 By class</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 12 }}>
                  <th style={{ padding: "6px 8px" }}>Class</th><th style={{ padding: "6px 8px" }}>Students</th><th style={{ padding: "6px 8px" }}>Active this week</th><th style={{ padding: "6px 8px" }}>Avg streak</th>
                </tr></thead>
                <tbody>
                  {ov!.classes.map((c) => (
                    <tr key={c.className} style={{ borderTop: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "8px", fontWeight: 700 }}>{c.className}</td>
                      <td style={{ padding: "8px" }}>{c.students}</td>
                      <td style={{ padding: "8px" }}>{c.activeWeek}</td>
                      <td style={{ padding: "8px" }}>{c.avgStreak}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(ov?.top?.length ?? 0) > 0 && (
            <div style={{ ...card, background: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <h2 style={{ color: "#92400E", fontSize: 16, margin: "0 0 8px" }}>🏆 Top performers this week</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {ov!.top.map((t, i) => (
                  <div key={`${t.name}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                    <span style={{ width: 24, fontWeight: 800, color: "#92400E" }}>{i + 1}.</span>
                    <span style={{ flex: 1, fontWeight: 700 }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: "#92400E" }}>{t.className}</span>
                    <span style={{ fontWeight: 800 }}>{t.answers} answers</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "roster" && (
      <>
      <div style={card}>
        <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 4px" }}>Add students</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
          Paste or upload rows as <strong>Full Name, Class</strong> (e.g. <em>Ada Obi, SS2</em>). Each student gets a login they can use in the lab and at home. No welcome emails are sent — hand them their login slip.
        </p>
        <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={6} placeholder={"Ada Obi, SS2\nChidinma Eze, SS2\nIbrahim Musa, JSS3"}
          style={{ ...input, height: "auto", padding: 10, fontFamily: "monospace", resize: "vertical" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={upload} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 18px", cursor: "pointer" }}>
            {busy ? "Creating accounts…" : "Create student logins"}
          </button>
          <label style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, cursor: "pointer", border: "1px solid #0F766E", borderRadius: 10, padding: "12px 14px" }}>
            📄 Upload CSV file
            <input type="file" accept=".csv,text/csv,text/plain" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          </label>
        </div>
        {msg && <p style={{ fontSize: 13, color: msg.startsWith("Paste") ? "#DC2626" : "#166534", margin: "10px 0 0" }}>{msg}</p>}
      </div>

      {creds && creds.length > 0 && (
        <div style={{ ...card, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h2 style={{ color: "#166534", fontSize: 16, margin: 0, flex: 1 }}>Login slips ({creds.length})</h2>
            <button onClick={copyCsv} style={{ height: 38, borderRadius: 10, border: "1px solid #166534", background: "#fff", color: "#166534", fontWeight: 700, padding: "0 12px", cursor: "pointer" }}>{copied ? "Copied ✓" : "Copy all"}</button>
            <button onClick={downloadCsv} style={{ height: 38, borderRadius: 10, border: 0, background: "#166534", color: "#fff", fontWeight: 700, padding: "0 12px", cursor: "pointer" }}>⬇ Download CSV</button>
          </div>
          <div style={{ maxHeight: 300, overflow: "auto", marginTop: 10, border: "1px solid #BBF7D0", borderRadius: 10, background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ background: "#F8FAFC", textAlign: "left" }}>
                <th style={{ padding: "8px 10px" }}>Class</th><th style={{ padding: "8px 10px" }}>Name</th><th style={{ padding: "8px 10px" }}>Login email</th><th style={{ padding: "8px 10px" }}>Password</th>
              </tr></thead>
              <tbody>
                {creds.map((c, i) => (
                  <tr key={c.email} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "6px 10px" }}>{c.className || "—"}</td>
                    <td style={{ padding: "6px 10px", fontWeight: 700 }}>{c.name}</td>
                    <td style={{ padding: "6px 10px", fontFamily: "monospace", fontSize: 11 }}>{c.email}</td>
                    <td style={{ padding: "6px 10px", fontFamily: "monospace", fontWeight: 800 }}>{c.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {roster.length > 0 && (
        <div style={card}>
          <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 8px" }}>Current students ({roster.length})</h2>
          <div style={{ maxHeight: 260, overflow: "auto", border: "1px solid #F1F5F9", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <tbody>
                {roster.map((r) => (
                  <tr key={r.email} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "6px 10px" }}>{r.className || "—"}</td>
                    <td style={{ padding: "6px 10px", fontWeight: 700 }}>{r.name}</td>
                    <td style={{ padding: "6px 10px", fontFamily: "monospace", fontSize: 11, color: "#5F6E7F" }}>{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: "8px 0 0" }}>Passwords can't be re-shown here — keep the downloaded CSV safe, or ask the student to tell you their old one.</p>
        </div>
      )}
      </>
      )}

      {tab === "notes" && pendingNotes.length > 0 && (
        <div style={card}>
          <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 10px" }}>⏳ Lesson notes awaiting your review</h2>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
            Teachers have written these notes. Approve them so students in the class can see them on their dashboard, or reject if they need changes.
          </p>
          {pendingNotes.map((n) => (
            <div key={n.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "10px 0", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <div>
                  <strong style={{ fontSize: 14 }}>{n.topic}</strong>
                  <span style={{ fontSize: 11, color: "#5F6E7F", marginLeft: 6 }}>{n.subject} · {n.className}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: "#F59E0B", color: "#fff" }}>Pending</span>
              </div>
              <div style={{ color: "#5F6E7F", fontSize: 11, marginBottom: 6 }}>
                by {n.teacherName} · {new Date(n.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
              </div>
              <p style={{ margin: "0 0 8px", color: "#333A45" }}>{n.body.slice(0, 300)}{n.body.length > 300 ? "…" : ""}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => reviewNote(n.id, "approved")}
                  style={{ height: 36, borderRadius: 8, border: 0, background: "#16A34A", color: "#fff", fontWeight: 700, padding: "0 14px", cursor: "pointer", flex: 1 }}>
                  Approve
                </button>
                <button onClick={() => reviewNote(n.id, "rejected")}
                  style={{ height: 36, borderRadius: 8, border: 0, background: "#DC2626", color: "#fff", fontWeight: 700, padding: "0 14px", cursor: "pointer", flex: 1 }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "notes" && pendingNotes.length === 0 && (
        <div style={card}>
          <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 8px" }}>⏳ Lesson notes awaiting your review</h2>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No pending notes. Teachers' notes will appear here for your review.</p>
        </div>
      )}
    </main>
  );
}
