"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Plan = {
  daysLeft: number | null;
  exam: string;
  message: string;
  week: { day: string; date: string; items: { subject: string; topic: string; minutes: number; reason: string }[] }[];
};

function PlanInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (id) fetch(`/api/study-plan?userId=${id}`).then((r) => r.json()).then(setPlan);
  }, [params]);

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;
  if (!plan) return <main style={{ padding: 20 }}>Loading…</main>;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My study plan</h1>
      <p style={{ fontSize: 15 }}>{plan.message}</p>
      {plan.week.length === 0 && <p style={{ fontSize: 14 }}>Practice a little first — then come back for your week.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {plan.week.map((d) => (
          <div key={d.date} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14 }}>
            <strong>{d.day}</strong>
            <div style={{ fontSize: 12, color: "#5F6E7F" }}>{d.date}</div>
            {d.items.map((it, i) => (
              <div key={i} style={{ fontSize: 13, marginTop: 8, paddingTop: 8, borderTop: "1px solid #E2E8F0" }}>
                <strong>{it.subject} • {it.topic}</strong> — {it.minutes} min
                <div style={{ color: "#5F6E7F" }}>{it.reason}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

export default function StudyPlan() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <PlanInner />
    </Suspense>
  );
}
