import Credentials from "next-auth/providers/credentials";

// Local-dev auth: email + password checked against env seed user.
// Prod: replace authorize() with Prisma lookup + bcrypt compare.
export const authOptions = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        const email = credentials?.email;
        const password = credentials?.password;
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
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET
};
