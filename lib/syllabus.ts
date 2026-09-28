// WAEC/JAMB Day-1 syllabus map (PRD §9 + §8 anti-hallucination).
// Single source of truth for subject lists; AI questions must stay inside these topics.
export const SUBJECTS = [
  "English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Commerce",
  "Economics",
  "Government",
  "Literature"
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SYLLABUS: Record<Subject, string[]> = {
  English: ["Comprehension", "Synonyms", "Antonyms", "Tenses", "Lexis"],
  Mathematics: ["Quadratic equations", "Linear equations", "Percentages", "Geometry"],
  Physics: ["Motion", "Waves", "Electricity"],
  Chemistry: ["Atomic structure", "Periodic table", "Acids and bases"],
  Biology: ["Cells", "Transport in plants", "Ecology"],
  Commerce: ["Trade", "Business units"],
  Economics: ["Demand and supply", "Scale of preference", "Inflation"],
  Government: ["Democracy", "Federalism"],
  Literature: ["Prose", "Drama", "Poetry"]
};

export function topicAllowed(subject: string, topic: string): boolean {
  const list = (SYLLABUS as Record<string, string[]>)[subject];
  return !!list && list.includes(topic);
}
