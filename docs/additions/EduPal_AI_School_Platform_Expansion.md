# EduPal AI — SCHOOL PLATFORM EXPANSION
Institutional learning platform • Brainstorming & product structure

A role-based school experience connected to EduPal AI’s existing individual learning platform.


## 1. EduPal AI School Platform


### Core idea

Expand EduPal AI from a student-focused learning application into a school-centered learning platform. The school model should sit alongside the existing individual-learning model, not replace it.


### Three main user groups

SCHOOL ADMINISTRATORS — manage the institution, people, academic structure, permissions, approvals, subscriptions, and reports.

TEACHERS — create and upload learning materials, build question banks and assessments, assign work, and monitor learners.

STUDENTS — access school-approved materials, assignments, assessments, feedback, and the EduPal AI learning assistant.


### Design structure

```text
┌──────────────────────────────────────────────┐
│                 EDUPAL AI                   │
├──────────────────┬───────────────────────────┤
│ INDIVIDUAL       │ SCHOOL PLATFORM           │
│ LEARNING         │ Admins • Teachers         │
│ Personal study   │ Students • School content │
│ Practice         │ Approvals • Reports       │
└──────────────────┴───────────────────────────┘
```

### Product principle

One connected platform, with different experiences based on each user's role and permissions.


## 2. School Subscription vs. Individual Learning


### Two ways to access EduPal AI

INDIVIDUAL LEARNING — a student accesses EduPal AI independently through the existing individual plan.

SCHOOL SUBSCRIPTION — a school subscribes, configures its academic environment, and gives eligible students and staff access through the institution.


### What the school subscription should cover

- Student seats and staff access
- Classes, departments, subjects, and academic terms
- School learning resources and assessments
- Teacher permissions and approval workflows
- School announcements and academic activity
- Reports and subscription-capacity management

### Suggested subscription logic

Use a capacity-based model: a school selects a plan for a defined number of student accounts. The school can upgrade its capacity as enrollment grows. Consider annual and term-based billing options, depending on how schools budget.


### Keep individual learning intact

A school subscription should not erase or block the existing student experience. Where practical, students who already have EduPal accounts should be able to link those accounts to their school.


## 3. School Structure and Academic Hierarchy


### Suggested school structure

```text
School → Academic session/term → Department or section → Class → Subject → Teacher and students.
```

### Example

Faith Academy → 2026/2027 session → Senior Secondary → SS2 → Chemistry → Assigned teacher and enrolled students.


### Flexible configuration

Schools should be able to name and organize academic units to match their own structure. Some use departments; others may use arms, streams, houses, or year groups.


### Why this matters

A clear hierarchy helps EduPal AI deliver the correct notes, questions, assignments, announcements, and reports to the correct class and subject.


## 4. Roles, Permissions, and Approval


### Suggested roles

School Owner / Subscription Admin • Principal • Vice Principal (Academics) • HOD • Teacher • Student


### Role-based permissions

Permissions determine who can create, upload, review, approve, publish, edit, archive, manage accounts, manage billing, and view reports. Schools should assign permissions according to their governance structure.


### Example approval route

Teacher submits a resource → HOD checks subject relevance and accuracy → Vice Principal (Academics) or designated approver approves → resource is published to students.


### Important design rule

The approval route should be configurable. Not every school uses the same hierarchy, and smaller schools may need a simpler process.


## 5. School Portal — Role-Based Sidebar


### Suggested navigation

Dashboard

Reports & Analytics

Students

Teachers & Staff

Classes & Departments

Learning Resources

Questions & Assessments

Assignments

Approval Center

Announcements

Billing & Subscription

Settings


### Role-aware navigation

The sidebar adapts to the signed-in user's role. Students should not see billing or staff-management tools. Teachers should see their classes and academic workspace. Administrators should see school-management functions.


### Sidebar wireframe

```text
┌ SCHOOL PORTAL ─────────────────┐
│ Dashboard                      │
│ Reports & Analytics            │
│ Students                       │
│ Teachers & Staff               │
│ Classes & Departments          │
│ Learning Resources             │
│ Questions & Assessments        │
│ Assignments                    │
│ Approval Center                │
│ Announcements                  │
│ Billing & Subscription         │
│ Settings                       │
└────────────────────────────────┘
```

### Visual identity

Use the EduPal AI wordmark and the tagline “Your Personal Exam Coach” in the expanded sidebar. Hide both the wordmark and tagline when the sidebar is collapsed, leaving the compact app icon.


## 6. Teacher Workspace


### Teacher tools

- Upload notes, PDFs, slides, and other learning materials
- Add subject, class, topic, term, and resource description
- Submit materials for review and approval
- Create and manage a subject-specific question bank
- Build assignments and assessments
- Import questions in bulk using a spreadsheet template
- View submissions, results, and class progress

