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

// School Curriculum API.
//
// GET ?className=JSS1
//   → class metadata + subject sections (names and topic counts only).
// GET ?className=JSS1&subject=Mathematics
//   → the full topic-by-topic notes for that subject in that class.
//
// Topics tagged with a class are shown only in that class. Untagged topics
// (the general MD notes) are shown in every class until class-specific notes
// are imported, so no class ever looks empty by accident.

function subjectByName(subjects: CurriculumSubject[], name: string, level: "JSS" | "SSS") {
  const want = canonicalSubject(name).toLowerCase();
  return (
    subjects.find((s) => s.level === level && s.name.toLowerCase() === want) ??
    subjects.find((s) => s.level === level && canonicalSubject(s.name).toLowerCase() === want)
  );
}

function topicsForClass(subject: CurriculumSubject | undefined, className: string): CurriculumTopic[] {
  if (!subject) return [];
  const wanted = normalizeClass(className).toLowerCase();
  return subject.topics.filter((t) => {
    const topicClass = normalizeClass(t.class || "").toLowerCase();
    return !topicClass || topicClass === wanted;
  });
}

function section(title: string, names: readonly string[], subjects: CurriculumSubject[], level: "JSS" | "SSS", className: string) {
  return {
    title,
    subjects: names.map((name) => ({
      name: canonicalSubject(name),
      topicCount: topicsForClass(subjectByName(subjects, name, level), className).length
    }))
  };
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
    const subjects = getCurriculumSubjects();

    // Full topic view for one subject.
    if (subjectName) {
      const found = subjectByName(subjects, subjectName, level);
      const topics = topicsForClass(found, className);
      return NextResponse.json({
        ok: true,
        className,
        level,
        subject: {
          name: canonicalSubject(subjectName),
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
    const sections = junior
      ? [section("Subjects", JSS_SUBJECTS, subjects, "JSS", className)]
      : [
          section("General", GENERAL_SUBJECTS, subjects, "SSS", className),
          section("Science", SCIENCE_SUBJECTS, subjects, "SSS", className),
          section("Art", ART_SUBJECTS, subjects, "SSS", className),
          section("Commercial", COMMERCIAL_SUBJECTS, subjects, "SSS", className)
        ];

    return NextResponse.json({
      ok: true,
      className,
      level,
      sections: sections.filter((s) => s.subjects.length > 0)
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
