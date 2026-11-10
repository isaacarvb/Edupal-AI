import fs from "node:fs";
import path from "node:path";

// Curriculum note files in docs/notes/json file/*.json. File subject names differ
// slightly from app names — normalized here so each file lands in its column.
const MAP: Record<string, string> = {
  english: "English Studies",
  "english language": "English Studies",
  "english studies": "English Studies",
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  commerce: "Commerce",
  economics: "Economics",
  government: "Government",
  accounting: "Accounting",
  marketing: "Marketing",
  geography: "Geography",
  "literature in english": "Literature in English",
  literature: "Literature in English",
  "christian religious studies": "Christian Religious Studies",
  "christian religious knowledge": "Christian Religious Studies",
  crk: "Christian Religious Studies",
  crs: "Christian Religious Studies",
  "civic education": "Civic Education",
  civics: "Civic Education",
  "digital technologies": "Digital Technologies",
  "digital technologies (computer studies/ict)": "Digital Technologies",
  "computer studies": "Digital Technologies",
  ict: "Digital Technologies",
  "business studies": "Business Studies",
  "nigerian history": "Nigerian History",
  history: "Nigerian History",
  "citizenship education": "Social and Citizenship Studies",
  "social and citizenship education": "Social and Citizenship Studies",
  "social and citizenship studies": "Social and Citizenship Studies",
  "integrated science": "Intermediate Science",
  "basic science and technology": "Intermediate Science",
  "intermediate science": "Intermediate Science",
  "intermediate science (basic science and technology)": "Intermediate Science",
  "physical and health education": "Physical Health Education",
  "physical health education": "Physical Health Education"
};

export type NoteTopic = { topic: string; content: string };

export function noteSubjects(level: "senior" | "junior"): string[] {
  const dir = path.join(process.cwd(), "docs", "notes", "json file");
  const prefix = level === "senior" ? "sss_" : "jss_";
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith(prefix) && x.endsWith(".json"))) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      const app = MAP[String(d.subject ?? "").toLowerCase().trim()];
      if (app && !out.includes(app)) out.push(app);
    } catch { /* skip unreadable files */ }
  }
  return out;
}

export function noteTopics(level: "senior" | "junior", subject: string): NoteTopic[] {
  const dir = path.join(process.cwd(), "docs", "notes", "json file");
  const prefix = level === "senior" ? "sss_" : "jss_";
  if (!fs.existsSync(dir)) return [];
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith(prefix) && x.endsWith(".json"))) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      const app = MAP[String(d.subject ?? "").toLowerCase().trim()];
      if (app === subject && Array.isArray(d.topics)) {
        return d.topics
          .filter((t: { topic?: unknown; content?: unknown }) => typeof t.topic === "string" && typeof t.content === "string")
          .map((t: { topic: string; content: string }) => ({ topic: t.topic, content: t.content }));
      }
    } catch { /* skip unreadable files */ }
  }
  return [];
}
