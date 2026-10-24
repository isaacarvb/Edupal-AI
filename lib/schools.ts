import { getDb, uid, type Db } from "./db";

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

export { uid, getDb };
