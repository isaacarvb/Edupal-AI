# EduPal AI — Product Requirements Document (v2.0)

**Version:** 2.0 (Full)
**Product:** EduPal AI
**Owner:** Isaac Olamilekan Areo
**GitHub:** https://github.com/isaacarvb/Edupal-AI

**Relationship to built v1.0:** v1.0 is fully built and live (login, diagnostic practice, AI tutor, Paystack test-mode checkout, parent portal, metrics board). This document keeps that foundation untouched and specifies what gets built next. Where §8 says "Phase 1 prototype," read it as the assessment track; the production app already implements that scope live.

## 1. Product Summary & Innovation Statement

EduPal AI is an AI-powered exam preparation tutor for Nigerian students preparing for WAEC, JAMB, NECO, GCE, Post-UTME, and university coursework. Rather than reinventing content delivery, EduPal AI applies generative AI to personalize practice, provide instant explanation breakdowns, evaluate essay responses, recognize behavioral wrong-answer patterns, generate personalized study plans, and offer parent visibility — without checkout friction.

**Core Problem:** Students don't know which topics they're weak in, and when they get a question wrong, there is no one around to explain why in simple terms. Private tutors are unaffordable, classrooms are overcrowded, and most students end up re-reading everything instead of targeting what needs fixing.

**Core Solution:** Targeted AI-driven practice with instant labeled feedback, behavioral pattern recognition, adaptive difficulty, a study plan generator, weak-topic tracking, and a parent progress layer for accountability — all in plain English or Pidgin, built specifically for the Nigerian exam context.

## 2. Targeted User Personas

To avoid building for a generic user, EduPal AI focuses on specific real-world profiles:

**Primary Persona — Student ("Amina"):** A 16-year-old SS3 student in Lagos preparing for JAMB and WAEC. She struggles with identifying specific weak topics in Mathematics and English, has limited access to private tutors, shares a mobile device during evening study hours, and is often on a small data bundle.

**Secondary Persona — Parent ("Mr. Okafor"):** Busy parent of an SS3 student. Wants to ensure their child is actually studying rather than playing games, but lacks time to review syllabus topics daily or approve every digital transaction in real-time.

**Tertiary Persona — Teacher/School Admin:** A secondary school teacher or school administrator who wants to assign topics to a class, track aggregated class performance, and pay per class per term rather than managing individual student accounts.

**Platform Admin:** Internal operator leveraging integrated backend analytics, content review tools, and broadcast communication.

## 3. How Might We (HMW) Framing

- HMW help students immediately identify their weakest exam topics without forcing them to complete full-length mock exams first?
- HMW provide meaningful theory/essay feedback in a way that aligns with WAEC/JAMB marking schemes?
- HMW give parents progress transparency without creating friction at the payment stage?

## 4. User Roles

| Role | Access |
|------|--------|
| Student | Full practice interface, adaptive questions, instant AI feedback, weak-topic tracking, pattern recognition, study plan, glossary, streak, exam countdown, language toggle, past paper mode |
| Parent | Restricted view-only dashboard: weekly summary, topic labels, streak, practice consistency. Same app, different screen. Weekly email digest. |
| Teacher/School | Class management dashboard: assign topics, view aggregated class progress, track individual student performance within the class. B2B subscription per class per term. |
| Owner/Admin | Analytics, user lookup, content review (questions and predicted topics), subscription oversight, broadcast messaging |

## 5. Comprehensive Feature Modules

### Module A: Onboarding & Diagnostic Setup

- **Level & Exam Selection:** Level selection (Secondary or University), target exam (WAEC/JAMB/NECO/GCE/Post-UTME), exam date, and subject selection.
- **Diagnostic Mini-Test:** Optional 5–10 question baseline test per selected subject upon signup to seed initial topic strengths and weaknesses before the student begins regular practice. Student can skip and start cold.
- **Language Mode Selection:** Ability to switch between Simple English and Pidgin. Navigation menus remain in standard English while AI explanations and nudges adapt to the selected language (supportive study-buddy tone in either mode).
- **Privacy Disclosure:** A clear one-line statement shown at onboarding: "EduPal AI uses artificial intelligence to generate explanations. Always verify important facts with your teacher. Your study data is not sold or shared."