### Resource workflow

```text
DRAFT → SUBMITTED → UNDER REVIEW → APPROVED → PUBLISHED
```

### Teacher workspace wireframe

```text
┌ TEACHER WORKSPACE ──────────────┐
│ My Classes                      │
│ Upload Resource                 │
│ My Question Bank                │
│ Create Assignment               │
│ Assessments                     │
│ Submissions & Results           │
│ Class Progress                  │
└─────────────────────────────────┘
```

### Teacher experience

Teachers should be able to upload a resource, choose the class and subject, add topic details, preview the material, and submit it for approval without navigating through too many screens.


## 7. Student School Experience


### Student home

Students sign in through a school-linked account and see their class, subjects, teacher-published materials, assignments, assessments, announcements, and AI tutor.


### Three learning areas

SCHOOL RESOURCES — approved materials uploaded by the school.

EDUPAL RESOURCES — platform-wide learning content.

MY LEARNING — personal practice, saved topics, learning history, and individual progress.


### Student journey

```text
School account → Class / Subject → Learning material → Practice or assignment → Feedback → Progress.
```

### Design principle

Keep the existing individual student experience. Add the school layer without making students lose their personal learning history, saved resources, or existing tools.


## 8. School AI Learning Assistant


### Purpose

Help students understand approved school materials, revise topics, practise questions, and get explanations suited to their level.


### Grounding and source clarity

Where the assistant answers using school-uploaded content, identify that content as a source when possible. If an answer comes from general EduPal content or general AI knowledge, make that distinction clear.


### School controls

Give administrators control over whether school-approved resources are prioritized, which subjects are enabled, and whether certain AI-generated resources require staff review before being shared widely.


### Safety and reliability

The assistant should support learning rather than replace teachers. It should acknowledge uncertainty, encourage students to consult teachers when appropriate, and avoid presenting unverified answers as official school policy.


## 9. Principal / School Dashboard


### Dashboard overview

Enrollment • Active teachers • Published resources • Assignments completed • Student engagement • Teacher activity • Academic performance • Pending approvals • Subject coverage • Subscription usage.


### Illustrative dashboard layout

```text
┌ SCHOOL OVERVIEW ──────────────────┐
│ Students          Active Teachers │
│ Resources         Assignments     │
├───────────────────────────────────┤
│ Engagement & Activity             │
│ Performance Overview              │
│ Subject Coverage                  │
│ Pending Approvals                 │
│ Subscription Capacity             │
└───────────────────────────────────┘
```

### Useful reporting views

- Student engagement by class and subject
- Teacher resource and assignment activity
- Content coverage across subjects
- Completion and assessment trends
- Pending approvals and workflow delays
- Current seat usage and subscription capacity

### Reporting caution

Separate platform usage from learning outcomes. Logins, resource views, and assignment completion are engagement indicators; they are not, by themselves, proof of improved academic performance.


## 10. School Onboarding


### Suggested setup sequence

1. School registers and submits institutional details.

2. The institution is verified and the subscription is activated.

3. The owner or designated administrator configures the school profile.

4. Classes, departments, subjects, and academic terms are created.

5. Teachers are invited or imported.

6. Students are imported, invited, or linked to existing EduPal accounts.

7. Roles and approval routes are assigned.

8. Teachers upload and publish approved resources.

9. Students sign in and begin learning.


### Account linking

Avoid duplicate student accounts. Where possible, let students link an existing EduPal account to their school using a secure invitation, school-issued code, or administrator-approved process.


### First-use support

Provide setup guidance, import templates, role descriptions, and a checklist so administrators can complete onboarding without needing technical support for every step.


## 11. Subscription and Pricing Options


### Potential pricing models

PER STUDENT — price based on the number of student accounts.

SCHOOL ANNUAL PLAN — one annual institutional subscription with a defined capacity.

TERM-BASED PLAN — a subscription aligned with a school's academic term.

CAPACITY TIERS — schools select a student-seat range and upgrade when needed.


### What to include

Consider including teacher and administrator accounts within the institutional plan, while defining student capacity clearly. Specify what happens when the school reaches its seat limit and how upgrades are handled.


### Recommendation

Start with a simple, easy-to-explain school subscription based on student capacity. Validate willingness to pay with schools before introducing too many tiers.


### Commercial clarity

Pricing should explain the billing period, included seats, renewal terms, support level, and whether taxes or setup fees apply. Avoid promising features that are not yet available.


## 12. Existing App Architecture and Account Experience


### Recommended approach

Build the school platform as an institutional layer on top of the existing EduPal AI learning foundation. Avoid creating two disconnected products that duplicate accounts, content, or learning history.


### Shared capabilities

