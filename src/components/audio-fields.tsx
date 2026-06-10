"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MicButton } from "./mic-button";

interface AudioInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (v: string) => void;
}

/** Input com botão de microfone embutido (transcrição por áudio). */
export function AudioInput({ value, onChange, className, ...rest }: AudioInputProps) {
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pr-12 ${className || ""}`}
        {...rest}
      />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
        <MicButton currentText={value} onTranscript={onChange} />
      </div>
    </div>
  );
}

interface AudioTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  value: string;
  onChange: (v: string) => void;
}

/** Textarea com botão de microfone embutido (transcrição por áudio). */
export function AudioTextarea({ value, onChange, className, ...rest }: AudioTextareaProps) {
  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pr-12 ${className || ""}`}
        {...rest}
      />
      <div className="absolute bottom-2 right-2">
        <MicButton currentText={value} onTranscript={onChange} />
      </div>
    </div>
  );
}
