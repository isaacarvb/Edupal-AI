"use client";
import { useEffect, useState } from "react";

type O = { total: number; free: number; paid: number; newToday: number; attemptsToday: number; attemptsTotal: number; dau: number; wau: number; admins: number; questions: number; flagged: number; drafts: number; maintenance: boolean };

type Rev = { totalKobo: number; paidCount: number } | null;

export default function AdminDashboard() {
  const [o, setO] = useState<O | null>(null);
  const [rev, setRev] = useState<Rev>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    const adminId = localStorage.getItem("edupal_admin");
    if (!adminId) return;
    fetch(`/api/admin/overview?adminId=${adminId}`).then(async (r) => {
      const d = await r.json();
      if (!r.ok) setErr(d.error || "Failed to load.");
      else setO(d);
    });
    fetch(`/api/admin/revenue?adminId=${adminId}`).then(async (r) => {
      if (r.ok) setRev(await r.json());
    });
  }, []);
  if (err) return <main style={{ padding: 32 }}>{err}</main>;
  if (!o) return <main style={{ padding: 32 }}>Loading dashboard…</main>;
  const card = (k: string, v: string | number, href?: string) => (
    <a href={href ?? "#"} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, textDecoration: "none", color: "#1E242E" }}>
      <div style={{ fontSize: 12, color: "#5F6E7F" }}>{k}</div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{v}</div>
    </a>
  );
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Admin Dashboard</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Free vs paid, activity, content health. {o.maintenance ? "🔴 Maintenance ON" : "🟢 Live"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
        {card("Users (students)", o.total, "/admin/users")}
        {card("Free", o.free, "/admin/users?plan=FREE")}
        {card("Paid / pilot", o.paid, "/admin/users")}
        {card("New today", o.newToday, "/admin/users")}
        {card("Active today", o.dau, "/admin/users")}
        {card("Active 7d", o.wau, "/admin/users")}
        {card("Attempts today", o.attemptsToday)}
        {card("Attempts total", o.attemptsTotal)}
        {card("Questions", o.questions, "/admin/questions")}
        {card("Flagged", o.flagged, "/admin/flags")}
        {card("AI drafts", o.drafts, "/admin/drafts")}
        {card("Revenue", rev ? `₦${(rev.totalKobo / 100).toLocaleString("en-NG")}` : "…", "/admin/payments")}
        {card("Payments", rev?.paidCount ?? "…", "/admin/payments")}
        {card("Admins", o.admins, "/admin/admins")}
        {card("Logs", "📜", "/admin/logs")}
      </div>
    </main>
  );
}
