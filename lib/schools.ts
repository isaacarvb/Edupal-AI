import { getDb, uid, type Db } from "./db";
import { hashPassword } from "./password";

// ---------------------------------------------------------------------------
// School Portal — institutional layer.
//
// A school is a paying tenant; its students are NORMAL EduPal users that are
// additionally linked via school_members. Nothing here touches personal
// wallets or personal subscriptions — school access is always READ from the
// school's own row (active + expires_at), never written into student wallets.
// ---------------------------------------------------------------------------

export type SchoolRow = {
  id: string;
  groupId: string | null;
  name: string;
  code: string;
  adminUserId: string | null;
  active: number;
  expiresAt: string | null;
  maxSeats: number;
  createdAt: string;
};

const COLS = `id, group_id AS "groupId", name, code, admin_user_id AS "adminUserId",
  active, expires_at AS "expiresAt", max_seats AS "maxSeats", created_at AS "createdAt"`;

// A school grants access while it is switched on AND its subscription has not
// lapsed. No expiry date = never lapses (owner-issued lifetime deals).
export function schoolIsActive(s: { active: number | boolean; expiresAt: string | null }): boolean {
  if (!s.active) return false;
  if (!s.expiresAt) return true;
  const end = Date.parse(s.expiresAt);
  return Number.isFinite(end) && end > Date.now();
}

export function schoolStatus(s: { active: number | boolean; expiresAt: string | null }): "ACTIVE" | "EXPIRED" | "INACTIVE" {
  if (!s.active) return "INACTIVE";
  return schoolIsActive(s) ? "ACTIVE" : "EXPIRED";
}

// Short human-friendly school code (shown to staff, used in generated logins).
export function schoolCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function getSchoolByAdmin(db: Db, userId: string): Promise<SchoolRow | undefined> {
  return (await db.prepare(`SELECT ${COLS} FROM schools WHERE admin_user_id = ?`).get(userId)) as SchoolRow | undefined;
}

export async function getSchoolById(db: Db, schoolId: string): Promise<SchoolRow | undefined> {
  return (await db.prepare(`SELECT ${COLS} FROM schools WHERE id = ?`).get(schoolId)) as SchoolRow | undefined;
}

// Gate for every /api/school/* call: the caller must be the staff login of a
// school (school access itself is NOT required — staff prepare rosters before
// the subscription is switched on).
export async function requireSchoolAdmin(
  db: Db,
  userId: string | null
): Promise<{ school: SchoolRow; staffName: string; staffEmail: string }> {
  if (!userId) throw new Error("userId required");
  const school = await getSchoolByAdmin(db, userId);
  if (!school) throw new Error("forbidden: not a school admin");
  const staff = (await db.prepare("SELECT name, email FROM users WHERE id = ?").get(userId)) as
    | { name: string | null; email: string | null }
    | undefined;
  return { school, staffName: staff?.name ?? "", staffEmail: staff?.email ?? "" };
}

// ---------------------------------------------------------------------------
// Roster account creation — school-issued logins.
//
// Email is synthetic (ada.obi14@code.edupal-ai.com): many students have no
// email of their own and the school hands out credentials on paper anyway.
// Passwords are simple to type, shown ONCE (hash is stored, never the plain).
// ---------------------------------------------------------------------------

export function slugifyName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .trim()
      .replace(/\s+/g, ".")
      .slice(0, 24) || "student"
  );
}

// ada.obi + counter until free — guaranteed unique against emails already in
// the users table (checked per-call by the caller with a taken-set).
export function syntheticEmail(name: string, code: string, taken: Set<string>): string {
  const base = slugifyName(name);
  const domain = `${code.toLowerCase()}.edupal-ai.com`;
  for (let n = 1; ; n++) {
    const email = `${base}${n}@${domain}`;
    if (!taken.has(email)) {
      taken.add(email);
      return email;
    }
  }
}

// Typeable for kids: 4 letters + 4 digits, e.g. "balo4821".
export function generatePassword(): string {
  const letters = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  let out = "";
  for (let i = 0; i < 4; i++) out += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 4; i++) out += digits[Math.floor(Math.random() * digits.length)];
  return out;
}

export async function countMembers(db: Db, schoolId: string): Promise<number> {
  const row = (await db.prepare("SELECT COUNT(*) AS n FROM school_members WHERE school_id = ?").get(schoolId)) as
    | { n: number | string }
    | undefined;
  return Number(row?.n ?? 0);
}

// ---------------------------------------------------------------------------
// Teacher accounts — school staff who log in at /login and see only their classes.
// ---------------------------------------------------------------------------

