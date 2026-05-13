"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useLocale } from "@/hooks/useLocale";
import { classifyText } from "@/lib/abuseClassifier";
import { QUESTIONS, LOADING_MESSAGES, MIN_ANSWER_LENGTH } from "@/lib/constants";
import { track, EVENTS } from "@/lib/analytics";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import ProgressBar from "@/components/ProgressBar";
import VoiceButton from "@/components/VoiceButton";
import ContentWarning from "@/components/ContentWarning";
import SafetyCheck from "@/components/SafetyCheck";
import { ChatSkeleton } from "@/components/SkeletonLoader";
import { Message } from "@/types";

export default function SessionPage() {
  const router = useRouter();
  const { t } = useLocale();
  const {
    state,
    isHydrated,
    addMessage,
    submitAnswer,
    setAnalysing,
    setResult,
  } = useSession();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnalysing, setIsAnalysingLocal] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [showContentWarning, setShowContentWarning] = useState(true);
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasInitialized = useRef(false);

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

  // Check if content warning was already shown
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("authrelo_content_warning_seen");
      if (seen) setShowContentWarning(false);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || hasInitialized.current || showContentWarning) return;
    hasInitialized.current = true;

    if (state.currentStep > 0 && state.messages.length > 0) {
      setMessages(state.messages);
      setCurrentStep(state.currentStep);
      setAnswers(state.answers);
      if (state.currentStep < QUESTIONS.length) {
        showQuestion(state.currentStep);
      } else if (state.analysisResult) {
        router.push("/paywall");
      } else {
        handleAnalysis(state.answers);
      }
      return;
    }

    showQuestion(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, showContentWarning]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (!isAnalysing) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnalysing]);

  async function handleAnalysis(allAnswers: string[]) {
    setIsAnalysingLocal(true);
    setAnalysing(true);
    track(EVENTS.ANALYSIS_STARTED);

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: allAnswers }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const result = await res.json();

      if (result.safetyFlag) {
        router.push("/crisis");
        return;
      }

      track(EVENTS.ANALYSIS_COMPLETE);
      setResult(result);
      setAnalysing(false);
      router.push("/paywall");
    } catch (err) {
      console.error(err);
      setIsAnalysingLocal(false);
      setAnalysing(false);
      addLocalMessage("ai", "Something went wrong with the analysis. Please try again.");
    }
  }

  function processAnswer(trimmed: string) {
    addLocalMessage("user", trimmed);
    addMessage("user", trimmed);

    const newAnswers = [...answers, trimmed];
    setAnswers(newAnswers);
    submitAnswer(trimmed);

    track(EVENTS.QUESTION_ANSWERED, { step: currentStep + 1 });

    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    setInput("");

    const microReflect = QUESTIONS[currentStep]?.microReflect;
    if (microReflect) {
      setTimeout(() => {
        addLocalMessage("micro-reflect", microReflect);
        addMessage("micro-reflect", microReflect);
        scrollToBottom();
      }, 600);
    }

    if (newStep >= QUESTIONS.length) {
      const reflectDelay = microReflect ? 2000 : 800;
      setTimeout(() => handleAnalysis(newAnswers), reflectDelay);
    } else {
      const nextDelay = microReflect ? 2500 : 1000;
      setTimeout(() => showQuestion(newStep), nextDelay);
    }
  }

  function handleSubmit() {
    const trimmed = input.trim();
    if (trimmed.length < MIN_ANSWER_LENGTH || isTyping || isAnalysing) return;

    // Classify text
    const classification = classifyText(trimmed);

    if (classification.level === "crisis") {
      track(EVENTS.ABUSE_DETECTED, { pattern: classification.matchedPattern });
      router.push("/crisis");
      return;
    }

    if (classification.level === "borderline") {
      // Show safety check
      setPendingAnswer(trimmed);
      setShowSafetyCheck(true);
      return;
    }

    // Haptic feedback on submit
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

  function handleContentWarningAccept() {
    setShowContentWarning(false);
    sessionStorage.setItem("authrelo_content_warning_seen", "true");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const canSubmit =
    input.trim().length >= MIN_ANSWER_LENGTH && !isTyping && !isAnalysing;

  if (!isHydrated) return <ChatSkeleton />;

  // Content warning
  if (showContentWarning) {
    return (
      <AnimatePresence>
        <ContentWarning
          onAccept={handleContentWarningAccept}
          t={t as (key: string) => string}
        />
      </AnimatePresence>
    );
  }

  // Safety check
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

  // Analysis loading screen
  if (isAnalysing) {
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
              {t("analysing")}
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

  return (
    <main className="h-dvh bg-bg-primary flex flex-col max-w-mobile mx-auto">
      {/* Header */}
      <header className="flex-shrink-0 px-4 pt-4 pb-3 space-y-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-accent font-medium text-lg">{t("brandName")}</span>
          {currentStep < QUESTIONS.length && (
            <span className="text-text-muted text-xs">
              {QUESTIONS[currentStep]?.label}
            </span>
          )}
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

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      {currentStep < QUESTIONS.length && (
        <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border safe-bottom">
          <div className="flex items-end gap-2">
            {isSupported && (
              <VoiceButton
                isListening={isListening}
                isSupported={isSupported}
                onStart={() => {
                  track(EVENTS.VOICE_INPUT_USED);
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
              className="flex-shrink-0 w-11 h-11 rounded-button bg-accent text-bg-primary flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:scale-100 hover:bg-amber-400 active:scale-95"
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
