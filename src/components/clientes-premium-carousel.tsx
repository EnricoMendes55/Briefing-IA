"use client";

import { CLIENTES_PREMIUM } from "@/lib/clientes-premium";

export function ClientesPremiumCarousel() {
  if (CLIENTES_PREMIUM.length === 0) return null;

  // Duplica a lista para o loop infinito da animação ficar contínuo.
  const items = [...CLIENTES_PREMIUM, ...CLIENTES_PREMIUM];

  return (
    <div className="overflow-hidden border-t border-border bg-card/60 py-3 backdrop-blur">
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Sites premium feitos pela Apresenta.me
      </p>
      <div className="relative">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {items.map((c, i) => (
            <a
              key={`${c.url}-${i}`}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              title={c.nome}
              className="inline-flex shrink-0 items-center opacity-70 transition-opacity hover:opacity-100"
            >
              <img
                src={c.logo}
                alt={c.nome}
                className="h-10 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