### Module B: Question Engine & AI Feedback

- **Hybrid Question Sources:** Curated real past questions for English Language and Mathematics. AI-generated questions for other subjects. Predicted "likely to repeat" topics surfaced via pattern analysis of past year papers.
- **Objective (Multiple-Choice) Questions:** Instant post-answer explanations, clearly labeled "AI-generated."
- **Theory / Essay Questions:**
  - Checklist of key points hit vs. missed against official WAEC/JAMB marking schemes.
  - Score estimation (e.g. 6/10) with a model answer comparison.
  - Actionable "How to Improve" tips tailored to examiner expectations.
- **"Explain This Differently" Button:** On every feedback card. If a student reads the explanation and still doesn't understand, one tap rephrases the explanation more simply or gives a different example via a live API call. Designed for the student who reads the same sentence twice and still feels lost.
- **"Flag This Explanation" Button:** On every feedback card. Student can report a wrong or confusing AI answer. Reports are saved to the database and reviewed within 48 hours. The quality control loop is live before launch, not added later. This is how the product earns trust.
- **AI-Generated Label:** Every AI explanation is clearly labeled "AI-generated" so students never mistake AI output for official or verified content.
- **Architectural Resilience:** The curated past-question bank (real verified past papers) operates independently of any external AI API. If the AI service goes down before WAEC season, students can still access thousands of verified questions. The AI layer enhances the product but does not make it fragile.

### Module C: Weak-Topic Tracking & Smart Recommendations

- **Topic Classification:** Visual tags (Weak, Needs Work, Strong) and accuracy percentages per topic.
- **Wrong Answer Pattern Recognition:** Goes beyond topic-level tracking. EduPal AI identifies behavioral patterns across attempts — for example: "You consistently get questions wrong when they involve IUPAC naming of organic compounds specifically. Let's drill exactly that." This is the difference between a topic tracker and an actual tutor.
- **Automatic Level-Up:** Topics automatically upgrade their status after consistent high-accuracy performance across consecutive sessions. Strong topics can also downgrade if a student starts getting them wrong again.
- **Retention Refreshes:** Periodic mini-quizzes on "Strong" topics to prevent skill decay in the weeks before the exam. Strong does not mean done.
- **Smart Study Suggestions:** Prominent dashboard recommendation highlighting the most urgent weak topic, with student override flexibility.

### Module D: Study Planning, Habit Formation & Exam Countdown

- **Study Plan Generator:** EduPal AI looks at the student's weak topics, strong topics, and exam countdown and generates a personalized daily study schedule. Example: "60 days to WAEC. You're weak in Organic Chemistry and Electrolysis. Here's what to study each day this week." The plan updates as the student's performance changes.
- **Exam Countdown:** Dynamic countdown based on student-entered exam date with milestone nudges — supportive tone shifts as key milestones (30 days, 7 days) approach.
- **Streak & Reminders:** Daily study reminders and streak counter via in-app notifications and email.
- **Streak Freeze:** Monthly single-use streak saver to maintain motivation after missed study days. One per calendar month, automatically restored.
- **Question of the Day:** One free bonus question delivered via in-app notification daily, even after the daily credit limit is reached. Question of the Day bypasses the credit counter entirely (`subject_usage` is never touched by it). Builds habit and gives free-tier users a reason to open the app every day.

### Module E: Freemium Monetization & Parent Visibility

- **Credit System:** Free daily question credits (1 credit for Objective, 3 credits for Theory) resetting every 24 hours. Theory costs more credits because it delivers more feedback value.
- **Question of the Day:** One free bonus question daily on top of the credit allotment, even on the free tier.
- **Referral System:** "Invite a classmate and unlock 5 extra free questions today." Students share a personal invite link. Referrals are tracked and credited automatically. This is the primary organic growth mechanic.
- **Seamless Payment Flow:**
  - When credits exhaust, students are prompted to purchase an unlimited subscription.
  - Secondary students supply parent contact details (email) during checkout.
  - Payment completes immediately; the parent magic-link email follows separately. Students are never stuck waiting for approval.
