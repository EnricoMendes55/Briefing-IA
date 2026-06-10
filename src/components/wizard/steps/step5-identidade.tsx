"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { ColorPicker } from "@/components/color-picker";
import { stepSchemas } from "@/lib/briefing-schema";

export function Step5Identidade() {
  const { formData, updateFormData } = useWizard();

  function validate(): boolean {
    const result = stepSchemas[5].safeParse(formData);
    if (!result.success) {
      const first = result.error.issues[0];
      alert(first.message);
      return false;
    }
    return true;
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Envie o logo e defina as cores da sua marca.
      </p>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Logo da imobiliária *</Label>
        <Input
          type="file"
          accept=".png,.jpg,.jpeg,.svg,.webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              updateFormData({ logoFile: file.name });
            }
          }}
          className="cursor-pointer"
        />
        {formData.logoFile && (
          <p className="text-sm text-muted-foreground">
            Arquivo selecionado: {formData.logoFile}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Formatos aceitos: PNG, JPG, SVG ou WebP
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold">Cores da marca</h3>

        <ColorPicker
          label="Cor primária"
          value={formData.corPrimaria || "#1a365d"}
          onChange={(v) => updateFormData({ corPrimaria: v })}
        />

        <ColorPicker
          label="Cor secundária"
          value={formData.corSecundaria || "#e53e3e"}
          onChange={(v) => updateFormData({ corSecundaria: v })}
        />

        <ColorPicker
          label="Cor terciária"
          value={formData.corTerciaria || "#edf2f7"}
          onChange={(v) => updateFormData({ corTerciaria: v })}
        />

        <div className="mt-4 flex gap-3">
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded border"
              style={{ backgroundColor: formData.corPrimaria || "#1a365d" }}
            />
            <span className="text-xs">Primária</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded border"
              style={{ backgroundColor: formData.corSecundaria || "#e53e3e" }}
            />
            <span className="text-xs">Secundária</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded border"
              style={{ backgroundColor: formData.corTerciaria || "#edf2f7" }}
            />
            <span className="text-xs">Terciária</span>
          </div>
        </div>
      </div>

      <StepNavigation onNext={validate} />
    </div>
  );
}
