"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import TopBar from "./TopBar";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

// Persistent app shell: collapsible dark sidebar (desktop), hamburger drawer (mobile).
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState("STUDENT");
  const [name, setName] = useState("Student");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setCollapsed(localStorage.getItem("edupal_collapsed") === "1");
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => {
      localStorage.setItem("edupal_collapsed", c ? "0" : "1");
      return !c;
    });
  }

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

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    setRole(localStorage.getItem("edupal_role") ?? "STUDENT");
    setOpen(false);
    if (id) {
      fetch(`/api/topics?userId=${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.profile?.name) setName(String(d.profile.name));
          const ed = d.profile?.examDate as string | null;
          setDaysLeft(ed ? Math.ceil((Date.parse(ed) - Date.now()) / 86400000) : null);
        });
    }
  }, [path, search]);

  async function logout() {
    localStorage.removeItem("edupal_user");
    localStorage.removeItem("edupal_role");
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  const q = userId ? `?userId=${userId}` : "";
  const likelyBadge =
    daysLeft === null ? "Locked" : daysLeft > 7 ? `${daysLeft} left` : daysLeft >= 0 ? "Live" : "Live";
  const links = role === "TEACHER" ? [
    { href: userId ? `/teacher?userId=${userId}` : "/login", match: "/teacher", label: "My Classes", emoji: "🏫", badge: "" },
    { href: "/admin", match: "/admin", label: "Progress Analytics", emoji: "📊", badge: "" },
    { href: userId ? `/teacher?userId=${userId}` : "/login", match: "/teacher#billing", label: "Billing", emoji: "💳", badge: "" }
  ] : [
    { href: userId ? `/dashboard${q}` : "/onboarding", match: "/dashboard", label: "Dashboard", emoji: "🏠", badge: "" },
    { href: userId ? `/practice${q}&subject=English` : "/onboarding", match: "/practice", label: "Practice & Diagnostics", emoji: "📝", badge: "" },
    { href: userId ? `/dashboard${q}#topics` : "/onboarding", match: "/dashboard#topics", label: "Weak Topics", emoji: "🎯", badge: "" },
    { href: userId ? `/dashboard/curriculum${q}` : "/onboarding", match: "/dashboard/curriculum", label: "Curriculum & Notes", emoji: "📚", badge: "" },
    { href: userId ? `/likely-questions${q}` : "/onboarding", match: "/likely-questions", label: "Likely Questions", emoji: "🔥", badge: userId ? likelyBadge : "" },
    { href: "/metrics", match: "/metrics", label: "Progress Analytics", emoji: "📊", badge: "" },
    { href: "/parent", match: "/parent", label: "Parent Portal", emoji: "👨‍👩‍👧", badge: "" },
    { href: userId ? `/dashboard${q}#upgrade` : "/onboarding", match: "/dashboard#upgrade", label: "Subscription & Credits", emoji: "💳", badge: "" }
  ];
  const homeHref = role === "TEACHER" && userId ? `/teacher?userId=${userId}` : userId ? `/dashboard${q}` : "/";
  const wide = !collapsed;
  const initial = name.trim().charAt(0).toUpperCase() || "S";

  const sidebar = (
    <aside
      title={collapsed ? "Expand sidebar" : ""}
      style={{
        width: collapsed ? 64 : 240, flexShrink: 0, background: "#1E242E", color: "#fff",
        display: "flex", flexDirection: "column", minHeight: "100vh",
        position: mobile ? "fixed" : "sticky", top: 0, height: "100vh",
        left: 0, zIndex: 50,
        transform: mobile && !open ? "translateX(-100%)" : "none",
        transition: "width 200ms ease, transform 200ms ease",
        overflow: "hidden"
      }}
    >
      <div style={{ padding: wide ? 16 : 12, borderBottom: "1px solid #333A45" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: wide ? "space-between" : "center", gap: 8 }}>
          {wide && <a href={homeHref} style={{ fontWeight: 800, fontSize: 17, color: "#fff", textDecoration: "none" }}>🎓 EduPal AI</a>}
          {!mobile && (
            <button onClick={toggleCollapse} title="Collapse Sidebar" aria-label="Collapse Sidebar"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 10px", cursor: "pointer" }}>
              {collapsed ? "»" : "«"}
            </button>
          )}
        </div>
      </div>
      <nav style={{ padding: 10, display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {links.map((l) => (
          <a
            key={l.label} href={l.href} title={l.label}
            className={isActive(l.match) ? "nav-link nav-link-active" : "nav-link"}
            style={{
              color: "#fff", textDecoration: "none", fontSize: 14, padding: "10px 12px",
              borderRadius: 999, display: "flex", alignItems: "center", gap: wide ? 8 : 0,
              justifyContent: wide ? "flex-start" : "center", whiteSpace: "nowrap"
            }}
          >
            <span style={{ fontSize: 16 }}>{l.emoji}</span>
            {wide && <span style={{ flex: 1 }}>{l.label}</span>}
            {wide && l.badge !== "" && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999,
                background: l.badge === "Live" ? "#16A34A" : "#F59E0B", color: l.badge === "Live" ? "#fff" : "#422006" }}>
                {l.badge}
              </span>
            )}
          </a>
        ))}
      </nav>
      <div style={{ padding: 10, borderTop: "1px solid #333A45" }}>
        {wide ? (
          <div style={{ background: "#333A45", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px", flexShrink: 0 }}>{initial}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
              <div style={{ fontSize: 10, color: "#A7F3D0" }}>{role === "TEACHER" ? "Active Teacher" : "Active Student"}</div>
            </div>
            <button onClick={logout} title="Logout" aria-label="Logout"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 8px", cursor: "pointer" }}>🚪</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <span title={name} style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px" }}>{initial}</span>
            <button onClick={logout} title="Logout" aria-label="Logout"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 8px", cursor: "pointer" }}>🚪</button>
          </div>
        )}
        <a href="/settings" title="Settings" style={{ display: "block", color: "#fff", textDecoration: "none", fontSize: 14, padding: "10px 12px", borderRadius: 8, textAlign: wide ? "left" : "center" }}>
          ⚙️{wide && <span style={{ marginLeft: 8 }}>Settings</span>}
        </a>
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
