import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurriculumSubjects, getCurriculumTopic, type CurriculumSubject, type CurriculumTopic } from "@/lib/curriculum";
import { getSiteSettings, notesAccessKey, type SiteSettings, type TopicAccess } from "@/lib/site-settings";
import { getWallet } from "@/lib/credits";

// Default policy: first visible topic of a subject = free for everyone,
// the rest need Unlimited. Admin overrides (site_settings.notes_access) win.
function accessFor(s: SiteSettings, level: string, subject: string, topic: string, isFirstVisible: boolean): TopicAccess {
  const o = s.notesAccess[notesAccessKey(level, subject, topic)];
  if (o === "FREE" || o === "UNLIMITED" || o === "HIDDEN") return o;
  return isFirstVisible ? "FREE" : "UNLIMITED";
}

function firstVisibleIdx(s: SiteSettings, level: string, subject: string, names: string[]): number {
  return names.findIndex((n) => s.notesAccess[notesAccessKey(level, subject, n)] !== "HIDDEN");
}

function lockedCopy<T extends CurriculumTopic>(t: T): T & { locked: boolean } {
  return { ...t, locked: true, notes: [], learningObjectives: [], activities: [], examFocus: [] };
}

function applyAccess(s: SiteSettings, subj: CurriculumSubject, unlimited: boolean): CurriculumSubject & { topics: (CurriculumTopic & { locked: boolean })[] } {
  const names = subj.topics.map((t) => t.name);
  const firstIdx = firstVisibleIdx(s, subj.level, subj.name, names);
  const topics = subj.topics
    .map((t, i) => ({ t, i, access: accessFor(s, subj.level, subj.name, t.name, i === firstIdx) }))
    .filter(({ access }) => access !== "HIDDEN")
    .map(({ t, access }) => {
      if (unlimited || access === "FREE") return { ...t, locked: false };
      return lockedCopy(t);
    });
  return { ...subj, topics };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const topic = searchParams.get("topic");
  const userId = searchParams.get("userId");

  const settings = await getSiteSettings();
  let unlimited = false;
  if (userId) {
    try {
      const db = await getDb();
      const wallet = await getWallet(db, userId);
      unlimited = wallet?.plan === "UNLIMITED";
    } catch {
      unlimited = false; // fail closed: treat as free
    }
  }

  const all = getCurriculumSubjects();

  // Single topic (notes preview / practice detail).
  if (subject && topic) {
    const t = getCurriculumTopic(subject, topic);
    if (!t) return NextResponse.json({ error: "topic not found" }, { status: 404 });
    const owner = all.find((s) => s.id === subject || s.name.toLowerCase() === subject.toLowerCase());
    const names = owner?.topics.map((x) => x.name) ?? [t.name];
    const isFirst = names[firstVisibleIdx(settings, t.level, t.subject, names)] === t.name;
    const access = accessFor(settings, t.level, t.subject, t.name, isFirst);
    if (access === "HIDDEN") return NextResponse.json({ error: "topic not found" }, { status: 404 });
    if (!unlimited && access === "UNLIMITED") {
      return NextResponse.json({ topic: lockedCopy(t), locked: true, meta: { unlimited: false } });
    }
    return NextResponse.json({ topic: { ...t, locked: false }, locked: false, meta: { unlimited } });
  }

  // One subject.
  if (subject) {
    const s = all.find((x) => x.id === subject || x.name.toLowerCase() === subject.toLowerCase());
    if (!s) return NextResponse.json({ error: "subject not found" }, { status: 404 });
    return NextResponse.json({ subject: applyAccess(settings, s, unlimited), meta: { unlimited } });
  }

  // Full curriculum (what the dashboard page uses).
  return NextResponse.json({
    subjects: all.map((s) => applyAccess(settings, s, unlimited)).filter((s) => s.topics.length > 0),
    meta: { unlimited }
  });
}
