"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LINKS = [
  { href: "/school/dashboard", label: "Dashboard", emoji: "🏠" },
  { href: "/school/analytics", label: "Progress Analytics", emoji: "📈" },
  { href: "/school/subscription", label: "School Subscription", emoji: "💳" },
  { href: "/school/students", label: "Student Roster", emoji: "👥" },
  { href: "/school/teachers", label: "Teacher Roster", emoji: "👨‍🏫" },
  { href: "/school/lesson-notes", label: "Lesson Notes", emoji: "📚" },
  { href: "/school/announcements", label: "Announcements", emoji: "📢" },
  { href: "/school/mock-exams", label: "Mock Exams", emoji: "📝" },
  { href: "/school/questions", label: "Question Bank", emoji: "❓" },
  { href: "/school/settings", label: "Settings", emoji: "⚙️" },
];

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [school, setSchool] = useState<{ name: string; code: string } | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try {
        const d = JSON.parse(s);
        setSchool({ name: d.name, code: d.code });
      } catch { /* ignore */ }
    }
  }, []);

  const q = search?.get("schoolId") ? `?schoolId=${search.get("schoolId")}` : "";
  const wide = !collapsed;

  const sidebar = (
    <aside
      style={{
        width: collapsed ? 64 : 250, flexShrink: 0, background: "#1E242E", color: "#fff",
        display: "flex", flexDirection: "column", minHeight: "100vh",
        position: "fixed", top: 0, height: "100vh", left: 0, zIndex: 50,
        transition: "width 200ms ease", overflow: "hidden"
      }}
    >
      <div style={{ padding: wide ? 16 : 12, borderBottom: "1px solid #333A45" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: wide ? "space-between" : "center", gap: 8 }}>
          {wide && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>🎓 EduPal AI</div>
              <div style={{ fontSize: 11, fontStyle: "italic", color: "#A7F3D0", marginTop: 2 }}>School Portal</div>
            </div>
          )}
          {!wide && (
            <button onClick={() => setCollapsed(false)} title="Expand" style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 10px", cursor: "pointer" }}>»</button>
          )}
        </div>
      </div>
      <nav style={{ padding: 10, display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {LINKS.map((l) => {
          const isActive = path === l.href;
          return (
            <a key={l.label} href={l.href}
              style={{
                color: isActive ? "#fff" : "#A7F3D0", textDecoration: "none", fontSize: 14, padding: "10px 12px",
                borderRadius: 999, display: "flex", alignItems: "center", gap: wide ? 8 : 0,
                justifyContent: wide ? "flex-start" : "center", whiteSpace: "nowrap",
                background: isActive ? "#0F766E" : "transparent"
              }}
            >
              <span style={{ fontSize: 16 }}>{l.emoji}</span>
              {wide && <span style={{ flex: 1 }}>{l.label}</span>}
            </a>
          );
        })}
      </nav>
      <div style={{ padding: 10, borderTop: "1px solid #333A45", marginTop: "auto" }}>
        <div style={{ background: "#333A45", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px", flexShrink: 0 }}>{school?.name?.slice(0,1) || "S"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{school?.name || "School"}</div>
            <div style={{ fontSize: 10, color: "#A7F3D0", fontFamily: "monospace", letterSpacing: 1 }}>{school?.code || ""}</div>
          </div>
          <button onClick={() => { localStorage.removeItem("edupal_school"); window.location.href = "/school-login"; }}
            title="Log out" aria-label="Log out"
            style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 8, fontSize: 14, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      <div style={{ flex: 1, minWidth: 0, marginLeft: collapsed ? 64 : 250, color: "#333A45" }}>
        <div style={{ width: "100%", maxWidth: 900, padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
