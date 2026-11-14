"use client";

import { useEffect } from "react";

// Counts active study time for the weekly leaderboard.
//
// One minute is added for each minute the tab is visible. Hidden tabs do not
// count, and the server clamps every heartbeat so the value cannot be inflated
// by editing the request.
export default function StudyTimeHeartbeat() {
  useEffect(() => {
    const userId = localStorage.getItem("edupal_user");
    if (!userId) return;

    let stopped = false;
    const ping = () => {
      if (stopped || document.visibilityState !== "visible") return;
      fetch("/api/study-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, seconds: 60 }),
        keepalive: true
      }).catch(() => { /* offline or tab closing — ignore */ });
    };

    // Start counting after the first full minute so a quick page view does not
    // register as study time.
    const timer = setInterval(ping, 60000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);

  return null;
}