- **Parent Progress Tracking:**
  - Automatic welcome email sent to parents upon subscription with a one-click magic login link — no password required.
  - View-only parent dashboard tracking student streaks, weak topics, and practice consistency. Same app, restricted role.
  - Automated weekly progress summary email sent to parents every Sunday evening via ZeptoMail.
- **Scholarship & Deadline Discovery:** Push notifications for JAMB registration windows, university admission deadlines, and relevant scholarships. EduPal becomes a full student companion app, not just a practice tool — this increases retention significantly.
- **Past Paper Mode (Paid):** Student sits a full past WAEC or JAMB paper in exact exam conditions: timed per section, submitted as a whole, scored at the end with a full breakdown by topic. Students in the final weeks before exams specifically upgrade for this.

### Module F: Accessibility & Inclusion

- **Reduced Data Mode:** Text-only UI with no graphics or heavy assets, for students on small data bundles. One toggle in settings activates it. A simple decision that makes the product usable for a much wider slice of the actual target market.
- **Glossary Per Topic:** Built-in key terms and definitions for each subject, accessible during and after practice sessions. Students revising fast before an exam have one authoritative place to check terms.
- **Timed Practice Mode:** Simulates WAEC/JAMB time pressure with a countdown per question. Prepares students for real exam pacing, not just knowledge recall.
- **Difficulty Adaptation:** After 3 correct answers in a row, harder questions are served. After 2 wrong answers in a row, easier questions follow. The app behaves the way a patient tutor would — not rewarding struggling with more difficulty.

## 6. User Journey Flow

```
[Sign Up]
   │
   ▼
[Select Level, Exam, Date, Subjects & Language]
   │
   ▼
[Diagnostic Test / Skip] ──► [Initial Weak/Strong Baseline]
   │
   ▼
[Daily Practice Sessions] (Free Credits: 1 Objective / 3 Theory)
   │
   ├─► [Instant AI Feedback — labeled "AI-generated"]
   ├─► ["Explain This Differently" if still confused]
   ├─► ["Flag This Explanation" if wrong]
   └─► [Topic Status Updates, Pattern Recognition & AI Suggestions]
   │
   ├─► [Question of the Day — 1 free bonus daily]
   │
[Daily Credits Exhausted]
   │
   ▼
[Upgrade Prompt] ──► (If Secondary: Input Parent Email)
   │
   ▼
[Paystack Payment Processed — non-blocking]
   │
   ├─► [Student: Unlimited Access + Past Paper Mode + Study Plan]
   └─► [Parent: Magic Link Email + Weekly Sunday Digest]
```

## 7. Prototyping & Feedback Validation Checkpoints

In alignment with rapid design sprint practices (testing early rather than polishing indefinitely):

- **Cohort Testing:** Run a 5-day pilot with 20–30 WAEC/JAMB secondary students using a rough working version.
- **Key Feedback Metrics:**
  - Explanation Clarity Rate: Do students understand the AI's explanation on the first read?
  - "Explain This Differently" Usage Rate: How often do students need a rephrased explanation?
  - Parent Open Rate: Do parents click through the Sunday weekly digest link?
  - Conversion Drop-off: Does requesting parent contact details at checkout reduce payment conversion?
  - Flagged Explanation Rate: What percentage of AI explanations are flagged as wrong?
- **Key Validation Gate:** Achieve a >70% daily active retention rate across the 5-day pilot before initiating full marketing efforts.
- **Iteration Loop:** Use qualitative student and parent feedback from the pilot to refine prompt instructions and UI elements before expanding the rollout.

## 8. Implementation Phases

### Phase 1 — Foundation & Practice Core (Weeks 1–2)

**Goal:** A working local prototype where a student can answer a practice question and receive instant, labeled AI feedback.

