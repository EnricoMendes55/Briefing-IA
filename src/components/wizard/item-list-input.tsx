"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ItemListInputProps {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (v: string[]) => void;
}

/** Lista dinâmica de itens de texto (adicionar/remover). */
export function ItemListInput({
  label,
  placeholder,
  value,
  onChange,
}: ItemListInputProps) {
  const items = Array.isArray(value) ? value : [];

  function set(i: number, v: string) {
    onChange(items.map((it, idx) => (idx === i ? v : it)));
  }
  function add() {
    onChange([...items, ""]);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground">Nenhum item adicionado.</p>
      )}
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={it}
            placeholder={placeholder}
            onChange={(e) => set(i, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            aria-label="Remover"
            className="text-muted-foreground hover:text-destructive"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Adicionar
      </Button>
    </div>
  );
}
