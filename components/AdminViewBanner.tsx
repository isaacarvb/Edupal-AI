"use client";
export default function AdminViewBanner({ userName }: { userName: string }) {
  function back() {
    const ret = localStorage.getItem("edupal_admin_return") || "/admin";
    localStorage.removeItem("edupal_admin_return");
    // Always drop the preview login + the preview ticket so the next "User view" starts fresh.
    localStorage.removeItem("edupal_user");
    try { sessionStorage.removeItem("edupal_admin_view"); } catch { /* ignore */ }
    window.location.href = ret;
  }
  return (
    <div style={{ background: "#7C3AED", color: "#fff", padding: "8px 12px", display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontSize: 13, position: "sticky", top: 0, zIndex: 100 }}>
      <span>👁 ADMIN VIEW — previewing as {userName || "student"}</span>
      <button onClick={back} style={{ background: "#fff", color: "#7C3AED", border: 0, borderRadius: 999, fontWeight: 800, padding: "6px 14px", cursor: "pointer" }}>← Back to Admin</button>
    </div>
  );
}
