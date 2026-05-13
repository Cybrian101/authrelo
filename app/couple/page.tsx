"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, ArrowRight } from "lucide-react";
import { QUESTIONS, MIN_ANSWER_LENGTH, LOADING_MESSAGES } from "@/lib/constants";
import { classifyText } from "@/lib/abuseClassifier";
import { track, EVENTS } from "@/lib/analytics";
import { useLocale } from "@/hooks/useLocale";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import ProgressBar from "@/components/ProgressBar";
import VoiceButton from "@/components/VoiceButton";
import SafetyCheck from "@/components/SafetyCheck";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { Button } from "@/components/ui/button";
import { Message } from "@/types";

type CouplePhase = "intro" | "partner1" | "switch" | "partner2" | "analysing";

export default function CouplePage() {
  const router = useRouter();
  const { t } = useLocale();
  const [phase, setPhase] = useState<CouplePhase>("intro");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [partner1Answers, setPartner1Answers] = useState<string[]>([]);
  const [partner2Answers, setPartner2Answers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, isSupported, startListening, stopListening } =
    useVoiceInput();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const addLocalMessage = useCallback(
    (type: Message["type"], content: string) => {
      const msg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  const showQuestion = useCallback(
    (step: number) => {
      if (step >= QUESTIONS.length) return;
      setIsTyping(true);
      scrollToBottom();
      setTimeout(() => {
        setIsTyping(false);
        addLocalMessage("ai", QUESTIONS[step].text);
        scrollToBottom();
      }, 1200);
    },
    [addLocalMessage, scrollToBottom]
  );

  function startPartnerSession(partner: 1 | 2) {
    setMessages([]);
    setCurrentStep(0);
    setInput("");
    setPhase(partner === 1 ? "partner1" : "partner2");
    setTimeout(() => showQuestion(0), 500);
  }

  useEffect(() => {
    if (phase !== "analysing") return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  async function handleAnalysis() {
    setPhase("analysing");
    track(EVENTS.ANALYSIS_STARTED, { mode: "couple" });

    try {
      const res = await fetch("/api/couple-analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner1Answers, partner2Answers }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const result = await res.json();

      if (result.safetyFlag) {
        router.push("/crisis");
        return;
      }

      track(EVENTS.ANALYSIS_COMPLETE, { mode: "couple" });
      sessionStorage.setItem("authrelo_couple_result", JSON.stringify(result));
      sessionStorage.setItem(
        "authrelo_session",
        JSON.stringify({
          analysisResult: result,
          isPaid: false,
          currentStep: 5,
          answers: partner1Answers,
        })
      );
      router.push("/paywall");
    } catch (err) {
      console.error(err);
      addLocalMessage("ai", "Something went wrong. Please try again.");
      // Go back to the correct phase — partner2, since analysis only runs after partner2 finishes
      setPhase("partner2");
    }
  }

  function processAnswer(trimmed: string) {
    addLocalMessage("user", trimmed);

    const isPartner1 = phase === "partner1";
    const answers = isPartner1 ? partner1Answers : partner2Answers;
    const newAnswers = [...answers, trimmed];

    if (isPartner1) {
      setPartner1Answers(newAnswers);
    } else {
      setPartner2Answers(newAnswers);
    }

    track(EVENTS.QUESTION_ANSWERED, {
      step: currentStep + 1,
      mode: "couple",
      partner: isPartner1 ? 1 : 2,
    });

    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    setInput("");

    const microReflect = QUESTIONS[currentStep]?.microReflect;
    if (microReflect) {
      setTimeout(() => {
        addLocalMessage("micro-reflect", microReflect);
        scrollToBottom();
      }, 600);
    }

    if (newStep >= QUESTIONS.length) {
      if (isPartner1) {
        setTimeout(() => setPhase("switch"), 1500);
      } else {
        setTimeout(() => handleAnalysis(), 1500);
      }
    } else {
      const nextDelay = microReflect ? 2500 : 1000;
      setTimeout(() => showQuestion(newStep), nextDelay);
    }
  }

  function handleSubmit() {
    const trimmed = input.trim();
    if (trimmed.length < MIN_ANSWER_LENGTH || isTyping) return;

    const classification = classifyText(trimmed);

    if (classification.level === "crisis") {
      track(EVENTS.ABUSE_DETECTED, { pattern: classification.matchedPattern, mode: "couple" });
      router.push("/crisis");
      return;
    }

    if (classification.level === "borderline") {
      setPendingAnswer(trimmed);
      setShowSafetyCheck(true);
      return;
    }

    if (navigator.vibrate) navigator.vibrate(20);
    processAnswer(trimmed);
  }

  function handleSafetyCheckSafe() {
    setShowSafetyCheck(false);
    if (pendingAnswer) {
      processAnswer(pendingAnswer);
      setPendingAnswer(null);
    }
  }

  function handleSafetyCheckNeedHelp() {
    setShowSafetyCheck(false);
    setPendingAnswer(null);
    router.push("/crisis");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const canSubmit = input.trim().length >= MIN_ANSWER_LENGTH && !isTyping;

  // Safety check overlay
  if (showSafetyCheck) {
    return (
      <AnimatePresence>
        <SafetyCheck
          onSafe={handleSafetyCheckSafe}
          onNeedHelp={handleSafetyCheckNeedHelp}
          t={t as (key: string) => string}
        />
      </AnimatePresence>
    );
  }

  // Intro screen
  if (phase === "intro") {
    return (
      <main className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-mobile space-y-8 text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
            <Users className="w-10 h-10 text-accent" />
          </div>
          <div className="space-y-3">
            <h1 className="text-xl font-medium text-text-primary">
              {t("coupleMode")}
            </h1>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              {t("coupleModeDesc")}
            </p>
          </div>
          <div className="space-y-3 text-left">
            <div className="bg-bg-card border border-border rounded-card p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-medium">1</span>
              <span className="text-text-secondary text-sm">{t("couplePartner1")} answers 5 questions</span>
            </div>
            <div className="bg-bg-card border border-border rounded-card p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-medium">2</span>
              <span className="text-text-secondary text-sm">{t("coupleSwitchPrompt")}</span>
            </div>
            <div className="bg-bg-card border border-border rounded-card p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-medium">3</span>
              <span className="text-text-secondary text-sm">See how your patterns connect</span>
            </div>
          </div>
          <Button
            onClick={() => {
              track(EVENTS.COUPLE_MODE_START);
              startPartnerSession(1);
            }}
            className="w-full"
            size="lg"
          >
            {t("coupleModeStart")}
          </Button>
        </motion.div>
      </main>
    );
  }

  // Switch screen
  if (phase === "switch") {
    return (
      <main className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-mobile space-y-8 text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
            <ArrowRight className="w-10 h-10 text-accent" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-medium text-text-primary">
              {t("couplePartner1")} is done!
            </h2>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              {t("coupleSwitchPrompt")}. Their answers are completely
              separate — neither of you will see each other&apos;s responses.
            </p>
          </div>
          <Button
            onClick={() => startPartnerSession(2)}
            className="w-full"
            size="lg"
          >
            Start {t("couplePartner2")}&apos;s turn
          </Button>
        </motion.div>
      </main>
    );
  }

  // Analysing screen
  if (phase === "analysing") {
    return (
      <main className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
        <div className="w-full max-w-mobile text-center space-y-8">
          <div className="loading-pulse">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-accent/20 animate-pulse-slow" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-medium text-text-primary">
              {t("coupleComparing")}
            </h2>
            <p
              key={loadingMsgIndex}
              className="text-text-secondary text-sm opacity-0 animate-fade-in"
            >
              {LOADING_MESSAGES[loadingMsgIndex]}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Chat interface
  const partnerLabel = phase === "partner1" ? t("couplePartner1") : t("couplePartner2");

  return (
    <main className="h-dvh bg-bg-primary flex flex-col max-w-mobile mx-auto">
      <header className="flex-shrink-0 px-4 pt-4 pb-3 space-y-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-accent font-medium text-lg">{t("brandName")}</span>
          <span className="text-xs px-2 py-1 rounded-pill bg-accent/10 text-accent border border-accent-border">
            {partnerLabel}
          </span>
        </div>
        <ProgressBar
          currentStep={Math.min(currentStep + 1, QUESTIONS.length)}
          totalSteps={QUESTIONS.length}
          label={
            currentStep < QUESTIONS.length
              ? QUESTIONS[currentStep]?.label
              : "Complete"
          }
        />
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {currentStep < QUESTIONS.length && (
        <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border safe-bottom">
          <div className="flex items-end gap-2">
            {isSupported && (
              <VoiceButton
                isListening={isListening}
                isSupported={isSupported}
                onStart={() => {
                  track(EVENTS.VOICE_INPUT_USED, { mode: "couple" });
                  startListening((text) =>
                    setInput((prev) => (prev ? prev + " " + text : text))
                  );
                }}
                onStop={stopListening}
                label={isListening ? t("voiceListening") : t("voiceTap")}
              />
            )}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("typeAnswer")}
                rows={1}
                className="w-full bg-bg-card border border-border rounded-input px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-border transition-colors min-h-[44px] max-h-32 leading-relaxed"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 128) + "px";
                }}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-shrink-0 w-11 h-11 rounded-button bg-accent text-bg-primary flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:bg-amber-400 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {input.trim().length > 0 &&
            input.trim().length < MIN_ANSWER_LENGTH && (
              <p className="text-text-muted text-xs mt-2 px-1">
                {t("minChars")}
              </p>
            )}
        </div>
      )}
    </main>
  );
}
