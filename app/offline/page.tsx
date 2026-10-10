export default function Offline() {
  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 20, textAlign: "center", color: "#333A45" }}>
      <div style={{ fontSize: 48 }}>📴</div>
      <h1 style={{ color: "#1E242E" }}>You're offline</h1>
      <p>Practice needs internet for questions and saving progress. Your downloaded pages still open — reconnect and continue.</p>
      <a href="/" style={{ display: "inline-block", background: "#0F766E", color: "#fff", borderRadius: 10, padding: "12px 28px", fontWeight: 800, textDecoration: "none", marginTop: 8 }}>Try again</a>
    </main>
  );
}
