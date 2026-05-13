"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Brain, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface OnboardingCarouselProps {
  onComplete: () => void;
  t: (key: string) => string;
}

const slides = [
  { icon: MessageCircle, titleKey: "onboard1Title", descKey: "onboard1Desc" },
  { icon: Brain, titleKey: "onboard2Title", descKey: "onboard2Desc" },
  { icon: Sparkles, titleKey: "onboard3Title", descKey: "onboard3Desc" },
];

export default function OnboardingCarousel({
  onComplete,
  t,
}: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-mobile flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
              <Icon className="w-10 h-10 text-accent" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-medium text-text-primary">
                {t(slide.titleKey)}
              </h2>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t(slide.descKey)}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + buttons */}
      <div className="w-full max-w-mobile space-y-4 pb-8">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-6 bg-accent"
                  : "w-2 bg-text-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {!isLast && (
            <Button
              variant="ghost"
              onClick={onComplete}
              className="flex-1"
            >
              {t("skip")}
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={isLast ? "w-full" : "flex-1"}
          >
            {isLast ? t("getStarted") : t("next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
