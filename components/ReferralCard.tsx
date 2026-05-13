"use client";

import { useState, useMemo } from "react";
import { Gift, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { track, EVENTS } from "@/lib/analytics";

interface ReferralCardProps {
  t: (key: string) => string;
}

export default function ReferralCard({ t }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  // Generate referral code once per mount — not on every render
  const referralCode = useMemo(
    () => `AR${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    []
  );

  const referralLink = `https://authrelo.com?ref=${referralCode}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      track(EVENTS.REFERRAL_COPIED);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="bg-bg-card border border-border rounded-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Gift className="w-4 h-4 text-accent" />
        <p className="text-text-primary text-sm font-medium">
          {t("referralTitle")}
        </p>
      </div>
      <p className="text-text-secondary text-xs">{t("referralDesc")}</p>
      <div className="flex items-center gap-2 bg-bg-primary border border-border rounded-input px-3 py-2">
        <code className="flex-1 text-xs text-text-muted truncate">
          {referralLink}
        </code>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
