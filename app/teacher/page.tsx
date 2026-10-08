"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type ClassRow = { id: string; name: string; inviteCode: string; term: string; plan: string; members: number };
type Detail = {
  class: { id: string; name: string; inviteCode: string; term: string; plan: string };
  members: { id: string; name: string; email: string; accuracy: number | null; attempts: number }[];
  assignments: { id: string; subject: string; topic: string; note: string }[];
  sessions: { id: string; title: string; startsAt: string; meetUrl: string }[];
};

function TeacherInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [openId, setOpenId] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [cname, setCname] = useState("");
  const [asubject, setAsubject] = useState("English");
  const [atopic, setAtopic] = useState("");
  const [anote, setAnote] = useState("");
  const [stitle, setStitle] = useState("");
  const [sdate, setSdate] = useState("");
  const [stime, setStime] = useState("");
  const [surl, setSurl] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = useCallback(async () => {
    if (!userId) return;
    const d = await fetch(`/api/classes?userId=${userId}`).then((r) => r.json());
    if (d.role !== "TEACHER") {
      setMsg("Teacher accounts only — this login is a student.");
      return;
    }
    setClasses(d.classes ?? []);
  }, [userId]);

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (params.get("paid") === "1") setMsg("✓ Class subscription active (test).");
  }, [params]);

  async function openDetail(id: string) {
    setOpenId(id);
    const d = await fetch(`/api/classes/${id}?userId=${userId}`).then((r) => r.json());
    setDetail(d.error ? null : d);
  }

  async function createClass() {
    if (!cname.trim()) return;
    const res = await fetch("/api/classes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name: cname.trim() })
    });
    const data = await res.json();
    if (res.ok) {
      setCname("");
      setMsg(`Class created — invite code: ${data.inviteCode}`);
      refresh();
    } else setMsg(data.error || "Failed");
  }

  async function assign() {
    if (!openId || !atopic.trim()) return;
    await fetch("/api/classes/assign", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, classId: openId, subject: asubject, topic: atopic.trim(), note: anote })
    });
    setAtopic("");
    setAnote("");
    openDetail(openId);
  }

  async function schedule() {
    if (!openId || !stitle.trim() || !sdate || !stime) return;
    await fetch("/api/classes/sessions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, classId: openId, title: stitle.trim(), startsAt: `${sdate}T${stime}:00`, meetUrl: surl.trim() })
    });
    setStitle("");
    setSurl("");
    openDetail(openId);
  }

  async function payClass(id: string) {
    const res = await fetch("/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, classId: id })
    });
    const data = await res.json();
    if (data.mode === "paystack" && data.authorizationUrl) {
      window.location.href = data.authorizationUrl;
      return;
    }
    if (res.ok) {
      setMsg("✓ Class subscription active (test).");
      openDetail(id);
      refresh();
    }
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. <a href="/signup">Sign up as Teacher</a>.</main>;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My classes</h1>
      {msg && <p style={{ fontSize: 14, fontWeight: 700 }}>{msg}</p>}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <strong>New class</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input value={cname} onChange={(e) => setCname(e.target.value)} placeholder="e.g. SS3A Physics" style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
          <button onClick={createClass} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 20px", cursor: "pointer" }}>Create</button>
        </div>
      </div>
      {classes.map((c) => (
        <div key={c.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <strong>{c.name}</strong>
            <span style={{ fontSize: 12 }}>Code: <strong>{c.inviteCode}</strong> • {c.members} student(s) • {c.term} • {c.plan}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => openDetail(c.id)} style={{ fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid #0F766E", background: "#fff", color: "#0F766E", padding: "8px 14px", cursor: "pointer" }}>
              {openId === c.id ? "Refresh" : "Open"}
            </button>
            {c.plan !== "PAID" && (
              <button onClick={() => payClass(c.id)} style={{ fontSize: 13, fontWeight: 700, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", padding: "8px 14px", cursor: "pointer" }}>
                Pay per class — ₦25,000/term (test)
              </button>
            )}
          </div>
          {openId === c.id && detail && (
            <div style={{ marginTop: 12 }}>
              <h3 style={{ fontSize: 15 }}>Students {detail.members.length === 0 && "(none yet — share the code)"}</h3>
              {detail.members.map((m) => (
                <div key={m.id} style={{ fontSize: 13, padding: "6px 0", borderTop: "1px solid #E2E8F0" }}>
                  {m.name ?? m.email} — {m.attempts === 0 ? "no practice yet" : `${Math.round(m.accuracy ?? 0)}% over ${m.attempts}`}
                </div>
              ))}
              <h3 style={{ fontSize: 15 }}>Assign a topic</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select value={asubject} onChange={(e) => setAsubject(e.target.value)} style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1" }}>
                  {["English", "Mathematics", "Physics", "Chemistry", "Biology", "Commerce", "Economics", "Government", "Literature"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <input value={atopic} onChange={(e) => setAtopic(e.target.value)} placeholder="Topic" style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
                <input value={anote} onChange={(e) => setAnote(e.target.value)} placeholder="Note (optional)" style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
                <button onClick={assign} style={{ height: 40, borderRadius: 8, border: 0, background: "#1E242E", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>Assign</button>
              </div>
              {detail.assignments.map((a: { id: string; subject: string; topic: string; note: string }) => (
                <div key={a.id} style={{ fontSize: 13 }}>• {a.subject} — {a.topic}{a.note ? ` (${a.note})` : ""}</div>
              ))}
              <h3 style={{ fontSize: 15 }}>Schedule live session</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input value={stitle} onChange={(e) => setStitle(e.target.value)} placeholder="Title" style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
                <input value={sdate} onChange={(e) => setSdate(e.target.value)} type="date" style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
                <input value={stime} onChange={(e) => setStime(e.target.value)} type="time" style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
                <input value={surl} onChange={(e) => setSurl(e.target.value)} placeholder="Meet link" style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
                <button onClick={schedule} style={{ height: 40, borderRadius: 8, border: 0, background: "#1E242E", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>Schedule</button>
              </div>
              {detail.sessions.map((s: { id: string; title: string; startsAt: string; meetUrl: string }) => (
                <div key={s.id} style={{ fontSize: 13 }}>• {s.title} — {s.startsAt.slice(0, 16).replace("T", " ")}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

export default function Teacher() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <TeacherInner />
    </Suspense>
  );
}
