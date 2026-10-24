import { getDb, uid, type Db } from "./db";
import { schoolIsActive, getSchoolById } from "./schools";

export type LessonNote = {
  id: string;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  className: string;
  subject: string;
  topic: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type Assignment = {
  id: string;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  className: string;
  subject: string;
  topic: string;
  instructions: string;
  dueAt: string | null;
  createdAt: string;
};

export type Broadcast = {
  id: string;
  schoolId: string;
  className: string | null;
  body: string;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Lesson notes — teachers write (pending), VP Academics approves/rejects.
// ---------------------------------------------------------------------------

export async function getLessonNotes(db: Db, schoolId: string, opts?: {
  status?: "pending" | "approved" | "rejected";
  className?: string;
  teacherId?: string;
}): Promise<LessonNote[]> {
  let sql = `SELECT ln.id, ln.school_id AS "schoolId", ln.teacher_id AS "teacherId",
    ln.teacher_name AS "teacherName", ln.class_name AS "className", ln.subject, ln.topic,
    ln.body, ln.status, ln.reviewed_by AS "reviewedBy", ln.reviewed_at AS "reviewedAt",
    ln.created_at AS "createdAt"
   FROM lesson_notes ln WHERE ln.school_id = ?`;
  const params: unknown[] = [schoolId];
  if (opts?.status) { sql += " AND ln.status = ?"; params.push(opts.status); }
  if (opts?.className) { sql += " AND ln.class_name = ?"; params.push(opts.className); }
  if (opts?.teacherId) { sql += " AND ln.teacher_id = ?"; params.push(opts.teacherId); }
  sql += " ORDER BY ln.created_at DESC";
  const rows = (await db.prepare(sql).all(...params)) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: String(r.id),
    schoolId: String(r.schoolId),
    teacherId: String(r.teacherId),
    teacherName: String(r.teacherName ?? ""),
    className: String(r.className ?? ""),
    subject: String(r.subject ?? ""),
    topic: String(r.topic ?? ""),
    body: String(r.body ?? ""),
    status: String(r.status) as "pending" | "approved" | "rejected",
    reviewedBy: r.reviewedBy ? String(r.reviewedBy) : null,
    reviewedAt: r.reviewedAt ? String(r.reviewedAt) : null,
    createdAt: String(r.createdAt ?? "")
  }));
}

export async function createLessonNote(db: Db, opts: {
  schoolId: string; teacherId: string; teacherName: string; className: string;
  subject: string; topic: string; body: string;
}): Promise<LessonNote> {
  const id = uid();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO lesson_notes (id, school_id, teacher_id, teacher_name, class_name, subject, topic, body, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
    )
    .run(id, opts.schoolId, opts.teacherId, opts.teacherName, opts.className, opts.subject, opts.topic, opts.body);
  return {
    id, schoolId: opts.schoolId, teacherId: opts.teacherId, teacherName: opts.teacherName,
    className: opts.className, subject: opts.subject, topic: opts.topic, body: opts.body,
    status: "pending", reviewedBy: null, reviewedAt: null, createdAt: now
  };
}

export async function reviewLessonNote(db: Db, opts: {
  noteId: string; reviewerId: string; reviewerName: string;
  status: "approved" | "rejected";
}): Promise<LessonNote> {
  const note = (await db.prepare("SELECT * FROM lesson_notes WHERE id = ?").get(opts.noteId)) as
    | Record<string, unknown>
    | undefined;
  if (!note) throw new Error("note not found");
  if (note.status !== "pending") throw new Error("note already reviewed");
  await db
    .prepare(
      "UPDATE lesson_notes SET status = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?"
    )
    .run(opts.status, opts.reviewerId, new Date().toISOString(), opts.noteId);
  return getLessonNotes(db, String(note.school_id)).then((ns) => ns.find((n) => n.id === opts.noteId)) as Promise<LessonNote>;
}

// ---------------------------------------------------------------------------
// Assignments — teachers set work for a class.
// ---------------------------------------------------------------------------

