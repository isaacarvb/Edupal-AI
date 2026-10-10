"use client";
import { useEffect } from "react";

// Applies light/dark theme from localStorage (toggle lives in Settings).
export default function ThemeMode() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.classList.toggle("dark", localStorage.getItem("edupal_theme") === "dark");
    };
    apply();
    window.addEventListener("edupal-theme", apply);
    return () => window.removeEventListener("edupal-theme", apply);
  }, []);
  return null;
}
