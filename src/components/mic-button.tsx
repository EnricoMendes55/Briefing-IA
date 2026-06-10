"use client";

import { useRef } from "react";
import { useSpeech } from "@/lib/use-speech";

interface MicButtonProps {
  /** Texto atual do campo — usado como prefixo do que será transcrito. */
  currentText: string;
  /** Recebe o texto atualizado a cada parcial / final do reconhecimento. */
  onTranscript: (text: string) => void;
  className?: string;
}

export function MicButton({ currentText, onTranscript, className }: MicButtonProps) {
  const { supported, listening, start, stop } = useSpeech();
  const baseRef = useRef("");

  if (!supported) return null;

  function toggle() {
    if (listening) {
      stop();
      return;
    }
    baseRef.current = currentText || "";
    start((transcript) => {
      const sep = baseRef.current && transcript ? " " : "";
      onTranscript(baseRef.current + sep + transcript);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseDown={(e) => e.preventDefault()}
      title={listening ? "Parar gravação" : "Falar para transcrever"}
      aria-label={listening ? "Parar gravação" : "Falar para transcrever"}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        listening
          ? "animate-pulse bg-destructive text-white"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } ${className || ""}`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
}
