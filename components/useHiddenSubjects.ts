"use client";
import { useEffect, useState } from "react";

// Subjects the admin switched OFF. Empty = everything visible.
// Fails open: if the fetch fails, nothing is hidden.
export function useHiddenSubjects(): string[] {
  const [hidden, setHidden] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/subjects").then(async (r) => {
      if (!r.ok) return;
      const d = await r.json();
      setHidden(d.hidden ?? []);
    }).catch(() => {});
  }, []);
  return hidden;
}
