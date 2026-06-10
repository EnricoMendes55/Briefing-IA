"use client";

interface ChipMultiProps {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}

/** Seleção múltipla em formato de chips. */
export function ChipMulti({ options, value, onChange }: ChipMultiProps) {
  const sel = Array.isArray(value) ? value : [];
  function toggle(o: string) {
    onChange(sel.includes(o) ? sel.filter((s) => s !== o) : [...sel, o]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = sel.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