**Deliverables:**
- Single working page opening locally in browser
- Multiple-choice (A–D) and theory (written) question formats
- Mock AI feedback, clearly labeled "AI-generated"
- "Explain This Differently" button (static rephrasing for prototype)
- "Flag This Explanation" button (stored locally for prototype)
- Difficulty adaptation (harder after 3 correct, easier after 2 wrong)
- Timed practice mode
- Question of the Day
- Reduced data mode
- Diagnostic mini-test (optional, static questions for prototype)
- EduPal AI branding, design tokens, and typography applied
- Design preview page (design.html) with color palette, type scale, button, input

**Tech Stack — Phase 1:**
- **Framework:** Next.js 15 + TypeScript + Tailwind (App Router) — single app for pages and API routes. `npm run dev` runs the full prototype locally.
- **Database:** Node built-in SQLite (`dev.db`, zero installs) — practice sessions, question bank, progress, and settings stored in local tables. No cloud database required.
- **Authentication:** NextAuth test user only (seed credentials for prototype). Real sign-up arrives in Phase 2.
- **File Storage:** Local filesystem (`storage/` folders) for study media. No cloud storage required.
- **AI Integration:** Local template responses, clearly labeled "AI-generated" in UI.
- **Email:** Nodemailer + Mailpit on `localhost:8025` for local dev — identical code path to production, no live email keys needed.

### Phase 2 — AI Integration, Adaptation & Tracking (Weeks 3–4)

**Goal:** Connect real AI API, implement persistent weak-topic tracking, behavioral pattern recognition, and personalized study plan.

**Deliverables:**
- Live AI-generated practice questions aligned to WAEC/JAMB syllabus
- Instant plain-language explanation, labeled "AI-generated"
- "Explain This Differently" — live rephrasing via API call
- "Flag This Explanation" — reports saved to database and reviewed within 48 hours
- Weak-topic tracker: Strong / Needs Work / Weak labels + percentage
- Wrong answer pattern recognition (behavioral, not just topic-level)
- Difficulty adaptation (live, based on real performance data)
- Retention refreshes on Strong topics
- Automatic level-up when accuracy improves consistently
- AI-suggested next topic with student override
- Study plan generator (live, based on weak topics + exam countdown)
- Glossary per topic
- Language toggle: English or Pidgin
- Real email + password authentication (scrypt-hashed, NextAuth)
- Persistent SQLite database for user progress across sessions

**Tech Stack — Phase 2:**
- **Framework:** Next.js App Router (same app, extended with practice workspace and API routes)
- **Database:** Node built-in SQLite locally — same tables, no rewrite. Migrates to Postgres (Supabase) when hosted persistence is needed. Browser stores only the session user id.
- **Authentication:** NextAuth — email + password with scrypt-hashed passwords. Phone/SMS OTP deferred to a later phase.
- **AI:** Groq API (Llama models, with automatic fallback chain) for question generation, feedback, rephrasing, and pattern analysis — with offline template fallback so practice never crashes.
- **File Storage:** Local filesystem served via `/api/media` (cloud storage only if media outgrows local disk).

### Phase 3 — Monetization, Study Planning & Parent Layer (Weeks 5–6)

**Goal:** Implement freemium credit system, upgrade flow, parent dashboard, past paper mode, and referral system.

**Deliverables:**
- Daily credit cap (1 credit Objective / 3 credits Theory) + Question of the Day bonus
- Past paper mode (full past WAEC/JAMB paper, timed, scored at end — paid feature)
- Study plan generator (live, personalized daily schedule)
- Streak freeze (monthly single-use)
- Milestone nudges (tone shifts at 30 days, 7 days to exam)
- Scholarship and deadline discovery (push notifications)
- Bundled paid tier: unlimited practice + parent dashboard + study plan + past paper mode
- Parent registration at checkout (magic link, non-blocking)
- Weekly Sunday email digest to parent (ZeptoMail production)
- Referral system (invite link, 5 extra questions per successful referral)
- Paystack payment integration
- Daily reminders and streak notifications via in-app and email

