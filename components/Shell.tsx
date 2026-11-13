"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import TopBar from "./TopBar";
import AdminViewBanner from "./AdminViewBanner";
import NoticeBell from "./NoticeBell";
import SchoolShell from "./SchoolShell";
import TeacherShell from "./TeacherShell";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/school-register", "/school-login", "/school-session"];

// Persistent app shell: collapsible dark sidebar (desktop), hamburger drawer (mobile).
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState("Student");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [plan, setPlan] = useState("");
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [adminView, setAdminView] = useState(false);
  const [classroom, setClassroom] = useState(false);
  const [tip, setTip] = useState<{ text: string; top: number } | null>(null);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Environment detection: STUDENT → individual app, SCHOOL_ADMIN → school portal,
  // SCHOOL_TEACHER → teacher workspace.
  const env = role === "SCHOOL_ADMIN" ? "school" : role === "SCHOOL_TEACHER" ? "teacher" : "individual";

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setCollapsed(localStorage.getItem("edupal_collapsed") === "1");
    try {
      const raw = localStorage.getItem("student_sections");
      setOpenSections(raw ? JSON.parse(raw) : {});
    } catch {
      setOpenSections({});
    }
  }, []);

  function toggleSection(name: string) {
    setOpenSections((prev) => {
      const next = { ...prev, [name]: !(prev[name] ?? true) };
      localStorage.setItem("student_sections", JSON.stringify(next));
      return next;
    });
  }

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
  const isActive = (match: string) => match === here;

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    setRole(localStorage.getItem("edupal_role"));
    setOpen(false);
    // School-code sessions last 2 hours. Progress is saved server-side, so when
    // time is up we clear the local ticket and send the student back to the
    // code page to start a fresh session.
    try {
      const raw = localStorage.getItem("edupal_school_session");
      if (raw) {
        const sess = JSON.parse(raw) as { expiresAt?: number };
        if (!sess.expiresAt || sess.expiresAt <= Date.now()) {
          localStorage.removeItem("edupal_school_session");
          localStorage.removeItem("edupal_user");
          localStorage.removeItem("edupal_role");
          window.location.href = localStorage.getItem("edupal_role") === "SCHOOL_TEACHER" ? "/teacher-session" : "/school-session";
          return;
        }
      }
    } catch { /* malformed ticket — ignore */ }
    if (id && env === "individual") {
      fetch(`/api/topics?userId=${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.profile?.name) setName(String(d.profile.name));
          if (d?.profile?.plan) setPlan(String(d.profile.plan));
          const ed = d.profile?.examDate as string | null;
          setDaysLeft(ed ? Math.ceil((Date.parse(ed) - Date.now()) / 86400000) : null);
        });
    }
  }, [path, search, env]);

  function showTip(label: string, el: HTMLElement) {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => {
      const r = el.getBoundingClientRect();
      setTip({ text: label, top: r.top + r.height / 2 });
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
      window.location.href = `/school/dashboard?userId=${staff}`;
    } else {
      setClassroom(false);
    }
  }

  async function logout() {
    localStorage.removeItem("edupal_user");
    localStorage.removeItem("edupal_role");
    localStorage.removeItem("edupal_school_staff");
    localStorage.removeItem("edupal_school_session");
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  // Skip sidebar shell for /admin/* (it has its own admin layout).
  if (path?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Public routes get a clean top bar only — no sidebar shell.
  if (PUBLIC_ROUTES.includes(path)) {
    return (
      <>
        <TopBar />
        {children}
      </>
    );
  }

  // School pages have their own sidebar in app/school/layout.tsx. Skip the
  // student shell here so only the school sidebar renders.
  if (path === "/school" || path?.startsWith("/school/")) {
    return <>{children}</>;
  }

  // Route to the correct environment based on role.
  if (env === "school") {
    return <SchoolShell>{children}</SchoolShell>;
  }
  if (env === "teacher") {
    return <TeacherShell>{children}</TeacherShell>;
  }

  // Individual student shell.
  const q = userId ? `?userId=${userId}${adminView ? "&adminView=1" : ""}` : "";
  const likelyBadge =
    daysLeft === null ? "Locked" : daysLeft > 10 ? `${daysLeft} left` : "Live";
  const links = [
    { href: userId ? `/dashboard${q}` : "/onboarding", match: "/dashboard", label: "Dashboard", emoji: "🏠", badge: "" },
    { href: userId ? `/practice?userId=${userId}` : "/onboarding", match: "/practice", label: "Practice", emoji: "📝", badge: "" },
    { href: userId ? `/weak-topics?userId=${userId}` : "/onboarding", match: "/weak-topics", label: "Weak Topics", emoji: "🎯", badge: "" },
    { href: userId ? `/dashboard/curriculum${q}` : "/onboarding", match: "/dashboard/curriculum", label: "Curriculum & Notes", emoji: "📚", badge: "" },
    { href: userId ? `/likely-questions${q}` : "/onboarding", match: "/likely-questions", label: "Likely Questions", emoji: "🔥", badge: userId ? likelyBadge : "" },
    { href: userId ? `/past-paper?userId=${userId}` : "/onboarding", match: "/past-paper", label: "Past Papers", emoji: "📄", badge: userId && plan !== "UNLIMITED" ? "Unlimited" : "" },
    { href: "/metrics", match: "/metrics", label: "Progress Analytics", emoji: "📊", badge: "" },
    { href: userId ? `/leaderboard?userId=${userId}` : "/onboarding", match: "/leaderboard", label: "Leaderboard", emoji: "🏆", badge: "" },
    { href: userId ? `/subscription?userId=${userId}` : "/onboarding", match: "/subscription", label: "Subscription & Credits", emoji: "💳", badge: "" },
    { href: "/deadlines", match: "/deadlines", label: "Exam Info", emoji: "📅", badge: "" }
  ];
  const byLabel = (label: string) => links.find((l) => l.label === label)!;
  const sections = [
    { name: "LEARN", links: ["Dashboard", "Practice", "Weak Topics", "Curriculum & Notes", "Likely Questions", "Past Papers"].map(byLabel) },
    { name: "PROGRESS", links: ["Progress Analytics", "Leaderboard"].map(byLabel) },
    { name: "ACCOUNT", links: ["Subscription & Credits", "Exam Info"].map(byLabel) }
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
      <nav style={{ padding: 10, display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
        {sections.map((section) => {
          const isOpen = openSections[section.name] ?? true;
          return (
            <div key={section.name} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {wide ? (
                <button
                  onClick={() => toggleSection(section.name)}
                  aria-label={isOpen ? `Collapse ${section.name}` : `Expand ${section.name}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                    background: "transparent", border: 0, cursor: "pointer", textAlign: "left",
                    fontSize: 10, fontWeight: 800, letterSpacing: 1, color: "#94A3B8",
                    padding: "10px 12px 4px", textTransform: "uppercase"
                  }}
                >
                  <span>{section.name}</span>
                  <span style={{ fontSize: 10, color: "#64748B" }}>{isOpen ? "▾" : "▸"}</span>
                </button>
              ) : (
                <div style={{ height: 1, background: "#333A45", margin: "6px 8px" }} />
              )}

              {(isOpen || !wide) && section.links.map((l) => (
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
            </div>
          );
        })}
      </nav>
      <div style={{ padding: 10, borderTop: "1px solid #333A45" }}>
        {wide ? (
          <div style={{ background: "#333A45", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px", flexShrink: 0 }}>{initial}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
              <div style={{ fontSize: 10, color: "#A7F3D0" }}>Active Student</div>
            </div>
            <button onClick={logout} title="Log out" aria-label="Log out"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <span title={name} style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px" }}>{initial}</span>
            <button onClick={logout} title="Log out" aria-label="Log out"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
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
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🏫 {name.trim().split(/\s+/)[0] || "Student"} is practising</span>
          <a href="/school/classroom" style={{ background: "#0F766E", color: "#fff", borderRadius: 999, padding: "6px 12px", textDecoration: "none", fontWeight: 700, flexShrink: 0 }}>Switch student</a>
          <button onClick={exitClassroom} style={{ background: "transparent", border: 0, color: "#A7F3D0", cursor: "pointer", fontWeight: 700, flexShrink: 0 }}>Exit</button>
        </div>
      )}
    </div>
  );
}
