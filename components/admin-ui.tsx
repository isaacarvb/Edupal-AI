"use client";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "dark" | "danger" | "dangerOutline" | "ghost" | "green";

const BASE: CSSProperties = {
  fontWeight: 800, borderRadius: 10, cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  gap: 6, whiteSpace: "nowrap"
};

const SIZES: Record<string, CSSProperties> = {
  sm: { fontSize: 13, padding: "8px 14px", minHeight: 36 },
  md: { fontSize: 14, padding: "10px 18px", minHeight: 44 },
  lg: { fontSize: 16, padding: "12px 22px", minHeight: 48, width: "100%" }
};

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: { background: "#0F766E", color: "#fff", border: 0 },
  dark: { background: "#1E242E", color: "#fff", border: 0 },
  green: { background: "#16A34A", color: "#fff", border: 0 },
  danger: { background: "#DC2626", color: "#fff", border: 0 },
  dangerOutline: { background: "#fff", color: "#DC2626", border: "2px solid #DC2626" },
  ghost: { background: "#fff", color: "#0F766E", border: "1px solid #0F766E" }
};

// Shared admin button: clear hover/press/disabled/loading states (see globals.css .admin-scope).
export function AdminButton({
  children, onClick, variant = "primary", size = "md", busy = false, disabled = false, style, title
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: Variant;
  size?: keyof typeof SIZES;
  busy?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  title?: string;
}) {
  const off = disabled || busy;
  return (
    <button
      onClick={off ? undefined : onClick}
      disabled={off}
      title={title}
      style={{ ...BASE, ...SIZES[size], ...VARIANTS[variant], ...(off ? { opacity: 0.6, cursor: "not-allowed" } : null), ...style }}
    >
      {busy && <span className="abtn-spinner" aria-hidden />}
      {busy ? "Working…" : children}
    </button>
  );
}
