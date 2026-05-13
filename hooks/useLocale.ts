"use client";

import { useState, useCallback, useEffect } from "react";
import { Locale, t, TranslationKey } from "@/lib/i18n";

const LOCALE_KEY = "authrelo_locale";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved === "en" || saved === "hi") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
  }, []);

  const tr = useCallback(
    (key: TranslationKey) => t(locale, key),
    [locale]
  );

  return { locale, setLocale, t: tr };
}
