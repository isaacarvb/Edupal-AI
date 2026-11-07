function Feature({ emoji, color, title, text }: { emoji: string; color: string; title: string; text: string }) {
  return (
    <div className="feature-card" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
      <span className="deco" style={{ display: "inline-block", fontSize: 24, background: color, borderRadius: 10, padding: "6px 10px" }}>{emoji}</span>
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
      <section className="lite-flat" style={{ background: "linear-gradient(160deg, #1E242E 0%, #2F5D7C 60%, #0F766E 100%)", color: "#fff", padding: "72px 20px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ display: "inline-block", fontSize: 14, fontWeight: 700, letterSpacing: 2, background: "rgba(16,185,129,0.18)", border: "1px solid #10B981", color: "#A7F3D0", padding: "8px 22px", borderRadius: 999 }}>
            WAEC • JAMB • Others
          </span>
          <h1 style={{ fontSize: 56, fontWeight: 700, margin: "20px 0 12px", color: "#fff", lineHeight: 1.1 }}>
            EduPal AI — your personal exam coach
          </h1>
          <p style={{ fontSize: 18, opacity: 0.92, lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
            Practice real-style questions, get instant step-by-step explanations,
            and fix your weak topics before exam day. In Simple English or Pidgin.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/school-register" className="btn-journey" style={{ background: "#0F766E" }}>START YOUR JOURNEY — School Administrator</a>
            <a href="/signup" className="btn-journey" style={{ background: "#2F5D7C" }}>START YOUR JOURNEY — Individual Student</a>
          </div>
          <p style={{ fontSize: 13, opacity: 0.8 }}>Free daily practice • No card needed to start</p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 26 }}>Why students love EduPal</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          <Feature emoji="🤖" color="#CCFBF1" title="AI Tutor That Explains" text="Every answer comes with a step-by-step breakdown — essays get a checklist, a score, and a model answer." />
          <Feature emoji="🎯" color="#FEF3C7" title="Finds Your Weak Topics" text="Weak, Needs Work, Strong — the app points at exactly what to study next, and celebrates level-ups." />
          <Feature emoji="⏳" color="#E1EBF5" title="Countdowns & Streaks" text="Daily reminders, study streaks with a monthly freeze, and a countdown that pushes you at 30 and 7 days." />
          <Feature emoji="🔥" color="#FDEAEA" title="Likely Questions" text="AI-curated questions that predict what is most likely to appear in your WAEC and JAMB exams." />
          <Feature emoji="📚" color="#E0E7FF" title="Robust Notes" text="Comprehensive, curriculum-aligned study notes and formula guides across all JSS and SSS subjects." />
          <Feature emoji="📅" color="#F3E8FF" title="Exam Info" text="Latest exam updates, syllabus changes, and countdown alerts for WAEC, JAMB, and more." />
          <Feature emoji="🏫" color="#FEF3C7" title="School Administrator" text="Manage your school's subscription, upload student rosters, track progress analytics, and give students access with a single school code." />
          <Feature emoji="📖" color="#CCFBF1" title="20+ Core Subjects Supported" text="JSS + SSS subjects — covering the full Nigerian secondary curriculum." />
          <Feature emoji="📝" color="#E0E7FF" title="10,000+ Practice Questions" text="Real exam-style questions and topics so you can practice and improve daily." />
          <Feature emoji="💬" color="#FDEAEA" title="2 Explanation Modes" text="Simple English & Pidgin — learn in the way that makes the most sense to you." />
        </div>
      </section>

      {/* EXAMS */}
      <section id="exams" style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 16px 32px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 26 }}>Exams supported</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["WAEC", "JAMB", "BECE", "Others"].map((e) => (
            <span key={e} style={{ fontSize: 15, fontWeight: 700, background: "#1E242E", color: "#fff", padding: "10px 22px", borderRadius: 999 }}>{e}</span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
          <h2 style={{ color: "#1E242E", fontSize: 26 }}>How it works</h2>
          <h3 style={{ color: "#1E242E", fontSize: 16, fontWeight: 700, margin: "16px 0 12px" }}>For Individual Students</h3>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Step n={1} title="Create Your Free Account" text="Name, email, password — 30 seconds." />
            <Step n={2} title="Choose Exam & Set Target Date" text="Level, exam, subjects, language." />
            <Step n={3} title="Take 10-Question Diagnostic" text="We find your baseline per topic." />
            <Step n={4} title="Target Weak Topics with AI" text="Practice daily, level up, repeat." />
          </div>
          <h3 style={{ color: "#1E242E", fontSize: 16, fontWeight: 700, margin: "24px 0 12px" }}>For School Administrators</h3>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Step n={1} title="Register Your School" text="School name, address, email, password, and student count." />
            <Step n={2} title="Upload Student Roster" text="Bulk upload student names, classes, and departments via CSV." />
            <Step n={3} title="Subscribe via Paystack" text="Choose student count and term (3/6/9/12 months). Pay once, no auto-renewal." />
            <Step n={4} title="Share School Code with Students" text="Students enter the code + name + class to access EduPal in the lab." />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
        <h2 style={{ color: "#1E242E", fontSize: 26, marginBottom: 16 }}>Pricing</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px", minHeight: 180, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Free</div>
            <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 18, margin: "10px 0" }}>
              <li>10 questions per subject, daily</li>
              <li>Weak-topic tracking</li>
              <li>Study streaks & reminders</li>
              <li>Limited subject access</li>
            </ul>
            <div style={{ fontWeight: 800, fontSize: 22 }}>₦0</div>
          </div>
          <div style={{ flex: "1 1 240px", minHeight: 180, background: "#1E242E", color: "#fff", borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Paid</div>
            <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 18, margin: "10px 0" }}>
              <li>Unlimited practice across all subjects</li>
              <li>Full access to all resources</li>
              <li>Exam countdown & priority support</li>
            </ul>
            <div style={{ fontWeight: 800, fontSize: 22 }}>Paystack checkout</div>
          </div>
          <div style={{ flex: "1 1 240px", minHeight: 180, background: "#0F766E", color: "#fff", borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Schools</div>
            <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 18, margin: "10px 0" }}>
              <li>Charged per student per term</li>
              <li>Volume discounts up to 25%</li>
              <li>Admin dashboard + progress analytics</li>
              <li>Computer lab access for students</li>
            </ul>
            <div style={{ fontWeight: 800, fontSize: 22 }}>Per-student pricing</div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ textAlign: "center", padding: "16px 16px 48px" }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <a href="/school-register" className="btn-journey" style={{ background: "#0F766E" }}>School Administrator</a>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#5F6E7F", letterSpacing: 0.5, whiteSpace: "nowrap" }}>← Start your journey →</span>
          <a href="/signup" className="btn-journey" style={{ background: "#2F5D7C" }}>Individual Student</a>
        </div>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>Know what you're learning, where you're weak, and when your exam is.</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #E2E8F0", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#5F6E7F" }}>© 2026 EduPal AI — made for Nigerian students 🇳🇬</span>
          <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="/privacy" style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Privacy Policy</a>
            <a href="/terms" style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Terms of Use</a>
            <a href="/login" style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
          </span>
        </div>
      </footer>
    </main>
  );
}
