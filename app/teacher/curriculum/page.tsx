"use client";

import { useEffect, useState } from "react";
import SchoolCurriculumView from "@/components/SchoolCurriculumView";
import SubscriptionGate from "@/components/SubscriptionGate";

export default function TeacherCurriculumPage() {
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("edupal_role") !== "SCHOOL_TEACHER") setDenied(true);
  }, []);

  if (denied) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>Teacher access only.</p>
        <button
          onClick={() => { window.location.href = "/login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}
        >
          Sign in
        </button>
      </main>
    );
  }

  return (
    <SubscriptionGate
      feature="Curriculum & Notes"
      description="Class-by-class, topic-by-topic notes for every subject you teach."
      bullets={[
        "Browse JSS1 to SSS3, subject by subject",
        "Read objectives, notes, activities and exam focus for each topic",
        "Print or save any topic for your lesson planning"
      ]}
    >
      <SchoolCurriculumView />
    </SubscriptionGate>
  );
}
