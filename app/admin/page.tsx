"use client";
import { useEffect, useState } from "react";

function BankCount() {
  const [counts, setCounts] = useState<{ subject: string; n: number }[] | null>(null);
  useEffect(() => {
    fetch("/api/admin-bank")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCounts(d?.counts ?? []));
  }, []);
  if (!counts) return <p style={{ fontSize: 14 }}>Loading bank…</p>;
  const total = counts.reduce((s, c) => s + c.n, 0);
  return (
    <div style={{ fontSize: 14 }}>
      <p><strong>Total: {total} questions</strong> (diagnostic cap is 10 per subject — thin subjects run dry fast)</p>
      {counts.map((c) => <div key={c.subject}>{c.subject} — {c.n}</div>)}
    </div>
  );
}

// Internal pilot evidence board (owner only in prod). Student view lives at /metrics.
type M = {
  students: number; attempts: number; retentionPct: number; retained: number;
  activeStudents: number; clarityPct: number; paid: number; exhausted: number;
  parentPct: number; linksSent: number;
  bySubject: { subject: string; accuracy: number; attempts: number }[];
  gates: { retention70: boolean; note: string };
};

type Flag = { id: string; response: string; correct: number; at: string; subject: string; topic: string; stem: string; answerKey: string; student: string | null };

