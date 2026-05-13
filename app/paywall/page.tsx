"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PatternCard from "@/components/PatternCard";
import BlurredResult from "@/components/BlurredResult";
import PageTransition from "@/components/PageTransition";
import { usePayment } from "@/hooks/usePayment";
import { useLocale } from "@/hooks/useLocale";
import { track, EVENTS } from "@/lib/analytics";
import { AnalysisResult } from "@/types";

export default function PaywallPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { initiatePayment, isLoading, error, clearError } = usePayment();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("authrelo_session");
      if (stored) {
        const session = JSON.parse(stored);
        if (session.analysisResult) {
          setResult(session.analysisResult);
          track(EVENTS.PAYWALL_VIEW);
        } else {
          router.push("/");
          return;
        }
        if (session.isPaid) {
          router.push("/result");
          return;
        }
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

  function handlePayment() {
    clearError();
    track(EVENTS.PAYMENT_INITIATED);
    initiatePayment(
      () => {
        track(EVENTS.PAYMENT_SUCCESS);
        try {
          const stored = sessionStorage.getItem("authrelo_session");
          if (stored) {
            const session = JSON.parse(stored);
            session.isPaid = true;
            sessionStorage.setItem("authrelo_session", JSON.stringify(session));
          }
        } catch {
          // ignore
        }
        router.push("/result");
      },
      () => {
        track(EVENTS.PAYMENT_FAILED);
      }
    );
  }

  if (!isHydrated || !result) {
    return (
      <main className="min-h-dvh bg-bg-primary flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </main>
    );
  }

  const sectionLabels = [
    t("whatWeHeard"),
    t("patternYoureIn"),
    t("yourEntryPoint"),
    t("partnerExperience"),
    t("oneThing"),
  ];

  return (
    <PageTransition>
      <main className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
        <div className="w-full max-w-mobile space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-xl font-medium text-text-primary">
              {t("patternReady")}
            </h1>
            <p className="text-text-secondary text-sm">
              {t("foundReal")}
            </p>
          </motion.div>

          {/* Pattern Card with blur */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PatternCard
              patternName={result.patternName}
              previewLine={result.previewLine}
              fullReflection={result.sections.heard + " " + result.sections.pattern}
              blurred={true}
            />
          </motion.div>

          {/* Blurred sections */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BlurredResult sections={sectionLabels} />
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 rounded-pill px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full text-base font-medium"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-bg-primary border-t-transparent animate-spin" />
                  {t("processing")}
                </span>
              ) : (
                t("unlockPay")
              )}
            </Button>
            <div className="text-center space-y-1.5">
              <p className="text-text-muted text-xs">{t("oneTime")}</p>
              <p className="text-text-muted text-xs italic">
                {t("cheaperThan")}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
