"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultSection from "@/components/ResultSection";
import ShareCard from "@/components/ShareCard";
import UpsellCard from "@/components/UpsellCard";
import FeedbackWidget from "@/components/FeedbackWidget";
import EmailDelivery from "@/components/EmailDelivery";
import ReferralCard from "@/components/ReferralCard";
import Confetti from "@/components/Confetti";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import { useLocale } from "@/hooks/useLocale";
import { track, EVENTS } from "@/lib/analytics";
import { AnalysisResult } from "@/types";

const SECTION_CONFIG = [
  { key: "heard", titleKey: "whatWeHeard" },
  { key: "pattern", titleKey: "patternYoureIn" },
  { key: "entryPoint", titleKey: "yourEntryPoint" },
  { key: "partnerExperience", titleKey: "partnerExperience" },
  { key: "action", titleKey: "oneThing" },
];

export default function ResultPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("authrelo_session");
      if (stored) {
        const session = JSON.parse(stored);
        if (!session.isPaid || !session.analysisResult) {
          router.push("/");
          return;
        }
        setResult(session.analysisResult);
        track(EVENTS.RESULT_VIEW);
        // Trigger confetti after a small delay
        setTimeout(() => setShowConfetti(true), 500);
      } else {
        router.push("/");
        return;
      }
    } catch {
      router.push("/");
      return;
    }
    setIsHydrated(true);
  }, [router]);

  function handleRestart() {
    sessionStorage.removeItem("authrelo_session");
    router.push("/");
  }

  if (!isHydrated || !result) {
    return (
      <main className="min-h-dvh bg-bg-primary flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </main>
    );
  }

  // Build full reflection text for email
  const fullReflection = SECTION_CONFIG.map(
    (s) =>
      `${t(s.titleKey as Parameters<typeof t>[0])}:\n${result.sections[s.key as keyof typeof result.sections]}`
  ).join("\n\n");

  return (
    <PageTransition>
      <main className="min-h-dvh bg-bg-primary pb-safe">
        <Confetti trigger={showConfetti} />

        <div className="w-full max-w-mobile mx-auto px-5 py-6 space-y-6">
          {/* Header */}
          <ScrollReveal>
            <div className="space-y-2">
              <p className="text-accent text-xs font-medium uppercase tracking-widest">
                {t("yourReflection")}
              </p>
              <h1 className="text-2xl font-medium text-accent leading-tight">
                {result.patternName}
              </h1>
              <p className="text-text-muted text-sm">
                {t("basedOnShared")}
              </p>
            </div>
          </ScrollReveal>

          {/* Sections — progressive disclosure */}
          {SECTION_CONFIG.map((section, i) => (
            <ScrollReveal key={section.key} delay={i * 0.08}>
              <ResultSection
                sectionKey={section.key}
                title={t(section.titleKey as Parameters<typeof t>[0])}
                content={
                  result.sections[section.key as keyof typeof result.sections]
                }
                isAction={section.key === "action"}
              />
            </ScrollReveal>
          ))}

          {/* Closing */}
          <ScrollReveal delay={0.4}>
            <div className="text-center py-4">
              <p className="text-text-secondary text-[15px] italic leading-relaxed">
                {result.sections.closing}
              </p>
            </div>
          </ScrollReveal>

          {/* Footer disclaimer */}
          <ScrollReveal delay={0.45}>
            <p className="text-text-muted text-xs text-center leading-relaxed">
              {t("footerDisclaimer")}
            </p>
          </ScrollReveal>

          {/* Feedback */}
          <ScrollReveal delay={0.5}>
            <FeedbackWidget t={t as (key: string) => string} />
          </ScrollReveal>

          {/* Email delivery */}
          <ScrollReveal delay={0.55}>
            <EmailDelivery
              patternName={result.patternName}
              reflection={fullReflection}
              t={t as (key: string) => string}
            />
          </ScrollReveal>

          {/* Share */}
          <ScrollReveal delay={0.6}>
            <ShareCard
              patternName={result.patternName}
              previewLine={result.previewLine}
            />
          </ScrollReveal>

          {/* Referral */}
          <ScrollReveal delay={0.65}>
            <ReferralCard t={t as (key: string) => string} />
          </ScrollReveal>

          {/* Upsell */}
          <ScrollReveal delay={0.7}>
            <UpsellCard />
          </ScrollReveal>

          {/* Therapist link */}
          <ScrollReveal delay={0.75}>
            <Button
              onClick={() => router.push("/therapists")}
              variant="secondary"
              className="w-full gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              {t("findTherapist")}
            </Button>
          </ScrollReveal>

          {/* Restart */}
          <ScrollReveal delay={0.8}>
            <Button
              onClick={handleRestart}
              variant="ghost"
              className="w-full gap-2 text-text-muted"
            >
              <RotateCcw className="w-4 h-4" />
              {t("startOver")}
            </Button>
          </ScrollReveal>
        </div>
      </main>
    </PageTransition>
  );
}
