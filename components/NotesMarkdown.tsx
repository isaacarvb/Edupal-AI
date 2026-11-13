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
    if (tok.startsWith("**")) out.push(<strong key={`${k}-b${i++}`} style={{ color: "#0F172A", fontWeight: 800 }}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={`${k}-c${i++}`} style={{ background: "#F0FDFA", border: "1px solid #CCFBF1", color: "#115E59", padding: "1px 6px", borderRadius: 6, fontSize: "0.9em", fontWeight: 600 }}>{tok.slice(1, -1)}</code>);
    else out.push(<em key={`${k}-i${i++}`} style={{ color: "#334155" }}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function cells(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

const th: React.CSSProperties = {
  borderBottom: "1px solid #CBD5E1",
  background: "#F0FDFA",
  color: "#115E59",
  fontWeight: 800,
  fontSize: 12.5,
  letterSpacing: 0.2,
  padding: "9px 12px",
  textAlign: "left",
  verticalAlign: "top"
};
const td: React.CSSProperties = {
  borderBottom: "1px solid #E2E8F0",
  background: "#fff",
  color: "#334155",
  fontSize: 13.5,
  padding: "9px 12px",
  textAlign: "left",
  verticalAlign: "top",
  lineHeight: 1.55
};

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
      const level = h[1].length;
      const big = level <= 2;
      out.push(
        <div
          key={`h${k++}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 900,
            color: big ? "#0F766E" : "#1E293B",
            fontSize: big ? 16.5 : 14.5,
            lineHeight: 1.4,
            margin: big ? "18px 0 8px" : "14px 0 6px"
          }}
        >
          <span aria-hidden style={{ width: big ? 4 : 3, height: big ? 18 : 14, borderRadius: 2, background: big ? "#10B981" : "#94A3B8", flexShrink: 0 }} />
          <span>{inline(h[2], `h${k}`)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^\s*-{3,}\s*$/.test(line)) {
      out.push(<hr key={`r${k++}`} style={{ border: 0, borderTop: "1px dashed #CBD5E1", margin: "16px 0" }} />);
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
          <div key={`t${k++}`} style={{ overflowX: "auto", margin: "12px 0", border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 320 }}>
              <tbody>
                {body.map((r, ri) => (
                  <tr key={ri} style={{ background: ri > 0 && ri % 2 === 0 ? "#F8FAFC" : "#fff" }}>
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
        <ul key={`u${k++}`} style={{ margin: "8px 0 10px", paddingLeft: 22, fontSize: 14.5, color: "#334155", lineHeight: 1.7 }}>
          {items.map((it, ii) => <li key={ii} style={{ marginBottom: 4, paddingLeft: 2 }}>{inline(it, `u${k}-${ii}`)}</li>)}
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
        <ol key={`o${k++}`} style={{ margin: "8px 0 10px", paddingLeft: 22, fontSize: 14.5, color: "#334155", lineHeight: 1.7 }}>
          {items.map((it, ii) => <li key={ii} style={{ marginBottom: 4, paddingLeft: 2 }}>{inline(it, `o${k}-${ii}`)}</li>)}
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
        <div key={`q${k++}`} style={{ display: "flex", gap: 10, borderLeft: "4px solid #10B981", background: "#F0FDFA", padding: "10px 14px", margin: "10px 0", borderRadius: "0 12px 12px 0", fontSize: 14.5, color: "#115E59", lineHeight: 1.65 }}>
          <span aria-hidden style={{ flexShrink: 0 }}>💡</span>
          <div>
            {parts.map((p, pi) => <div key={pi} style={{ marginBottom: pi === parts.length - 1 ? 0 : 4 }}>{inline(p, `q${k}-${pi}`)}</div>)}
          </div>
        </div>
      );
      continue;
    }

    // Paragraph
    out.push(
      <p key={`p${k++}`} style={{ margin: "0 0 10px", fontSize: 14.5, color: "#334155", lineHeight: 1.75 }}>
        {inline(line, `p${k}`)}
      </p>
    );
    i++;
  }

  return <div>{out}</div>;
}
