"use client";
import { useEffect, useState } from "react";

// PWA install banner: shows once, hides for installed users forever,
// snoozes 7 days for users who cancel.
type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallPWA() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    if (window.matchMedia("(display-mode: standalone)").matches) return; // installed: never show
    const snooze = Number(localStorage.getItem("edupal_pwa_snooze") ?? 0);
    if (Date.now() < snooze) return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    // Fallback for browsers without the event (e.g. iOS Safari): show how-to after 20s.
    const t = setTimeout(() => {
      if (!localStorage.getItem("edupal_pwa_snooze")) setVisible((v) => v || true);
    }, 20000);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      clearTimeout(t);
    };
  }, []);

  if (!visible) return null;

  async function install() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
        return;
      }
    }
    // No prompt API (iOS): guide to Share → Add to Home Screen.
    snooze();
  }

  function snooze() {
    localStorage.setItem("edupal_pwa_snooze", String(Date.now() + 7 * 86400000));
    setVisible(false);
  }

  return (
    <div style={{ position: "fixed", bottom: 16, left: 16, right: 16, maxWidth: 440, margin: "0 auto", zIndex: 100,
      background: "#1E242E", color: "#fff", borderRadius: 16, padding: 16,
      display: "flex", gap: 12, alignItems: "center", boxShadow: "0 8px 32px rgb(0 0 0 / 0.35)" }}>
      <span style={{ fontSize: 28 }}>🎓</span>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: 15 }}>Install EduPal AI</strong>
        <p style={{ fontSize: 12, margin: "2px 0 0", opacity: 0.85 }}>
          {deferred ? "Faster access, right from your home screen." : "Tap Share → Add to Home Screen to install."}
        </p>
      </div>
      {deferred && (
        <button onClick={install} style={{ background: "#0F766E", color: "#fff", border: 0, borderRadius: 10, fontWeight: 800, padding: "10px 16px", cursor: "pointer" }}>
          Install
        </button>
      )}
      <button onClick={snooze} aria-label="Not now"
        style={{ background: "transparent", border: "1px solid #5F6E7F", color: "#fff", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
        ✕
      </button>
    </div>
  );
}
