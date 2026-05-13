"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

interface SafetyCheckProps {
  onSafe: () => void;
  onNeedHelp: () => void;
  t: (key: string) => string;
}

export default function SafetyCheck({ onSafe, onNeedHelp, t }: SafetyCheckProps) {
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
          <ShieldCheck className="w-8 h-8 text-accent" />
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-primary text-lg font-medium"
        >
          {t("safetyCheck")}
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button onClick={onSafe} className="w-full" size="lg">
            {t("safetyYes")}
          </Button>
          <Button
            onClick={onNeedHelp}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {t("safetyNo")}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
