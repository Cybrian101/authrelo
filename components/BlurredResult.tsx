"use client";

import { Lock } from "lucide-react";

interface BlurredResultProps {
  sections: string[];
}

export default function BlurredResult({ sections }: BlurredResultProps) {
  return (
    <div className="space-y-3">
      <p className="text-text-secondary text-sm">5 sections inside</p>
      <div className="space-y-2">
        {sections.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-bg-card border border-border rounded-pill px-4 py-3"
          >
            <Lock className="w-4 h-4 text-text-muted flex-shrink-0" />
            <span className="blur-content text-text-secondary text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
