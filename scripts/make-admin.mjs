// Usage: node scripts/make-admin.mjs you@email.com [SUPER_ADMIN]
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const email = process.argv[2]?.trim().toLowerCase();
const role = process.argv[3] ?? "ADMIN";
if (!email || !email.includes("@")) {
  console.error("Usage: node scripts/make-admin.mjs you@email.com [SUPER_ADMIN]");
  process.exit(1);
}
const file = process.env.DB_FILE ?? path.join(process.cwd(), "dev.db");
const db = new DatabaseSync(file);
const row = db.prepare("SELECT id, role FROM users WHERE email = ?").get(email);
if (!row) {
  console.error(`No user found with email ${email} — have them sign up first, then rerun.`);
  process.exit(1);
}
db.prepare("UPDATE users SET role = ? WHERE email = ?").run(role, email);
console.log(`OK — ${email} is now ${role}. Sign in at /admin with their password.`);
