"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Slim top nav on every page. Practice/Dashboard need a user → onboarding first.
export default function Nav() {
  const path = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    setUserId(localStorage.getItem("edupal_user"));
  }, [path]);

  const links = [
    { href: userId ? `/practice?userId=${userId}&subject=English` : "/onboarding", label: "Practice" },
    { href: userId ? `/dashboard?userId=${userId}` : "/onboarding", label: "Dashboard" },
    { href: "/parent", label: "Parent" },
    { href: "/login", label: "Login" }
  ];

  return (
    <nav style={{ background: "#1E242E", padding: "10px 16px", display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
      <a href="/" style={{ color: "#fff", fontWeight: 800, textDecoration: "none", marginRight: 12 }}>🎓 EduPal AI</a>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          style={{
            color: "#fff", textDecoration: "none", fontSize: 14, padding: "6px 10px",
            borderRadius: 8, background: path === l.href ? "#0F766E" : "transparent"
          }}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}
