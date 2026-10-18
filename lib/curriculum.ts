import fs from "node:fs";
import path from "node:path";

export type CurriculumTopic = {
  id: string;
  name: string;
  class: string;
  subject: string;
  level: "SSS" | "JSS";
  exams: string[];
  subjectId: string;
  learningObjectives: string[];
  notes: string[];
  activities: string[];
  examFocus: string[];
  source: "md" | "json" | "both";
};

export type CurriculumSubject = {
  id: string;
  name: string;
  level: "SSS" | "JSS";
  exams: string[];
  topics: CurriculumTopic[];
};

const NOTES_DIR = path.join(process.cwd(), "docs", "notes");
const MD_DIR = path.join(NOTES_DIR, ".md file");
const JSON_DIR = path.join(NOTES_DIR, "json file");

// ---------- MD file parsing ----------

function parseMdFile(filePath: string): CurriculumSubject | null {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  // Header: # Subject Name
  const titleLine = lines.find((l) => l.startsWith("# ")) ?? "";
  const subjectName = titleLine.replace(/^#\s*/, "").trim();

  // Meta: **Level:** SSS | **Exams:** WAEC, JAMB | **Subject ID:** SSS-ACC
  const metaLine = lines.find((l) => l.includes("**Level:**")) ?? "";
  const levelMatch = metaLine.match(/\*\*Level:\*\* (SSS|JSS)/);
  const level = (levelMatch?.[1] as "SSS" | "JSS") ?? "SSS";

  const examsMatch = metaLine.match(/\*\*Exams:\*\* ([^|]+)/);
  const exams = examsMatch?.[1]?.split(",").map((e) => e.trim()).filter(Boolean) ?? [];

  const subjectIdMatch = metaLine.match(/\*\*Subject ID:\*\* `?([^`|]+)`?/);
  const subjectId = subjectIdMatch?.[1]?.trim() ?? "";

  const topics: CurriculumTopic[] = [];
  let current: Partial<CurriculumTopic> | null = null;
  let section: "objectives" | "notes" | "activities" | "examFocus" | null = null;

  function save() {
    if (current?.name) {
      topics.push({
        id: current.id || `topic-${current.name}`,
        name: current.name,
        class: current.class || "",
        subject: subjectName,
        level,
        exams,
        subjectId,
        learningObjectives: current.learningObjectives ?? [],
        notes: current.notes ?? [],
        activities: current.activities ?? [],
        examFocus: current.examFocus ?? [],
        source: "md"
      });
    }
  }

  for (const line of lines) {
    // Theme header (skip)
    if (line.startsWith("## ") && !line.startsWith("### ")) continue;

    // Topic: ### Topic Name
    const tMatch = line.match(/^### (.+)$/);
    if (tMatch) {
      save();
      current = {
        name: tMatch[1].trim(),
        learningObjectives: [] as string[],
        notes: [] as string[],
        activities: [] as string[],
        examFocus: [] as string[]
      };
      section = null;
      continue;
    }
    if (!current) continue;

    // Class: **Class:** SSS1
    const cMatch = line.match(/\*\*Class:\*\* ([^|]+)/);
    if (cMatch) {
      current.class = cMatch[1].trim();
      continue;
    }

    // Topic ID: **Topic ID:** `SSS-ACC-001-01`
    const idMatch = line.match(/\*\*Topic ID:\*\* `?([^`|]+)`?/);
    if (idMatch) {
      current.id = idMatch[1].trim();
      continue;
    }

    // Section headers
    if (line.includes("🎯 Learning Objectives")) {
      section = "objectives";
      continue;
    }
    if (line.includes("📖 Notes")) {
      section = "notes";
      continue;
    }
    if (line.includes("✏️ Activities")) {
      section = "activities";
      continue;
    }
    if (line.includes("🏆 Exam Focus")) {
      section = "examFocus";
      continue;
    }

    // Content lines
    if (section === "objectives" && line.startsWith("- ")) {
      current!.learningObjectives!.push(line.slice(2).trim());
    } else if (section === "notes" && line.startsWith("- ")) {
      current!.notes!.push(line.slice(2).trim());
    } else if (section === "activities" && /^\d+\.\s/.test(line)) {
      current!.activities!.push(line.replace(/^\d+\.\s*/, "").trim());
    } else if (section === "examFocus" && line.startsWith("> ")) {
      current!.examFocus!.push(line.slice(2).trim());
    }
  }
  save();

  return topics.length > 0
    ? {
        id: subjectId.toLowerCase(),
        name: subjectName,
        level,
        exams,
        topics
      }
    : null;
}

// ---------- NERDC curriculum JSON parsing ----------

