export default function Home() {
  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <p style={{ fontSize: 13, background: "#CCFBF1", border: "1px solid #99F6E4", color: "#2F5D7C", padding: "6px 10px", borderRadius: 999 }}>
        EduPal AI • Phase 0 local foundation
      </p>
      <h1 style={{ fontSize: 28 }}>Study buddy that feels calm</h1>
      <p>Local Next.js + SQLite is running. Next: onboarding + diagnostic (Phase 1).</p>
      <a href="/api/health" style={{ color: "#0F766E", fontWeight: 700 }}>Check /api/health</a>
    </main>
  );
}
