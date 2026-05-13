"use client";

import { Heart, Phone, ExternalLink } from "lucide-react";
import { CRISIS_RESOURCES } from "@/lib/constants";

export default function CrisisScreen() {
  return (
    <div className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
      <div className="w-full max-w-mobile space-y-6 opacity-0 animate-fade-in-up">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
            <Heart className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-xl font-medium text-text-primary">
            What you&apos;ve shared sounds serious.
          </h1>
          <p className="text-text-secondary text-[15px] leading-relaxed">
            Please reach out to someone who can really help right now.
          </p>
        </div>

        <div className="space-y-3">
          {CRISIS_RESOURCES.map((resource) => (
            <a
              key={resource.name}
              href={
                resource.icon === "phone"
                  ? `tel:${resource.number}`
                  : `https://${resource.number}`
              }
              className="flex items-center gap-4 bg-bg-card border border-border rounded-card p-4 transition-colors hover:bg-bg-card-hover active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                {resource.icon === "phone" ? (
                  <Phone className="w-5 h-5 text-accent" />
                ) : (
                  <ExternalLink className="w-5 h-5 text-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium text-[15px]">
                  {resource.name}
                </p>
                <p className="text-accent text-sm">{resource.number}</p>
                <p className="text-text-muted text-xs mt-0.5">
                  {resource.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-text-muted text-sm leading-relaxed">
          You can also close this and talk to someone you trust.
        </p>
      </div>
    </div>
  );
}
