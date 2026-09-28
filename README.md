# EduPal AI

AI-powered exam prep tutor for Nigerian students — WAEC & JAMB in v1.0. Personalized practice, instant explanations, weak-topic tracking, parent visibility.

## Run it locally (100% offline-friendly)

Needs Node.js 24.

```powershell
npm install
node scripts/seed.mjs
npm run dev
```

Open `http://localhost:3000` → **Set up your study plan** → practice → dashboard.

Local login (dev only): `amina@example.com` / `password123`.

## Project map

```
app/            Next.js pages + API routes (onboarding, diagnostic, practice, topics, auth, media)
lib/            db (Node built-in SQLite), auth, ai (pluggable), mail (Mailpit-ready), storage (local fs)
db/schema.sql   Tables — auto-applied on boot, no migrations tool needed
scripts/seed.mjs  Curated + template question bank (idempotent)
storage/        Local media library (gitignored)
docs/           PRD, implementation plan, design preview
docx/ picx/ vidx/  Study-notes / images / videos libraries
```

## Stack (local-first, $0)

| Piece | Choice | Prod swap |
|---|---|---|
| Framework | Next.js 15 + Tailwind | same |
| Database | Node built-in SQLite (`dev.db`) | Postgres/Supabase |
| Auth | NextAuth credentials (local) | + bcrypt/Prisma lookup |
| Email | Nodemailer → Mailpit `:1025` | ZeptoMail SMTP |
| Payments | Mock checkout | Paystack |
| AI | `lib/ai.ts` stub | Ollama local / OpenAI API |

Decisions with rationale live in `docs/PRD-v1.0.md` §11–13.

## Status

* [x] Phase 0 — local foundation, health check, auth, media API
* [x] Phase 1 — onboarding, 10Q diagnostic, MCQ/theory practice, mastery dashboard
* [x] Phase 2 — theory grading (checklist + score), guardrails, likely-repeat badge
* [x] Phase 3 — smart suggest + override, consecutive-win level-ups, retention refresh
* [x] Phase 4 — streak freeze, milestone countdown, daily reminders outbox
* [x] Phase 5 — 24h credit reset, mock Paystack checkout, parent dashboard + digest
* [ ] Phase 6 — harden + pilot gate (all 9 subjects, metrics board) ← in progress
