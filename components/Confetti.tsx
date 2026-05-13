"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ["#F59E0B", "#FCD34D", "#FBBF24", "#F97316"];

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    frame();
  }, [trigger]);

  return null;
}
