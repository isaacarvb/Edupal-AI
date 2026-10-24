"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import TopBar from "./TopBar";
import AdminViewBanner from "./AdminViewBanner";
import NoticeBell from "./NoticeBell";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

const TIPS: Record<string, string> = {
  Dashboard: "Your home screen — streaks, practice summary, and quick actions",
  Practice: "Answer questions and get instant AI feedback on your answers",
  "Weak Topics": "See the topics you struggle with most and drill them specifically",
  "Curriculum & Notes": "Browse the syllabus and access study notes by subject and topic",
  "Likely Questions": "AI-predicted questions most likely to appear in your exam",
  "Progress Analytics": "Track your performance over time across all subjects and topics",
  "Parent Portal": "Your parent or guardian's view of your progress and activity",
  "School Portal": "Your school's students, classes and login management",
  "Subscription & Credits": "Manage your plan, view daily credits, and upgrade your account",
  "Exam Info": "Key dates, registration deadlines, and exam tips",
  Settings: "Update your profile, password, language, and display preferences"
};

// Persistent app shell: collapsible dark sidebar (desktop), hamburger drawer (mobile).
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [schoolAdmin, setSchoolAdmin] = useState(false);
  const [name, setName] = useState("Student");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [adminView, setAdminView] = useState(false);
  const [classroom, setClassroom] = useState(false);
  const [tip, setTip] = useState<{ text: string; top: number } | null>(null);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setSchoolAdmin(localStorage.getItem("edupal_role") === "SCHOOL_ADMIN");
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

  function showTip(label: string, el: HTMLElement) {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => {
      const r = el.getBoundingClientRect();
      setTip({ text: TIPS[label] ?? label, top: r.top + r.height / 2 });
    }, 300);
  }

  function hideTip() {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    setTip(null);
  }

  // Preview mode survives clicks AND refreshes: the ?adminView=1 ticket is
  // remembered in session memory, cleared only by "Back to Admin".
  // (Must sit with the other hooks — never below an early return.)
  useEffect(() => {
    try {
      if (search?.get("adminView") === "1") {
        sessionStorage.setItem("edupal_admin_view", "1");
        setAdminView(true);
      } else {
        setAdminView(sessionStorage.getItem("edupal_admin_view") === "1");
      }
    } catch {
      setAdminView(search?.get("adminView") === "1");
    }
  }, [search]);

  // Classroom mode ticket: set when a student starts from the school's
  // tap-your-name picker, so a "Switch student" pill floats on every page.
  useEffect(() => {
    try {
      if (search?.get("classroom") === "1") {
        sessionStorage.setItem("edupal_classroom", "1");
        setClassroom(true);
      } else {
        setClassroom(sessionStorage.getItem("edupal_classroom") === "1");
      }
    } catch {
      setClassroom(search?.get("classroom") === "1");
    }
  }, [search]);

  function exitClassroom() {
    try { sessionStorage.removeItem("edupal_classroom"); } catch { /* private mode */ }
    const staff = localStorage.getItem("edupal_school_staff");
    if (staff) {
      localStorage.setItem("edupal_user", staff);
      localStorage.setItem("edupal_role", "SCHOOL_ADMIN");
      window.location.href = `/school?userId=${staff}`;
    } else {
      setClassroom(false);
    }
  }

  async function logout() {
    localStorage.removeItem("edupal_user");
    localStorage.removeItem("edupal_role");
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  const q = userId ? `?userId=${userId}${adminView ? "&adminView=1" : ""}` : "";
  const likelyBadge =
    daysLeft === null ? "Locked" : daysLeft > 7 ? `${daysLeft} left` : "Live";
  const links = [
    { href: userId ? `/dashboard${q}` : "/onboarding", match: "/dashboard", label: "Dashboard", emoji: "🏠", badge: "" },
    { href: userId ? `/practice?userId=${userId}` : "/onboarding", match: "/practice", label: "Practice", emoji: "📝", badge: "" },
    { href: userId ? `/weak-topics?userId=${userId}` : "/onboarding", match: "/weak-topics", label: "Weak Topics", emoji: "🎯", badge: "" },
    { href: userId ? `/dashboard/curriculum${q}` : "/onboarding", match: "/dashboard/curriculum", label: "Curriculum & Notes", emoji: "📚", badge: "" },
    { href: userId ? `/likely-questions${q}` : "/onboarding", match: "/likely-questions", label: "Likely Questions", emoji: "🔥", badge: userId ? likelyBadge : "" },
    { href: "/metrics", match: "/metrics", label: "Progress Analytics", emoji: "📊", badge: "" },
    { href: "/parent", match: "/parent", label: "Parent Portal", emoji: "👨‍👩‍👧", badge: "" },
    // School Portal: visible ONLY to school staff accounts (role SCHOOL_ADMIN).
    ...(schoolAdmin ? [{ href: userId ? `/school?userId=${userId}` : "/school", match: "/school", label: "School Portal", emoji: "🏫", badge: "" }] : []),
    { href: userId ? `/subscription?userId=${userId}` : "/onboarding", match: "/subscription", label: "Subscription & Credits", emoji: "💳", badge: "" },
    { href: "/deadlines", match: "/deadlines", label: "Exam Info", emoji: "📅", badge: "" }
  ];
  const homeHref = userId ? `/dashboard${q}` : "/";
  const wide = !collapsed;
  const initial = name.trim().charAt(0).toUpperCase() || "S";

  const sidebar = (
    <aside
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
          {wide && (
            <a href={homeHref} style={{ color: "#fff", textDecoration: "none" }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>🎓 EduPal AI</div>
              <div style={{ fontSize: 11, fontStyle: "italic", color: "#A7F3D0", marginTop: 2 }}>"..your personal exam coach"</div>
            </a>
          )}
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
            key={l.label} href={l.href}
            onMouseEnter={(e) => showTip(l.label, e.currentTarget)}
            onMouseLeave={hideTip}
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
              <div style={{ fontSize: 10, color: "#A7F3D0" }}>Active Student</div>
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
        <a href="/settings"
          onMouseEnter={(e) => showTip("Settings", e.currentTarget)}
          onMouseLeave={hideTip}
          style={{ display: "block", color: "#fff", textDecoration: "none", fontSize: 14, padding: "10px 12px", borderRadius: 8, textAlign: wide ? "left" : "center" }}>
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

  // Skip sidebar shell for /admin/* (it has its own layout).
  if (path?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      {tip && (
        <div style={{ position: "fixed", left: collapsed && !mobile ? 72 : 248, top: tip.top - 16, zIndex: 60,
          background: "#1E242E", color: "#fff", fontSize: 12, padding: "8px 12px", borderRadius: 8,
          border: "1px solid #0F766E", maxWidth: 240, pointerEvents: "none", boxShadow: "0 4px 16px rgb(0 0 0 / 0.3)" }}>
          {tip.text}
        </div>
      )}
      {mobile && open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {adminView && <AdminViewBanner userName={name} />}
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
      {userId && <NoticeBell userId={userId} />}
      {classroom && (
        <div style={{ position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 70,
          background: "#1E242E", color: "#fff", borderRadius: 999, padding: "8px 8px 8px 16px",
          display: "flex", alignItems: "center", gap: 10, fontSize: 13, border: "1px solid #0F766E",
          boxShadow: "0 8px 24px rgb(0 0 0 / 0.35)", maxWidth: "92vw" }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🏫 {name !== "Student" ? name.trim().split(/\s+/)[0] : "Student"} is practising</span>
          <a href="/school/classroom" style={{ background: "#0F766E", color: "#fff", borderRadius: 999, padding: "6px 12px", textDecoration: "none", fontWeight: 700, flexShrink: 0 }}>Switch student</a>
          <button onClick={exitClassroom} style={{ background: "transparent", border: 0, color: "#A7F3D0", cursor: "pointer", fontWeight: 700, flexShrink: 0 }}>Exit</button>
        </div>
      )}
    </div>
  );
}
