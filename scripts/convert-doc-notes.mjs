import fs from "node:fs";
import path from "node:path";

// Convert the RTF-based ".doc" lesson notes into plain Markdown so the
// curriculum loader (lib/class-notes.ts) can read them.
//
// The originals live in docs-originals/<CLASS>/ and are kept out of docs/ so
// the huge RTF files are never bundled into the Netlify function (Netlify caps
// a function at 250 MB). The readable text is written to docs/<CLASS>/ as a
// small ".md" file.
//
// Usage:
//   node scripts/convert-doc-notes.mjs            # skip files that already have .md
//   node scripts/convert-doc-notes.mjs --force    # overwrite existing .md files

const DOCS_DIR = path.join(process.cwd(), "docs");
const ORIGINALS_DIR = path.join(process.cwd(), "docs-originals");
const CLASSES = ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"];
const force = process.argv.includes("--force");

const DEST = new Set([
  "fonttbl", "colortbl", "stylesheet", "info", "pict", "header", "footer",
  "headerl", "headerr", "footerl", "footerr", "footnote", "annotation",
  "listtable", "listoverridetable", "rsidtbl", "generator", "themedata",
  "colorschememapping", "latentstyles", "datastore", "xmlnstbl", "filetbl",
  "revtbl", "pgptbl", "shppict", "nonshppict", "object", "objdata", "fldinst"
]);

function rtfToText(rtf) {
  let out = "";
  let i = 0;
  const n = rtf.length;
  const skipStack = [false];
  const ucStack = [1];
  let pendingSkip = 0;
  const cp1252 = new TextDecoder("windows-1252");

  while (i < n) {
    const ch = rtf[i];
    if (ch === "{") {
      const m = /^\{\\([a-zA-Z]+)/.exec(rtf.slice(i, i + 40));
      const dest = m?.[1];
      const starred = rtf.startsWith("{\\*", i);
      const skip = starred || (dest && DEST.has(dest));
      skipStack.push(skip || skipStack[skipStack.length - 1]);
      ucStack.push(ucStack[ucStack.length - 1]);
      i++;
      continue;
    }
    if (ch === "}") {
      if (skipStack.length > 1) skipStack.pop();
      if (ucStack.length > 1) ucStack.pop();
      i++;
      continue;
    }
    const skipping = skipStack[skipStack.length - 1];
    if (ch === "\\") {
      const rest = rtf.slice(i + 1, i + 40);
      const word = /^([a-zA-Z]+)(-?\d+)?[ ]?/.exec(rest);
      if (word) {
        const name = word[1];
        const arg = word[2];
        i += 1 + word[0].length;
        if (skipping) continue;
        if (name === "par" || name === "line") out += "\n";
        else if (name === "tab") out += "\t";
        else if (name === "u" && arg) {
          let code = parseInt(arg, 10);
          if (code < 0) code += 65536;
          out += String.fromCharCode(code);
          pendingSkip = ucStack[ucStack.length - 1];
        } else if (name === "uc" && arg) {
          ucStack[ucStack.length - 1] = parseInt(arg, 10);
        }
        continue;
      }
      const c = rtf[i + 1];
      if (c === "'") {
        const hex = rtf.slice(i + 2, i + 4);
        i += 4;
        if (!skipping && /^[0-9a-f]{2}$/i.test(hex)) {
          out += cp1252.decode(Buffer.from([parseInt(hex, 16)]));
        }
        continue;
      }
      if (c === "\\" || c === "{" || c === "}") { if (!skipping) out += c; i += 2; continue; }
      if (c === "~") { if (!skipping) out += " "; i += 2; continue; }
      i += 2;
      continue;
    }
    if (ch === "\r" || ch === "\n") { i++; continue; }
    if (pendingSkip > 0) { pendingSkip--; i++; continue; }
    if (!skipping) out += ch;
    i++;
  }

  return out
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

let converted = 0;
let skipped = 0;
let failed = 0;

for (const cls of CLASSES) {
  const outDir = path.join(DOCS_DIR, cls);
  const originalsDir = path.join(ORIGINALS_DIR, cls);
  const dir = fs.existsSync(originalsDir) ? originalsDir : outDir;
  if (!fs.existsSync(dir)) continue;
  fs.mkdirSync(outDir, { recursive: true });
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!/\.(doc|rtf)$/i.test(entry.name)) continue;

    const src = path.join(dir, entry.name);
    const outFile = path.join(outDir, entry.name.replace(/\.(doc|rtf)$/i, ".md"));
    if (!force && fs.existsSync(outFile)) {
      skipped++;
      continue;
    }

    try {
      const raw = fs.readFileSync(src, "utf8");
      if (!raw.startsWith("{\\rtf")) {
        console.warn(`SKIP (not RTF): ${path.relative(process.cwd(), src)}`);
        failed++;
        continue;
      }
      const text = rtfToText(raw);
      if (!text) {
        console.warn(`SKIP (no text): ${path.relative(process.cwd(), src)}`);
        failed++;
        continue;
      }
      fs.writeFileSync(outFile, text + "\n", "utf8");
      converted++;
      const markers = (text.match(/^(?:TOPIC|UNIT|CHAPTER|WEEK|MODULE|SECTION)\s*\d+/gim) ?? []).length;
      console.log(`OK  ${cls}/${entry.name} -> ${path.basename(outFile)} (${Math.round(text.length / 1024)} KB, ${markers} topic markers)`);
    } catch (e) {
      failed++;
      console.error(`ERR ${cls}/${entry.name}:`, e instanceof Error ? e.message : e);
    }
  }
}

console.log(`\nConverted: ${converted} | Skipped (already .md): ${skipped} | Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
