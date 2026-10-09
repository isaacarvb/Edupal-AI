import type { Db } from "./db";

export type Pattern = { text: string; detail: string };

const STOP = new Set(
  "the,a,an,i,me,my,and,or,of,to,in,is,are,was,were,be,been,for,on,with,as,by,at,from,it,its,this,that,these,those,you,your,we,our,they,their,he,she,his,her,not,no,so,if,then,than,too,very,can,will,just,into,over,after,before,what,which,when,find,solve,choose,following".split(",")
);

function keywords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !STOP.has(w));
}

// Behavioral patterns from wrong answers — beyond topic labels.
export async function findPatterns(db: Db, userId: string): Promise<Pattern[]> {
  const out: Pattern[] = [];
  const wrong = await db
    .prepare(
      `SELECT a.question_id AS qid, a.response AS resp, q.stem AS stem, q.topic AS topic,
              q.subject AS subject, q.type AS type, q.options_json AS optionsJson, a.theory_score AS theory
       FROM attempts a JOIN questions q ON q.id = a.question_id
       WHERE a.user_id = ? AND a.correct = 0`
    )
    .all(userId) as {
    qid: string; resp: string; stem: string; topic: string;
    subject: string; type: string; optionsJson: string; theory: number | null;
  }[];
  if (wrong.length < 2) return out;

  // 1. Repeat offenders: same question wrong 2+ times.
  const byQ = new Map<string, { n: number; stem: string; topic: string; subject: string }>();
  for (const w of wrong) {
    const e = byQ.get(w.qid) ?? { n: 0, stem: w.stem, topic: w.topic, subject: w.subject };
    e.n += 1;
    byQ.set(w.qid, e);
  }
  for (const e of byQ.values()) {
    if (e.n >= 2) {
      out.push({
        text: `You keep missing "${e.stem.slice(0, 60)}${e.stem.length > 60 ? "…" : ""}" — let's drill exactly that.`,
        detail: `${e.n} wrong attempts • ${e.subject} • ${e.topic}`
      });
    }
  }

  // 2. First-option bias on wrong MCQs.
  const mcq = wrong.filter((w) => w.type === "MCQ");
  if (mcq.length >= 3) {
    let first = 0;
    for (const w of mcq) {
      try {
        const opts: string[] = JSON.parse(w.optionsJson);
        if (opts[0] !== undefined && w.resp.trim().toLowerCase() === String(opts[0]).trim().toLowerCase()) first += 1;
      } catch { /* ignore malformed bank rows */ }
    }
    if (first / mcq.length >= 0.6) {
      out.push({
        text: "When unsure, you grab the first option — slow down and eliminate one choice first.",
        detail: `${first} of your last ${mcq.length} misses picked option A`
      });
    }
  }

  // 3. Keyword clusters in wrong stems.
  const freq = new Map<string, number>();
  for (const w of wrong) {
    for (const k of new Set(keywords(w.stem))) freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  const topics = new Set(wrong.map((w) => w.topic.toLowerCase()));
  const cluster = [...freq.entries()]
    .filter(([k, n]) => n >= 2 && ![...topics].some((t) => t.includes(k) || k.includes(t.split(" ")[0])))
    .sort((a, b) => b[1] - a[1])[0];
  if (cluster) {
    out.push({
      text: `Questions mentioning "${cluster[0]}" trip you up — let's drill specifically that.`,
      detail: `${cluster[1]} wrong answers share the word`
    });
  }

  // 4. Theory gap.
  const theory = wrong.filter((w) => w.type === "THEORY" && w.theory !== null);
  if (theory.length >= 2) {
    const avg = theory.reduce((s, w) => s + (w.theory ?? 0), 0) / theory.length;
    if (avg < 6) {
      out.push({
        text: "Written answers score low — answer against the checklist, one key point per mark.",
        detail: `Theory average ${avg.toFixed(1)}/10 over ${theory.length} essays`
      });
    }
  }

  return out.slice(0, 3);
}
