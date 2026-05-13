"use client";

import { Locale } from "@/lib/i18n";

interface LanguageToggleProps {
  locale: Locale;
  onToggle: (locale: Locale) => void;
}

export default function LanguageToggle({
  locale,
  onToggle,
}: LanguageToggleProps) {
  return (
    <button
      onClick={() => onToggle(locale === "en" ? "hi" : "en")}
      className="h-9 px-3 rounded-full flex items-center justify-center text-xs font-medium transition-colors hover:bg-bg-card border border-border text-text-secondary"
    >
      {locale === "en" ? "हिं" : "EN"}
    </button>
  );
}
