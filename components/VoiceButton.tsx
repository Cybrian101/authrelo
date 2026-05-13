"use client";

import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  label?: string;
}

export default function VoiceButton({
  isListening,
  isSupported,
  onStart,
  onStop,
  label,
}: VoiceButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      onClick={isListening ? onStop : onStart}
      className="flex-shrink-0 w-11 h-11 rounded-button flex items-center justify-center transition-all duration-200 relative"
      style={{
        background: isListening
          ? "rgba(245,158,11,0.2)"
          : "rgba(255,255,255,0.05)",
        border: isListening
          ? "1px solid rgba(245,158,11,0.5)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
      title={label}
    >
      {isListening ? (
        <>
          <motion.div
            className="absolute inset-0 rounded-button border border-accent"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <MicOff className="w-5 h-5 text-accent" />
        </>
      ) : (
        <Mic className="w-5 h-5 text-text-muted" />
      )}
    </button>
  );
}