export async function getAssignments(db: Db, schoolId: string, opts?: {
  className?: string; teacherId?: string;
}): Promise<Assignment[]> {
  let sql = `SELECT a.id, a.school_id AS "schoolId", a.teacher_id AS "teacherId",
    st.name AS "teacherName", a.class_name AS "className", a.subject, a.topic,
    a.instructions, a.due_at AS "dueAt", a.created_at AS "createdAt"
   FROM assignments a JOIN school_teachers st ON st.id = a.teacher_id
   WHERE a.school_id = ?`;
  const params: unknown[] = [schoolId];
  if (opts?.className) { sql += " AND a.class_name = ?"; params.push(opts.className); }
  if (opts?.teacherId) { sql += " AND a.teacher_id = ?"; params.push(opts.teacherId); }
  sql += " ORDER BY a.created_at DESC";
  const rows = (await db.prepare(sql).all(...params)) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: String(r.id), schoolId: String(r.schoolId), teacherId: String(r.teacherId),
    teacherName: String(r.teacherName ?? ""), className: String(r.className ?? ""),
    subject: String(r.subject ?? ""), topic: String(r.topic ?? ""),
    instructions: String(r.instructions ?? ""), dueAt: r.dueAt ? String(r.dueAt) : null,
    createdAt: String(r.createdAt ?? "")
  }));
}

export async function createAssignment(db: Db, opts: {
  schoolId: string; teacherId: string; teacherName: string; className: string;
  subject: string; topic: string; instructions: string; dueAt: string | null;
}): Promise<Assignment> {
  const id = uid();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO assignments (id, school_id, teacher_id, class_name, subject, topic, instructions, due_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(id, opts.schoolId, opts.teacherId, opts.className, opts.subject, opts.topic, opts.instructions, opts.dueAt ?? null);
  return {
    id, schoolId: opts.schoolId, teacherId: opts.teacherId, teacherName: opts.teacherName,
    className: opts.className, subject: opts.subject, topic: opts.topic,
    instructions: opts.instructions, dueAt: opts.dueAt, createdAt: now
  };
}

export async function deleteAssignment(db: Db, assignmentId: string): Promise<void> {
  await db.prepare("DELETE FROM assignments WHERE id = ?").run(assignmentId);
}

// ---------------------------------------------------------------------------
// Broadcasts — messages to a class or the whole school.
// ---------------------------------------------------------------------------

export async function getActiveBroadcasts(db: Db, schoolId: string, className?: string): Promise<Broadcast[]> {
  const now = new Date().toISOString();
  let sql = `SELECT b.id, b.school_id AS "schoolId", b.class_name AS "className",
    b.body, b.starts_at AS "startsAt", b.ends_at AS "endsAt", b.created_at AS "createdAt"
   FROM broadcasts b WHERE b.school_id = ?
   AND (b.starts_at IS NULL OR b.starts_at <= ?)
   AND (b.ends_at IS NULL OR b.ends_at >= ?)`;
  const params: unknown[] = [schoolId, now, now];
  if (className) { sql += " AND (b.class_name IS NULL OR b.class_name = ?)"; params.push(className); }
  sql += " ORDER BY b.starts_at DESC";
  const rows = (await db.prepare(sql).all(...params)) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: String(r.id), schoolId: String(r.schoolId),
    className: r.className ? String(r.className) : null,
    body: String(r.body ?? ""), startsAt: String(r.startsAt ?? ""),
    endsAt: r.endsAt ? String(r.endsAt) : null, createdAt: String(r.createdAt ?? "")
  }));
}

export async function createBroadcast(db: Db, opts: {
  schoolId: string; className: string | null; body: string; startsAt: string; endsAt: string | null;
}): Promise<Broadcast> {
  const id = uid();
  const now = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO broadcasts (id, school_id, class_name, body, starts_at, ends_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(id, opts.schoolId, opts.className ?? null, opts.body, opts.startsAt, opts.endsAt ?? null);
  return { id, schoolId: opts.schoolId, className: opts.className, body: opts.body,
    startsAt: opts.startsAt, endsAt: opts.endsAt, createdAt: now };
}

export async function deleteBroadcast(db: Db, broadcastId: string): Promise<void> {
  await db.prepare("DELETE FROM broadcasts WHERE id = ?").run(broadcastId);
}

// ---------------------------------------------------------------------------
// Student-side view of lesson notes + broadcasts for their class.
// ---------------------------------------------------------------------------

export async function getStudentLessonNotes(db: Db, schoolId: string, className: string): Promise<LessonNote[]> {
  return getLessonNotes(db, schoolId, { status: "approved", className });
}

export async function getStudentBroadcasts(db: Db, schoolId: string, className: string): Promise<Broadcast[]> {
  return getActiveBroadcasts(db, schoolId, className);
}
