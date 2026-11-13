"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const TIPS: Record<string, string> = {
  Dashboard: "School overview — students, activity, and weak topics at a glance",
  "Progress Analytics": "Class performance, subject reports, and school-wide insights",
  "Student Roster": "View and manage all linked students",
  "Teacher Roster": "Manage teacher accounts and their assigned classes",
  "Lesson Notes": "Review and approve teacher lesson notes",
  Curriculum: "Class-by-class, topic-by-topic notes for every subject",
  Announcements: "Send and manage school-wide broadcasts",
  "Mock Exams": "Set up and review school mock exams",
  "Question Bank": "Browse the question bank and past papers",
  "School Subscription": "Manage school subscription and invoices",
  Settings: "Configure school details, code, and preferences"
};

// The same 11 links the school portal already had, grouped into four sections.
// `locked` sections need an active subscription; the sidebar shows a padlock.
type SchoolNavLink = { href: string; label: string; emoji: string; locked?: boolean };

const SECTIONS: Array<{ name: string; links: SchoolNavLink[] }> = [
  {
    name: "OVERVIEW",
    links: [
      { href: "/school/dashboard", label: "Dashboard", emoji: "🏠" },
      { href: "/school/analytics", label: "Progress Analytics", emoji: "📈" }
    ]
  },
  {
    name: "SCHOOL MANAGEMENT",
    links: [
      { href: "/school/students", label: "Student Roster", emoji: "👥", locked: true },
      { href: "/school/teachers", label: "Teacher Roster", emoji: "👨‍🏫", locked: true }
    ]
  },
  {
    name: "ACADEMICS",
    links: [
      { href: "/school/lesson-notes", label: "Lesson Notes", emoji: "📚", locked: true },
      { href: "/school/curriculum", label: "Curriculum", emoji: "🗂️", locked: true },
      { href: "/school/mock-exams", label: "Mock Exams", emoji: "📝", locked: true },
      { href: "/school/questions", label: "Question Bank", emoji: "❓", locked: true }
    ]
  },
  {
    name: "ADMINISTRATION",
    links: [
      { href: "/school/subscription", label: "School Subscription", emoji: "💳" },
      { href: "/school/announcements", label: "Announcements", emoji: "📢", locked: true },
      { href: "/school/settings", label: "Settings", emoji: "⚙️" }
    ]
  }
];

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [school, setSchool] = useState<{ name: string; code: string } | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
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
    try {
      const raw = localStorage.getItem("school_sections");
      setOpenSections(raw ? JSON.parse(raw) : {});
    } catch {
      setOpenSections({});
    }
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try {
        const d = JSON.parse(s);
        setSchool({ name: d.name, code: d.code });
        if (d.id) {
          fetch(`/api/school/access?schoolId=${encodeURIComponent(d.id)}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => setIsActive(Boolean(j?.school?.isActive)))
            .catch(() => {});
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  function toggleCollapse() {
    setCollapsed((c) => {
      localStorage.setItem("school_collapsed", c ? "0" : "1");
      return !c;
    });
  }

  function toggleSection(name: string) {
    setOpenSections((prev) => {
      const next = { ...prev, [name]: !(prev[name] ?? true) };
      localStorage.setItem("school_sections", JSON.stringify(next));
      return next;
    });
  }

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

  function logout() {
    localStorage.removeItem("edupal_school");
    localStorage.removeItem("edupal_user");
    localStorage.removeItem("edupal_role");
    localStorage.removeItem("edupal_school_staff");
    localStorage.removeItem("edupal_school_session");
    window.location.href = "/school-login";
  }

  const wide = !collapsed;
  const initial = school?.name?.slice(0, 1).toUpperCase() || "S";

  const navLinkStyle: React.CSSProperties = {
    color: "#fff", textDecoration: "none", fontSize: 14, padding: "10px 12px",
    borderRadius: 999, display: "flex", alignItems: "center", gap: wide ? 8 : 0,
    justifyContent: wide ? "flex-start" : "center", whiteSpace: "nowrap"
  };

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

      <nav style={{ padding: 10, display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
        {SECTIONS.map((section) => {
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
                  key={l.label}
                  href={l.href}
                  onMouseEnter={(e) => showTip(l.label, e.currentTarget)}
                  onMouseLeave={hideTip}
                  className={path === l.href ? "nav-link nav-link-active" : "nav-link"}
                  style={navLinkStyle}
                >
                  <span style={{ fontSize: 16 }}>{l.emoji}</span>
                  {wide && <span style={{ flex: 1 }}>{l.label}</span>}
                  {l.locked && isActive === false && (
                    <span title="Subscribe to unlock this section" style={{ fontSize: 10, opacity: 0.9 }}>🔒</span>
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
              <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{school?.name || "School"}</div>
              <div style={{ fontSize: 10, color: "#A7F3D0", fontFamily: "monospace", letterSpacing: 1 }}>{school?.code || ""}</div>
            </div>
            <button onClick={logout} title="Log out" aria-label="Log out"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <span title={school?.name || "School"} style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px" }}>{initial}</span>
            <button onClick={logout} title="Log out" aria-label="Log out"
              style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      {tip && (
        <div style={{ position: "fixed", left: collapsed && !mobile ? 72 : 258, top: tip.top - 16, zIndex: 60,
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
        <div style={{ width: "100%", maxWidth: 900, padding: "20px 24px", color: "#333A45" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