export default function Admin() {
  const [m, setM] = useState<M | null>(null);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [dkind, setDkind] = useState("exam");
  const [dtitle, setDtitle] = useState("");
  const [dcloses, setDcloses] = useState("");
  const [dmsg, setDmsg] = useState("");
  const [csv, setCsv] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [drafts, setDrafts] = useState<{ id: string; exam: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; answerKey: string; markingRubric: string }[]>([]);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [draftMsg, setDraftMsg] = useState("");
  function load() {
    fetch("/api/metrics").then((r) => r.json()).then(setM);
    fetch("/api/flag").then((r) => r.json()).then((d) => setFlags(d.flags ?? []));
    fetch("/api/drafts").then((r) => r.json()).then((d) => {
      setDrafts(d.pending ?? []);
      setSel({});
    });
  }
  useEffect(load, []);
  async function review(ids: string[], action: "approve" | "reject") {
    if (!ids.length) return;
    const res = await fetch("/api/drafts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action })
    });
    const data = await res.json();
    setDraftMsg(res.ok ? `${action}d ${action === "approve" ? data.approved : ids.length}.` : data.error || "Failed.");
    load();
  }

  async function resolve(id: string) {
    await fetch("/api/flag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resolve: id }) });
    load();
  }

  async function addDeadline() {
    setDmsg("");
    if (!dtitle.trim()) return setDmsg("Title required.");
    const res = await fetch("/api/deadlines", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: dkind, title: dtitle.trim(), closesOn: dcloses || null })
    });
    if (!res.ok) return setDmsg("Failed to add.");
    setDtitle("");
    setDcloses("");
    setDmsg("Added. Only add dates verified against official sources.");
  }
  if (!m) return <main style={{ padding: 32 }}>Loading…</main>;
  const row = (k: string, v: string | number) => (
    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E2E8F0", fontSize: 14 }}>
      <span>{k}</span><strong>{v}</strong>
    </div>
  );
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 32, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 22 }}>Admin — pilot evidence</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>{m.gates.note}</p>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
        {row("Students", m.students)}
        {row("Answers", m.attempts)}
        {row("Retention (2+ days)", `${m.retentionPct}% ${m.gates.retention70 ? "✓ gate" : "✗ gate"}`)}
        {row("MCQ clarity", `${m.clarityPct}%`)}
        {row("Paid / exhausted", `${m.paid} / ${m.exhausted}`)}
        {row("Parent verify", `${m.parentPct}% (${m.linksSent})`)}
      </div>
      <h2 style={{ fontSize: 18 }}>By subject</h2>
      {m.bySubject.map((s) => <div key={s.subject} style={{ fontSize: 14 }}>{s.subject} — {s.accuracy}% over {s.attempts}</div>)}
      <h2 style={{ fontSize: 18, marginTop: 16 }}>Import curated questions</h2>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }}>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>Paste CSV or load a file. Duplicates (same question text) are skipped. Only upload questions you have rights to use — imports are marked CURATED. <a href="/api/admin-bank/template" style={{ color: "#0F766E", fontWeight: 700 }}>Download template</a></p>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={5} placeholder="exam,year,subject,topic,type,stem,options (a|b|c),answer,rubric,predicted" style={{ width: "100%", borderRadius: 10, border: "1px solid #CBD5E1", padding: 10, fontSize: 13, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid #0F766E", color: "#0F766E", padding: "10px 16px", cursor: "pointer" }}>
            Load file…
            <input type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setCsv(String(r.result ?? "")); r.readAsText(f); } }} />
          </label>
          <button onClick={async () => {
            setImportMsg("Importing…");
            const res = await fetch("/api/admin-bank/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ csv }) });
            const data = await res.json();
            setImportMsg(res.ok ? `Added ${data.added}, skipped ${data.skipped}${data.errors?.length ? `. Issues: ${data.errors.join("; ")}` : ""}` : data.error || "Failed");
            if (res.ok) { setCsv(""); load(); }
          }} style={{ fontSize: 13, fontWeight: 700, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", padding: "10px 16px", cursor: "pointer" }}>
            Import
          </button>
        </div>
        {importMsg && <p style={{ fontSize: 13 }}>{importMsg}</p>}
      </div>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>Question bank</h2>
      <BankCount />
      <h2 style={{ fontSize: 18, marginTop: 16 }}>Add deadline window</h2>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={dkind} onChange={(e) => setDkind(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 14 }}>
            <option value="exam">Exam</option>
            <option value="scholarship">Scholarship</option>
            <option value="admission">Admission</option>
          </select>
          <input value={dtitle} onChange={(e) => setDtitle(e.target.value)} placeholder="e.g. JAMB UTME 2027 registration" style={{ flex: "2 1 200px", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
          <input value={dcloses} onChange={(e) => setDcloses(e.target.value)} type="date" style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
        </div>
        {dmsg && <p style={{ fontSize: 13 }}>{dmsg}</p>}
        <button onClick={addDeadline} style={{ marginTop: 8, height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 20px", cursor: "pointer" }}>Add window</button>
      </div>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>Flagged explanations ({flags.length})</h2>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Review SLA: 48 hours.</p>
      {flags.length === 0 && <p style={{ fontSize: 14 }}>Queue clear — nothing flagged.</p>}
      {flags.map((f) => (
        <div key={f.id} style={{ background: "#fff", border: "1px solid #FECACA", borderRadius: 12, padding: 12, margin: "8px 0", fontSize: 14 }}>
          <strong>{f.subject} • {f.topic}</strong>
          <p style={{ margin: "4px 0" }}>{f.stem}</p>
          <p style={{ margin: "4px 0", color: "#5F6E7F" }}>Student said: “{f.response}” (key: {f.answerKey}) • {f.student ?? "unknown"} • {f.at.slice(0, 10)}</p>
          <button onClick={() => resolve(f.id)} style={{ fontSize: 13, fontWeight: 700, background: "#0F766E", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>Mark resolved</button>
        </div>
      ))}
      <h2 style={{ fontSize: 18, marginTop: 16 }}>AI drafts awaiting review ({drafts.length})</h2>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Generated from curriculum notes — verify every answer before approving. Approved drafts enter the bank as AI-source.</p>
      {draftMsg && <p style={{ fontSize: 14 }}>{draftMsg}</p>}
      {drafts.length === 0 && <p style={{ fontSize: 14 }}>No pending drafts. Generate: <code>node scripts/generate-questions.mjs --subject English</code></p>}
      {drafts.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={() => review(drafts.map((d) => d.id), "approve")} style={{ fontSize: 13, fontWeight: 700, background: "#16A34A", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>Approve all ({drafts.length})</button>
          <button onClick={() => review(drafts.filter((d) => sel[d.id]).map((d) => d.id), "approve")} style={{ fontSize: 13, fontWeight: 700, background: "#fff", color: "#16A34A", border: "2px solid #16A34A", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>Approve selected</button>
          <button onClick={() => review(drafts.filter((d) => sel[d.id]).map((d) => d.id), "reject")} style={{ fontSize: 13, fontWeight: 700, background: "#fff", color: "#DC2626", border: "2px solid #DC2626", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>Reject selected</button>
        </div>
      )}
      {drafts.map((d) => (
        <div key={d.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, margin: "8px 0", fontSize: 14 }}>
          <label style={{ display: "flex", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={!!sel[d.id]} onChange={(e) => setSel((s) => ({ ...s, [d.id]: e.target.checked }))} style={{ width: 18, height: 18 }} />
            <span><strong>{d.subject} • {d.topic}</strong> [{d.type}] — {d.stem}</span>
          </label>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "6px 0 0 26px" }}>Answer: {d.answerKey}{d.markingRubric ? ` • ${d.markingRubric}` : ""}</p>
        </div>
      ))}
    </main>
  );
}
