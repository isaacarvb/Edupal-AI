**EduPal AI — Product Requirements Document (PRD v1.0) original**  
**1\. Product Summary & Innovation Statement**  
EduPal AI is an AI-powered exam preparation tutor for Nigerian students preparing for WAEC and JAMB. Rather than reinventing content delivery, EduPal AI applies generative AI to personalize practice, provide instant explanation breakdowns, evaluate essay responses, and offer visibility to parents without checkout friction.  

**2\. Targeted User Personas**  
To avoid building for a generic user, EduPal AI focuses on specific real-world profiles:  

* Primary Persona (Student — "Amina"): A 16-year-old SS3 student in Lagos preparing for JAMB and WAEC. She struggles with identifying specific weak topics in Mathematics and English, has limited access to private tutors, and shares a mobile device during evening study hours.    
* Secondary Persona (Parent — "Mr. Okafor"): Busy parent of an SS3 student. Wants to ensure their child is actually studying rather than playing games, but lacks time to review syllabus topics daily or approve every digital transaction in real-time.    
* Platform Admin: Internal operator leveraging integrated backend analytics and broadcast communication tools.  

**3\. How Might We (HMW) Framing**

* HMW help students immediately identify their weakest exam topics without forcing them to complete full-length mock exams first?    
* HMW provide meaningful theory/essay feedback in a way that aligns with WAEC/JAMB marking schemes?    
* HMW give parents progress transparency without creating friction at the payment stage?  

**4\. Comprehensive Feature Modules**  
Module A: Onboarding & Diagnostic Setup

* Target Selection: Level selection (Secondary or University), target exam, exam date, and subject selection.    
* Diagnostic Mini-Test: Optional 5–10 question baseline test per selected subject upon signup to seed initial topic strengths and weaknesses.    
* Language Mode Selection: Ability to switch between Simple English and Pidgin.  

Module B: Question Engine & AI Feedback

* Hybrid Question Sources: Curated real past questions for English and Mathematics, AI-generated questions for other subjects, and predicted "likely to repeat" topics.    
* Objective (Multiple-Choice) Questions: Instant post-answer explanations.    
* Theory / Essay Questions:  
- Checklist of key points hit vs. missed against official marking schemes.  
- Score estimation (e.g., 6/10) with a model answer comparison.    
- Actionable "How to Improve" tips tailored to examiner expectations.    
* Adaptive AI Persona: Navigation menus remain in standard English while AI explanations and nudges adapt to the selected language (Simple English or Pidgin study buddy tone).  


Module C: Weak-Topic Tracking & Smart Recommendations

* Topic Classification: Visual tags (Weak, Needs Work, Strong) and accuracy percentages per topic.    
* Automatic Level-Up: Topics automatically upgrade status after consistent high-accuracy performance across consecutive sessions.    
* Smart Study Suggestions: Prominent dashboard recommendation highlighting the most urgent weak topic, with student override flexibility.    
* Retention Refreshes: Periodic mini-quizzes on "Strong" topics to prevent skill decay prior to exam dates.

Module D: Habit Formation & Exam Countdown

* Exam Countdown: Dynamic countdown based on student-entered exam date.    
* Streak & Reminders: Daily study reminders and streak counter via in-app notifications and email.    
* Streak Freeze: Monthly single-use streak saver to maintain motivation after missed study days.  
* Milestone Nudges: Supportive tone shifts as key countdown milestones (e.g., 30 days, 7 days) approach.  

Module E: Freemium Monetization & Parent Visibility

* Credit System: Free daily question credits (1 credit for Objective, 3 credits for Theory) resetting every 24 hours.    
* Seamless Payment Flow:  
- When credits exhaust, students are prompted to purchase an unlimited subscription.    
- Secondary students supply parent contact details during checkout.    
- Payment completes immediately without blocking student access for real-time parent verification.    
* Parent Progress Tracking:  
- Automatic welcome email sent to parents upon subscription with login credentials and a one-click magic login link.    
- View-only parent dashboard tracking student streaks, weak topics, and practice consistency.    
- Automated weekly progress summary email sent to parents every Sunday evening.  

**5\. User Journey Flow**

\[Sign Up\]   
   │  
   ▼  
\[Select Exam, Date, Subjects & Language\]  
   │  
   ▼  
\[Diagnostic Test / Skip\] ──► \[Initial Weak/Strong Baseline\]  
   │  
   ▼  
\[Daily Practice Sessions\] (Free Credits: Objective & Theory)  
   │  
   ├─► \[Instant AI Feedback & Step-by-Step Explanations\]  
   └─► \[Topic Status Updates & AI Next-Topic Suggestions\]  
   │  
\[Daily Credits Exhausted\]  
   │  
   ▼  
\[Upgrade Prompt\] ──► (If Secondary: Input Parent Contact)  
   │  
   ▼  
\[Direct Payment Processed\]  
   │  
   ├─► \[Student: Unlimited Access Unlocked\]  
   └─► \[Parent: Welcome Email \+ Magic Link \+ Weekly Email Digest\]

**6\. Prototyping & Feedback Validation Checkpoints**  
In alignment with rapid design sprint practices (testing early rather than polishing indefinitely):  

* Cohort Testing: Run a 5-day pilot with 20 WAEC/JAMB secondary students using a rough working version.    
* Key Feedback Metrics:  
- Explanation Clarity Rate: Do students understand the AI's explanation on the first read?    
- Parent Open Rate: Do parents click through the Sunday weekly digest link?    
- Conversion Drop-off: Does requesting parent contact details at checkout reduce payment conversion?    
* Iteration Loop: Use qualitative student and parent feedback from the pilot to refine prompt instructions and UI elements before expanding the rollout.  

**7\. Fast-Follow Roadmap**

* WhatsApp Integration: Transition OTP, daily reminders, and parent progress digests to WhatsApp following Meta Business verification.    
* Curated Past Question Expansion: Expand human-verified past question banks across all secondary and tertiary entrance subjects.

**8\. AI Guardrails & Prompt Governance**

* Syllabus & Marking Scheme Strictness: The AI must evaluate objective and theory responses strictly against WAEC/JAMB syllabus definitions and marking rubrics.  
* Anti-Hallucination Measures: For subjects using AI-generated questions (outside English and Mathematics), questions must be pre-screened or generated against validated reference topic templates.  
* Off-Topic & Safety Boundaries: If a student asks questions unrelated to their selected subjects or exam prep, the AI gracefully redirects them back to study mode.  
* Tone Consistency: The AI persona must maintain a supportive, encouraging "study buddy" tone without outputting overly complex technical jargon.

**9\. Initial Subject Scope (Day 1 Launch)**

* Core Compulsory: English Language, Mathematics  
* Sciences: Physics, Chemistry, Biology  
* Commercial / Arts: Commerce, Economics, Government, Literature-in-English

**10\. Pilot Cohort & Pilot Recruitment Strategy**

* Target Pilot Size: 20 to 30 active SS3 / JAMB students.  
* Recruitment Channel: Direct outreach through local tutorial centers and secondary school study groups in Lagos.  
* 5-Day Pilot Sprint Structure:  
- Day 1: Onboarding & Diagnostic test setup.  
- Days 2–4: Daily 15-minute practice sessions (Objective \+ Theory).  
- Day 5: Feedback survey evaluating explanation clarity, app usability, and parent dashboard satisfaction.  
* Key Validation Gate: Achieve a \>70% daily active retention rate across the 5-day pilot before initiating full marketing efforts.

