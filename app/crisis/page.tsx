"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Phone, ExternalLink, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import { CRISIS_RESOURCES } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";

export default function CrisisPage() {
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    // Clear session to prevent going back
    sessionStorage.removeItem("authrelo_content_warning_seen");
  }, []);

  return (
    <PageTransition>
      <main className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
        <div className="w-full max-w-mobile space-y-6">
          <ScrollReveal>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="text-center space-y-3">
              <h1 className="text-xl font-medium text-text-primary">
                {t("crisisHeading")}
              </h1>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("crisisSubtext")}
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {CRISIS_RESOURCES.map((resource, i) => (
              <ScrollReveal key={resource.name} delay={0.15 + i * 0.08}>
                <a
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
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.5}>
            <Button
              onClick={() => router.push("/therapists")}
              variant="outline"
              className="w-full gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              {t("findTherapist")}
            </Button>
          </ScrollReveal>

          <ScrollReveal delay={0.55}>
            <p className="text-center text-text-muted text-sm leading-relaxed">
              {t("crisisNote")}
            </p>
          </ScrollReveal>
        </div>
      </main>
    </PageTransition>
  );
}
