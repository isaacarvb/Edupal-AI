"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolQuestions() {
  const [school, setSchool] = useState<{ id: string; name: string } | null>(null);
  const [questions, setQuestions] = useState<{ id: string; subject: string; topic: string; stem: string; answer: string; createdAt: string }[]>([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [stem, setStem] = useState("");
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importBusy, setImportBusy] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      const res = await fetch(`/api/school/questions-list?schoolId=${d.id}`);
      if (res.ok) {
        const jd = await res.json();
        setQuestions(jd.questions ?? []);
      }
    } catch { /* ignore */ }
  }

  async function handleImport(file: File) {
    setMsg("");
    setImportBusy(true);
    setSelectedFile(file);
    try {
      let text = await file.text();
      text = text.replace(/^\uFEFF/, "");
      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) return setMsg("CSV must have a header row and at least one question row.");

      const header = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
      let subjectIdx = header.findIndex((h) => h === "subject");
      let topicIdx = header.findIndex((h) => h === "topic");
      let stemIdx = header.findIndex((h) => h === "stem" || h === "question" || h === "question stem");
      let optionsIdx = header.findIndex((h) => h === "options");
      let answerIdx = header.findIndex((h) => h === "answer");

      const startRow = subjectIdx === -1 || topicIdx === -1 || stemIdx === -1 || optionsIdx === -1 || answerIdx === -1 ? 0 : 1;
      if (subjectIdx === -1) subjectIdx = 0;
      if (topicIdx === -1) topicIdx = 1;
      if (stemIdx === -1) stemIdx = 2;
      if (optionsIdx === -1) optionsIdx = 3;
      if (answerIdx === -1) answerIdx = 4;

      if (lines.length < startRow + 1) return setMsg("No question data found in CSV.");

      const rows: Array<{ subject: string; topic: string; stem: string; options: string[]; answer: string }> = [];
      for (let i = startRow; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length <= Math.max(subjectIdx, topicIdx, stemIdx, optionsIdx, answerIdx)) continue;
        const subj = cols[subjectIdx]?.trim() || "";
        const top = cols[topicIdx]?.trim() || "";
        const stemVal = cols[stemIdx]?.trim() || "";
        const optionsVal = cols[optionsIdx]?.trim() || "";
        const ans = cols[answerIdx]?.trim() || "";
        if (!subj || !top || !stemVal || !optionsVal || !ans) continue;
        const optsArray = optionsVal.split("|").map((o) => o.trim()).filter(Boolean);
        if (optsArray.length === 0 || !optsArray.includes(ans)) continue;
        rows.push({ subject: subj, topic: top, stem: stemVal, options: optsArray, answer: ans });
      }

      if (rows.length === 0) return setMsg("No valid question rows found. Check columns: subject, topic, stem, options (| separated), answer.");

      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);

      const form = new FormData();
      form.append("schoolId", d.id);
      form.append("questions", JSON.stringify(rows));

      const res = await fetch("/api/school/questions-import", { method: "POST", body: form });
      const jd = await res.json();
      if (!res.ok) return setMsg(jd.error || "Import failed.");
      setMsg(`Imported ${jd.imported} questions.`);
      fetchQuestions();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImportBusy(false);
    }
  }

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleImport(f);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMsg("");
    setImportBusy(false);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = "";
  };

  async function addQuestion() {
    if (!subject.trim() || !topic.trim() || !stem.trim() || !options.trim() || !answer.trim()) {
      return setMsg("All fields required. Use | to separate options (e.g. Option A|Option B|Option C|Option D).");
    }
    setMsg("");
    setBusy(true);
    try {
      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);
      const optsArray = options.split("|").map((o) => o.trim()).filter(Boolean);
      const res = await fetch("/api/school/questions-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: d.id, subject: subject.trim(), topic: topic.trim(), stem: stem.trim(), options: optsArray, answer: answer.trim() })
      });
      const jd = await res.json();
      if (!res.ok) return setMsg(jd.error || "Failed to add.");
      setMsg("Question added to bank.");
      setSubject("");
      setTopic("");
      setStem("");
      setOptions("");
      setAnswer("");
      fetchQuestions();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to add.");
    } finally {
      setBusy(false);
    }
  }

  if (!school) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>School session not found.</p>
        <button onClick={() => { window.location.href = "/school-login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          Sign In to School
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>Question Bank</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 16 }}>
        Add school-specific questions. They're mixed into practice sessions for your students.
      </p>

      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 10 }}>Upload CSV</div>
        <p style={{ fontSize: 12, color: "#5F6E7F", marginBottom: 8 }}>
          CSV columns: <code style={{ color: "#1E242E" }}>subject, topic, stem, options, answer</code> — options separated by |
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleSelectFile}
            style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}
          />
          {selectedFile && (
            <button onClick={handleRemoveFile}
              style={{ height: 44, borderRadius: 10, border: "1px solid #DC2626", background: "#FFF1F2", color: "#DC2626", fontWeight: 800, fontSize: 16, padding: "0 16px", cursor: "pointer" }}>
              ×
            </button>
          )}
        </div>
        {selectedFile && (
          <p style={{ fontSize: 12, color: "#5F6E7F", marginBottom: 4 }}>
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
        {importBusy && <p style={{ fontSize: 13, color: "#5F6E7F" }}>Importing…</p>}
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>Add Question</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (e.g. Mathematics)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. Algebra)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <textarea value={stem} onChange={(e) => setStem(e.target.value)} placeholder="Question stem…" rows={2}
            style={{ borderRadius: 10, border: "1px solid #CBD5E1", padding: "10px 12px", fontSize: 14, gridColumn: "1 / -1", resize: "vertical" }} />
          <input value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Options (separate with | — e.g. Ans A|Ans B|Ans C|Ans D)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", gridColumn: "1 / -1" }} />
          <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Correct answer (must match one option exactly)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", gridColumn: "1 / -1" }} />
          <button onClick={addQuestion} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: busy ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 14, cursor: busy ? "not-allowed" : "pointer", gridColumn: "1 / -1" }}>
            {busy ? "Adding…" : "Add to Question Bank"}
          </button>
        </div>
        {msg && <p style={{ fontSize: 13, marginTop: 8, color: msg.startsWith("Question") ? "#166534" : "#DC2626" }}>{msg}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {questions.length === 0 ? (
          <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", padding: 24 }}>No custom questions yet.</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1E242E" }}>{q.subject} — {q.topic}</span>
                <span style={{ fontSize: 11, color: "#5F6E7F" }}>{new Date(q.createdAt).toLocaleDateString("en-NG")}</span>
              </div>
              <p style={{ fontSize: 13, color: "#333A45", margin: "0 0 4px" }}>{q.stem}</p>
              <p style={{ fontSize: 12, color: "#5F6E7F" }}>Answer: <strong>{q.answer}</strong></p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
