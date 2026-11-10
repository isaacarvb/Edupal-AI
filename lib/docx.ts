import { inflateRawSync } from "node:zlib";

// Minimal, dependency-free .docx text extractor.
//
// A .docx file is a ZIP archive containing word/document.xml. We read the ZIP
// central directory ourselves (no external package), inflate that one entry,
// then turn the WordprocessingML into readable plain text with paragraph
// breaks, tabs and table cells. This is intentionally small: it is only used
// to import the study-note documents the school admin drops into docs/<class>/.

type ZipEntry = {
  name: string;
  method: number;
  compressedSize: number;
  localOffset: number;
};

function readZipEntries(buf: Buffer): ZipEntry[] {
  // End Of Central Directory record: scan back over the optional comment.
  let eocd = -1;
  const min = Math.max(0, buf.length - 0xffff - 22);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error("Not a valid .docx file (ZIP directory missing).");

  const total = buf.readUInt16LE(eocd + 10);
  let offset = buf.readUInt32LE(eocd + 16);
  const entries: ZipEntry[] = [];

  for (let i = 0; i < total; i++) {
    if (offset + 46 > buf.length || buf.readUInt32LE(offset) !== 0x02014b50) break;
    const method = buf.readUInt16LE(offset + 10);
    const compressedSize = buf.readUInt32LE(offset + 20);
    const nameLen = buf.readUInt16LE(offset + 28);
    const extraLen = buf.readUInt16LE(offset + 30);
    const commentLen = buf.readUInt16LE(offset + 32);
    const localOffset = buf.readUInt32LE(offset + 42);
    const name = buf.toString("utf8", offset + 46, offset + 46 + nameLen).replace(/\\/g, "/");
    entries.push({ name, method, compressedSize, localOffset });
    offset += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
}

function readEntry(buf: Buffer, entry: ZipEntry): Buffer {
  const local = entry.localOffset;
  if (local + 30 > buf.length || buf.readUInt32LE(local) !== 0x04034b50) {
    throw new Error("Corrupt .docx entry.");
  }
  const nameLen = buf.readUInt16LE(local + 26);
  const extraLen = buf.readUInt16LE(local + 28);
  const start = local + 30 + nameLen + extraLen;
  const data = buf.subarray(start, start + entry.compressedSize);

  if (entry.method === 0) return data;
  if (entry.method === 8) return inflateRawSync(data);
  throw new Error(`Unsupported .docx compression method ${entry.method}.`);
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function documentXmlToText(xml: string): string {
  // Turn Word heading styles and numbered/bulleted lists into simple Markdown
  // markers, so the topic splitter and the notes renderer both understand them.
  xml = xml.replace(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g, (_m, inner: string) => {
    const style = /<w:pStyle[^>]*w:val="([^"]+)"/.exec(inner)?.[1] ?? "";
    let prefix = "";
    if (/^title$/i.test(style)) prefix = "# ";
    else if (/^heading\s*[12]$/i.test(style)) prefix = "## ";
    else if (/^heading\s*3$/i.test(style)) prefix = "### ";
    if (/<w:numPr\b/.test(inner)) prefix = "- " + prefix;
    return `<w:p>${prefix ? `<w:t>${prefix}</w:t>` : ""}${inner}</w:p>`;
  });

  // Table cells and rows should stay readable as plain text.
  let out = xml
    .replace(/<w:tab\b[^>]*\/>/g, "\t")
    .replace(/<w:br\b[^>]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<\/w:tc>/g, " | ")
    .replace(/<\/w:tr>/g, "\n")
    .replace(/<w:t\b[^>]*>/g, "")
    .replace(/<\/w:t>/g, "");

  // Drop every remaining tag.
  out = out.replace(/<[^>]+>/g, "");
  out = decodeXmlEntities(out);

  return out
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Extract readable plain text from a .docx buffer. */
export function extractDocxText(buf: Buffer): string {
  const entries = readZipEntries(buf);
  const doc = entries.find((e) => e.name === "word/document.xml");
  if (!doc) throw new Error("Not a Word document (.docx): word/document.xml missing.");
  return documentXmlToText(readEntry(buf, doc).toString("utf8"));
}
