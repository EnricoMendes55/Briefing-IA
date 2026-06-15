"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GerarComIaModalProps {
  open: boolean;
  onClose: () => void;
  /** Endpoint que recebe { prompt, contexto } e devolve { texto }. */
  endpoint: string;
  /** Contexto extra mandado pra IA junto com o prompt do cliente. */
  contexto?: Record<string, unknown>;
  /** Título do modal. */
  titulo: string;
  /** Descrição/dica acima do prompt. */
  descricao: string;
  /** Texto-placeholder do prompt. */
  promptPlaceholder: string;
  /** Texto sugerido pré-preenchido (opcional). */
  promptInicial?: string;
  /** Callback chamado quando o cliente aceita o texto gerado. */
  onAplicar: (texto: string) => void;
}

export function GerarComIaModal({
  open,
  onClose,
  endpoint,
  contexto,
  titulo,
  descricao,
  promptPlaceholder,
  promptInicial = "",
  onAplicar,
}: GerarComIaModalProps) {
  const [prompt, setPrompt] = useState(promptInicial);
  const [gerando, setGerando] = useState(false);
  const [resultado, setResultado] = useState<string>("");
  const [erro, setErro] = useState<string>("");

  if (!open) return null;

  async function gerar() {
    setErro("");
    setResultado("");
    setGerando(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, contexto }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao gerar texto.");
      } else {
        setResultado(data.texto || "");
      }
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    }
    setGerando(false);
  }

  function aplicar() {
    if (!resultado) return;
    onAplicar(resultado);
    onClose();
  }

  function fechar() {
    setPrompt(promptInicial);
    setResultado("");
    setErro("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm"
      onClick={fechar}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </span>
            <h2 className="text-lg font-bold">{titulo}</h2>
          </div>
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-muted-foreground">{descricao}</p>

          <div className="space-y-1.5">
            <Label htmlFor="ai-prompt" className="text-sm">Conte pra IA o que você quer</Label>
            <Textarea
              id="ai-prompt"
              rows={4}
              placeholder={promptPlaceholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={gerar}
              disabled={gerando || prompt.trim().length < 5}
            >
              {gerando ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Gerando…
                </>
              ) : (
                "Gerar texto"
              )}
            </Button>
          </div>

          {erro && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {erro}
            </p>
          )}

          {resultado && (
            <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Resultado
              </Label>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{resultado}</p>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={gerar}>
                  Gerar de novo
                </Button>
                <Button type="button" size="sm" onClick={aplicar}>
                  Usar este texto
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
