"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import TopBar from "@/components/TopBar";
import NoticeBell from "@/components/NoticeBell";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

const TIPS: Record<string, string> = {
  "My Classes": "Your classes, roster and per-student activity",
  "Lesson Notes": "Write lesson notes for VP review — approved notes show to students",
  Assignments: "Set practice assignments for your classes and track completion"
};

// Teacher environment shell: academic workspace.
export default function TeacherShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("Teacher");
  const [schoolName, setSchoolName] = useState("School");
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
    setCollapsed(localStorage.getItem("teacher_collapsed") === "1");
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => {
      localStorage.setItem("teacher_collapsed", c ? "0" : "1");
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
      fetch(`/api/teacher/dashboard?userId=${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.teacher?.name) setName(d.teacher.name);
          if (d?.school?.name) setSchoolName(d.school.name);
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
  const initial = name.trim().charAt(0).toUpperCase() || "T";

  const LINKS = [
    { href: `/teacher/dashboard${q}`, match: "/teacher/dashboard", label: "My Classes", emoji: "📚" },
    { href: `/teacher/lesson-notes${q}`, match: "/teacher/lesson-notes", label: "Lesson Notes", emoji: "📝" },
    { href: `/teacher/assignments${q}`, match: "/teacher/assignments", label: "Assignments", emoji: "✅" }
  ];

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
            <a href="/teacher/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>🎓 EduPal AI</div>
              <div style={{ fontSize: 11, fontStyle: "italic", color: "#A7F3D0", marginTop: 2 }}>Teacher Workspace</div>
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
        {LINKS.map((l) => (
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
          </a>
        ))}
      </nav>
      <div style={{ padding: 10, borderTop: "1px solid #333A45" }}>
        {wide ? (
          <div style={{ background: "#333A45", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, textAlign: "center", lineHeight: "32px", flexShrink: 0 }}>{initial}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
              <div style={{ fontSize: 10, color: "#A7F3D0" }}>{schoolName}</div>
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