function parseNerdcJson(content: string): CurriculumSubject[] {
  const data = JSON.parse(content);
  const subjects: CurriculumSubject[] = [];

  for (const level of data.nerdc_curriculum.levels) {
    const lvl = level.level === "SSS" ? "SSS" : "JSS";
    for (const subj of level.subjects) {
      const topics: CurriculumTopic[] = [];
      for (const theme of subj.themes) {
        for (const t of theme.topics) {
          topics.push({
            id: t.topic_id,
            name: t.topic,
            class: t.class,
            subject: subj.subject,
            level: lvl,
            exams: subj.exam_relevance ?? [],
            subjectId: subj.subject_id,
            learningObjectives: t.learning_objectives ?? [],
            notes: t.content ?? [],
            activities: t.activities ?? [],
            examFocus: t.exam_focus ?? [],
            source: "json"
          });
        }
      }
      subjects.push({
        id: subj.subject_id.toLowerCase(),
        name: subj.subject,
        level: lvl,
        exams: subj.exam_relevance ?? [],
        topics
      });
    }
  }
  return subjects;
}

// ---------- Simple JSON notes parsing ----------

function parseSimpleJson(content: string): { subject: string; level: "SSS" | "JSS"; topics: { topic: string; content: string }[] } | null {
  const data = JSON.parse(content);
  if (!data.subject || !data.topics) return null;
  return {
    subject: data.subject,
    level: data.level === "senior_secondary" ? "SSS" : "JSS",
    topics: data.topics
  };
}

// ---------- Merge ----------

export function getCurriculumSubjects(): CurriculumSubject[] {
  const byId = new Map<string, CurriculumSubject>();

  // 1. MD files (richest source)
  if (fs.existsSync(MD_DIR)) {
    for (const file of fs.readdirSync(MD_DIR).filter((f) => f.endsWith(".md"))) {
      const subj = parseMdFile(path.join(MD_DIR, file));
      if (subj) byId.set(subj.id, subj);
    }
  }

  // 2. NERDC curriculum JSON (adds missing subjects/topics)
  const nerdcPath = path.join(JSON_DIR, "nerdc_curriculum.json");
  if (fs.existsSync(nerdcPath)) {
    const nerdcSubjects = parseNerdcJson(fs.readFileSync(nerdcPath, "utf8"));
    for (const subj of nerdcSubjects) {
      const existing = byId.get(subj.id);
      if (existing) {
        const existingTopicNames = new Set(existing.topics.map((t) => t.name.toLowerCase()));
        for (const t of subj.topics) {
          if (!existingTopicNames.has(t.name.toLowerCase())) {
            existing.topics.push(t);
          }
        }
      } else {
        byId.set(subj.id, subj);
      }
    }
  }

  // 3. Simple JSON notes (add content where missing)
  if (fs.existsSync(JSON_DIR)) {
    for (const file of fs.readdirSync(JSON_DIR).filter((f) => f.endsWith(".json") && f !== "nerdc_curriculum.json")) {
      try {
        const simple = parseSimpleJson(fs.readFileSync(path.join(JSON_DIR, file), "utf8"));
        if (!simple) continue;

        const existing = byId.get(simple.subject.toLowerCase());
        if (existing) {
          const existingTopicNames = new Set(existing.topics.map((t) => t.name.toLowerCase()));
          for (const t of simple.topics) {
            if (!existingTopicNames.has(t.topic.toLowerCase())) {
              existing.topics.push({
                id: `simple-${simple.subject}-${t.topic}`,
                name: t.topic,
                class: "",
                subject: simple.subject,
                level: simple.level,
                exams: [],
                subjectId: "",
                learningObjectives: [],
                notes: t.content ? [t.content] : [],
                activities: [],
                examFocus: [],
                source: "json"
              });
            }
          }
        } else {
          byId.set(simple.subject.toLowerCase(), {
            id: simple.subject.toLowerCase(),
            name: simple.subject,
            level: simple.level,
            exams: [],
            topics: simple.topics.map((t, i) => ({
              id: `simple-${i}`,
              name: t.topic,
              class: "",
              subject: simple.subject,
              level: simple.level,
              exams: [],
              subjectId: "",
              learningObjectives: [],
              notes: t.content ? [t.content] : [],
              activities: [],
              examFocus: [],
              source: "json"
            }))
          });
        }
      } catch {
        /* skip unreadable */
      }
    }
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCurriculumTopic(subjectId: string, topicName: string): CurriculumTopic | null {
  const subjects = getCurriculumSubjects();
  const subj = subjects.find((s) => s.id === subjectId || s.name.toLowerCase() === subjectId.toLowerCase());
  if (!subj) return null;
  return subj.topics.find((t) => t.name.toLowerCase() === topicName.toLowerCase()) ?? null;
}
