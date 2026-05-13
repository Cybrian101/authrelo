"use client";

import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (
    initialized ||
    typeof window === "undefined" ||
    !process.env.NEXT_PUBLIC_POSTHOG_KEY
  ) {
    return;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "memory", // No cookies — privacy first
    disable_session_recording: true,
    autocapture: false,
  });

  initialized = true;
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture(event, properties);
}

// Funnel events
export const EVENTS = {
  LANDING_VIEW: "landing_view",
  SESSION_START: "session_start",
  QUESTION_ANSWERED: "question_answered",
  ABUSE_DETECTED: "abuse_detected",
  ANALYSIS_STARTED: "analysis_started",
  ANALYSIS_COMPLETE: "analysis_complete",
  PAYWALL_VIEW: "paywall_view",
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  RESULT_VIEW: "result_view",
  RESULT_SHARED: "result_shared",
  FEEDBACK_GIVEN: "feedback_given",
  COUPLE_MODE_START: "couple_mode_start",
  REFERRAL_COPIED: "referral_copied",
  EMAIL_SENT: "email_sent",
  VOICE_INPUT_USED: "voice_input_used",
  THEME_TOGGLED: "theme_toggled",
  LANGUAGE_CHANGED: "language_changed",
  PWA_INSTALLED: "pwa_installed",
} as const;