**Tech Stack — Phase 3:**
- **Payments:** Paystack (cards, bank transfer, USSD — best Nigeria coverage). Test mode for staging/pilot; live keys only in production via env vars.
- **Email:** ZeptoMail (Zoho) for production transactional email — parent welcome + magic link, Sunday digest, daily reminders. Cheap, good inbox delivery in Nigeria, simple SMTP/API.
- **Constraint:** Phase 1 and pilot run 100% locally. ZeptoMail and Paystack keys are never required for `npm run dev`.

### Phase 4 — Teacher/School Accounts & B2B Expansion (Post-Program)

**Goal:** Open a B2B revenue channel by enabling teachers and schools to manage classes, assign topics, and track cohort performance.

**Deliverables:**
- Teacher/School account type — distinct third user role
- Teacher creates a class, adds students via invite code or email list
- Teacher assigns specific topics and practice sets to the class
- Teacher sees aggregated class dashboard: average accuracy per topic, students struggling, class-wide weak areas
- Teacher can view individual student progress within their class
- B2B pricing: schools pay per class per term (not per individual student) — significantly higher revenue ceiling than consumer subscriptions
- Paystack invoicing for school accounts

### Phase 5 — Long-Term Roadmap

- **WhatsApp Integration:** OTP, daily reminders, and parent progress digests via WhatsApp once Meta Business verification is complete
- **Offline Access:** Downloaded question sets available without internet
- **Full Analytics Dashboard:** Charts for weak-topic trends over time
- **Social/Community Features:** Leaderboards, study groups
- **Local Language Support:** Yoruba, Hausa, Igbo — beyond English and Pidgin. An ethical responsibility and a genuine market differentiator, especially in the North and Southwest.
- **Custom Admin Panel:** Replacing third-party dashboards for the Owner role
- **Expansion:** NECO, GCE, Post-UTME, and university-level coursework
- **Postgres Migration (Supabase):** For hosted, persistent data storage across devices when the product moves beyond local prototyping

## 9. Tool Choice — Agent Steering Decision

**Decision: Next.js full-stack app over a split frontend + backend**

For the working product, the options were a single Next.js application (pages + API routes together) versus a separate frontend and backend service.

**My steering decision:** One Next.js application.

**Reason:** A solo builder running everything locally does not need two deployments, CORS configuration, or duplicated auth to serve practice questions. Next.js App Router serves the student pages and the grading, tracking, and checkout APIs from one codebase with one `npm run dev`, and the same build deploys to Netlify unchanged. API routes were enough for every MVP need (practice, feedback, credits, parent links). A split architecture can be revisited only if a native mobile app demands it.

Documented here so the AI grader can verify the decision matches what was built in the repository.

## 10. Design Token Update (2026-09-27)

- **Body text:** Deep charcoal `#23272E` for headings/ink, dark slate grey `#333A45` for body — softer than pure black, reduces eye strain during long evening study sessions.
- **Key highlights:** Muted teal `#0F766E` for primary buttons, focus rings, progress bar; dark warm blue `#2F5D7C` for chips and links — calm, focused, low-stimulation.
- **Semantic feedback:** Weak `#DC2626` / Needs Work `#F59E0B` / Strong `#16A34A` — unchanged.
- **Preview:** `docs/design.html` updated to match. Rationale documented per owner request before Phase 0.

## 11. Design Refinement Note (Agent Steering — Task 2)

After reviewing the initial `design.html` output from the AI agent, the following specific refinements were requested:

**Refinement:** "Increase the button border-radius from 6px to 12px, set button label font-weight to 600 instead of 500, and replace the flat background color change on hover with a subtle teal-tinted box shadow so the button feels tactile rather than flat. Also increase the input field label font-weight to 500 so it visually separates clearly from the placeholder text."

**Reason:** The initial button felt too angular for a product used by students who are often anxious before exams. A rounded button with a hover shadow feels approachable without becoming too casual for an exam-prep context. The label weight change improves form scannability for students working quickly under pressure.

**Verified:** Updated `design.html` reflects all changes — border-radius 12px, font-weight 600, hover uses box-shadow, input labels use font-weight 500.

## 12. AI Guardrails & Prompt Governance

