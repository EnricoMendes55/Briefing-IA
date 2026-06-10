"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface LayoutValue {
  carrossel?: boolean;
  linhas?: number;
  colunas?: number;
  quantidade?: number;
}

interface LayoutConfigProps {
  value: LayoutValue | undefined;
  onChange: (v: LayoutValue) => void;
  /** "completo" = carrossel + linhas(1-3) + colunas(1-5); "quantidade" = carrossel + nº itens(1-5). */
  mode: "completo" | "quantidade";
}

function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-1">
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const n = min + i;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`h-9 w-9 rounded-lg border text-sm font-medium transition-colors ${
                value === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LayoutConfig({ value, onChange, mode }: LayoutConfigProps) {
  const v = value || {};
  return (
    <div className="space-y-3 rounded-xl bg-muted/40 p-3">
      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          checked={!!v.carrossel}
          onCheckedChange={(c) => onChange({ ...v, carrossel: !!c })}
        />
        <span className="text-sm">Exibir em carrossel</span>
      </label>

      {mode === "completo" ? (
        <div className="flex flex-wrap gap-6">
          <NumberStepper
            label="Linhas (1–3)"
            value={v.linhas || 1}
            min={1}
            max={3}
            onChange={(n) => onChange({ ...v, linhas: n })}
          />
          <NumberStepper
            label="Cards por linha (1–5)"
            value={v.colunas || 1}
            min={1}
            max={5}
            onChange={(n) => onChange({ ...v, colunas: n })}
          />
        </div>
      ) : (
        <NumberStepper
          label="Quantidade de itens (1–5)"
          value={v.quantidade || 1}
          min={1}
          max={5}
          onChange={(n) => onChange({ ...v, quantidade: n })}
        />
      )}
    </div>
  );
}
