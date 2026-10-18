# EduPal AI — Implementation Plan (PRD v1.0)

Source: `docx/EduPal AI_PRD v1.0.md` (126 lines, 7831 bytes).
Repo state at planning time: `README.md` (1382 bytes), `docx/`, `picx/`, `vidx/` (each only `.gitkeep` except PRD), 1 commit `a3714ed`, origin repo (since moved to `https://github.com/isaacarvb/Edupal-AI`), untracked `docx/EduPal AI_PRD v1.0.md`.

## 1. What we are building

AI exam tutor for WAEC/JAMB (Day 1). Personas: Amina (16yo SS3, shared mobile, evening study), Mr. Okafor (busy parent, wants visibility, no checkout friction), Admin (uses hosted dashboards, no custom panel in v1.0).

Core loop: Sign up → select level/exam/date/subjects/language → optional 5–10Q diagnostic → daily practice on credits → instant AI feedback → topic mastery updates → smart next-topic → exhaust credits → pay (parent contact if secondary, no blocking verification) → unlimited + parent magic-link dashboard + Sunday email.

Day-1 subjects: English, Mathematics (curated past questions), Physics, Chemistry, Biology, Commerce, Economics, Government, Literature (AI-generated against topic templates + likely-repeat predictions).

Out of scope v1.0: WhatsApp, offline mode, social, custom admin panel.

## 2. Architectural decisions

| Decision | Choice (local-first) | Alternative rejected | Why |
|---|---|---|---|
| Framework | Next.js 15 + TypeScript + Tailwind, App Router, single app with role views | Separate frontend/backend (React + Express) | One deploy, shared auth, API Routes enough for MVP, role middleware cheap. Split later if mobile app needed. |
| Database | SQLite file `./dev.db` via Prisma ORM | PostgreSQL locally via Docker | **Why SQLite instead of PostgreSQL?** SQLite is a single file, zero install, zero RAM/Docker, instant reset for a solo dev on Windows. Covers pilot scale (20–30 users) easily. Prisma schema migrates 1:1 to Postgres/Supabase later by changing `provider` + connection string — no query rewrite. Postgres locally adds Docker dependency, port conflicts, and ops overhead with no benefit until concurrent-write scale or hosted prod. Switch trigger: public launch or need for Supabase Auth/RLS. |
| Storage | Local filesystem `./storage/docx|picx|vidx`, served via `/api/media` | S3 / Supabase Storage now | No keys, no cost, works offline, maps directly to existing `docx/`, `picx/`, `vidx/` seed folders. Migrate by swapping `lib/storage.ts` to S3 client. |
| Auth | NextAuth.js email+password + mock SMS OTP (console code in dev) | Supabase Auth / Firebase Auth now | Works with SQLite locally, no external service. PRD v1.0 allows Supabase/Firebase dashboards for admin only — auth stays local until prod. |
| Email | Nodemailer + Mailpit (`localhost:8025`) for parent magic link + weekly digest | SendGrid / Resend now | Free, offline, inspectable. Swap SMTP host in prod. |
| AI | Pluggable `lib/ai.ts` → Ollama (`llama3.1`) locally, OpenAI API in prod | Hardcode OpenAI everywhere | PRD §8 requires syllabus-strict, anti-hallucination, study-buddy tone. Single interface lets prompts/templates stay identical while provider changes. Curated English/Math banks bypass AI entirely. |
| Jobs | node-cron in-app (reminders, streak reset, countdown nudges) | BullMQ/Redis, external cron | No infra for MVP. Move to hosted scheduler at scale. |
| i18n | `next-intl`, nav stays Standard English, AI body toggles Simple English / Pidgin | Full Pidgin UI | Matches PRD Module B: menus stable, AI persona adapts. |

## 3. Design system (mobile-first, shared device)

Principles: 360px first, thumb-reach actions, low-data (no auto video), high contrast for evening use, Standard English chrome.

Tokens (`app/globals.css`):
- Colors: primary green `#16A34A` (Naija exam connotation), ink `#0F172A`, muted `#64748B`, bg `#F8FAFC`, warning amber `#F59E0B` (Needs Work), danger `#DC2626` (Weak), success `#16A34A` (Strong).
- Type: Inter, base 16px, headings 20/24/28, line-height 1.6 for explanations.
- Spacing/radius: 4pt scale, cards `rounded-xl`, buttons `rounded-lg h-12` minimum touch target.
- Dark mode: off for v1.0 to halve QA.

Components (`components/`):
`Button`, `Input/OTPInput`, `Card`, `TopicBadge(Weak/Needs Work/Strong + %)`, `AccuracyBar`, `CountdownChip`, `StreakFlame + FreezeBadge`, `CreditMeter (x/y left)`, `QuestionCard (MCQ + Theory)`, `FeedbackPanel (checklist hit/missed, score e.g. 6/10, model answer, How to Improve)`, `NextTopicSuggest + Override`, `LanguageToggle`, `ParentTable (view-only)`.

