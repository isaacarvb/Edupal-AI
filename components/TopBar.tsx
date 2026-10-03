"use client";

// Public top bar: brand + anchors + auth CTAs. No sidebar here.
export default function TopBar() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 30, background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: "#1E242E", textDecoration: "none", marginRight: "auto" }}>
          🎓 EduPal AI
        </a>
        <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
          <a href="/#features" style={{ color: "#333A45", textDecoration: "none" }}>Features</a>
          <a href="/#exams" style={{ color: "#333A45", textDecoration: "none" }}>Exams Supported</a>
          <a href="/#pricing" style={{ color: "#333A45", textDecoration: "none" }}>Pricing</a>
        </nav>
        <a href="/login" style={{ fontSize: 14, fontWeight: 700, color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, padding: "8px 18px", textDecoration: "none" }}>
          Log In
        </a>
        <a href="/signup" style={{ fontSize: 14, fontWeight: 800, color: "#fff", background: "#0F766E", borderRadius: 10, padding: "10px 20px", textDecoration: "none" }}>
          Start Free Practice
        </a>
      </div>
    </header>
  );
}
