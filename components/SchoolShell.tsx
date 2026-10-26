"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import TopBar from "@/components/TopBar";
import NoticeBell from "@/components/NoticeBell";
import React from "react";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

const TIPS: Record<string, string> = {
  Dashboard: "School overview — students, activity, and weak topics at a glance",
  "Academic Reports": "Class performance, subject reports, and school-wide insights",
  Students: "Roster management — view and manage all linked students",
  "Teachers & Staff": "Manage teacher accounts and their assigned classes",
  "Classes & Departments": "Organise classes, departments, and subject assignments",
  "Learning Resources": "Browse study notes and learning materials by subject",
  "Questions & Assessments": "Browse the question bank and past papers",
  Assignments: "View and manage assignments set by teachers",
  "Approval Center": "Review and approve/reject teacher lesson notes",
  Announcements: "Send and manage school-wide broadcasts",
  "Subscription & Billing": "Manage school subscription and invoices",
  "School Settings": "Configure school details, code, and preferences"
};

// School environment shell: VP Academics / staff portal.
export default function SchoolShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("Staff");
  const [schoolName, setSchoolName] = useState("School");
  const [schoolCode, setSchoolCode] = useState("");
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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
    setCollapsed(localStorage.getItem("school_collapsed") === "1");
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => {
      localStorage.setItem("school_collapsed", c ? "0" : "1");
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
    setOpen(false);
    if (id) {
      fetch(`/api/school?userId=${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.school) {
            setSchoolName(d.school.name || "School");
            setSchoolCode(d.school.code || "");
          }
          if (d?.staff?.name) setName(d.staff.name);
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

  async function logout() {
    localStorage.removeItem("edupal_user");
    localStorage.removeItem("edupal_role");
    localStorage.removeItem("edupal_school_staff");
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  const q = userId ? `?userId=${userId}` : "";
  const wide = !collapsed;
  const initial = name.trim().charAt(0).toUpperCase() || "S";

  const LINKS = [
    { href: `/school/dashboard${q}`, match: "/school/dashboard", label: "Dashboard", emoji: "🏠" },
    { href: `/school/academic-reports${q}`, match: "/school/academic-reports", label: "Academic Reports", emoji: "📈" },
    { href: `/school/students${q}`, match: "/school/students", label: "Students", emoji: "👥" },
    { href: `/school/teachers${q}`, match: "/school/teachers", label: "Teachers & Staff", emoji: "👨‍🏫" },
    { href: `/school/classes${q}`, match: "/school/classes", label: "Classes & Departments", emoji: "🏫" },
    { href: `/school/learning-resources${q}`, match: "/school/learning-resources", label: "Learning Resources", emoji: "📚" },
    { href: `/school/questions${q}`, match: "/school/questions", label: "Questions & Assessments", emoji: "❓" },
    { href: `/school/assignments${q}`, match: "/school/assignments", label: "Assignments", emoji: "✅" },
    { href: `/school/approval${q}`, match: "/school/approval", label: "Approval Center", emoji: "✅" },
    { href: `/school/announcements${q}`, match: "/school/announcements", label: "Announcements", emoji: "📢" },
    { href: `/school/subscription${q}`, match: "/school/subscription", label: "Subscription & Billing", emoji: "💳" },
    { href: `/school/settings${q}`, match: "/school/settings", label: "School Settings", emoji: "⚙️" }
  ];

  const sidebar = (
    <aside
      style={{
        width: collapsed ? 64 : 250, flexShrink: 0, background: "#1E242E", color: "#fff",
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
            <a href="/school/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>🎓 EduPal AI</div>
              <div style={{ fontSize: 11, fontStyle: "italic", color: "#A7F3D0", marginTop: 2 }}>School Portal</div>
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
        {LINKS.map((l) => {
          const section = getSection(l.label);
          return (
            <React.Fragment key={l.label}>
              {section && (
                <div style={{ padding: wide ? "8px 12px" : "8px", fontSize: 10, fontWeight: 800, letterSpacing: 1, color: "#94A3B8", textTransform: "uppercase", marginBottom: 4 }}>
                  {section}
                </div>
              )}
              <a
                href={l.href}
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
              </a>
            </React.Fragment>
          )
        })}
      </nav>
      <div style={{ padding: 10, borderTop: "1px solid #333A45" }}>
        {wide ? (
          <div style={{ background: "#333A45", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px", flexShrink: 0 }}>{initial}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
              <div style={{ fontSize: 10, color: "#A7F3D0" }}>{schoolName}</div>
              <div style={{ fontSize: 10, color: "#A7F3D0", fontFamily: "monospace", letterSpacing: 1 }}>{schoolCode}</div>
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
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      {tip && (
        <div style={{ position: "fixed", left: collapsed && !mobile ? 72 : 260, top: tip.top - 16, zIndex: 60,
          background: "#1E242E", color: "#fff", fontSize: 12, padding: "8px 12px", borderRadius: 8,
          border: "1px solid #0F766E", maxWidth: 240, pointerEvents: "none", boxShadow: "0 4px 16px rgb(0 0 0 / 0.3)" }}>
          {tip.text}
        </div>
      )}
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
      {userId && <NoticeBell userId={userId} />}
    </div>
  );
}

function getSection(label: string): string | null {
  if (["Dashboard", "Academic Reports"].includes(label)) return "OVERVIEW";
  if (["Students", "Teachers & Staff", "Classes & Departments"].includes(label)) return "SCHOOL MANAGEMENT";
  if (["Learning Resources", "Questions & Assessments", "Assignments", "Approval Center"].includes(label)) return "ACADEMICS";
  if (["Announcements", "Subscription & Billing", "School Settings"].includes(label)) return "ADMINISTRATION";
  return null;
}