Flows to prototype first (Figma or code): onboarding → diagnostic → practice → exhausted-credits paywall → parent dashboard. Pilot metric: explanation clarity on first read.

Accessibility: labels on all inputs, focus rings, Pidgin is plain-language (no slang that obscures meaning), video captions in `vidx/`.

## 4. Data model (Prisma + SQLite)

```
User(id, email/phone unique, passwordHash, role: STUDENT|PARENT|ADMIN, level: SECONDARY|UNIVERSITY, createdAt)
Profile(userId, exam: WAEC|JAMB, examDate, subjects[], language: SIMPLE|PIDGIN)
Question(id, exam, subject, topic, type: MCQ|THEORY, stem, optionsJson, answerKey, markingRubric, source: CURATED|AI, predictedRepeat Boolean)
Attempt(id, userId, questionId, response, correct Boolean, theoryScore Int?, feedbackJson, creditsSpent, createdAt)
TopicMastery(userId, subject, topic, accuracy Float, label: WEAK|NEEDS_WORK|STRONG, streakCount, updatedAt)
Streak(userId, current, longest, lastStudyDate, freezeAvailable Boolean)
Wallet(userId, creditsLeft, resetAt, plan: FREE|UNLIMITED)
ParentLink(studentId, parentEmail, magicToken, verifiedAt)
```

Indexes: `(userId, subject, topic)` on Attempt/Mastery, `(exam, subject, topic)` on Question.

## 5. Phases

### Phase 0 — Foundation (3–5 days)
Scaffold Next.js+TS+Tailwind, Prisma SQLite, NextAuth, role middleware, `lib/storage.ts` local, Mailpit, Ollama stub, seed script for English/Math CSV.
Accept: `npm run dev` works offline, login works, upload to `storage/` renders via `/api/media`.

### Phase 1 — Onboarding + Diagnostic
Level → exam → date → subjects → language. Optional 5–10Q diagnostic per subject seeding `TopicMastery`. Countdown starts.
Accept: new user gets baseline Weak/Strong without full mock.

### Phase 2 — Question Engine + AI Feedback (core)
MCQ with instant explanation; Theory with checklist hit/missed + score + model answer + How to Improve. Curated banks for English/Math; AI others via validated topic templates + `predictedRepeat` flag. Guardrails: syllabus-strict system prompt, off-topic redirect, study-buddy tone.
Accept: HMW1 + HMW2 demonstrable in 15-min session.

### Phase 3 — Tracking + Smart Suggest
Accuracy % + label per topic, auto level-up after N consecutive high scores, urgent-weak surfacing + override, retention mini-quiz on Strong.
Accept: dashboard shows Weak → Needs Work → Strong transitions.

### Phase 4 — Habits + Countdown
Countdown chip (30d/7d tone shift), in-app + email reminders, streak + monthly freeze.
Accept: streak survives one missed day via freeze; reminders visible in Mailpit.

### Phase 5 — Monetization + Parent (PRD Module E)
Credits: 1 MCQ / 3 Theory, 24h reset, `CreditMeter`. On exhaust: paywall → parent contact if SECONDARY → immediate payment (mock Paystack locally) → unlimited. Parent: welcome email + magic link, view-only dashboard (streaks, weak topics, consistency), Sunday digest.
Accept: secondary checkout completes without blocking; parent login sees only own child.

### Phase 6 — Harden + Pilot gate
Seed all 9 subjects, prompt tuning, 5-day pilot 20–30 Lagos SS3, instrument: clarity rate, parent open rate, checkout drop-off, >70% D1–D5 retention.
Accept: pilot metrics dashboard (even if Supabase dashboard in prod).

### Phase 7 — Fast-follow (post-MVP, not in v1.0 build)
WhatsApp OTP/reminders/digests after Meta verification; expand curated banks; charts. Still out: offline, social, full custom admin.

## 6. API surface (Next.js Routes)
`POST /api/auth/signup|otp`, `GET/POST /api/onboarding`, `GET /api/practice/next?subject=`, `POST /api/practice/attempt`, `GET /api/topics`, `POST /api/topics/override`, `GET /api/streak|countdown`, `GET/POST /api/credits|checkout|parent/*`, `POST /api/media`.

## 7. Risks
AI hallucination in non-curated subjects → mitigate with topic templates + human review screen (lightweight, PRD-allowed). Shared-device sessions → short sessions + logout nudge. Parent-contact drop-off → measure; PRD bets no-block flow fixes it.

## 8. Immediate next actions
1. Commit PRD (`git add "docx/EduPal AI_PRD v1.0.md"`).
2. Scaffold Phase 0.
3. Seed 20 English + 20 Math curated Qs.
