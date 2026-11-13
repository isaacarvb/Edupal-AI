"use client";

import { useEffect, useState } from "react";

// Subscription gate for paid school sections.
//
// The page still opens so staff can see what the section does, but the real
// content is replaced by a short explanation and a dimmed preview until the
// school has an active subscription. Every API behind these sections also
// returns 403, so the lock cannot be bypassed from the browser.

type SchoolAccess = {
  id: string;
  name: string;
  isActive: boolean;
  expiresAt: string | null;
};

const shell: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 20,
  color: "#333A45"
};

function GenericPreview() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ height: 46, borderRadius: 12, background: "#E2E8F0", width: "42%" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 14, padding: 14, background: "#fff" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#CCFBF1", marginBottom: 10 }} />
            <div style={{ height: 12, borderRadius: 6, background: "#E2E8F0", width: "70%", marginBottom: 8 }} />
            <div style={{ height: 10, borderRadius: 6, background: "#F1F5F9", width: "45%" }} />
          </div>
        ))}
      </div>
      <div style={{ border: "1px solid #E2E8F0", borderRadius: 14, padding: 16, background: "#fff" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: 10, borderRadius: 6, background: i === 2 ? "#F1F5F9" : "#E2E8F0", width: i === 2 ? "58%" : "100%", marginBottom: 10 }} />
        ))}
      </div>
    </div>
  );
}

export default function SubscriptionGate({
  feature,
  description,
  bullets,
  preview,
  children
}: {
  feature: string;
  description: string;
  bullets?: string[];
  preview?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<"loading" | "active" | "locked" | "error">("loading");
  const [school, setSchool] = useState<SchoolAccess | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("edupal_role") ?? "";
    const teacher = role === "SCHOOL_TEACHER";
    setIsTeacher(teacher);

    // School admins sign in with the school email and only store the school id.
    // Teachers store a real user id. Students never get past the gate.
    let schoolId: string | null = null;
    try {
      const raw = localStorage.getItem("edupal_school");
      schoolId = raw ? String(JSON.parse(raw)?.id ?? "") || null : null;
    } catch {
      schoolId = null;
    }
    const userId = localStorage.getItem("edupal_user");

    const url = !teacher && schoolId
      ? `/api/school/access?schoolId=${encodeURIComponent(schoolId)}`
      : userId
        ? `/api/school/access?userId=${encodeURIComponent(userId)}`
        : "";

    if (!url) {
      setState("locked");
      return;
    }

    fetch(url)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not check subscription.");
        setSchool(data.school ?? null);
        setState(data.school?.isActive ? "active" : "locked");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading") {
    return (
      <main style={shell}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>Checking your school subscription…</p>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main style={shell}>
        <div style={{ background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 14, padding: 18 }}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px", color: "#1E242E" }}>We could not check your subscription</h1>
          <p style={{ fontSize: 14, margin: "0 0 12px", color: "#9A3412" }}>
            Refresh the page and try again. If it keeps happening, sign in again with your school account.
          </p>
          <a href="/school-login" style={{ display: "inline-block", background: "#0F766E", color: "#fff", borderRadius: 10, padding: "10px 16px", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            Sign in to school
          </a>
        </div>
      </main>
    );
  }

  if (state === "active") return <>{children}</>;

  return (
    <main style={shell}>
      <section
        style={{
          background: "linear-gradient(135deg, #0F766E 0%, #0E7490 55%, #1D4ED8 100%)",
          borderRadius: 20,
          padding: 26,
          color: "#fff",
          boxShadow: "0 18px 40px rgb(15 118 110 / 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#A7F3D0" }}>
          <span>🔒 Locked section</span>
        </div>
        <h1 style={{ fontSize: 26, margin: "10px 0 8px" }}>{feature}</h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: 620, color: "#E6FFFA" }}>{description}</p>

        {bullets && bullets.length > 0 && (
          <ul style={{ margin: "16px 0 0", paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: "#ECFDF5" }}>
            {bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        )}

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {isTeacher ? (
            <span style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700 }}>
              Ask your school administrator to activate the school subscription.
            </span>
          ) : (
            <a
              href="/school/subscription"
              style={{ background: "#fff", color: "#0F766E", borderRadius: 10, padding: "12px 20px", fontWeight: 800, fontSize: 15, textDecoration: "none" }}
            >
              Subscribe to unlock →
            </a>
          )}
          <span style={{ fontSize: 12, color: "#CCFBF1" }}>
            {school ? `${school.name} · ${school.isActive ? "Active" : school.expiresAt ? "Expired" : "Not subscribed"}` : "School subscription required"}
          </span>
        </div>
      </section>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: "#94A3B8", textTransform: "uppercase", marginBottom: 8 }}>
          Preview — subscribe to use this section
        </div>
        <div
          aria-hidden
          style={{ filter: "blur(5px)", opacity: 0.55, pointerEvents: "none", userSelect: "none" }}
        >
          {preview ?? <GenericPreview />}
        </div>
      </div>
    </main>
  );
}