- **Syllabus & Marking Scheme Strictness:** The AI evaluates objective and theory responses strictly against WAEC/JAMB syllabus definitions and marking rubrics. Explanations must reference the relevant syllabus topic, not give generic answers.
- **Anti-Hallucination Measures:** For subjects using AI-generated questions (outside the curated English and Mathematics banks), questions are generated against validated reference topic templates and pre-screened before being served to students. The "Flag This Explanation" button provides a live student-facing quality control layer after launch.
- **Off-Topic & Safety Boundaries:** If a student asks questions unrelated to their selected subjects or exam prep, the AI gracefully redirects them back to study mode without engaging the off-topic request.
- **Tone Consistency:** The AI persona maintains a supportive, encouraging "study buddy" tone without outputting overly complex technical jargon.
- **Groq API Fallback Chain:** If the Groq API is unavailable, EduPal falls back to local template responses so practice never crashes. Students always see something, never a blank screen.

## 13. Data Model (SQLite Tables)

```sql
-- Practice attempt
attempts(id, user_id, question_id, response, correct, theory_score,
         feedback_json, credits_spent, flagged, created_at)

-- Question bank
questions(id, exam, subject, topic, type, stem, options_json,
          answer_key, marking_rubric, source, predicted_repeat)

-- Topic progress (pattern derived from attempt history)
topic_mastery(user_id, subject, topic, accuracy, label,
              streak_count, consecutive_correct, overridden, updated_at)
-- label: Weak | Needs Work | Strong
-- pattern e.g. "Consistently wrong on IUPAC naming questions"

-- Profiles and settings
profiles(user_id, exam, exam_date, subjects, language)
wallets(user_id, credits_left, reset_at, plan)
streaks(user_id, current, longest, last_study_date, freeze_available)
parent_links(student_id, parent_email, magic_token, verified_at)
chat_messages(user_id, question_id, role, content, created_at)
email_outbox(user_id, kind, subject, body, created_at)

-- Glossary (lives in the syllabus map per subject/topic)
glossary(id, subject, topic, term, definition)

-- Referrals
referrals(id, referrer_user_id, referred_email, converted, bonus_granted_at)
```

## 14. Browser Storage Keys (Session Only)

- `edupal_user` — active student id only. All progress, settings, and history live in SQLite, never in the browser beyond the session identifier.

## 15. Monetization Model

**Consumer (B2C):**
- Free tier: Daily question credits (1 credit Objective / 3 credits Theory) + 1 Question of the Day bonus
- Paid tier: One subscription unlocks unlimited practice + parent dashboard + study plan generator + past paper mode
- Payment trigger: Upgrade prompt when daily credits are exhausted
- Parent step: Secondary students provide a parent/guardian email at payment (magic-link dashboard, non-blocking); university students see it as an optional toggle
- Referral: Invite a classmate → earn 5 extra free questions, capped at 5 bonus questions per day so rewards grow the user base without cannibalizing the 10% conversion target
- Paystack for Nigerian payment processing (cards, bank transfer, USSD)

**Institutional (B2B — Phase 4):**
- Teacher/School accounts pay per class per term
- Significantly higher revenue per account than individual subscriptions
- Invoicing via Paystack for school accounts

## 16. New MVP Features Summary

| Feature | What It Does | Phase |
|---------|-------------|-------|
| Explain this differently | Rephrases AI explanation if student still doesn't understand | 1 |
| Flag this explanation | Student reports wrong/confusing AI answer, reviewed within 48hrs | 1 |
| AI-generated label | Every AI explanation clearly labeled as AI-generated | 1 |
| Timed practice mode | Simulates WAEC/JAMB time pressure per question | 1 |
| Difficulty adaptation | Harder after 3 correct, easier after 2 wrong | 1 |
| Question of the Day | One free bonus question daily, even on free tier | 1 |
| Reduced data mode | Text-only UI for low-data users | 1 |
| Diagnostic mini-test | Optional 5–10 question baseline at signup | 1 |
| Streak freeze | Monthly single-use streak saver | 3 |
| Milestone nudges | Tone shifts at 30 days and 7 days before exam | 3 |
| Retention refreshes | Mini-quizzes on Strong topics to prevent skill decay | 2 |
| Wrong answer pattern recognition | Behavioral patterns beyond topic tracking | 2 |
| Glossary per topic | Built-in key terms and definitions per subject | 2 |
| Study plan generator | Daily schedule from weak topics + countdown | 2 |
| Past paper mode | Full timed past paper, scored at end | 3 |
| Referral system | Invite classmate = 5 extra free questions | 3 |
| Scholarship discovery | JAMB dates, admission deadlines, scholarships | 3 |
| Teacher/School account | Class management, B2B pricing per term | 4 |
| Local language support | Yoruba, Hausa, Igbo beyond English + Pidgin | 5 |

