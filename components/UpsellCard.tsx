"use client";

import { Button } from "./ui/button";

export default function UpsellCard() {
  return (
    <div className="bg-bg-card border border-border rounded-card p-5 space-y-4">
      <p className="text-text-primary text-[15px] leading-relaxed">
        Relationships change. Come back when you need to.
      </p>
      <div className="space-y-2 text-sm text-text-secondary">
        <p>
          <span className="text-accent font-medium">3 sessions — ₹129</span>{" "}
          (₹43 each)
        </p>
        <p>
          Or{" "}
          <span className="text-accent font-medium">
            ₹99/month — unlimited sessions
          </span>
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="flex-1">
          Get 3 sessions
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          Get monthly
        </Button>
      </div>
    </div>
  );
}
