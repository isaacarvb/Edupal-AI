"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import TopBar from "./TopBar";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

// Persistent app shell: dark sidebar on desktop, hamburger drawer on mobile.
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState("STUDENT");
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
    setRole(localStorage.getItem("edupal_role") ?? "STUDENT");
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
  const [hash, setHash] = useState("");
  useEffect(() => {
    const apply = () => setHash(window.location.hash);
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [path]);
  const here = `${path}${hash}`;
  // Exact match on path + anchor: /dashboard lights only Dashboard, not #topics/#upgrade.
  const isActive = (match: string) => match === here;
  const links = role === "TEACHER" ? [
    { href: userId ? `/teacher?userId=${userId}` : "/login", match: "/teacher", label: "My Classes", emoji: "🏫" },
    { href: "/admin", match: "/admin", label: "Progress Analytics", emoji: "📊" },
    { href: userId ? `/teacher?userId=${userId}` : "/login", match: "/teacher#billing", label: "Billing", emoji: "💳" }
  ] : [
    { href: userId ? `/dashboard${q}` : "/onboarding", match: "/dashboard", label: "Dashboard", emoji: "🏠" },
    { href: userId ? `/practice${q}&subject=English` : "/onboarding", match: "/practice", label: "Practice & Diagnostics", emoji: "📝" },
    { href: userId ? `/dashboard${q}#topics` : "/onboarding", match: "/dashboard#topics", label: "Weak Topics", emoji: "🎯" },
    { href: "/metrics", match: "/metrics", label: "Progress Analytics", emoji: "📊" },
    { href: "/parent", match: "/parent", label: "Parent Portal", emoji: "👨‍👩‍👧" },
    { href: userId ? `/dashboard${q}#upgrade` : "/onboarding", match: "/dashboard#upgrade", label: "Subscription & Credits", emoji: "💳" }
  ];
  const homeHref = role === "TEACHER" && userId ? `/teacher?userId=${userId}` : userId ? `/dashboard${q}` : "/";

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
        <a href={homeHref} style={{ fontWeight: 800, fontSize: 17, color: "#fff", textDecoration: "none" }}>🎓 EduPal AI</a>
        <div style={{ marginTop: 10, background: "#0F766E", borderRadius: 10, padding: "8px 10px", fontSize: 13, fontWeight: 700 }}>
          👤 {name}
        </div>
      </div>
      <nav style={{ padding: 10, display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {links.map((l) => {
          const active = isActive(l.match);
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

  // Public routes get the clean top bar; app routes get the sidebar shell.
  if (PUBLIC_ROUTES.includes(path)) {
    return (
      <>
        <TopBar />
        {children}
      </>
    );
  }

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
