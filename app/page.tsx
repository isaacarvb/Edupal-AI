const btn: React.CSSProperties = {
  display: "block", textAlign: "center", background: "#0F766E", color: "#fff",
  borderRadius: 12, minHeight: 52, lineHeight: "52px", fontWeight: 800,
  fontSize: 17, textDecoration: "none", margin: "16px 0", letterSpacing: 1
};

function Feature({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 14, margin: "8px 0" }}>
      <div style={{ fontSize: 26 }}>{emoji}</div>
      <strong style={{ color: "#1E242E" }}>{title}</strong>
      <p style={{ fontSize: 14, margin: "4px 0 0" }}>{text}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <main style={{ margin: 0, color: "#333A45", fontFamily: "Inter,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(160deg, #1E242E 0%, #2F5D7C 60%, #0F766E 100%)",
          color: "#fff", padding: "56px 20px 48px", textAlign: "center"
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontSize: 13, letterSpacing: 2, opacity: 0.85, margin: 0 }}>WAEC • JAMB • NECO</p>
          <div style={{ fontSize: 52, margin: "8px 0" }}>🎓</div>
          <h1 style={{ fontSize: 34, margin: "0 0 8px", color: "#fff", lineHeight: 1.2 }}>
            EduPal AI — your personal exam coach
          </h1>
          <p style={{ fontSize: 16, opacity: 0.92, lineHeight: 1.6 }}>
            Practice real-style questions, get instant step-by-step explanations,
            and fix your weak topics before exam day. In Simple English or Pidgin.
          </p>
          <a href="/onboarding" style={btn}>START YOUR JOURNEY</a>
          <p style={{ fontSize: 13, opacity: 0.8 }}>Free daily practice • No card needed to start</p>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 8, textAlign: "center" }}>
          {[
            ["9", "subjects"],
            ["30+", "practice questions"],
            ["2", "languages"]
          ].map(([n, label]) => (
            <div key={label} style={{ flex: 1, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0F766E" }}>{n}</div>
              <div style={{ fontSize: 12, color: "#5F6E7F" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "12px 16px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 22 }}>Why students love EduPal</h2>
        <Feature emoji="🤖" title="AI tutor that explains" text="Every answer comes with a step-by-step breakdown — and essays get a checklist, score, and model answer." />
        <Feature emoji="🎯" title="Finds your weak topics" text="Weak, Needs Work, Strong — the app points at exactly what to study next, and celebrates level-ups." />
        <Feature emoji="⏳" title="Exam countdown + streaks" text="Daily reminders, study streaks with a monthly freeze, and a countdown that pushes you at 30 and 7 days." />
        <Feature emoji="👪" title="Parents stay in the loop" text="Weekly progress updates and a view-only dashboard, with zero friction at payment." />
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 22 }}>How it works</h2>
        {["Set your level, exam and date", "Take a 10-question diagnostic", "Practice daily, fix weak topics", "Go unlimited when ready"].map((s, i) => (
          <div key={s} style={{ display: "flex", gap: 10, alignItems: "center", margin: "8px 0" }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: "#0F766E", color: "#fff", textAlign: "center", lineHeight: "28px", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 15 }}>{s}</span>
          </div>
        ))}
        <a href="/onboarding" style={btn}>START YOUR JOURNEY</a>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "16px 20px 40px", fontSize: 13, color: "#5F6E7F" }}>
        Know what you're learning, where you're weak, and when your exam is.
      </footer>
    </main>
  );
}
