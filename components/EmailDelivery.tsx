"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { track, EVENTS } from "@/lib/analytics";

interface EmailDeliveryProps {
  patternName: string;
  reflection: string;
  t: (key: string) => string;
}

export default function EmailDelivery({
  patternName,
  reflection,
  t,
}: EmailDeliveryProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSend() {
    if (!email || !email.includes("@")) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, patternName, reflection }),
      });

      if (res.ok) {
        setStatus("sent");
        track(EVENTS.EMAIL_SENT);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg-card border border-success/25 rounded-card p-4 flex items-center gap-3"
      >
        <Check className="w-5 h-5 text-success" />
        <p className="text-success text-sm">{t("emailSent")}</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-accent" />
        <p className="text-text-secondary text-sm">{t("emailSend")}</p>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="flex-1 bg-bg-primary border border-border rounded-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-border transition-colors min-h-[44px]"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!email.includes("@") || status === "sending"}
          className="h-[44px]"
        >
          {status === "sending" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Send"
          )}
        </Button>
      </div>
      <p className="text-text-muted text-xs">{t("emailOptional")}</p>
      {status === "error" && (
        <p className="text-red-400 text-xs">Failed to send. Try again.</p>
      )}
    </div>
  );
}
