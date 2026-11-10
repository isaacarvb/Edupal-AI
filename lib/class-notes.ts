import fs from "node:fs";
import path from "node:path";
import { canonicalSubject, JSS_SUBJECTS, SSS_SUBJECTS } from "./syllabus";
import { normalizeClass } from "./csv";
import { extractDocxText } from "./docx";

// Class-specific notes.
//
// The school admin drops documents into docs/<CLASS>/ (JSS1 … SSS3). Each file
// may be Markdown, plain text or Word .docx. The subject is taken from the
// filename (or from a subject sub-folder), and topics are split by headings or
// by "TOPIC 1:", "UNIT 2:" style markers. These notes are then shown in the
// school Curriculum section exactly class by class.

const DOCS_DIR = path.join(process.cwd(), "docs");

export type ClassTopic = { id: string; name: string; notes: string[] };
export type ClassSubjectNotes = { name: string; topics: ClassTopic[] };

const NOTE_EXTENSIONS = new Set([".md", ".markdown", ".txt", ".docx"]);

// Common aliases used in filenames, longest first so "social and citizenship
// studies" wins over a shorter accidental match.
const EXTRA_ALIASES = [
  "social and citizenship studies",
  "social and citizenship education",
  "intermediate science",
  "basic science and technology",
  "basic technology",
  "physical health education",
  "christian religious studies",
  "literature in english",
  "english language",
  "english studies",
  "digital technologies",
  "computer studies",
  "computer science",
  "nigerian history",
  "business studies",
  "civic education",
  "integrated science",
  "basic science",
  "mathematics",
  "geography",
  "economics",
  "accounting",
  "government",
  "marketing",
  "commerce",
  "chemistry",
  "biology",
  "physics",
  "history",
  "english",
  "crs",
  "crk",
  "phe",
  "ict",
  "maths",
  "math"
];

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const KNOWN_NAMES = [...SSS_SUBJECTS, ...JSS_SUBJECTS].map((s) => ({ raw: s as string, key: norm(s as string) }));
const KNOWN_ALIASES = EXTRA_ALIASES.map((a) => ({ raw: a, key: norm(a) })).sort((a, b) => b.key.length - a.key.length);

