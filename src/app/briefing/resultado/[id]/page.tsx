"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BriefingResult {
  id: string;
  generatedImagePath?: string;
  iaProvider?: string;
  regeneracoes: number;
  status: string;
}

export default function ResultadoPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/briefing/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefingId: id }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResult((prev) =>
          prev
            ? {
                ...prev,
                generatedImagePath: data.imagePath,
                iaProvider: data.provider,
                regeneracoes: (prev.regeneracoes || 0) + 1,
              }
            : null
        );
      }
    } catch {
      alert("Erro ao regenerar. Tente novamente.");
    }
    setRegenerating(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-lg text-muted-foreground">
          Gerando seu layout...
        </p>
        <p className="text-sm text-muted-foreground">
          Isso pode levar alguns segundos.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-destructive">Briefing não encontrado</p>
        <Link href="/">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    );
  }

  const canRegenerate = (result.regeneracoes || 0) < 2;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Seu layout está pronto!</h1>
        <p className="mt-2 text-muted-foreground">
          Abaixo está o mockup gerado com base nas suas escolhas.
        </p>
      </div>

      {result.generatedImagePath ? (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border shadow-lg">
            <img
              src={result.generatedImagePath}
              alt="Layout gerado"
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={result.generatedImagePath}
              download={`layout-${id}.svg`}
              className="inline-flex"
            >
              <Button variant="outline" size="lg">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Baixar imagem
              </Button>
            </a>

            {canRegenerate && (
              <Button
                size="lg"
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                {regenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Regenerando...
                  </>
                ) : (
                  <>
                    Regenerar layout ({2 - (result.regeneracoes || 0)}{" "}
                    {2 - (result.regeneracoes || 0) === 1
                      ? "tentativa restante"
                      : "tentativas restantes"}
                    )
                  </>
                )}
              </Button>
            )}

            {!canRegenerate && (
              <p className="text-sm text-muted-foreground">
                Limite de regenerações atingido.
              </p>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            <p>
              Gerado por: <strong>{result.iaProvider}</strong> | ID:{" "}
              <code className="text-xs">{id}</code>
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <p className="text-lg font-semibold text-destructive">
            Houve um erro na geração da imagem
          </p>
          <p className="mt-2 text-muted-foreground">
            Você pode tentar regenerar clicando abaixo.
          </p>
          {canRegenerate && (
            <Button
              className="mt-4"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              {regenerating ? "Regenerando..." : "Tentar novamente"}
            </Button>
          )}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="ghost">Voltar ao início</Button>
        </Link>
      </div>
    </div>
  );
}
