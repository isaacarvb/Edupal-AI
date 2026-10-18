"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type Q = { id: string; exam: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; answerKey: string; markingRubric: string; source: string };

export default function AdminQuestions() {
  const [rows, setRows] = useState<Q[]>([]);
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [csv, setCsv] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [importBusy, setImportBusy] = useState(false);
  const [delBusy, setDelBusy] = useState<string | null>(null);
  const [edit, setEdit] = useState<Q | null>(null);
  const [form, setForm] = useState({ exam: "JAMB", subject: "English", topic: "", type: "MCQ", stem: "", options: "", answer: "", rubric: "" });
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/questions?adminId=${aid()}&q=${encodeURIComponent(q)}&subject=${encodeURIComponent(subject)}&limit=100`).then(async (r) => {
      const d = await r.json();
      if (r.ok) setRows(d.questions);
    });
  }
  useEffect(load, []);

  async function save() {
    setMsg("");
    if (saveBusy) return;
    setSaveBusy(true);
    try {
      const payload = { adminId: aid(), ...(edit ? { id: edit.id } : {}), exam: form.exam, subject: form.subject, topic: form.topic, type: form.type, stem: form.stem, options: form.options.split("|").map((s) => s.trim()).filter(Boolean), answer: form.answer, rubric: form.rubric };
      const res = await fetch("/api/admin/questions", { method: edit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      setMsg(edit ? "Updated." : "Added.");
      setEdit(null);
      setForm({ exam: "JAMB", subject: "English", topic: "", type: "MCQ", stem: "", options: "", answer: "", rubric: "" });
      load();
    } finally {
      setSaveBusy(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this question?")) return;
    setDelBusy(id);
    try {
      await fetch(`/api/admin/questions?id=${id}&adminId=${aid()}`, { method: "DELETE" });
      load();
    } finally {
      setDelBusy(null);
    }
  }

  async function importCsv() {
    setMsg("Importing…");
    if (importBusy) return;
    setImportBusy(true);
    try {
      const res = await fetch("/api/admin-bank/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ csv }) });
      const d = await res.json();
      setMsg(res.ok ? `Added ${d.added}, skipped ${d.skipped}` : d.error || "Failed");
      if (res.ok) { setCsv(""); load(); }
    } finally {
      setImportBusy(false);
    }
  }

  function startEdit(r: Q) {
    setEdit(r);
    let opts = "";
    try { opts = (JSON.parse(r.optionsJson) as string[]).join(" | "); } catch { opts = r.optionsJson; }
    setForm({ exam: r.exam, subject: r.subject, topic: r.topic, type: r.type, stem: r.stem, options: opts, answer: r.answerKey, rubric: r.markingRubric });
    window.scrollTo(0, 0);
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>{edit ? "Edit question" : "Questions — add / edit / delete"}</h1>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} placeholder="Exam" style={{ width: 110, height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px" }} />
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" style={{ width: 130, height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px" }} />
          <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Topic" style={{ flex: "1 1 140px", height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px" }} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1" }}><option>MCQ</option><option>THEORY</option></select>
        </div>
        <textarea value={form.stem} onChange={(e) => setForm({ ...form, stem: e.target.value })} placeholder="Question stem" rows={2} style={{ width: "100%", marginTop: 8, borderRadius: 8, border: "1px solid #CBD5E1", padding: 8, boxSizing: "border-box" }} />
        <input value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} placeholder="Options separated by | (MCQ only)" style={{ width: "100%", height: 40, marginTop: 8, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer key" style={{ flex: 1, height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px" }} />
          <input value={form.rubric} onChange={(e) => setForm({ ...form, rubric: e.target.value })} placeholder="Rubric (optional)" style={{ flex: 1, height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px" }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <AdminButton onClick={save} busy={saveBusy}>{edit ? "Save" : "Add question"}</AdminButton>
          {edit && <AdminButton variant="ghost" onClick={() => { setEdit(null); setForm({ exam: "JAMB", subject: "English", topic: "", type: "MCQ", stem: "", options: "", answer: "", rubric: "" }); }}>Cancel</AdminButton>}
        </div>
        {msg && <p style={{ fontSize: 13 }}>{msg}</p>}
      </div>

      <h2 style={{ fontSize: 17, marginTop: 16 }}>Bulk CSV import</h2>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }}>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}><a href="/api/admin-bank/template" style={{ color: "#0F766E", fontWeight: 700 }}>Download template</a></p>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={3} placeholder="exam,year,subject,topic,type,stem,options,answer,rubric,predicted" style={{ width: "100%", borderRadius: 8, border: "1px solid #CBD5E1", padding: 8, boxSizing: "border-box" }} />
        <AdminButton variant="dark" onClick={importCsv} busy={importBusy} style={{ marginTop: 8 }}>Import CSV</AdminButton>
      </div>

      <h2 style={{ fontSize: 17, marginTop: 16 }}>Bank ({rows.length})</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Search stem or topic…" style={{ flex: 1, height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px" }} />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject filter" style={{ width: 140, height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px" }} />
        <AdminButton variant="ghost" onClick={load}>Filter</AdminButton>
      </div>
      {rows.map((r) => (
        <div key={r.id} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14 }}>
          <strong>{r.subject} • {r.topic}</strong> [{r.type}] <span style={{ color: "#5F6E7F" }}>{r.exam}</span>
          <p style={{ margin: "4px 0" }}>{r.stem}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <AdminButton size="sm" variant="ghost" onClick={() => startEdit(r)}>Edit</AdminButton>
            <AdminButton size="sm" variant="dangerOutline" busy={delBusy === r.id} onClick={() => del(r.id)}>Delete</AdminButton>
          </div>
        </div>
      ))}
    </main>
  );
}