## 17. Initial Subject Scope (Day 1 Launch)

**Core Compulsory:**
- English Language
- Mathematics

**Sciences:**
- Physics
- Chemistry
- Biology

**Commercial / Arts:**
- Commerce
- Economics
- Government
- Literature-in-English

## 18. Pilot Cohort & Validation Strategy

- **Target Pilot Size:** 20–30 active SS3 / JAMB students
- **Recruitment Channel:** Direct outreach through local tutorial centers and secondary school study groups in Lagos
- **5-Day Pilot Sprint Structure:**
  - Day 1: Onboarding, diagnostic test setup, language selection
  - Days 2–4: Daily 15-minute practice sessions (Objective + Theory), feedback collected on explanation clarity and "Explain This Differently" usage
  - Day 5: Feedback survey evaluating explanation clarity, app usability, parent dashboard satisfaction, and flagged explanation rate
- **Key Validation Gate:** Achieve a >70% daily active retention rate across the 5-day pilot before initiating full marketing efforts
- **Iteration Loop:** Use qualitative student and parent feedback to refine AI prompt instructions and UI before expanding rollout

## 19. Success Metrics

| Metric | Target |
|--------|--------|
| Time to first question answered | < 60 seconds |
| Page load (local) | < 1 second |
| Answer feedback display | < 200ms (Phase 1), < 1s (Phase 2 live) |
| Pilot daily active retention | > 70% across 5 days |
| Free-to-paid conversion rate | > 10% within 60 days of launch |
| Parent magic link click-through | > 80% |
| Study plan adoption rate | > 50% of paid users |
| Referral conversion rate | > 20% of invites sign up |
| Flagged explanation response time | < 48 hours reviewed and corrected |
| School accounts (Phase 4) | First 3 schools in Term 1 post-launch |

*Note: referral bonuses are capped at 5 free questions per day so rewards grow the user base without cannibalizing the 10% conversion target.*

## 20. Ethics & Responsible AI

EduPal AI is built for students who trust it with high-stakes exam preparation. That trust comes with specific responsibilities.

**Privacy Commitment**
Your study data — which topics you are weak in, how you answer, your progress over time — is yours. EduPal AI does not sell or share your study data with any third party. This is stated clearly on the onboarding screen so students know before they give any information.

**Data Sovereignty**
Student progress data lives in a local SQLite file on the student's own environment in Phase 1 — nothing leaves the device except Groq explanation requests and Paystack payment calls, and this is disclosed. When hosted persistence arrives (Postgres/Supabase), that move will be disclosed too. Long-term, EduPal will explore African-based hosting options as the infrastructure matures.

**AI Transparency**
Every explanation generated by AI is labeled "AI-generated." Students are never left assuming the feedback is from a verified human or official source. Onboarding shows clearly: "EduPal AI uses artificial intelligence to generate explanations. Always verify important facts with your teacher."

**Human Override**
Students can always override AI topic suggestions. No AI decision in EduPal is final or irreversible. Parent access is disclosed to the student so no one is surveilled without knowing it.

**Feedback Loop Before Shipping**
Every feedback card has a "Flag This Explanation" button. Students can report wrong or confusing AI answers. Reports are reviewed and acted on within 48 hours. The quality control loop exists before launch, not added after something goes wrong.

**Architectural Resilience**
EduPal's curated past-question bank is the foundation layer. If the Groq API goes down before WAEC season, students can still access thousands of real verified questions. The AI layer enhances the product but does not make it fragile.

