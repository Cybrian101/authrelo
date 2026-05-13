"use client";

import {
  Ear,
  Repeat,
  User,
  Users,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  heard: Ear,
  pattern: Repeat,
  entryPoint: User,
  partnerExperience: Users,
  action: Lightbulb,
};

interface ResultSectionProps {
  sectionKey: string;
  title: string;
  content: string;
  isAction?: boolean;
  animationDelay?: number;
}

export default function ResultSection({
  sectionKey,
  title,
  content,
  isAction = false,
  animationDelay = 0,
}: ResultSectionProps) {
  const Icon = iconMap[sectionKey];

  if (isAction) {
    return (
      <div
        className="bg-accent/10 border border-accent-border rounded-card p-5 space-y-3 opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-accent" />}
          <h3 className="text-base font-medium text-accent">{title}</h3>
        </div>
        <p className="text-text-primary text-lg leading-relaxed font-medium">
          {content}
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-bg-card border border-border rounded-card p-5 space-y-3 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-accent" />}
        <h3 className="text-base font-medium text-text-primary">{title}</h3>
      </div>
      <p className="text-text-secondary text-[15px] leading-relaxed">
        {content}
      </p>
    </div>
  );
}
