"use client";

import { useState, useEffect, useRef } from "react";
import type { Plano } from "@/lib/models-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModelFile {
  name: string;
  label: string;
  plano: Plano;
  path: string;
}

interface ModelPickerProps {
  category: string;
  title: string;
  value: string;
  onChange: (filename: string) => void;
  /** Plano do cliente atual. "premium" libera tudo; "padrao" bloqueia premium. */
  userPlan?: Plano;
  /** Chamado quando o cliente tenta selecionar um modelo bloqueado. */
  onBlockedSelect?: () => void;
}

export function ModelPicker({
  category,
  title,
  value,
  onChange,
  userPlan = "premium",
  onBlockedSelect,
}: ModelPickerProps) {
  const [models, setModels] = useState<ModelFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState<ModelFile | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/modelos?category=${category}`)
      .then((r) => r.json())
      .then((data) => {
        setModels(data.models || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  function isLocked(m: ModelFile) {
    return m.plano === "premium" && userPlan !== "premium";
  }

  function handleSelect(m: ModelFile) {
    if (isLocked(m)) {
      onBlockedSelect?.();
      return;
    }
    onChange(m.name);
  }

  function scroll(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {!loading && models.length > 2 && (
          <div className="hidden gap-2 sm:flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scroll(-1)}
              aria-label="Anterior"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scroll(1)}
              aria-label="Próximo"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="aspect-[16/10] w-80 shrink-0 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : models.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          Modelos deste elemento serão adicionados em breve. Você poderá escolher
          quando as imagens estiverem disponíveis.
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]"
        >
          {models.map((model) => {
            const selected = value === model.name;
            const locked = isLocked(model);
            return (
              <div
                key={model.name}
                className={`group relative w-72 shrink-0 snap-start overflow-hidden rounded-xl border-2 bg-card transition-all sm:w-80 ${
                  selected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="relative">
                  <img
                    src={model.path}
                    alt={model.label}
                    className={`aspect-[16/10] w-full object-cover ${locked ? "opacity-60 grayscale" : ""}`}
                  />

                  {/* Botão de zoom */}
                  <button
                    type="button"
                    onClick={() => setZoomed(model)}
                    className="absolute right-2 top-2 rounded-lg bg-background/90 p-2 text-foreground opacity-0 shadow transition-opacity hover:bg-background group-hover:opacity-100"
                    aria-label="Ampliar imagem"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
                    </svg>
                  </button>

                  {model.plano === "premium" && (
                    <Badge className="absolute left-2 top-2 bg-amber-500 text-white hover:bg-amber-500">
                      Premium
                    </Badge>
                  )}

                  {selected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                      <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-lg">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                      <div className="rounded-full bg-background/90 p-2 shadow">
                        <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="text-sm font-medium">{model.label}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    onClick={() => handleSelect(model)}
                    disabled={locked}
                  >
                    {selected ? "Selecionado" : locked ? "Bloqueado" : "Selecionar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!value && !loading && models.length > 0 && (
        <p className="text-sm text-muted-foreground">Selecione um modelo acima</p>
      )}

      {/* Lightbox / zoom */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
          onClick={() => setZoomed(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomed(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-2 shadow hover:bg-background"
              aria-label="Fechar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={zoomed.path} alt={zoomed.label} className="max-h-[75vh] w-full object-contain" />
            <div className="flex items-center justify-between gap-4 border-t border-border p-4">
              <div>
                <p className="font-semibold">{zoomed.label}</p>
                <p className="text-sm text-muted-foreground">
                  {title}
                  {zoomed.plano === "premium" ? " • Premium" : ""}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  handleSelect(zoomed);
                  if (!isLocked(zoomed)) setZoomed(null);
                }}
                disabled={isLocked(zoomed)}
              >
                {value === zoomed.name
                  ? "Selecionado"
                  : isLocked(zoomed)
                    ? "Disponível no Premium"
                    : "Selecionar este modelo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
