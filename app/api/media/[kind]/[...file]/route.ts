import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4"
};

// Serves local ./storage/<kind>/<file>. Prod swap: S3/Supabase client.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kind: string; file: string[] }> }
) {
  const { kind, file: fileParts } = await params;
  if (kind !== "docx" && kind !== "picx" && kind !== "vidx") {
    return NextResponse.json({ error: "unknown library" }, { status: 404 });
  }
  const file = path.basename(fileParts.join("/"));
  const full = path.join(process.cwd(), "storage", kind, file);
  if (!fs.existsSync(full)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const ext = path.extname(full).toLowerCase();
  const buf = fs.readFileSync(full);
  return new NextResponse(buf, {
    headers: { "Content-Type": MIME[ext] ?? "application/octet-stream" }
  });
}
