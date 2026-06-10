"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidUrl } from "@/lib/form-helpers";

interface AutoUrlPromptProps {
  onSubmit: (url: string) => void;
  onBack: () => void;
}

export function AutoUrlPrompt({ onSubmit, onBack }: AutoUrlPromptProps) {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && !isValidUrl(url);

  function handleContinue() {
    setTouched(true);
    if (!isValidUrl(url)) return;
    onSubmit(url.trim());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            Preenchimento automatizado
          </span>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            Qual é o site atual da sua imobiliária?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Vamos fazer uma varredura no site pra pré-preencher os campos do
            briefing — você só revisa, ajusta o que quiser e segue.
          </p>

          <div className="mt-6 space-y-2">
            <Label htmlFor="siteUrl">URL do site</Label>
            <Input
              id="siteUrl"
              value={url}
              placeholder="https://www.suaimobiliaria.com.br"
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={invalid}
            />
            {invalid && (
              <p className="text-sm text-destructive">
                Informe uma URL válida (incluindo https://).
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="button" size="lg" onClick={handleContinue}>
              Analisar e continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
