const H: React.CSSProperties = { color: "#0F766E", fontSize: 18, fontWeight: 800, margin: "26px 0 8px" };
const P: React.CSSProperties = { fontSize: 15, lineHeight: 1.75, color: "#333A45", margin: "0 0 10px" };

export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px", color: "#333A45" }}>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 26px" }}>
        <h1 style={{ color: "#1E242E", fontSize: 26, margin: "0 0 4px" }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 8px" }}>Last updated: October 2026 · EduPal AI</p>

        <p style={P}>
          This policy explains what we collect when you use EduPal AI, why we collect it, and the choices you have.
          Written in plain English — no legal jargon.
        </p>

        <h2 style={H}>1. What we collect</h2>
        <ul style={{ ...P, paddingLeft: 22 }}>
          <li><strong>Your account details</strong> — name, email address and password (your password is stored only as a secure hash, never in plain text).</li>
          <li><strong>Your study details</strong> — level, exam (WAEC/JAMB/NECO), exam dates, department and subjects you choose.</li>
          <li><strong>Your activity</strong> — practice answers, scores, weak topics, streaks and notes progress. We use this to personalise your practice and daily questions.</li>
          <li><strong>Payment records</strong> — plan, amount, payment status and reference. We never see or store your card number, PIN or bank details — those are handled entirely by Paystack.</li>
          <li><strong>Messages you send to the AI tutor</strong> — needed to generate your explanations.</li>
        </ul>

        <h2 style={H}>2. Cookies &amp; local storage</h2>
        <p style={P}>
          We use essential cookies and your browser&apos;s local storage to keep you signed in, remember your preferences
          (like theme and sound settings) and protect your session. We do not use advertising trackers.
        </p>

        <h2 style={H}>3. How we use your information</h2>
        <ul style={{ ...P, paddingLeft: 22 }}>
          <li>To run your study plan, practice and progress tracking</li>
          <li>To personalise daily questions and AI tutor answers</li>
          <li>To process subscriptions and confirm payments</li>
          <li>To send important emails (parent links, announcements, receipts) — with your control</li>
          <li>To keep the service safe and prevent abuse</li>
        </ul>

        <h2 style={H}>4. Payments (Paystack)</h2>
        <p style={P}>
          Payments are processed by Paystack, a PCI-DSS compliant payment provider. EduPal AI receives only the payment
          status, reference and amount — never your full card details. See{" "}
          <a href="https://paystack.com/privacy" target="_blank" rel="noreferrer" style={{ color: "#0F766E", fontWeight: 700 }}>Paystack&apos;s Privacy Policy</a>.
        </p>

        <h2 style={H}>5. AI providers</h2>
        <p style={P}>
          Questions you ask the AI tutor and parts of your practice data are sent to our AI processing provider so we can
          generate answers, explanations and questions. We do not sell this data.
        </p>

        <h2 style={H}>6. Who we share data with</h2>
        <p style={P}>
          We never sell your personal data. We only share what&apos;s strictly needed with service providers that run the app:
          hosting (Netlify), database (PostgreSQL), payments (Paystack), email delivery, and AI processing — each bound to
          protect it. We may also disclose data if required by Nigerian law.
        </p>

        <h2 style={H}>7. Data security &amp; retention</h2>
        <p style={P}>
          Data is transmitted over encrypted connections (HTTPS), passwords are hashed, and access is restricted.
          We keep your data while your account exists. You can ask us to delete it at any time.
        </p>

        <h2 style={H}>8. Your rights</h2>
        <p style={P}>
          You can ask us for a copy of your data, correct it, or delete your account completely. Email{" "}
          <a href="mailto:isaacareo34@gmail.com" style={{ color: "#0F766E", fontWeight: 700 }}>isaacareo34@gmail.com</a> and
          we&apos;ll act on it promptly.
        </p>

        <h2 style={H}>9. Students under 18</h2>
        <p style={P}>
          EduPal AI is built for secondary-school students. If you&apos;re under 18, please involve a parent or guardian when
          creating an account and making payments.
        </p>

        <h2 style={H}>10. Changes &amp; contact</h2>
        <p style={P}>
          We&apos;ll update this page when our practices change. Questions? Contact{" "}
          <a href="mailto:isaacareo34@gmail.com" style={{ color: "#0F766E", fontWeight: 700 }}>isaacareo34@gmail.com</a>.
        </p>

        <p style={{ marginTop: 24 }}>
          <a href="/terms" style={{ color: "#0F766E", fontWeight: 700 }}>Read our Terms of Use →</a>
        </p>
        <p style={{ fontSize: 14 }}>
          <a href="/" style={{ color: "#0F766E", fontWeight: 700 }}>← Back to home</a>
        </p>
      </div>
    </main>
  );
}
