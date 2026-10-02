"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";

// Persistent app shell: dark sidebar on desktop, hamburger drawer on mobile.
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("Student");
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    setOpen(false);
    if (id) {
      fetch(`/api/topics?userId=${id}`)
        .then((r) => r.json())
        .then((d) => d.profile?.name && setName(String(d.profile.name)));
    }
  }, [path, search]);

  async function logout() {
    localStorage.removeItem("edupal_user");
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  const q = userId ? `?userId=${userId}` : "";
  const links = [
    { href: userId ? `/dashboard${q}` : "/onboarding", label: "Dashboard", emoji: "🏠" },
    { href: userId ? `/practice${q}&subject=English` : "/onboarding", label: "Practice & Diagnostics", emoji: "📝" },
    { href: userId ? `/dashboard${q}#topics` : "/onboarding", label: "Weak Topics", emoji: "🎯" },
    { href: "/metrics", label: "Progress Analytics", emoji: "📊" },
    { href: "/parent", label: "Parent Portal", emoji: "👨‍👩‍👧" },
    { href: userId ? `/dashboard${q}#upgrade` : "/onboarding", label: "Subscription & Credits", emoji: "💳" }
  ];

  const sidebar = (
    <aside
      style={{
        width: 248, flexShrink: 0, background: "#1E242E", color: "#fff",
        display: "flex", flexDirection: "column", minHeight: "100vh",
        position: mobile ? "fixed" : "sticky", top: 0, height: mobile ? "100vh" : "100vh",
        left: 0, zIndex: 50,
        transform: mobile && !open ? "translateX(-100%)" : "none",
        transition: "transform 200ms ease"
      }}
    >
      <div style={{ padding: "16px", borderBottom: "1px solid #333A45" }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>🎓 EduPal AI</div>
        <div style={{ marginTop: 10, background: "#0F766E", borderRadius: 10, padding: "8px 10px", fontSize: 13, fontWeight: 700 }}>
          👤 {name}
        </div>
      </div>
      <nav style={{ padding: 10, display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {links.map((l) => {
          const active = path === l.href.split("?")[0].split("#")[0] && l.href.startsWith(path);
          return (
            <a
              key={l.label} href={l.href}
              style={{
                color: "#fff", textDecoration: "none", fontSize: 14, padding: "10px 12px",
                borderRadius: 8, background: active ? "#0F766E" : "transparent"
              }}
            >
              <span style={{ marginRight: 8 }}>{l.emoji}</span>{l.label}
            </a>
          );
        })}
      </nav>
      <div style={{ padding: 10, borderTop: "1px solid #333A45", display: "flex", flexDirection: "column", gap: 2 }}>
        <a href="/settings" style={{ color: "#fff", textDecoration: "none", fontSize: 14, padding: "10px 12px", borderRadius: 8 }}>
          <span style={{ marginRight: 8 }}>⚙️</span>Settings
        </a>
        <button onClick={logout} style={{ textAlign: "left", background: "transparent", border: 0, color: "#fff", fontSize: 14, padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}>
          <span style={{ marginRight: 8 }}>🚪</span>Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      {mobile && open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {mobile && (
          <div style={{ background: "#1E242E", padding: "10px 12px", position: "sticky", top: 0, zIndex: 30 }}>
            <button onClick={() => setOpen(!open)} aria-label="Menu"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 18, padding: "4px 12px", cursor: "pointer" }}>
              ☰
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
