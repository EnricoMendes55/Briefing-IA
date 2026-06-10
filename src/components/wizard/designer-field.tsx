"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface DesignerValue {
  texto?: string;
  designer?: boolean;
}

interface DesignerFieldProps {
  label: string;
  value: DesignerValue | undefined;
  onChange: (v: DesignerValue) => void;
  placeholder?: string;
  multiline?: boolean;
  optional?: boolean;
}

/**
 * Campo de texto com a opção "Deixar a critério do designer".
 * Quando marcada, o campo de texto é desabilitado.
 */
export function DesignerField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  optional = false,
}: DesignerFieldProps) {
  const v = value || {};
  const designer = !!v.designer;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-sm">
          {label}
          {optional && (
            <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
          )}
        </Label>
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
          <Checkbox
            checked={designer}
            onCheckedChange={(c) => onChange({ ...v, designer: !!c })}
          />
          Critério do designer
        </label>
      </div>
      {!designer &&
        (multiline ? (
          <Textarea
            rows={2}
            placeholder={placeholder}
            value={v.texto || ""}
            onChange={(e) => onChange({ ...v, texto: e.target.value })}
          />
        ) : (
          <Input
            placeholder={placeholder}
            value={v.texto || ""}
            onChange={(e) => onChange({ ...v, texto: e.target.value })}
          />
        ))}
    </div>
  );
}
