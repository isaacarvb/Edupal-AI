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
        const db = getDb();
        const row = db
          .prepare("SELECT id, email, role, password_hash AS hash FROM users WHERE email = ?")
          .get(email) as { id: string; email: string; role: string; hash: string | null } | undefined;
        if (row?.hash && verifyPassword(password, row.hash)) {
          return { id: row.id, email: row.email, name: "EduPal user", role: row.role };
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
