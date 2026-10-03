function Feature({ emoji, color, title, text }: { emoji: string; color: string; title: string; text: string }) {
  return (
    <div className="feature-card" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
      <span style={{ display: "inline-block", fontSize: 24, background: color, borderRadius: 10, padding: "6px 10px" }}>{emoji}</span>
      <div style={{ fontWeight: 800, color: "#1E242E", fontSize: 17, marginTop: 10 }}>{title}</div>
      <p style={{ fontSize: 14, margin: "6px 0 0", color: "#333A45" }}>{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div style={{ flex: "1 1 200px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, textAlign: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: 999, background: "#0F766E", color: "#fff", fontWeight: 800, lineHeight: "36px", margin: "0 auto" }}>{n}</div>
      <div style={{ fontWeight: 800, color: "#1E242E", marginTop: 8, fontSize: 15 }}>{title}</div>
      <p style={{ fontSize: 13, color: "#5F6E7F", margin: "4px 0 0" }}>{text}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <main style={{ margin: 0, color: "#333A45", fontFamily: "Inter,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg, #1E242E 0%, #2F5D7C 60%, #0F766E 100%)", color: "#fff", padding: "72px 20px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ display: "inline-block", fontSize: 14, fontWeight: 700, letterSpacing: 2, background: "rgba(16,185,129,0.18)", border: "1px solid #10B981", color: "#A7F3D0", padding: "8px 22px", borderRadius: 999 }}>
            WAEC • JAMB • NECO
          </span>
          <h1 style={{ fontSize: 56, fontWeight: 700, margin: "20px 0 12px", color: "#fff", lineHeight: 1.1 }}>
            EduPal AI — your personal exam coach
          </h1>
          <p style={{ fontSize: 18, opacity: 0.92, lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
            Practice real-style questions, get instant step-by-step explanations,
            and fix your weak topics before exam day. In Simple English or Pidgin.
          </p>
          <a href="/signup" className="btn-journey">START YOUR JOURNEY</a>
          <p style={{ fontSize: 13, opacity: 0.8 }}>Free daily practice • No card needed to start</p>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ background: "#ECFDF5", borderBottom: "1px solid #A7F3D0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", display: "flex", justifyContent: "space-around", textAlign: "center", flexWrap: "wrap", gap: 12 }}>
          {[
            ["9", "Core Subjects Supported"],
            ["30+", "Exam Topics & Questions"],
            ["2", "Explanation Modes (Simple English & Pidgin)"]
          ].map(([n, label]) => (
            <div key={label}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0F766E" }}>{n}</div>
              <div style={{ fontSize: 13, color: "#333A45" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 26 }}>Why students love EduPal</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          <Feature emoji="🤖" color="#CCFBF1" title="AI Tutor That Explains" text="Every answer comes with a step-by-step breakdown — essays get a checklist, a score, and a model answer." />
          <Feature emoji="🎯" color="#FEF3C7" title="Finds Your Weak Topics" text="Weak, Needs Work, Strong — the app points at exactly what to study next, and celebrates level-ups." />
          <Feature emoji="⏳" color="#E1EBF5" title="Countdowns & Streaks" text="Daily reminders, study streaks with a monthly freeze, and a countdown that pushes you at 30 and 7 days." />
          <Feature emoji="👪" color="#FDEAEA" title="Parents Stay in the Loop" text="Weekly progress updates and a view-only dashboard, with zero friction at payment." />
        </div>
      </section>

      {/* EXAMS */}
      <section id="exams" style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 16px 32px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 26 }}>Exams supported</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["WAEC", "JAMB"].map((e) => (
            <span key={e} style={{ fontSize: 15, fontWeight: 700, background: "#1E242E", color: "#fff", padding: "10px 22px", borderRadius: 999 }}>{e} — live now</span>
          ))}
          {["NECO", "GCE", "Post-UTME"].map((e) => (
            <span key={e} style={{ fontSize: 15, fontWeight: 600, background: "#fff", color: "#5F6E7F", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 999 }}>{e} — coming soon</span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
          <h2 style={{ color: "#1E242E", fontSize: 26 }}>How it works</h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Step n={1} title="Create Your Free Account" text="Name, email, password — 30 seconds." />
            <Step n={2} title="Choose Exam & Set Target Date" text="Level, exam, subjects, language." />
            <Step n={3} title="Take 10-Question Diagnostic" text="We find your baseline per topic." />
            <Step n={4} title="Target Weak Topics with AI" text="Practice daily, level up, repeat." />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 26 }}>Pricing</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Free</div>
            <p style={{ fontSize: 14 }}>10 questions per subject, daily. Weak-topic tracking included.</p>
            <div style={{ fontWeight: 800, fontSize: 22 }}>₦0</div>
          </div>
          <div style={{ flex: "1 1 240px", background: "#1E242E", color: "#fff", borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Unlimited</div>
            <p style={{ fontSize: 14, opacity: 0.9 }}>Unlimited practice + parent dashboard + weekly digest.</p>
            <div style={{ fontWeight: 800, fontSize: 22 }}>Paystack checkout</div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ textAlign: "center", padding: "16px 16px 48px" }}>
        <a href="/signup" className="btn-journey">Start Practicing Now — Free Daily Access</a>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>Know what you're learning, where you're weak, and when your exam is.</p>
      </section>
    </main>
  );
}
