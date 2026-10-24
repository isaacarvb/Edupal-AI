"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function ParentInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [data, setData] = useState<null | {
    parentEmail: string;
    summary: { exam: string; childName: string; streak: number; plan: string; weekAttempts: number };
    weak: { subject: string; topic: string; accuracy: number; label: string }[];
  }>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/parent?token=${token}`)
      .then((r) => r.json())
      .then((d) => (d.error ? setErr(d.error) : setData(d)));
  }, [token]);

  if (!token) return <main style={{ padding: 20 }}>Missing link. Ask your child to resend it.</main>;
  if (err) return <main style={{ padding: 20 }}>This link is invalid.</main>;
  if (!data) return <main style={{ padding: 20 }}>Loading…</main>;

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 22 }}>{data.summary.childName ? `${data.summary.childName}'s progress` : "Progress overview"}</h1>
      <p style={{ fontSize: 14, color: "#5F6E7F" }}>For {data.parentEmail} • view-only</p>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 12 }}>
        <p>Exam: <strong>{data.summary.exam}</strong> • Plan: <strong>{data.summary.plan}</strong></p>
        <p>Study streak: <strong>{data.summary.streak} day(s)</strong></p>
        <p>Answers this week: <strong>{data.summary.weekAttempts}</strong></p>
      </div>
      <h2 style={{ color: "#1E242E", fontSize: 18 }}>Weakest topics</h2>
      {data.weak.map((t) => (
        <div key={`${t.subject}-${t.topic}`} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 10, margin: "6px 0", fontSize: 14 }}>
          {t.subject} • {t.topic} — {Math.round(t.accuracy)}% ({t.label})
        </div>
      ))}
    </main>
  );
}

export default function Parent() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <ParentInner />
    </Suspense>
  );
}
