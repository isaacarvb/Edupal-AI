// Small, dependency-free CSV helper shared by the school roster imports.
// Handles quoted fields (commas + line breaks inside quotes), escaped quotes
// (""), CRLF / LF / bare-CR line endings, and a leading UTF-8 BOM.

export type CsvRow = string[];

/** Parse CSV text into rows of raw string cells. Empty trailing rows are dropped. */
export function parseCsv(text: string): CsvRow[] {
  const src = String(text ?? "").replace(/^\uFEFF/, "");
  const rows: CsvRow[] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushRow = () => {
    row.push(field);
    // Ignore completely blank lines.
    if (row.some((c) => c.trim() !== "")) rows.push(row);
    row = [];
    field = "";
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      pushRow();
    } else if (ch === "\r") {
      // CRLF: let the following \n finish the row. Bare CR: finish now.
      if (src[i + 1] !== "\n") pushRow();
    } else {
      field += ch;
    }
  }

  if (field !== "" || row.length > 0) pushRow();
  return rows;
}

/** Normalise a header cell for matching: trim, lowercase, collapse spaces. */
export function headerKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/[\s_]+/g, " ")
    .replace(/\s*\.\s*/g, "")
    .trim();
}

/** Find a column by any of its accepted header names. */
export function findColumn(headers: string[], aliases: string[]): number {
  const keys = headers.map(headerKey);
  for (const alias of aliases) {
    const idx = keys.indexOf(headerKey(alias));
    if (idx !== -1) return idx;
  }
  return -1;
}

/**
 * Normalise a Nigerian class label: "JSS 1" / "jss1" -> "JSS1",
 * "SS2A" / "sss 2 a" -> "SSS2A". Unknown labels are trimmed but left alone.
 */
export function normalizeClass(raw: string): string {
  const original = String(raw ?? "").trim().replace(/\s+/g, " ");
  const compact = original.toUpperCase().replace(/\s+/g, "");
  const m = compact.match(/^(JSS|SSS|SS)([1-3])([A-Z]?)$/);
  if (!m) return original;
  const prefix = m[1] === "SS" ? "SSS" : m[1];
  return `${prefix}${m[2]}${m[3]}`;
}

/** Build a CSV cell, quoting when the value contains a comma, quote or newline. */
export function csvCell(value: unknown): string {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Turn a matrix of values into CSV text (CRLF line endings). */
export function toCsv(rows: unknown[][]): string {
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}

/** Trigger a client-side download of a CSV template. Client components only. */
export function downloadCsv(filename: string, rows: unknown[][]): void {
  if (typeof document === "undefined") return;
  const blob = new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
