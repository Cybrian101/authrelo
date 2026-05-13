"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Brain, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingCarousel from "@/components/OnboardingCarousel";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import InstallPrompt from "@/components/InstallPrompt";
import { useLocale } from "@/hooks/useLocale";
import { useTheme } from "@/hooks/useTheme";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { track, EVENTS, initAnalytics } from "@/lib/analytics";

export default function LandingPage() {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { canInstall, install, dismiss } = useInstallPrompt();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    initAnalytics();
    track(EVENTS.LANDING_VIEW);
    const seen = localStorage.getItem("authrelo_onboarding_done");
    if (!seen) {
      setHasSeenOnboarding(false);
      setShowOnboarding(true);
    }
  }, []);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem("authrelo_onboarding_done", "true");
  }

  if (showOnboarding && !hasSeenOnboarding) {
    return (
      <OnboardingCarousel onComplete={handleOnboardingComplete} t={t as (key: string) => string} />
    );
  }

  const trustPills = [
    { icon: Shield, text: t("trustAnonymous") },
    { icon: Brain, text: t("trustPsychology") },
    { icon: Clock, text: t("trustTime") },
  ];

  return (
    <main className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
      <div className="w-full max-w-mobile space-y-8">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end gap-2"
        >
          <LanguageToggle locale={locale} onToggle={setLocale} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center"
        >
          <h1 className="text-3xl font-medium text-accent tracking-tight">
            {t("brandName")}
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-3"
        >
          <p className="text-lg text-text-primary font-medium leading-snug">
            {t("tagline")}
          </p>
          <p className="text-[15px] text-text-secondary leading-relaxed">
            {t("subtext")}
          </p>
        </motion.div>

        {/* Trust Pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {trustPills.map((pill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              className="flex items-start gap-3 bg-bg-card border border-border rounded-pill px-4 py-3"
            >
              <pill.icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-secondary leading-relaxed">
                {pill.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={() => {
              track(EVENTS.SESSION_START);
              router.push("/session");
            }}
            className="w-full text-base font-medium"
            size="lg"
          >
            {t("ctaStart")}
          </Button>

          {/* Couple mode CTA */}
          <Button
            onClick={() => {
              track(EVENTS.COUPLE_MODE_START);
              router.push("/couple");
            }}
            variant="outline"
            className="w-full gap-2"
          >
            <Users className="w-4 h-4" />
            {t("coupleMode")}
          </Button>

          <p className="text-center text-text-muted text-xs leading-relaxed">
            {t("ctaNote")}
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-center text-text-muted text-xs leading-relaxed">
            {t("disclaimer")}
          </p>
        </motion.div>
      </div>

      {/* Install prompt */}
      <InstallPrompt
        canInstall={canInstall}
        onInstall={install}
        onDismiss={dismiss}
        t={t as (key: string) => string}
      />
    </main>
  );
}
