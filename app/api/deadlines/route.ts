import { NextResponse } from "next/server";
import { getDb, uid, type Db } from "@/lib/db";
import { DEADLINES } from "@/lib/deadlines-seed.mjs";

async function ensureSeeded(db: Db): Promise<void> {
  const n = ((await db.prepare("SELECT COUNT(*) AS n FROM deadlines").get()) as { n: number }).n;
  if (n > 0) return;
  const insert = await db.prepare(
    "INSERT INTO deadlines (id, kind, title, detail, source_url, opens_on, closes_on) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const d of DEADLINES as { kind: string; title: string; detail: string; source_url: string | null; opens_on: string | null; closes_on: string | null }[]) {
    await insert.run(uid(), d.kind, d.title, d.detail, d.source_url, d.opens_on, d.closes_on);
  }
}

// Curated board: upcoming first, then TBC, then past.
export async function GET() {
  const db = await getDb();
  await ensureSeeded(db);
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .prepare('SELECT id, kind, title, detail, source_url AS "sourceUrl", opens_on AS "opensOn", closes_on AS "closesOn" FROM deadlines')
    .all() as { id: string; kind: string; title: string; detail: string; sourceUrl: string | null; opensOn: string | null; closesOn: string | null }[];
  const upcoming = rows
    .filter((r) => r.closesOn && r.closesOn >= today)
    .sort((a, b) => String(a.closesOn).localeCompare(String(b.closesOn)))[0] ?? null;
  const dated = rows.filter((r) => r.closesOn).sort((a, b) => String(b.closesOn).localeCompare(String(a.closesOn)));
  const tbc = rows.filter((r) => !r.closesOn);
  return NextResponse.json({ upcoming, dated, tbc });
}

// Owner adds a newly announced window (admin page form).
export async function POST(req: Request) {
  const { kind, title, detail, sourceUrl, opensOn, closesOn } = await req.json();
  if (!kind || !title) return NextResponse.json({ error: "kind + title required" }, { status: 400 });
  if (!["exam", "scholarship", "admission"].includes(kind)) return NextResponse.json({ error: "bad kind" }, { status: 400 });
  const db = await getDb();
  await ensureSeeded(db);
  const id = uid();
  await db.prepare("INSERT INTO deadlines (id, kind, title, detail, source_url, opens_on, closes_on) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    id, kind, title, detail ?? "", sourceUrl ?? null, opensOn ?? null, closesOn ?? null
  );
  return NextResponse.json({ ok: true, id });
}
