"use client";

export interface OptionItem {
  value: string;
  hint?: string;
}

interface OptionCardsProps {
  options: OptionItem[];
  /** string para seleção única; string[] para múltipla. */
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  columns?: 1 | 2 | 3;
  /** Desabilita opções específicas (ex.: gating por finalidade). */
  isDisabled?: (value: string) => boolean;
  disabledHint?: string;
}

export function OptionCards({
  options,
  value,
  onChange,
  multiple = false,
  columns = 1,
  isDisabled,
  disabledHint,
}: OptionCardsProps) {
  const selectedSet = new Set(Array.isArray(value) ? value : value ? [value] : []);

  function toggle(v: string) {
    if (multiple) {
      const current = new Set(Array.isArray(value) ? value : []);
      if (current.has(v)) current.delete(v);
      else current.add(v);
      onChange(Array.from(current));
    } else {
      onChange(v);
    }
  }

  const colClass =
    columns === 3
      ? "sm:grid-cols-3"
      : columns === 2
        ? "sm:grid-cols-2"
        : "";

  return (
    <div className={`grid grid-cols-1 gap-3 ${colClass}`}>
      {options.map((opt) => {
        const selected = selectedSet.has(opt.value);
        const disabled = isDisabled?.(opt.value) ?? false;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => toggle(opt.value)}
            className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
              disabled
                ? "cursor-not-allowed border-border bg-muted/40 opacity-50"
                : selected
                  ? "border-primary bg-secondary/50 shadow-sm"
                  : "border-border bg-card hover:border-primary/40 hover:bg-secondary/20"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
                multiple ? "rounded-md" : "rounded-full"
              } ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/40"
              }`}
            >
              {selected && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="flex-1">
              <span className="block font-medium leading-tight">{opt.value}</span>
              {opt.hint && (
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {opt.hint}
                </span>
              )}
              {disabled && disabledHint && (
                <span className="mt-0.5 block text-xs text-muted-foreground italic">
                  {disabledHint}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