**Displacement Responsibility**
EduPal automates some of what a private tutor does. The ethical question is not whether to build it, but whether to build it responsibly. The target student — the one who cannot afford a private tutor — is the one being served, not the one being displaced.

**The 5-Question Ethics Check (run before every major feature ships):**
1. Who benefits, and who could be harmed?
2. Can a human override the AI's decision?
3. Whose data trained this and was consent real?
4. Would I be comfortable if this were used on me, or on my parent?
5. What is my plan when this goes wrong?

**African Ethical Questions specific to EduPal:**
- Data Sovereignty: Student data disclosed; African-based hosting is a long-term goal
- Language Harm: Pidgin supported now; Yoruba, Hausa, Igbo on the roadmap
- Cultural Fit: Parent involvement is built in because that is how decisions are made in Nigerian families
- Dependency: The curated past-question bank means EduPal functions even without AI API access

## 21. Personal AI Manifesto

*Isaac Olamilekan Areo — EduPal AI*

I will build AI that helps Nigerian students stop guessing what to study and start knowing exactly where they are weak — so that every student, whether in a crowded classroom in Lagos or a rural school in Ekiti, has access to the kind of feedback that was once only available to those who could afford a private tutor.

I will not build AI that presents itself as more certain than it is. Every explanation EduPal AI generates will be honest about what it knows, clearly labeled as AI-generated, and paired with a way for students to flag when something feels wrong.

When the AI I build goes wrong — and it will — I will treat that as a signal, not a scandal. I will have a feedback loop in place before I ship, not after. Students will always be able to report a wrong explanation, and I will act on those reports.

When I have to choose between shipping faster and making sure a student is not being misled about an exam answer, I will choose the student. A student who fails WAEC because my app taught them something wrong is not a metric — that is a person who lost a year of their life. I will not move fast and break that.

The user I will never forget is the SS3 student in a noisy house, phone in hand, exam in two months, no money for extra lessons, trusting EduPal AI to tell them the truth.

## 22. Architectural Decision Notes

**Email (2026-09-27)**
Decision: ZeptoMail (Zoho) for production transactional email (parent welcome + magic link, Sunday digest, reminders). Why: cheap, good inbox delivery in Nigeria, simple SMTP/API, fits the parent-visibility flow in Module E. Local dev stays fully offline: Nodemailer + Mailpit on `localhost:8025` with identical code path; swap SMTP host to `smtp.zeptomail.com` + API key only in staging/prod via env vars. Status: approved. SendGrid/Resend deferred.

**Payments (2026-09-27)**
Decision: Paystack for production (cards, bank transfer, USSD — best Nigeria coverage). Local dev stays offline with mock checkout; Paystack test keys used in staging/pilot only. Status: approved. Flutterwave deferred as fallback.

**Database (2026-09-27)**
Switch: Prisma + SQLite → Node built-in SQLite (`node:sqlite`, `db/schema.sql`, `lib/db.ts`). Why: Prisma needs to download its engine from the internet on every fresh install, and the build network blocks that server (`binaries.prisma.sh` DNS fails on both dev machines). Node's built-in SQLite needs zero downloads — fully offline, which fits the 100%-local rule even better. Same tables, same file (`dev.db`). Seed runs with plain `node scripts/seed.mjs`. Consequence: no `npx prisma` commands in Phase 1. Prisma returns only at the hosted Postgres/Supabase stage where its engine downloads normally.

**Constraint reaffirmed:** Phase 0 through pilot runs 100% locally. ZeptoMail, Paystack, and Groq API keys are never required for `npm run dev`.

## 23. Out of Scope — Phase 1

- Real AI API calls (local template responses only)
- Real authentication (test user seed only)
- Parent dashboard (magic link flow arrives in Phase 3)
- Payment and monetization
- WhatsApp integration
- Production email (Mailpit only locally)
- Offline caching
- Production deployment
- Teacher/School accounts
- Social/community features
- Local language expansion beyond English and Pidgin
- Technical specifications for production infrastructure
