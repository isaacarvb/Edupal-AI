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
  "english language": "English Studies",
  english: "English Studies",
  "english studies": "English Studies",
  mathematics: "Mathematics",
  maths: "Mathematics",
  "physical & health education": "Physical Health Education",
  "physical health education": "Physical Health Education",
  "physical and health education": "Physical Health Education",
  "digital technologies": "Digital Technologies",
  "digital technologies (computer studies/ict)": "Digital Technologies",
  "computer studies": "Digital Technologies",
  "computer studies/ict": "Digital Technologies",
  ict: "Digital Technologies",
  "business studies": "Business Studies",
  "basic science & technology": "Intermediate Science",
  "basic science and technology": "Intermediate Science",
  "intermediate science": "Intermediate Science",
  "integrated science": "Intermediate Science",
  "social studies": "Social and Citizenship Studies",
  "social & citizenship education": "Social and Citizenship Studies",
  "social and citizenship education": "Social and Citizenship Studies",
  "social and citizenship studies": "Social and Citizenship Studies",
  "citizenship education": "Social and Citizenship Studies",
  "nigerian history": "Nigerian History",
  history: "Nigerian History",
  "literature in english": "Literature in English",
  literature: "Literature in English",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  commerce: "Commerce",
  accounting: "Accounting",
  marketing: "Marketing",
  economics: "Economics",
  government: "Government",
  geography: "Geography",
  "christian religious studies": "Christian Religious Studies",
  "christian religious knowledge": "Christian Religious Studies",
  crk: "Christian Religious Studies",
  crs: "Christian Religious Studies",
  "civic education": "Civic Education",
  civics: "Civic Education",
};

// Canonical subject lists (from lib/syllabus.ts)
const SSS_SUBJECTS = [
  "English Studies", "Mathematics", "Physical Health Education", "Economics",
  "Christian Religious Studies", "Civic Education", "Geography", "Digital Technologies",
  "Physics", "Chemistry", "Biology", "Literature in English", "Government",
  "Commerce", "Accounting", "Marketing",
];
const JSS_SUBJECTS = [
  "Mathematics", "English Studies", "Social and Citizenship Studies", "Nigerian History",
  "Intermediate Science", "Digital Technologies", "Business Studies",
  "Physical Health Education", "Christian Religious Studies",
];
const ALL_SUBJECTS = new Set([...SSS_SUBJECTS, ...JSS_SUBJECTS]);

// SYLLABUS topic lists (from lib/syllabus.ts)
const SYLLABUS = {
  "English Studies": ["Comprehension", "Synonyms", "Antonyms", "Tenses", "Lexis", "Idioms"],
  Mathematics: ["Quadratic equations", "Linear equations", "Percentages", "Geometry"],
  Physics: ["Motion", "Waves", "Electricity"],
  Chemistry: ["Atomic structure", "Periodic table", "Acids and bases"],
  Biology: ["Cells", "Transport in plants", "Ecology"],
  Commerce: ["Trade", "Business units"],
  Economics: ["Demand and supply", "Scale of preference", "Inflation"],
  Government: ["Democracy", "Federalism"],
  "Literature in English": ["Prose", "Drama", "Poetry"],
  Accounting: ["Principles of Accounting", "Double Entry", "Trial Balance"],
  Marketing: ["Marketing Concepts", "Marketing Mix", "Consumer Behaviour"],
  "Physical Health Education": ["Fitness", "Safety", "Nutrition"],
  "Christian Religious Studies": ["Creation and the Fall", "The Life of Jesus", "Christian Values and Ethics", "The Early Church"],
  "Civic Education": ["Citizenship", "Human Rights", "Democracy and Elections", "Rule of Law", "National Values"],
  Geography: ["The Earth and Its Structure", "Map Reading", "Weather and Climate", "Population", "Regional Geography of Nigeria"],
  "Digital Technologies": ["Computer Fundamentals", "Word Processing", "Spreadsheets", "Internet and Email", "Programming Basics"],
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
