// SERVER-ONLY transactional email through Zoho CPaaS (ZeptoMail's API).
// Token lives in .env.local (gitignored) + Netlify env — never logged, never
// shipped to the browser. Every helper resolves (never throws, never rejects)
// so routes can fire-and-forget with `void sendX(...)`.

import type { Db } from "./db";
import { findPlan, defaultPlan } from "./plans";

const API = "https://cpaas.zoho.com/v1.1/email";
const TEAL = "#0F766E";
const LIVE_BASE = "https://edupal-ai-app.netlify.app";

export function mailConfigured(): boolean {
  return !!process.env.ZEPTOMAIL_TOKEN && !!process.env.ZEPTOMAIL_FROM;
}

// Same rule as checkout: .local/.test addresses have no inbox — skip them.
function deliverable(email: string): boolean {
  return (
    /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email) &&
    !/\.(local|test|localhost|invalid|example|internal)$/i.test(email)
  );
}

// Links in emails must land on the live app (request origin in dev/prod).
export function siteBase(origin?: string | null): string {
  return origin || process.env.NEXTAUTH_URL || LIVE_BASE;
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(full: string): string {
  return (full ?? "").trim().split(/\s+/)[0] || "there";
}

// "12 November 2026" in Lagos time.
function longDate(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return new Date(t).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos"
  });
}

// ---------------------------------------------------------------------------
// Low-level send (Zoho CPaaS email API)
// ---------------------------------------------------------------------------

type SendArgs = { to: string; toName?: string; subject: string; html: string };

export async function sendMail(args: SendArgs): Promise<boolean> {
  const token = process.env.ZEPTOMAIL_TOKEN;
  const from = process.env.ZEPTOMAIL_FROM || "noreply@edupal-ai.com";
  if (!token || !deliverable(args.to)) return false;
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        from: { address: from, name: "EduPal AI" },
        to: [{ email_address: { address: args.to, name: args.toName ?? "" } }],
        subject: args.subject,
        htmlbody: args.html
      })
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // Log status + provider message only — the token never appears here.
      console.error(`[mail] ${res.status} ${args.subject}: ${body.slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[mail] send failed:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

// ---------------------------------------------------------------------------
// Templates (plain-English, table-based so Gmail/Outlook/mobile render cleanly)
// ---------------------------------------------------------------------------

function button(label: string, href: string): string {
  return `<a href="${esc(href)}" style="display:inline-block;background:${TEAL};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;font-size:15px;">${esc(label)}</a>`;
}

function shell(title: string, bodyHtml: string, base: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:10px;border:1px solid #e2e8f0;">
<tr><td style="background:${TEAL};padding:18px 28px;"><span style="color:#ffffff;font-size:20px;font-weight:bold;">EduPal AI</span></td></tr>
<tr><td style="padding:28px;color:#1f2937;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
<tr><td style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
EduPal AI &middot; Practice that takes secondary school students to their best result<br>
<a href="${esc(base)}/privacy" style="color:#64748b;">Privacy</a> &nbsp;&middot;&nbsp; <a href="${esc(base)}/terms" style="color:#64748b;">Terms</a>
<br><br>You are receiving this because this email address is linked to an EduPal AI account.</td></tr>
</table>
</td></tr>
</table></body></html>`;
}

