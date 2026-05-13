"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";

interface ContentWarningProps {
  onAccept: () => void;
  t: (key: string) => string;
}

export default function ContentWarning({ onAccept, t }: ContentWarningProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh bg-bg-primary flex items-center justify-center p-5"
    >
      <div className="w-full max-w-mobile space-y-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-16 h-16 mx-auto rounded-full bg-accent/10 border border-accent-border flex items-center justify-center"
        >
          <Heart className="w-8 h-8 text-accent" />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-medium text-text-primary">
            {t("contentWarningTitle")}
          </h2>
          <p className="text-text-secondary text-[15px] leading-relaxed">
            {t("contentWarningText")}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onAccept} className="w-full" size="lg">
            {t("contentWarningCta")}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
