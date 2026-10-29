import Credentials from "next-auth/providers/credentials";
import { getDb } from "./db";
import { verifyPassword } from "./password";

// Local-dev auth: real SQLite users (email + scrypt password) + legacy seed user.
// Prod: same shape, stronger policy (resets, lockouts) on top.
export const authOptions = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;
        const db = await getDb();
        const row = await db
          .prepare("SELECT id, email, role, password_hash AS hash, failed_login_attempts AS attempts, locked_until AS locked FROM users WHERE email = ?")
          .get(email) as { id: string; email: string; role: string; hash: string | null; attempts: number; locked: string | null } | undefined;

        // --- Check if account is locked ---
        if (row?.locked) {
          const lockedUntil = Date.parse(row.locked);
          if (Number.isFinite(lockedUntil) && lockedUntil > Date.now()) {
            return null; // Account is locked
          }
          // Lock expired — reset attempts
          if (row) {
            await db
              .prepare("UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?")
              .run(row.id);
          }
        }

        // --- Verify password ---
        if (row?.hash && verifyPassword(password, row.hash)) {
          // Successful login — reset attempts
          await db
            .prepare("UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?")
            .run(row.id);
          return { id: row.id, email: row.email, name: "EduPal user", role: row.role };
        }

        // Wrong password — increment attempts and lock if >= 3
        if (row) {
          const newAttempts = (row.attempts ?? 0) + 1;
          if (newAttempts >= 3) {
            const lockedUntil = new Date(Date.now() + 30 * 60000).toISOString(); // 30 minutes
            await db
              .prepare("UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?")
              .run(newAttempts, lockedUntil, row.id);
          } else {
            await db
              .prepare("UPDATE users SET failed_login_attempts = ? WHERE id = ?")
              .run(newAttempts, row.id);
          }
        }
        // Legacy dev seed (pre-password accounts).
        if (
          email === (process.env.SEED_USER_EMAIL ?? "amina@example.com") &&
          password === (process.env.SEED_USER_PASSWORD ?? "password123")
        ) {
          return { id: "local-amina", email, name: "Amina" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: { id?: string; role?: string } }) {
      if (user?.id) token.uid = user.id;
      if ((user as { role?: string })?.role) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }: { session: { user?: Record<string, unknown> }; token: Record<string, unknown> }) {
      if (session.user && token.uid) session.user.id = token.uid;
      if (session.user && token.role) session.user.role = token.role;
      return session;
    }
  },
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET
};
