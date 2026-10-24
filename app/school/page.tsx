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
    fetch(`/api/school/roster?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setRoster(d.roster ?? []))
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
    </main>
  );
}