function cleanFileLabel(raw: string): string {
  return raw
    .replace(/\.(md|markdown|txt|docx)$/i, "")
    .replace(/\b(JSS|SSS|SS)\s*[1-3]\s*[A-Z]?\b/gi, " ")
    .replace(/\b(comprehensive\s+)?(study\s+)?notes?\b/gi, " ")
    .replace(/\bweek\s*\d+\b/gi, " ")
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Work out which subject a file or subject sub-folder belongs to. */
function detectSubject(label: string): string {
  const key = norm(cleanFileLabel(label));
  if (!key) return "General";

  // 1. Exact canonical name / alias.
  const exact = KNOWN_NAMES.find((s) => s.key === key) ?? KNOWN_ALIASES.find((s) => s.key === key);
  if (exact) return canonicalSubject(exact.raw);

  // 2. A known subject contained in the label ("JSS1 Mathematics Week 2").
  const contained = KNOWN_NAMES.filter((s) => key.includes(s.key)).sort((a, b) => b.key.length - a.key.length)[0];
  if (contained) return canonicalSubject(contained.raw);
  const alias = KNOWN_ALIASES.find((s) => key.includes(s.key));
  if (alias) return canonicalSubject(alias.raw);

  // 3. Unknown label: keep it readable instead of dropping the notes.
  const fallback = cleanFileLabel(label);
  return fallback ? canonicalSubject(fallback) : "General";
}

function findClassDir(className: string): string | null {
  const wanted = normalizeClass(className).toLowerCase();
  if (!wanted || !fs.existsSync(DOCS_DIR)) return null;

  const direct = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .find((d) => d.name.toLowerCase() === wanted);
  if (direct) return path.join(DOCS_DIR, direct.name);

  const loose = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .find((d) => normalizeClass(d.name).toLowerCase() === wanted);
  return loose ? path.join(DOCS_DIR, loose.name) : null;
}

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name.startsWith("~$")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (NOTE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function readNoteFile(file: string): string {
  if (path.extname(file).toLowerCase() === ".docx") {
    return extractDocxText(fs.readFileSync(file));
  }
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

type RawTopic = { name: string; body: string };

type Marker = { index: number; length: number; name: string };

function splitTopics(text: string, subject: string): RawTopic[] {
  const src = text.replace(/\r\n?/g, "\n").trim();
  if (!src) return [];

  const markers: Marker[] = [];

  // "TOPIC 1: Name", "UNIT 2 — Name", "CHAPTER 3", "WEEK 4", "MODULE 5".
  for (const m of src.matchAll(/^(?:TOPIC|UNIT|CHAPTER|WEEK|MODULE|SECTION)\s*\d+\s*[:.\-–]?\s*(.+)$/gim)) {
    markers.push({ index: m.index ?? 0, length: m[0].length, name: m[1].trim() });
  }

  // Markdown headings. A leading heading that names the subject or says
  // "notes" is the document title, not a topic.
  const headings = [...src.matchAll(/^(#{1,3})\s+(.+)$/gm)];
  let titleEnd = -1;
  if (headings.length > 0) {
    const first = headings[0];
    const firstKey = norm(first[2]);
    const titleKey = norm(cleanFileLabel(first[2]));
    const laterHasSubheading = headings.slice(1).some((h) => h[1].length >= 2);
    const looksLikeTitle =
      (first.index ?? 0) === 0 &&
      (titleKey === norm(subject) ||
        firstKey.includes("note") ||
        firstKey.includes("comprehensive") ||
        (first[1].length === 1 && laterHasSubheading));
    if (looksLikeTitle) titleEnd = (first.index ?? 0) + first[0].length;
  }

  for (const m of headings) {
    const index = m.index ?? 0;
    if (index === titleEnd - m[0].length) continue; // the title heading
    // Do not double-count a "# TOPIC 1:" line already captured above.
    if (/^#\s*(?:TOPIC|UNIT|CHAPTER|WEEK|MODULE|SECTION)\s*\d+/i.test(m[0])) continue;
    markers.push({ index, length: m[0].length, name: m[2].trim().replace(/^(?:TOPIC|UNIT|CHAPTER|WEEK|MODULE|SECTION)\s*\d+\s*[:.\-–]?\s*/i, "") });
  }

  if (markers.length === 0) {
    // Only a title heading (or no headings at all): keep the whole body as one
    // topic so nothing is lost.
    const body = (titleEnd !== -1 ? src.slice(titleEnd) : src).trim();
    return body ? [{ name: subject, body }] : [];
  }

  // Sort and drop any duplicate marker at the same position.
  markers.sort((a, b) => a.index - b.index || b.length - a.length);
  const unique: Marker[] = [];
  for (const m of markers) {
    if (unique.length === 0 || m.index !== unique[unique.length - 1].index) unique.push(m);
  }

  const topics: RawTopic[] = [];
  const preface = src.slice(0, unique[0].index).trim();
  if (preface && titleEnd === -1) topics.push({ name: "Introduction", body: preface });

  unique.forEach((m, i) => {
    const start = m.index + m.length;
    const end = i + 1 < unique.length ? unique[i + 1].index : src.length;
    const body = src
      .slice(start, end)
      .replace(/^\s*\*\*Topic ID:\*\*.*$/gim, "")
      .trim();
    topics.push({ name: m.name, body });
  });

  return topics.filter((t) => t.name);
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Read every class-specific note document for a class.
 * Returns one entry per canonical subject. Missing/empty folders return [].
 */
export function getClassNotes(className: string): ClassSubjectNotes[] {
  const dir = findClassDir(className);
  if (!dir) return [];

  const bySubject = new Map<string, ClassSubjectNotes>();

  for (const file of walkFiles(dir)) {
    const rel = path.relative(dir, file);
    const parts = rel.split(path.sep);
    // A subject sub-folder wins over the filename.
    const folderLabel = parts.length > 1 ? parts[0] : "";
    const fileLabel = path.basename(file);
    const subject = detectSubject(folderLabel || fileLabel);

    let text = "";
    try {
      text = readNoteFile(file);
    } catch {
      continue; // Unreadable/corrupt file: skip it rather than break the page.
    }

    const rawTopics = splitTopics(text, subject);
    if (rawTopics.length === 0) continue;

    const existing = bySubject.get(subject) ?? { name: subject, topics: [] };
    rawTopics.forEach((t, i) => {
      existing.topics.push({
        id: `class-${slug(normalizeClass(className))}-${slug(subject)}-${slug(t.name) || i + 1}`,
        name: t.name,
        notes: t.body ? [t.body] : []
      });
    });
    bySubject.set(subject, existing);
  }

  return [...bySubject.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** True when docs/<CLASS> exists and contains at least one readable note file. */
export function hasClassNotes(className: string): boolean {
  const dir = findClassDir(className);
  if (!dir) return false;
  return walkFiles(dir).length > 0;
}
