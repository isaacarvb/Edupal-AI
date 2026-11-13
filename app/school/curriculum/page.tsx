"use client";

import SchoolCurriculumView from "@/components/SchoolCurriculumView";
import SubscriptionGate from "@/components/SubscriptionGate";

const CLASSES = ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"];
const SUBJECTS = ["Mathematics", "English Language", "Biology", "Government", "Economics", "Literature"];

const preview = (
  <div style={{ display: "grid", gap: 14 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
      {CLASSES.map((c) => (
        <div key={c} style={{ border: "1px solid #E2E8F0", borderRadius: 14, padding: 14, background: "#fff" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#1E242E" }}>{c}</div>
          <div style={{ fontSize: 12, color: "#5F6E7F", marginTop: 4 }}>{c.startsWith("JSS") ? "9 subjects" : "20+ subjects"}</div>
        </div>
      ))}
    </div>
    <div style={{ border: "1px solid #E2E8F0", borderRadius: 14, padding: 16, background: "#fff" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 10 }}>Subjects</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SUBJECTS.map((s) => (
          <span key={s} style={{ background: "#F0FDFA", border: "1px solid #99F6E4", color: "#0F766E", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>{s}</span>
        ))}
      </div>
    </div>
  </div>
);

export default function SchoolCurriculumPage() {
  return (
    <SubscriptionGate
      feature="Curriculum & Notes"
      description="Class-by-class, topic-by-topic notes for every subject in your school."
      bullets={[
        "Browse JSS1 to SSS3, subject by subject",
        "Read objectives, notes, activities and exam focus for each topic",
        "Print or save any topic for offline teaching"
      ]}
      preview={preview}
    >
      <SchoolCurriculumView />
    </SubscriptionGate>
  );
}
