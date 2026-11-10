"use client";

import { useEffect, useState } from "react";
import { parseCsv, findColumn, downloadCsv } from "@/lib/csv";
import { canonicalSubject } from "@/lib/syllabus";

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
  const [importMsg, setImportMsg] = useState("");
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
    setImportMsg("");
    setImportBusy(true);
    setSelectedFile(file);
    try {
      const text = await file.text();
      const table = parseCsv(text);
      if (table.length < 2) return setImportMsg("CSV must have a header row and at least one question row.");

      const header = table[0];
      let subjectIdx = findColumn(header, ["subject"]);
      let topicIdx = findColumn(header, ["topic", "subtopic"]);
      let stemIdx = findColumn(header, ["stem", "question", "question stem", "question text"]);
      let optionsIdx = findColumn(header, ["options", "option", "choices", "answers"]);
      let answerIdx = findColumn(header, ["answer", "correct answer", "correct option", "key"]);
      const optAIdx = findColumn(header, ["option a", "a", "option 1"]);
      const optBIdx = findColumn(header, ["option b", "b", "option 2"]);
      const optCIdx = findColumn(header, ["option c", "c", "option 3"]);
      const optDIdx = findColumn(header, ["option d", "d", "option 4"]);
      const hasSplitOptions = optAIdx !== -1 && optBIdx !== -1;

      const hasHeader =
        subjectIdx !== -1 || topicIdx !== -1 || stemIdx !== -1 || optionsIdx !== -1 || answerIdx !== -1 || hasSplitOptions;
      const startRow = hasHeader ? 1 : 0;
      if (subjectIdx === -1) subjectIdx = 0;
      if (topicIdx === -1) topicIdx = 1;
      if (stemIdx === -1) stemIdx = 2;
      if (optionsIdx === -1) optionsIdx = 3;
      if (answerIdx === -1) answerIdx = 4;

      const rows: Array<{ subject: string; topic: string; stem: string; options: string[]; answer: string }> = [];
      const skipped: string[] = [];

      for (let i = startRow; i < table.length; i++) {
        const cols = table[i];
        const subject = canonicalSubject((cols[subjectIdx] ?? "").trim());
        const topic = (cols[topicIdx] ?? "").trim();
        const stem = (cols[stemIdx] ?? "").trim();
        let options: string[] = [];
        if (hasSplitOptions) {
          options = [optAIdx, optBIdx, optCIdx, optDIdx]
            .filter((idx) => idx !== -1)
            .map((idx) => (cols[idx] ?? "").trim())
            .filter(Boolean);
        } else {
          options = (cols[optionsIdx] ?? "")
            .split("|")
            .map((o) => o.trim())
            .filter(Boolean);
        }
        let answer = (cols[answerIdx] ?? "").trim();

        if (!subject || !topic || !stem) {
          skipped.push(`row ${i + 1}: missing subject/topic/stem`);
          continue;
        }
        if (options.length < 2) {
          skipped.push(`row ${i + 1}: needs at least 2 options`);
          continue;
        }
        // Allow the answer column to be a letter (A/B/C/D) instead of full text.
        const letter = answer.toUpperCase();
        if (/^[A-D]$/.test(letter)) {
          const idx = letter.charCodeAt(0) - 65;
          if (options[idx]) answer = options[idx];
        }
        if (!options.includes(answer)) {
          skipped.push(`row ${i + 1}: answer does not match any option`);
          continue;
        }
        rows.push({ subject, topic, stem, options, answer });
      }

      if (rows.length === 0) {
        return setImportMsg(
          skipped.length
            ? `No valid questions found. ${skipped.slice(0, 3).join("; ")}.`
            : "No valid question rows found. Use columns: subject, topic, stem, options (| separated), answer."
        );
      }

      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);

      const form = new FormData();
      form.append("schoolId", d.id);
      form.append("questions", JSON.stringify(rows));

      const res = await fetch("/api/school/questions-import", { method: "POST", body: form });
      const jd = await res.json();
      if (!res.ok) return setImportMsg(jd.error || "Import failed.");
      const bits = [`Imported ${jd.imported} question(s)`];
      if (jd.skipped) bits.push(`skipped ${jd.skipped}`);
      if (skipped.length) bits.push(`${skipped.length} row(s) could not be read`);
      setImportMsg(bits.join(", ") + ".");
      fetchQuestions();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Import failed.");
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
    setImportMsg("");
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Upload CSV</div>
          <button
            onClick={() =>
              downloadCsv("question-bank-template.csv", [
                ["subject", "topic", "stem", "options", "answer"],
                ["Mathematics", "Fractions", "What is 1/2 + 1/4?", "1/2|3/4|1/4|2/3", "3/4"],
                ["English Studies", "Synonyms", "Choose the word nearest in meaning to 'happy'.", "Sad|Joyful|Angry|Tired", "Joyful"]
              ])
            }
            style={{ height: 32, borderRadius: 8, border: "1px solid #0F766E", background: "#F0FDFA", color: "#0F766E", fontWeight: 700, fontSize: 12, padding: "0 10px", cursor: "pointer" }}
          >
            Download template
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#5F6E7F", marginBottom: 8 }}>
          CSV columns: <code style={{ color: "#1E242E" }}>subject, topic, stem, options, answer</code> — options separated by |
          (you can also use separate <code style={{ color: "#1E242E" }}>option a…option d</code> columns). Quoted commas are supported.
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
        {importMsg && <p style={{ fontSize: 13, marginTop: 6, color: importMsg.startsWith("Imported") ? "#166534" : "#DC2626" }}>{importMsg}</p>}
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
