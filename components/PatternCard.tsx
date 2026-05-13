"use client";

import { Lock } from "lucide-react";

interface PatternCardProps {
  patternName: string;
  previewLine: string;
  fullReflection?: string;
  blurred?: boolean;
}

export default function PatternCard({
  patternName,
  previewLine,
  fullReflection,
  blurred = false,
}: PatternCardProps) {
  return (
    <div className="bg-bg-card border border-accent-border rounded-card p-5 space-y-3 relative overflow-hidden">
      <h2 className="text-xl font-medium text-accent leading-tight">
        {patternName}
      </h2>
      <p className="text-text-primary text-[15px] leading-relaxed">
        {previewLine}
      </p>
      {fullReflection && (
        <div className="relative">
          <p
            className={`text-text-secondary text-[15px] leading-relaxed ${
              blurred ? "blur-content" : ""
            }`}
          >
            {fullReflection}
          </p>
          {blurred && (
            <div className="absolute bottom-2 right-2">
              <Lock className="w-5 h-5 text-text-muted" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
