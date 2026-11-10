import { NextResponse } from "next/server";
import { getCurriculumSubjects, type CurriculumSubject, type CurriculumTopic } from "@/lib/curriculum";
import {
  COMMERCIAL_SUBJECTS,
  GENERAL_SUBJECTS,
  JSS_SUBJECTS,
  SCIENCE_SUBJECTS,
  ART_SUBJECTS,
  canonicalSubject,
  isJuniorClass,
  isSeniorClass
} from "@/lib/syllabus";
import { normalizeClass } from "@/lib/csv";
import { getClassNotes } from "@/lib/class-notes";

// School Curriculum API.
//
// GET ?className=JSS1
//   → class metadata + subject sections (names and topic counts only).
// GET ?className=JSS1&subject=Mathematics
//   → the full topic-by-topic notes for that subject in that class.
//
// Notes pasted into docs/<CLASS>/ are the primary source. If a subject has a
// class-specific document, only that document's topics are shown for the
// class. If it does not, the general curriculum notes (MD/NERDC) are used so
// no class looks empty while documents are still being added.

type ClassTopic = { id: string; name: string; notes: string[] };

function classTopicToCurriculum(t: ClassTopic, subject: string, level: "JSS" | "SSS", className: string): CurriculumTopic {
  return {
    id: t.id,
    name: t.name,
    class: className,
    subject,
    level,
    exams: [],
    subjectId: "",
    learningObjectives: [],
    notes: t.notes,
    activities: [],
    examFocus: [],
    source: "md"
  };
}

function subjectByName(subjects: CurriculumSubject[], name: string, level: "JSS" | "SSS") {
  const want = canonicalSubject(name).toLowerCase();
  return (
    subjects.find((s) => s.level === level && s.name.toLowerCase() === want) ??
    subjects.find((s) => s.level === level && canonicalSubject(s.name).toLowerCase() === want)
  );
}

function generalTopicsForClass(subject: CurriculumSubject | undefined, className: string): CurriculumTopic[] {
  if (!subject) return [];
  const wanted = normalizeClass(className).toLowerCase();
  return subject.topics.filter((t) => {
    const topicClass = normalizeClass(t.class || "").toLowerCase();
    return !topicClass || topicClass === wanted;
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawClass = searchParams.get("className") ?? "";
    const className = normalizeClass(rawClass);
    const subjectName = searchParams.get("subject") ?? "";

    if (!className) return NextResponse.json({ error: "className required" }, { status: 400 });

    const junior = isJuniorClass(className);
    const senior = isSeniorClass(className);
    if (!junior && !senior) {
      return NextResponse.json({ error: "Unknown class. Use JSS1–JSS3 or SSS1–SSS3." }, { status: 400 });
    }

    const level: "JSS" | "SSS" = junior ? "JSS" : "SSS";
    const general = getCurriculumSubjects();

    // Class-specific documents win over the general curriculum.
    const classNotes = getClassNotes(className);
    const notesBySubject = new Map(classNotes.map((n) => [canonicalSubject(n.name).toLowerCase(), n]));

    function topicsFor(name: string): CurriculumTopic[] {
      const canon = canonicalSubject(name);
      const notes = notesBySubject.get(canon.toLowerCase());
      if (notes && notes.topics.length > 0) {
        return notes.topics.map((t) => classTopicToCurriculum(t, canon, level, className));
      }
      return generalTopicsForClass(subjectByName(general, name, level), className);
    }

    // Full topic view for one subject.
    if (subjectName) {
      const canon = canonicalSubject(subjectName);
      const topics = topicsFor(canon);
      return NextResponse.json({
        ok: true,
        className,
        level,
        source: notesBySubject.has(canon.toLowerCase()) ? "class" : "general",
        subject: {
          name: canon,
          topics: topics.map((t) => ({
            id: t.id,
            name: t.name,
            class: t.class,
            learningObjectives: t.learningObjectives,
            notes: t.notes,
            activities: t.activities,
            examFocus: t.examFocus
          }))
        }
      });
    }

    // Class overview: subject names + counts only.
    const fixed = junior ? [...JSS_SUBJECTS] : [...GENERAL_SUBJECTS, ...SCIENCE_SUBJECTS, ...ART_SUBJECTS, ...COMMERCIAL_SUBJECTS];
    const fixedKeys = new Set(fixed.map((s) => canonicalSubject(s).toLowerCase()));
    const extra = classNotes
      .map((n) => canonicalSubject(n.name))
      .filter((n) => !fixedKeys.has(n.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    const summary = (names: string[]) =>
      names.map((name) => ({ name: canonicalSubject(name), topicCount: topicsFor(name).length }));

    const sections = junior
      ? [{ title: "Subjects", subjects: summary([...fixed, ...extra]) }]
      : [
          { title: "General", subjects: summary([...GENERAL_SUBJECTS]) },
          { title: "Science", subjects: summary([...SCIENCE_SUBJECTS]) },
          { title: "Art", subjects: summary([...ART_SUBJECTS]) },
          { title: "Commercial", subjects: summary([...COMMERCIAL_SUBJECTS]) },
          ...(extra.length > 0 ? [{ title: "Other", subjects: summary(extra) }] : [])
        ];

    return NextResponse.json({
      ok: true,
      className,
      level,
      hasClassNotes: classNotes.length > 0,
      sections: sections.filter((s) => s.subjects.length > 0)
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
