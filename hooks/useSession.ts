"use client";

import { useState, useCallback, useEffect } from "react";
import { SessionState, Message, AnalysisResult } from "@/types";
import { QUESTIONS } from "@/lib/constants";

const SESSION_KEY = "authrelo_session";

const initialState: SessionState = {
  currentStep: 0,
  answers: [],
  messages: [],
  isAnalysing: false,
  analysisResult: null,
  isPaid: false,
};

function loadSession(): SessionState {
  if (typeof window === "undefined") return initialState;
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return initialState;
}

function saveSession(state: SessionState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useSession() {
  const [state, setState] = useState<SessionState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setState(loadSession());
    setIsHydrated(true);
  }, []);

  const updateState = useCallback((updater: (prev: SessionState) => SessionState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession(next);
      return next;
    });
  }, []);

  const addMessage = useCallback(
    (type: Message["type"], content: string) => {
      const msg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        content,
        timestamp: Date.now(),
      };
      updateState((prev) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
      return msg;
    },
    [updateState]
  );

  const submitAnswer = useCallback(
    (answer: string) => {
      updateState((prev) => {
        const newAnswers = [...prev.answers, answer];
        return {
          ...prev,
          answers: newAnswers,
          currentStep: prev.currentStep + 1,
        };
      });
    },
    [updateState]
  );

  const setAnalysing = useCallback(
    (isAnalysing: boolean) => {
      updateState((prev) => ({ ...prev, isAnalysing }));
    },
    [updateState]
  );

  const setResult = useCallback(
    (result: AnalysisResult) => {
      updateState((prev) => ({ ...prev, analysisResult: result }));
    },
    [updateState]
  );

  const setPaid = useCallback(
    (isPaid: boolean) => {
      updateState((prev) => ({ ...prev, isPaid }));
    },
    [updateState]
  );

  const clearSession = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setState(initialState);
  }, []);

  const currentQuestion =
    state.currentStep < QUESTIONS.length
      ? QUESTIONS[state.currentStep]
      : null;

  return {
    state,
    isHydrated,
    currentQuestion,
    addMessage,
    submitAnswer,
    setAnalysing,
    setResult,
    setPaid,
    clearSession,
    isComplete: state.currentStep >= QUESTIONS.length,
  };
}