export type SchoolTeacher = {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  classes: string[];
  active: number;
  createdAt: string;
};

const TEACHER_COLS = `id, school_id AS "schoolId", name, email, classes, active, created_at AS "createdAt"`;

export async function getSchoolTeachers(db: Db, schoolId: string): Promise<SchoolTeacher[]> {
  const rows = (await db
    .prepare(`SELECT ${TEACHER_COLS} FROM school_teachers WHERE school_id = ? ORDER BY name`)
    .all(schoolId)) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: String(r.id),
    schoolId: String(r.schoolId),
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    classes: String(r.classes ?? "").split(",").filter(Boolean),
    active: Number(r.active ?? 0),
    createdAt: String(r.createdAt ?? "")
  }));
}

export async function getTeacherById(db: Db, teacherId: string): Promise<SchoolTeacher | undefined> {
  const row = (await db.prepare(`SELECT ${TEACHER_COLS} FROM school_teachers WHERE id = ?`).get(teacherId)) as
    | Record<string, unknown>
    | undefined;
  if (!row) return undefined;
  return {
    id: String(row.id),
    schoolId: String(row.schoolId),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    classes: String(row.classes ?? "").split(",").filter(Boolean),
    active: Number(row.active ?? 0),
    createdAt: String(row.createdAt ?? "")
  };
}

export async function getTeacherByEmail(db: Db, email: string): Promise<SchoolTeacher | undefined> {
  const row = (await db.prepare(`SELECT ${TEACHER_COLS} FROM school_teachers WHERE LOWER(email) = LOWER(?)`).get(email)) as
    | Record<string, unknown>
    | undefined;
  if (!row) return undefined;
  return {
    id: String(row.id),
    schoolId: String(row.schoolId),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    classes: String(row.classes ?? "").split(",").filter(Boolean),
    active: Number(row.active ?? 0),
    createdAt: String(row.createdAt ?? "")
  };
}

// Gate for teacher APIs: caller must be a SCHOOL_TEACHER of the given school.
export async function requireSchoolTeacher(
  db: Db,
  userId: string | null,
  schoolId?: string
): Promise<{ teacher: SchoolTeacher; school: SchoolRow }> {
  if (!userId) throw new Error("userId required");
  const teacher = await getTeacherById(db, userId);
  if (!teacher) throw new Error("forbidden: not a teacher");
  if (teacher.active !== 1) throw new Error("forbidden: teacher account inactive");
  const school = await getSchoolById(db, teacher.schoolId);
  if (!school) throw new Error("forbidden: school not found");
  if (schoolId && school.id !== schoolId) throw new Error("forbidden: not your school");
  return { teacher, school };
}

// Create a teacher account: user row (for login) + school_teachers row.
// The caller must already be a school admin of the target school.
export async function createSchoolTeacher(db: Db, opts: {
  schoolId: string;
  name: string;
  email: string;
  password: string;
  classes: string[];
  creatorId: string;
}): Promise<SchoolTeacher> {
  const { schoolId, name, email, password, classes, creatorId } = opts;
  const cleanEmail = String(email ?? "").trim().toLowerCase();
  if (!cleanEmail.includes("@")) throw new Error("valid email required");
  if (password.length < 6) throw new Error("password of 6+ characters required");
  const school = await getSchoolById(db, schoolId);
  if (!school) throw new Error("school not found");

  const existingUser = (await db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail)) as { id: string } | undefined;
  const existingTeacher = await getTeacherByEmail(db, cleanEmail);
  if (existingUser || existingTeacher) throw new Error("email already used — sign in instead");

  const id = uid();
  const now = new Date().toISOString();
  await db
    .prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')")
    .run(id, name.trim(), cleanEmail, hashPassword(password));
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now);
  await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
  await db
    .prepare("INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, ?, ?, ?, ?, ?, 1)")
    .run(id, schoolId, name.trim(), cleanEmail, hashPassword(password), classes.join(","));
  return getTeacherById(db, id) as Promise<SchoolTeacher>;
}

export async function deleteSchoolTeacher(db: Db, teacherId: string): Promise<void> {
  const teacher = await getTeacherById(db, teacherId);
  if (!teacher) throw new Error("teacher not found");
  await db.prepare("DELETE FROM school_teachers WHERE id = ?").run(teacherId);
  await db.prepare("DELETE FROM users WHERE id = ? AND role = 'SCHOOL_TEACHER'").run(teacherId);
}

export { uid, getDb };
