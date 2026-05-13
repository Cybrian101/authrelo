"use client";

import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-bg-card border border-border"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-text-secondary" />
      ) : (
        <Moon className="w-4 h-4 text-text-secondary" />
      )}
    </button>
  );
}