// ---------------------------------------------------------------------------
// The three product emails
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(opts: {
  userId: string;
  name: string;
  email: string;
  base: string;
}): Promise<boolean> {
  try {
    const base = siteBase(opts.base);
    const hi = esc(firstName(opts.name));
    const dash = `${base}/dashboard?userId=${opts.userId}`;
    const upgrade = `${base}/subscription?userId=${opts.userId}`;
    const html = shell(
      "Welcome",
      `<p>Hi ${hi}, welcome to EduPal AI! 🎉</p>
<p>Your account is ready. Every day you get <strong>10 free practice questions</strong> drawn from your WAEC / NECO / JAMB topics, and your weak ones are tracked so you always know what to revise next.</p>
<p>${button("Open my dashboard", dash)}</p>
<p style="margin-top:22px;color:#64748b;font-size:13px;">Want unlimited practice, past papers and the AI tutor? <a href="${esc(upgrade)}" style="color:${TEAL};">See the Unlimited plans</a> — from ₦4,000 once, no monthly charges.</p>`,
      base
    );
    return await sendMail({ to: opts.email, toName: opts.name, subject: "Welcome to EduPal AI", html });
  } catch (e) {
    console.error("[mail] welcome failed:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function sendReceiptEmail(opts: {
  name: string;
  email: string;
  planLabel: string;
  amountKobo: number;
  reference: string;
  paidUntil: string;
  base: string;
}): Promise<boolean> {
  try {
    const base = siteBase(opts.base);
    const naira = `₦${Math.round(Number(opts.amountKobo) / 100).toLocaleString("en-NG")}`;
    const until = longDate(opts.paidUntil);
    const hi = esc(firstName(opts.name));
    const html = shell(
      "Payment received",
      `<p>Hi ${hi},</p>
<p><strong>Payment received — thank you!</strong> Your EduPal AI plan is now Unlimited.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:14px 0;">
<tr><td style="padding:8px 0;border-bottom:1px solid #eef2f5;color:#64748b;">Plan</td><td style="padding:8px 0;border-bottom:1px solid #eef2f5;text-align:right;"><strong>${esc(opts.planLabel)} — Unlimited</strong></td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid #eef2f5;color:#64748b;">Amount paid</td><td style="padding:8px 0;border-bottom:1px solid #eef2f5;text-align:right;"><strong>${naira}</strong></td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid #eef2f5;color:#64748b;">Reference</td><td style="padding:8px 0;border-bottom:1px solid #eef2f5;text-align:right;font-family:monospace;font-size:13px;">${esc(opts.reference)}</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid #eef2f5;color:#64748b;">Access until</td><td style="padding:8px 0;border-bottom:1px solid #eef2f5;text-align:right;"><strong>${esc(until)}</strong></td></tr>
</table>
<p style="color:#64748b;font-size:13px;">This is a one-time payment — you will never be charged again automatically. When your time finishes you simply drop back to the free plan, and you can renew whenever you want.</p>`,
      base
    );
    return await sendMail({ to: opts.email, toName: opts.name, subject: "Payment received — your Unlimited plan is on", html });
  } catch (e) {
    console.error("[mail] receipt failed:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

// One call site for the receipt (callback, webhook and local mock all share it),
// so the "thank you" email behaves identically wherever the payment lands.
export async function sendReceiptFor(
  db: Db,
  opts: { userId: string; reference: string; planId: string; amountKobo: number; base: string }
): Promise<void> {
  try {
    const who = (await db
      .prepare("SELECT name, email FROM users WHERE id = ?")
      .get(opts.userId)) as { name: string | null; email: string | null } | undefined;
    const w = (await db
      .prepare('SELECT paid_until AS "paidUntil" FROM wallets WHERE user_id = ?')
      .get(opts.userId)) as { paidUntil: string | null } | undefined;
    await sendReceiptEmail({
      name: who?.name ?? "",
      email: who?.email ?? "",
      planLabel: (findPlan(opts.planId) ?? defaultPlan()).label,
      amountKobo: opts.amountKobo,
      reference: opts.reference,
      paidUntil: w?.paidUntil ?? "",
      base: siteBase(opts.base)
    });
  } catch (e) {
    console.error("[mail] receiptFor failed:", e instanceof Error ? e.message : String(e));
  }
}

export async function sendExpiryEmail(opts: {
  name: string;
  email: string;
  paidUntil: string;
  daysLeft: number;
  base: string;
}): Promise<boolean> {
  try {
    const base = siteBase(opts.base);
    const hi = esc(firstName(opts.name));
    const until = longDate(opts.paidUntil);
    const days = Math.max(1, Math.round(opts.daysLeft));
    const renew = `${base}/subscription`;
    const html = shell(
      "Access ending soon",
      `<p>Hi ${hi},</p>
<p>Your <strong>Unlimited access ends in ${days} day${days === 1 ? "" : "s"}</strong> — on <strong>${esc(until)}</strong>.</p>
<p>Renew now and you keep everything without a break: unlimited practice questions, past papers, the AI tutor and your weak-topic tracking.</p>
<p>${button("Renew now", renew)}</p>
<p style="margin-top:22px;color:#64748b;font-size:13px;">No rush — if you let it finish you simply drop back to the free plan (10 questions a day). Your account, streak and progress stay exactly as they are.</p>`,
      base
    );
    return await sendMail({ to: opts.email, toName: opts.name, subject: "Your EduPal AI Unlimited access ends soon", html });
  } catch (e) {
    console.error("[mail] expiry nudge failed:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

// Lazy expiry nudge (no cron): checked on every dashboard load. At most ONE
// email per expiry date — wallets.nudge_for_until remembers the paid_until it
// was sent for, so renewing sets a new window and never re-nudges early.
export async function maybeSendExpiryNudge(
  db: Db,
  opts: { userId: string; plan: string; paidUntil: string | null; base: string }
): Promise<void> {
  try {
    if (opts.plan !== "UNLIMITED" || !opts.paidUntil) return;
    const end = Date.parse(opts.paidUntil);
    if (!Number.isFinite(end)) return;
    const left = end - Date.now();
    if (left <= 0 || left > 3 * 86400000) return; // only within the last 3 days
    const row = (await db
      .prepare("SELECT nudge_for_until AS n FROM wallets WHERE user_id = ?")
      .get(opts.userId)) as { n: string | null } | undefined;
    if (row?.n === opts.paidUntil) return; // already nudged for this expiry
    const who = (await db
      .prepare("SELECT name, email FROM users WHERE id = ?")
      .get(opts.userId)) as { name: string | null; email: string | null } | undefined;
    const sent = await sendExpiryEmail({
      name: who?.name ?? "",
      email: who?.email ?? "",
      paidUntil: opts.paidUntil,
      daysLeft: left / 86400000,
      base: siteBase(opts.base)
    });
    // Mark only on success — a failed send retries on the next dashboard load.
    if (sent) {
      await db
        .prepare("UPDATE wallets SET nudge_for_until = ? WHERE user_id = ?")
        .run(opts.paidUntil, opts.userId);
    }
  } catch (e) {
    console.error("[mail] nudge check failed:", e instanceof Error ? e.message : String(e));
  }
}
