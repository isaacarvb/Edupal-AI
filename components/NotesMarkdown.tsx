"use client";
import React from "react";

// Small dependency-free markdown renderer for curriculum notes.
// Supports headings, bold/italic/code, lists, tables, quotes and rules —
// enough for the comprehensive study notes without pulling in a library.

function inline(s: string, k: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={`${k}-b${i++}`}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={`${k}-c${i++}`} style={{ background: "#F1F5F9", padding: "1px 5px", borderRadius: 4, fontSize: "0.92em" }}>{tok.slice(1, -1)}</code>);
    else out.push(<em key={`${k}-i${i++}`}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function cells(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

const th: React.CSSProperties = { border: "1px solid #CBD5E1", background: "#F1F5F9", color: "#1E242E", fontWeight: 700, fontSize: 13, padding: "6px 10px", textAlign: "left", verticalAlign: "top" };
const td: React.CSSProperties = { border: "1px solid #E2E8F0", background: "#fff", color: "#333A45", fontSize: 13, padding: "6px 10px", textAlign: "left", verticalAlign: "top" };

export function NotesMarkdown({ text }: { text: string }) {
  const lines = (text || "").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Heading
    const h = /^(#{1,4})\s+(.+)$/.exec(line);
    if (h) {
      out.push(
        <div key={`h${k++}`} style={{ fontWeight: 800, color: "#0F766E", fontSize: h[1].length <= 2 ? 16 : 14, margin: "14px 0 6px" }}>
          {inline(h[2], `h${k}`)}
        </div>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^\s*-{3,}\s*$/.test(line)) {
      out.push(<hr key={`r${k++}`} style={{ border: 0, borderTop: "1px solid #E2E8F0", margin: "12px 0" }} />);
      i++;
      continue;
    }

    // Table
    if (/^\s*\|/.test(line)) {
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(cells(lines[i]));
        i++;
      }
      const isSep = (r: string[]) => r.every((c) => /^:?-{2,}:?$/.test(c) || c === "");
      const body = rows.filter((r, idx) => !(idx === 1 && isSep(r)));
      if (body.length > 0) {
        out.push(
          <div key={`t${k++}`} style={{ overflowX: "auto", margin: "10px 0" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                {body.map((r, ri) => (
                  <tr key={ri}>
                    {r.map((c, ci) =>
                      ri === 0 ? <th key={ci} style={th}>{inline(c, `t${k}-${ri}-${ci}`)}</th> : <td key={ci} style={td}>{inline(c, `t${k}-${ri}-${ci}`)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Bullet list
    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, ""));
        i++;
      }
      out.push(
        <ul key={`u${k++}`} style={{ margin: "6px 0 8px", paddingLeft: 22, fontSize: 14, color: "#333A45", lineHeight: 1.65 }}>
          {items.map((it, ii) => <li key={ii} style={{ marginBottom: 3 }}>{inline(it, `u${k}-${ii}`)}</li>)}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <ol key={`o${k++}`} style={{ margin: "6px 0 8px", paddingLeft: 22, fontSize: 14, color: "#333A45", lineHeight: 1.65 }}>
          {items.map((it, ii) => <li key={ii} style={{ marginBottom: 3 }}>{inline(it, `o${k}-${ii}`)}</li>)}
        </ol>
      );
      continue;
    }

    // Quote
    if (/^\s*>\s?/.test(line)) {
      const parts: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        parts.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push(
        <div key={`q${k++}`} style={{ borderLeft: "3px solid #0F766E", background: "#F0FDFA", padding: "8px 12px", margin: "8px 0", borderRadius: "0 8px 8px 0", fontSize: 14, color: "#333A45", lineHeight: 1.6 }}>
          {parts.map((p, pi) => <div key={pi}>{inline(p, `q${k}-${pi}`)}</div>)}
        </div>
      );
      continue;
    }

    // Paragraph
    out.push(
      <p key={`p${k++}`} style={{ margin: "0 0 8px", fontSize: 14, color: "#333A45", lineHeight: 1.7 }}>
        {inline(line, `p${k}`)}
      </p>
    );
    i++;
  }

  return <div style={{ marginTop: 4 }}>{out}</div>;
}
