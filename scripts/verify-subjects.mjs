// scripts/verify-subjects.mjs
// Verify that all CSV subjects map to canonical syllabus names in lib/syllabus.ts.
// Usage: node scripts/verify-subjects.mjs
//
// Checks:
// 1. Every distinct subject in docs/questions/*.csv maps via CANON_SUBJECT
// 2. Every canonical subject exists in SSS_SUBJECTS or JSS_SUBJECTS
// 3. Reports any topics not in the SYLLABUS topic lists (for awareness)
// 4. Confirms inline question-bank.mjs subjects are canonical

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// Canonical subject mapping (mirrors scripts/import-questions.mjs)
const CANON_SUBJECT = {
  "english language": "English",
  english: "English",
  mathematics: "Mathematics",
  "physical & health education": "Physical Health Education",
  "physical health education": "Physical Health Education",
  "physical and health education": "Physical Health Education",
  "digital technologies": "Digital Technologies (Computer Studies/ICT)",
  "digital technologies (computer studies/ict)": "Digital Technologies (Computer Studies/ICT)",
  "business studies": "Business Studies",
  "basic science & technology": "Intermediate Science (Basic Science and Technology)",
  "basic science and technology": "Intermediate Science (Basic Science and Technology)",
  "intermediate science": "Intermediate Science (Basic Science and Technology)",
  "integrated science": "Intermediate Science (Basic Science and Technology)",
  "social studies": "Social and Citizenship Education",
  "social & citizenship education": "Social and Citizenship Education",
  "social and citizenship education": "Social and Citizenship Education",
  "nigerian history": "Nigerian History",
  "literature in english": "Literature in English",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  commerce: "Commerce",
  accounting: "Accounting",
  marketing: "Marketing",
  economics: "Economics",
  government: "Government",
  "citizenship education": "Social and Citizenship Education",
};

// Canonical subject lists (from lib/syllabus.ts)
const SSS_SUBJECTS = [
  "English", "Mathematics", "Physical Health Education", "Physics", "Chemistry",
  "Biology", "Commerce", "Accounting", "Marketing", "Economics", "Government",
  "Literature in English",
];
const JSS_SUBJECTS = [
  "Mathematics", "English", "Physical Health Education",
  "Intermediate Science (Basic Science and Technology)",
  "Social and Citizenship Education", "Business Studies", "Nigerian History",
  "Digital Technologies (Computer Studies/ICT)",
];
const ALL_SUBJECTS = new Set([...SSS_SUBJECTS, ...JSS_SUBJECTS]);

// SYLLABUS topic lists (from lib/syllabus.ts)
const SYLLABUS = {
  English: ["Comprehension", "Synonyms", "Antonyms", "Tenses", "Lexis", "Idioms"],
  Mathematics: ["Quadratic equations", "Linear equations", "Percentages", "Geometry"],
  Physics: ["Motion", "Waves", "Electricity"],
  Chemistry: ["Atomic structure", "Periodic table", "Acids and bases"],
  Biology: ["Cells", "Transport in plants", "Ecology"],
  Commerce: ["Trade", "Business units"],
  Economics: ["Demand and supply", "Scale of preference", "Inflation"],
  Government: ["Democracy", "Federalism"],
  "Literature in English": ["Prose", "Drama", "Poetry"],
  Accounting: [],
  Marketing: [],
  "Physical Health Education": [],
};

function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

async function main() {
  let errors = 0;
  let warnings = 0;

  console.log("🔍 Verifying subject canonicalization...\n");

  // 1. Check CSV subjects
  const csvSubjects = new Set();
  const csvTopicsBySubject = new Map();

  for (const file of ["JSS_past_questions.csv", "SSS_past_questions.csv", "past_questions.csv"]) {
    const filePath = path.join(ROOT, "docs", "questions", file);
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP (not found): ${file}`);
      continue;
    }
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/).filter((l) => l.trim()).slice(1);
    for (const line of lines) {
      const fields = parseCSVLine(line);
      if (fields.length < 4) continue;
      const [, , rawSubject, rawTopic] = fields;
      csvSubjects.add(rawSubject);
      if (!csvTopicsBySubject.has(rawSubject)) csvTopicsBySubject.set(rawSubject, new Set());
      csvTopicsBySubject.get(rawSubject).add(rawTopic);
    }
  }

  console.log(`📊 Found ${csvSubjects.size} distinct subjects in CSVs:`);
  for (const s of [...csvSubjects].sort()) {
    const canon = CANON_SUBJECT[String(s).trim().toLowerCase()];
    const inSyllabus = canon ? ALL_SUBJECTS.has(canon) : false;
    const status = inSyllabus ? "✅" : "❌";
    const topicCount = csvTopicsBySubject.get(s)?.size ?? 0;
    console.log(`   ${status} "${s}" → "${canon ?? "UNMAPPED"}" (${topicCount} topics) ${inSyllabus ? "" : "(NOT IN SYLLABUS!)"}`);
    if (!canon || !inSyllabus) errors++;
  }

  // 2. Check topics against SYLLABUS
  console.log(`\n📚 Topic coverage check (topics not in SYLLABUS):`);
  for (const [rawSubject, topics] of csvTopicsBySubject) {
    const canon = CANON_SUBJECT[String(rawSubject).trim().toLowerCase()];
    const syllabusTopics = SYLLABUS[canon];
    if (!syllabusTopics) continue;
    const missing = [...topics].filter((t) => !syllabusTopics.includes(t));
    if (missing.length > 0) {
      console.log(`   ${canon}: ${missing.length} topic(s) not in SYLLABUS`);
      for (const m of missing.slice(0, 5)) console.log(`      - "${m}"`);
      if (missing.length > 5) console.log(`      ... and ${missing.length - 5} more`);
      warnings++;
    }
  }

  // 3. Check inline question-bank.mjs
  console.log(`\n📦 Inline question-bank.mjs subjects:`);
  const qbContent = fs.readFileSync(path.join(ROOT, "lib", "question-bank.mjs"), "utf8");
  const qbSubjects = new Set();
  const qbSubjectRegex = /subject:\s*["']([^"']+)["']/g;
  let match;
  while ((match = qbSubjectRegex.exec(qbContent)) !== null) {
    qbSubjects.add(match[1]);
  }
  for (const s of [...qbSubjects].sort()) {
    const canon = CANON_SUBJECT[String(s).trim().toLowerCase()];
    const inSyllabus = canon ? ALL_SUBJECTS.has(canon) : false;
    const status = inSyllabus ? "✅" : "❌";
    console.log(`   ${status} "${s}" → "${canon ?? "UNMAPPED"}"`);
    if (!canon || !inSyllabus) errors++;
  }

  // Summary
  console.log(`\n════════════════════════════════════════════════════════════════════════════`);
  console.log(`Errors: ${errors} | Warnings: ${warnings}`);
  if (errors === 0 && warnings === 0) {
    console.log("✅ All subjects canonicalized correctly. Ready for import.");
  } else if (errors === 0) {
    console.log("⚠️  All subjects canonicalized, but some topics not in SYLLABUS (review manually).");
  } else {
    console.log("❌ Fix the unmapped subjects above before importing.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