Identity and authentication • Learning resources • Question and assessment engine • AI tutoring • Progress tracking • Notifications • Subscription and entitlement checks.


### Separate by permissions

Individual users, school administrators, teachers, and students can use shared services while receiving different permissions and views. A user's role and school membership should determine what they can access.


### Account experience

At sign-in, route users to the correct experience based on their role and memberships. If a user is both a teacher and an individual learner, provide a clear way to switch contexts without confusing school activity with personal activity.


## 13. Roadmap — Institutional Expansion


### Phase 1: Institutional foundation

School registration, verification, subscription, school profile, roles, classes, departments, and student/staff management.


### Phase 2: Academic content management

Teacher workspace, resource upload, metadata, review and approval center, publishing, and resource organization.


### Phase 3: Teaching and assessment

Question bank, assignments, assessments, bulk question import, submissions, marking, and teacher feedback.


### Phase 4: School intelligence

School dashboards, engagement reports, subject coverage, teacher activity, performance trends, and configurable reporting.


### Future extensions

Parent portal, school-wide communication enhancements, and deeper integrations can follow after the core institutional workflow is stable.


## 14. Parent Portal — Future Extension


### Potential purpose

Give parents or guardians a limited, appropriate view of a student's learning activity and school communication.


### Possible features

- Announcements and school updates
- Assignment and assessment summaries
- Learning activity and progress snapshots
- Important dates and reminders
- Teacher or school communication, if enabled

### Access boundaries

Parents should only see information for the student or students they are authorized to access. The school should control what is shared and how communication is managed.


### Priority

Treat the parent portal as a future extension rather than a launch dependency. First stabilize the school, teacher, and student workflows.


## 15. Approval Center


### Purpose

Create one central place where authorized staff can review pending resources, questions, assessments, and other school content.


### Possible queue categories

Pending learning resources • Pending questions • Pending assessments • Returned for revision • Approved and scheduled • Recently published.


### Approval actions

Approve • Reject with reason • Request edits • Reassign reviewer • View version history • Preview before publishing.


### Audit trail

Record who submitted, reviewed, approved, edited, and published each item, including timestamps and comments. This helps schools maintain accountability and resolve disputes.


### Workflow principle

```text
Teachers should be able to see the status of their submissions and understand exactly what action is required next.
```

## 16. Proposed Final Platform Structure


### Platform layers

INDIVIDUAL LEARNING — personal study, practice, saved resources, and progress.

SCHOOL PORTAL — institution administration, users, classes, resources, and reports.

ACADEMIC WORKSPACE — teacher content creation, assignments, questions, and assessments.

SCHOOL AI — AI learning support grounded in approved school materials.

REPORTS — engagement, activity, coverage, and performance views.

PARENT PORTAL — future extension for parent/guardian visibility.


### Architecture sketch

```text
┌────────────────────────────────────────────────┐
│                    EDUPAL AI                   │
├──────────────────────┬─────────────────────────┤
│ INDIVIDUAL LEARNING  │ SCHOOL PLATFORM          │
│ Personal study       │ ┌ Admin Portal ───────┐ │
│ Practice             │ ├ Teacher Workspace ──┤ │
│ Saved resources      │ ├ Student Experience ─┤ │
│ Progress             │ ├ School AI ──────────┤ │
│                      │ └ Reports ────────────┘ │
├──────────────────────┴─────────────────────────┤
│ Shared learning engine, identity, content,      │
│ notifications, and role-based permissions       │
└────────────────────────────────────────────────┘
```

### Structural principle

Keep core learning services shared where possible, while separating school-specific data, permissions, billing, and administrative workflows.


## 17. Strategic Direction


### The bigger opportunity

EduPal AI should not become only a school dashboard or only a student tutor. It can become a connected learning platform serving individual learners and institutions.


### First institutional priorities

1. School registration and subscription

2. Administrator portal

3. Teacher workspace

4. Approval center

5. Student school experience


### Guiding principle

Build the institutional layer around the learning experience—not as a separate product that fragments it. Schools should gain control and visibility while students continue to receive a simple, supportive learning experience.


## 18. Final Recommendation


### Start with a focused school pilot

Work with one interested school to validate the institutional model, user roles, teacher resource workflow, student access, and administrative reporting before scaling to many schools.


### Build the minimum useful institutional release

Prioritize school setup, administrator controls, teacher uploads, content approval, student access to school materials, and a small set of reliable reports. Add advanced analytics and parent access later.


### Measure the right things

Track onboarding completion, active teachers, student participation, resource approval time, assignment completion, and school renewal interest. Use feedback from administrators, teachers, and students to guide iteration.


### Closing thought

The opportunity is to evolve EduPal AI from an excellent personal exam coach into a connected learning partner for both students and the schools that support them.
