"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "./ui/button";

interface InstallPromptProps {
  canInstall: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  t: (key: string) => string;
}

export default function InstallPrompt({
  canInstall,
  onInstall,
  onDismiss,
  t,
}: InstallPromptProps) {
  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-mobile mx-auto"
        >
          <div className="bg-bg-card border border-accent-border rounded-card p-4 flex items-start gap-3 shadow-lg shadow-black/30">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm font-medium">
                {t("installTitle")}
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                {t("installDesc")}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={onInstall} className="text-xs">
                  {t("installBtn")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="text-xs"
                >
                  {t("installDismiss")}
                </Button>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-text-muted hover:text-text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
