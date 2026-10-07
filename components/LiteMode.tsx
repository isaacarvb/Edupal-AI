"use client";
import { useEffect } from "react";

// Applies Reduced data mode from localStorage (toggle lives in Settings).
export default function LiteMode() {
  useEffect(() => {
    const apply = () => {
      document.body.classList.toggle("lite", localStorage.getItem("edupal_lite") === "1");
    };
    apply();
    window.addEventListener("edupal-lite", apply);
    return () => window.removeEventListener("edupal-lite", apply);
  }, []);
  return null;
}
