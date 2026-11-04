"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminButton } from "@/components/admin-ui";

const LINKS = [
  { href: "/admin", label: "Admin Dashboard", emoji: "📊" },
  { href: "/admin/users", label: "Users", emoji: "👥" },
  { href: "/admin/school-access", label: "School Access", emoji: "🏫" },
  { href: "/admin/payments", label: "Payments", emoji: "💰" },
  { href: "/admin/plans", label: "Plans & Promos", emoji: "🏷️" },
  { href: "/admin/engagement", label: "Engagement", emoji: "📈" },
  { href: "/admin/announcements", label: "Announcements", emoji: "📢" },
  { href: "/admin/questions", label: "Questions", emoji: "📝" },
  { href: "/admin/flags", label: "Flagged", emoji: "🚩" },
  { href: "/admin/drafts", label: "AI Drafts", emoji: "🤖" },
  { href: "/admin/subjects", label: "Subjects", emoji: "🎛️" },
  { href: "/admin/notes", label: "Notes Access", emoji: "📚" },
  { href: "/admin/schools", label: "Schools", emoji: "🏫" },
  { href: "/admin/admins", label: "Admins", emoji: "👑" },
  { href: "/admin/logs", label: "Logs", emoji: "📜" },
  { href: "/admin/settings", label: "Settings", emoji: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // User view role selector modal
  const [showUserView, setShowUserView] = useState(false);
  const [uvBusy, setUvBusy] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("edupal_admin");
    if (id) {
      setAdminEmail(localStorage.getItem("edupal_admin_email") ?? "admin");
      setReady(true);
    } else {
      setReady(true);
    }
  }, [path]);

  async function login() {
    setErr("");
    if (!email.trim() || !password) return setErr("Enter admin email + password.");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), password }) });
      const d = await res.json();
      if (!res.ok) return setErr(d.error || "Login failed.");
      localStorage.setItem("edupal_admin", d.adminId);
      localStorage.setItem("edupal_admin_email", d.email);
      setAdminEmail(d.email);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem("edupal_admin");
    localStorage.removeItem("edupal_admin_email");
    setAdminEmail(null);
    router.push("/admin");
  }

  async function switchToRole(role: "student" | "teacher" | "school") {
    setUvBusy(true);
    setErr("");
    try {
      const adminId = localStorage.getItem("edupal_admin") ?? "";
      const res = await fetch(`/api/admin/switch-user-view?adminId=${encodeURIComponent(adminId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, adminId }),
      });
      const d = await res.json();
      if (!res.ok) {
        setErr(d.error || "Failed to switch role.");
        return;
      }
      localStorage.setItem("edupal_user", d.userId);
      if (d.role) localStorage.setItem("edupal_role", d.role);
      window.location.href = d.redirectUrl;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error switching role.");
    } finally {
      setUvBusy(false);
      setShowUserView(false);
    }
  }

  if (!ready) return <main style={{ padding: 32 }}>Loading…</main>;

  if (!adminEmail && !localStorage.getItem("edupal_admin")) {
    return (
      <main style={{ maxWidth: 420, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={{ background: "#fff", border: "2px solid #1E242E", borderRadius: 16, padding: 20 }}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>🔒 Admin login</h1>
          <p style={{ fontSize: 13, color: "#5F6E7F" }}>Only isaacareo34@gmail.com can open this area. Sign up with that email first, then sign in here with the password you chose.</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@email.com" type="email" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", margin: "8px 0", boxSizing: "border-box" }} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" onKeyDown={(e) => e.key === "Enter" && login()} style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", margin: "0 0 8px", boxSizing: "border-box" }} />
          {err && <p style={{ fontSize: 13, color: "#DC2626" }}>{err}</p>}
          <AdminButton size="lg" busy={busy} onClick={login}>Sign in as admin</AdminButton>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-scope" style={{ display: "flex", minHeight: "100vh", background: "#F1F5F9" }}>
      <aside style={{ width: 220, flexShrink: 0, background: "#1E242E", color: "#fff", display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #333A45" }}>
          <div style={{ fontWeight: 800 }}>🎓 EduPal Admin</div>
          <div style={{ fontSize: 11, color: "#A7F3D0", overflow: "hidden", textOverflow: "ellipsis" }}>{adminEmail}</div>
        </div>
        <nav style={{ padding: 10, display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <a key={l.href} href={l.href} className="admin-link" style={{ color: "#fff", textDecoration: "none", fontSize: 14, padding: "10px 12px", borderRadius: 10, background: active ? "#0F766E" : "transparent", fontWeight: active ? 800 : 400 }}>
                {l.emoji} {l.label}
              </a>
            );
          })}
          <button onClick={() => setShowUserView(true)} disabled={uvBusy} className="admin-link" style={{ background: "transparent", border: 0, color: "#A7F3D0", fontSize: 13, padding: "10px 12px", borderRadius: 10, textAlign: "left", cursor: uvBusy ? "not-allowed" : "pointer", width: "100%" }}>
            {uvBusy ? "⏳ Opening…" : "👁 User view"}
          </button>
        </nav>
        <div style={{ padding: 10, borderTop: "1px solid #333A45" }}>
          <button onClick={logout} style={{ width: "100%", background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, padding: "8px", cursor: "pointer" }}>Logout admin</button>
        </div>
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>

      {showUserView && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, minWidth: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, color: "#1E242E" }}>Open as which user?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => switchToRole("student")} disabled={uvBusy} style={{ width: "100%", padding: 12, borderRadius: 10, border: 0, background: uvBusy ? "#CBD5E1" : "#0F766E", color: "#fff", fontWeight: 700, fontSize: 15, cursor: uvBusy ? "not-allowed" : "pointer" }}>
                👤 Student
              </button>
              <button onClick={() => switchToRole("school")} disabled={uvBusy} style={{ width: "100%", padding: 12, borderRadius: 10, border: 0, background: uvBusy ? "#CBD5E1" : "#0F766E", color: "#fff", fontWeight: 700, fontSize: 15, cursor: uvBusy ? "not-allowed" : "pointer" }}>
                🏫 School Admin
              </button>
            </div>
            <button onClick={() => setShowUserView(false)} style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #E2E8F0", background: "transparent", color: "#5F6E7F", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
