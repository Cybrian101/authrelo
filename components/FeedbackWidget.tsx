"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";

interface FeedbackWidgetProps {
  t: (key: string) => string;
}

export default function FeedbackWidget({ t }: FeedbackWidgetProps) {
  const [, setFeedback] = useState<"up" | "down" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleFeedback(value: "up" | "down") {
    setFeedback(value);
    setSubmitted(true);
    track(EVENTS.FEEDBACK_GIVEN, { value });

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }

  return (
    <div className="bg-bg-card border border-border rounded-card p-4">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between"
          >
            <p className="text-text-secondary text-sm">
              {t("wasAccurate")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback("up")}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-success/10 hover:border-success/30 transition-colors"
              >
                <ThumbsUp className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() => handleFeedback("down")}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
              >
                <ThumbsDown className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-1"
          >
            <Check className="w-4 h-4 text-success" />
            <p className="text-success text-sm">{t("feedbackThanks")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
