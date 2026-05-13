"use client";

import { useState, useCallback, useRef } from "react";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Check support on first call
  const checkSupport = useCallback(() => {
    if (typeof window === "undefined") return false;
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    const supported = !!SpeechRecognition;
    setSupported(supported);
    return supported;
  }, []);

  const startListening = useCallback(
    (
      onResult: (text: string) => void,
      lang: string = "en-IN"
    ) => {
      if (typeof window === "undefined") return;

      const SpeechRecognition =
        (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSupported(false);
        return;
      }

      const recognition = new (SpeechRecognition as new () => SpeechRecognitionInstance)();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          onResult(transcript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    []
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSupported: typeof window !== "undefined" ? isSupported || checkSupport() : false,
    startListening,
    stopListening,
  };
}
