import fs from "node:fs";
import path from "node:path";

// Local-first storage. Prod swap: replace internals with S3/Supabase client.
const ROOT = path.join(process.cwd(), "storage");

export function mediaDir(kind: "docx" | "picx" | "vidx") {
  const dir = path.join(ROOT, kind);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function saveMedia(kind: "docx" | "picx" | "vidx", name: string, bytes: Buffer) {
  const safe = path.basename(name);
  fs.writeFileSync(path.join(mediaDir(kind), safe), bytes);
  return `/api/media/${kind}/${encodeURIComponent(safe)}`;
}
