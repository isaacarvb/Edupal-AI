const H: React.CSSProperties = { color: "#0F766E", fontSize: 18, fontWeight: 800, margin: "26px 0 8px" };
const P: React.CSSProperties = { fontSize: 15, lineHeight: 1.75, color: "#333A45", margin: "0 0 10px" };

export default function TermsOfUse() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px", color: "#333A45" }}>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 26px" }}>
        <h1 style={{ color: "#1E242E", fontSize: 26, margin: "0 0 4px" }}>Terms of Use</h1>
        <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 8px" }}>Last updated: October 2026 · EduPal AI</p>

        <p style={P}>
          These terms govern your use of EduPal AI. By creating an account you agree to them. If you don&apos;t agree,
          please don&apos;t use the service.
        </p>

        <h2 style={H}>1. What EduPal AI is</h2>
        <p style={P}>
          EduPal AI is an exam-preparation platform for Nigerian students (WAEC, JAMB, NECO and BECE). We provide
          practice questions, study notes, an AI tutor, progress tracking and a parent dashboard. EduPal AI is an
          independent study tool — we are <strong>not</strong> affiliated with, endorsed by, or connected to WAEC, JAMB,
          NECO or NERDC.
        </p>

        <h2 style={H}>2. Your account</h2>
        <ul style={{ ...P, paddingLeft: 22 }}>
          <li>Provide accurate information and keep your password secret.</li>
          <li>One account per person; don&apos;t share or sell your account.</li>
          <li>You&apos;re responsible for everything that happens under your account.</li>
          <li>If you&apos;re under 18, involve a parent or guardian — especially for payments.</li>
        </ul>

        <h2 style={H}>3. The free plan</h2>
        <p style={P}>
          Free accounts get a daily allowance of practice questions (the exact number and reset time are shown in the
          app) and can read the first topic of each subject. We may change free-plan limits from time to time. We won&apos;t
          lock you out mid-study — when your daily allowance finishes, it refills at the next reset.
        </p>

        <h2 style={H}>4. Paid subscriptions</h2>
        <ul style={{ ...P, paddingLeft: 22 }}>
          <li>Prices: <strong>₦4,000 for 1 month, ₦7,000 for 2 months, ₦10,000 for one term (3 months)</strong>, as shown at checkout. Prices may change for future purchases.</li>
          <li><strong>One-time payment — no auto-renewal.</strong> We never charge you again without you buying again.</li>
          <li>Your access runs until the expiry date shown on your dashboard. Buying again <strong>adds time</strong> on top.</li>
          <li>When access ends you drop back to the free plan — with your data, streaks and progress intact.</li>
          <li>Payments are processed by Paystack. By paying you agree to Paystack&apos;s terms as well.</li>
          <li>Refunds: if a payment fails, double-charges, or you can&apos;t access what you paid for, contact us and we&apos;ll fix or refund it. Otherwise, subscriptions are non-refundable for unused time, except where Nigerian law requires otherwise.</li>
        </ul>

        <h2 style={H}>5. Acceptable use</h2>
        <p style={P}>You agree not to:</p>
        <ul style={{ ...P, paddingLeft: 22 }}>
          <li>Share answers or farm questions to resell to other students</li>
          <li>Scrape, copy, reverse-engineer or redistribute our questions, notes or AI</li>
          <li>Attack the service, overload it, or try to access other people&apos;s accounts</li>
          <li>Use the AI tutor for anything unlawful, abusive or harmful</li>
          <li>Create multiple accounts to abuse free limits or referral bonuses</li>
        </ul>

        <h2 style={H}>6. Study content &amp; AI</h2>
        <p style={P}>
          Notes and questions are produced from official curricula and reviewed for quality, but some content — including
          AI-generated explanations — may occasionally contain errors. Always confirm critical facts against your
          textbooks and official past questions. <strong>Results are not guaranteed</strong>: your outcome depends on your
          own effort. EduPal AI is a study aid, not a substitute for schooling.
        </p>

        <h2 style={H}>7. Our content</h2>
        <p style={P}>
          The platform, questions, notes, AI and design belong to EduPal AI and are protected by copyright. We grant you
          a personal, non-transferable licence to use them for your own studying only.
        </p>

        <h2 style={H}>8. Suspension &amp; termination</h2>
        <p style={P}>
          We may suspend or delete accounts that break these terms, abuse free limits, or harm other users.
          You can delete your account at any time (Settings or by emailing us). When an account is deleted, personal data
          is removed in line with our Privacy Policy.
        </p>

        <h2 style={H}>9. Disclaimer &amp; liability</h2>
        <p style={P}>
          The service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent allowed by law,
          EduPal AI isn&apos;t liable for indirect or consequential damages arising from your use of the service, including
          exam outcomes. Our total liability is limited to the amount you paid us in the last 12 months (or ₦10,000 if
          you haven&apos;t paid).
        </p>

        <h2 style={H}>10. Governing law</h2>
        <p style={P}>
          These terms are governed by the laws of the Federal Republic of Nigeria. Questions or disputes: contact{" "}
          <a href="mailto:isaacareo34@gmail.com" style={{ color: "#0F766E", fontWeight: 700 }}>isaacareo34@gmail.com</a> first —
          we&apos;d rather sort it out amicably.
        </p>

        <h2 style={H}>11. Changes to these terms</h2>
        <p style={P}>
          We&apos;ll update this page when terms change. Continuing to use EduPal AI after changes means you accept them.
        </p>

        <p style={{ marginTop: 24 }}>
          <a href="/privacy" style={{ color: "#0F766E", fontWeight: 700 }}>Read our Privacy Policy →</a>
        </p>
        <p style={{ fontSize: 14 }}>
          <a href="/" style={{ color: "#0F766E", fontWeight: 700 }}>← Back to home</a>
        </p>
      </div>
    </main>
  );
}
