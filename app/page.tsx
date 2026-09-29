const btn: React.CSSProperties = {
  display: "inline-block", background: "#0F766E", color: "#fff", fontWeight: 800,
  fontSize: 17, padding: "14px 34px", borderRadius: 12, textDecoration: "none", marginTop: 16
};

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, flex: "1 1 200px"
};

export default function Landing() {
  return (
    <main style={{ margin: 0, fontFamily: "Inter,-apple-system,Segoe UI,Roboto,Arial,sans-serif", color: "#333A45", lineHeight: 1.6 }}>
      {/* HERO — chalkboard-teal gradient with book pattern */}
      <section
        style={{
          background: "linear-gradient(135deg,#0F766E 0%,#2F5D7C 60%,#1E242E 100%)",
          color: "#fff", padding: "56px 20px 64px", textAlign: "center", position: "relative", overflow: "hidden"
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: 2, opacity: 0.85 }}>WAEC • JAMB • NECO • POST-UTME</div>
        <h1 style={{ fontSize: 36, margin: "12px 0 4px", color: "#fff", lineHeight: 1.2 }}>
          EduPal AI
        </h1>
        <p style={{ fontSize: 19, margin: "0 auto", maxWidth: 560, opacity: 0.95 }}>
          Your AI study buddy for Nigerian exams. Practice real-style questions, get instant
          step-by-step explanations, and fix your weak topics before exam day.
        </p>
        <a href="/onboarding" style={btn}>START YOUR JOURNEY</a>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 12 }}>Free daily practice • Simple English or Pidgin • 15 mins a day</p>
      </section>

      {/* TRUST STRIP */}
      <section style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", padding: "20px 16px", background: "#F8FAFC" }}>
        {["9 subjects day one", "Instant AI feedback", "Weak-topic tracking", "Parent progress view"].map((t) => (
          <span key={t} style={{ fontSize: 13, fontWeight: 700, background: "#CCFBF1", border: "1px solid #99F6E4", color: "#2F5D7C", padding: "6px 12px", borderRadius: 999 }}>{t}</span>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 24, textAlign: "center" }}>Everything you need to pass</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <div style={card}>
            <div style={{ fontSize: 28 }}>📝</div>
            <h3 style={{ color: "#1E242E", margin: "8px 0 4px" }}>Exam-style practice</h3>
            <p style={{ fontSize: 14, margin: 0 }}>Objective + theory questions across English, Mathematics, Sciences, Commercial and Arts — with likely-to-repeat flags.</p>
          </div>
          <div style={card}>
            <div style={{ fontSize: 28 }}>🤖</div>
            <h3 style={{ color: "#1E242E", margin: "8px 0 4px" }}>AI tutor that explains</h3>
            <p style={{ fontSize: 14, margin: 0 }}>Every answer gets a step-by-step breakdown, and essays get a checklist score against the marking scheme.</p>
          </div>
          <div style={card}>
            <div style={{ fontSize: 28 }}>📊</div>
            <h3 style={{ color: "#1E242E", margin: "8px 0 4px" }}>Know your weak topics</h3>
            <p style={{ fontSize: 14, margin: 0 }}>Weak / Needs Work / Strong badges with percentages, smart next-topic picks, and retention refreshes.</p>
          </div>
          <div style={card}>
            <div style={{ fontSize: 28 }}>👨‍👩‍👧</div>
            <h3 style={{ color: "#1E242E", margin: "8px 0 4px" }}>Parents stay in the loop</h3>
            <p style={{ fontSize: 14, margin: 0 }}>Weekly progress summaries and a view-only dashboard — no hovering required.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#1E242E", color: "#E2E8F0", padding: "36px 16px", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: 24 }}>How it works</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 960, margin: "16px auto 0", textAlign: "left" }}>
          {[
            ["1. Set your target", "Pick your level, exam, date and subjects — plus Simple English or Pidgin."],
            ["2. Take the diagnostic", "A short 10-question check maps your Weak and Strong topics instantly."],
            ["3. Practice daily", "Free credits every day. Streaks, freezes and reminders keep you going."],
            ["4. Watch yourself level up", "Topics climb from Weak to Strong while parents see the progress."]
          ].map(([h, p]) => (
            <div key={h} style={{ flex: "1 1 200px", background: "#2A3340", borderRadius: 16, padding: 16 }}>
              <h3 style={{ color: "#5EEAD4", margin: "0 0 4px", fontSize: 16 }}>{h}</h3>
              <p style={{ fontSize: 14, margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
        <a href="/onboarding" style={{ ...btn, marginTop: 24 }}>START YOUR JOURNEY</a>
      </section>

      <footer style={{ textAlign: "center", padding: 20, fontSize: 13, color: "#5F6E7F" }}>
        EduPal AI • Built for Nigerian students • <a href="/api/health" style={{ color: "#0F766E" }}>Status</a>
      </footer>
    </main>
  );
}
