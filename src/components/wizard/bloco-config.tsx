"use client";

import type { BlocoTipo } from "@/lib/content-config";
import { DesignerField, type DesignerValue } from "./designer-field";
import { ItemListInput } from "./item-list-input";
import { LayoutConfig, type LayoutValue } from "./layout-config";
import { OptionCards } from "./option-cards";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface BlocoConfigData {
  titulo?: DesignerValue;
  subtitulo?: DesignerValue;
  descricao?: DesignerValue;
  cta?: DesignerValue;
  itens?: string[];
  layout?: LayoutValue;
  choice?: string;
  bannerTexto?: string;
  bannerImagem?: string;
  bannerDesigner?: boolean;
  link?: string;
}

interface BlocoConfigPanelProps {
  bloco: BlocoTipo;
  value: BlocoConfigData;
  onChange: (v: BlocoConfigData) => void;
}

export function BlocoConfigPanel({ bloco, value, onChange }: BlocoConfigPanelProps) {
  function patch(p: Partial<BlocoConfigData>) {
    onChange({ ...value, ...p });
  }

  return (
    <div className="space-y-4">
      {bloco.disclaimer && (
        <p className="rounded-lg bg-secondary/60 p-3 text-sm text-secondary-foreground">
          {bloco.disclaimer}
        </p>
      )}

      {bloco.titulo !== false && (
        <DesignerField
          label="Título da seção"
          placeholder="Título que aparecerá nesta seção"
          value={value.titulo}
          onChange={(v) => patch({ titulo: v })}
        />
      )}

      {bloco.subtitulo !== false && (
        <DesignerField
          label="Subtítulo"
          placeholder="Subtítulo (opcional)"
          optional
          value={value.subtitulo}
          onChange={(v) => patch({ subtitulo: v })}
        />
      )}

      {bloco.descricao && (
        <DesignerField
          label={bloco.descricao}
          placeholder="Descreva..."
          multiline
          value={value.descricao}
          onChange={(v) => patch({ descricao: v })}
        />
      )}

      {bloco.itemList && (
        <ItemListInput
          label={bloco.itemList.label}
          placeholder={bloco.itemList.placeholder}
          value={value.itens || []}
          onChange={(v) => patch({ itens: v })}
        />
      )}

      {bloco.choice && (
        <div className="space-y-2">
          <Label className="text-sm">{bloco.choice.label}</Label>
          <OptionCards
            options={bloco.choice.options.map((o) => ({ value: o }))}
            value={value.choice || ""}
            onChange={(v) => patch({ choice: v as string })}
          />
        </div>
      )}

      {bloco.layout && (
        <LayoutConfig
          mode={bloco.layout}
          value={value.layout}
          onChange={(v) => patch({ layout: v })}
        />
      )}

      {bloco.banner && (
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!value.bannerDesigner}
              onChange={(e) => patch({ bannerDesigner: e.target.checked })}
              className="h-4 w-4"
            />
            Deixar imagem e texto a critério do designer
          </label>
          {!value.bannerDesigner && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Imagem do banner</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    patch({ bannerImagem: e.target.files?.[0]?.name || "" })
                  }
                  className="cursor-pointer"
                />
                {value.bannerImagem && (
                  <p className="text-xs text-muted-foreground">{value.bannerImagem}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Texto do banner</Label>
                <Input
                  placeholder="Texto de preferência"
                  value={value.bannerTexto || ""}
                  onChange={(e) => patch({ bannerTexto: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {bloco.link && (
        <div className="space-y-1.5">
          <Label className="text-sm">{bloco.link.label}</Label>
          <Input
            placeholder={bloco.link.placeholder}
            value={value.link || ""}
            onChange={(e) => patch({ link: e.target.value })}
          />
        </div>
      )}

      {bloco.cta && (
        <DesignerField
          label="Texto / ação do botão (CTA)"
          placeholder="Ex.: 'Ver todos os imóveis'"
          optional
          value={value.cta}
          onChange={(v) => patch({ cta: v })}
        />
      )}
    </div>
  );
}
