"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { OptionCards, type OptionItem } from "../option-cards";

const objetivoOpcoes: OptionItem[] = [
  { value: "Gerar leads", hint: "Layout terá mais botões e chamadas de ação (CTAs)." },
  { value: "Reforçar reputação", hint: "Layout terá mais seções sobre a história e a reputação da imobiliária." },
  { value: "Exibir imóveis com filtros", hint: "Layout terá mais imóveis e filtros, estilo portal." },
  { value: "Não tenho preferência", hint: "Ficará a critério do designer." },
];

const clienteIdealOpcoes: OptionItem[] = [
  { value: "Investidores", hint: "Foco em imóveis na planta e oportunidades de investimento." },
  { value: "Área Comercial", hint: "Foco em imóveis comerciais, como salas, escritórios e prédios." },
  { value: "Casais jovens", hint: "Foco em imóveis de aluguel ou venda de menor preço." },
  { value: "Alto poder aquisitivo", hint: "Alto padrão, imóveis de alto valor e um toque mais refinado e formal." },
  { value: "Não tenho preferência", hint: "Ficará a critério do designer." },
];

const finalidadeOpcoes: OptionItem[] = [
  { value: "Venda" },
  { value: "Aluguel" },
  { value: "Temporada" },
];

const HISTORIA_MIN = 150;

export function Step2Estrategia() {
  const { formData, updateFormData } = useWizard();
  const historia = formData.historia || "";

  function validate(): boolean {
    if (!formData.objetivoSite) return fail("Selecione o objetivo principal do site.");
    if (!formData.clienteIdeal) return fail("Selecione o cliente ideal.");
    const finalidade: string[] = formData.finalidadeImoveis || [];
    if (finalidade.length === 0) return fail("Selecione ao menos uma finalidade dos imóveis.");
    if (historia.trim().length < HISTORIA_MIN)
      return fail(`A história precisa ter pelo menos ${HISTORIA_MIN} caracteres (este texto será usado no layout).`);
    return true;
  }

  function fail(msg: string): boolean {
    alert(msg);
    return false;
  }

  return (
    <div className="space-y-8">
      <p className="rounded-xl bg-secondary/50 p-4 text-sm text-secondary-foreground">
        Esta seção ajuda o designer a escolher as imagens e os textos fictícios
        do layout, de forma que combinem melhor com o perfil da sua imobiliária.
      </p>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Objetivo principal do site *</Label>
        <OptionCards
          options={objetivoOpcoes}
          value={formData.objetivoSite || ""}
          onChange={(v) => updateFormData({ objetivoSite: v as string })}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Cliente ideal *</Label>
        <OptionCards
          options={clienteIdealOpcoes}
          value={formData.clienteIdeal || ""}
          onChange={(v) => updateFormData({ clienteIdeal: v as string })}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Finalidade dos imóveis * <span className="font-normal text-muted-foreground">(pode marcar mais de uma)</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Sua escolha aqui define o que poderá ser configurado depois (ex.: se
          marcar só Venda, não haverá listagens de locação).
        </p>
        <OptionCards
          multiple
          columns={3}
          options={finalidadeOpcoes}
          value={formData.finalidadeImoveis || []}
          onChange={(v) => updateFormData({ finalidadeImoveis: v as string[] })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="historia" className="text-base font-semibold">
          História da imobiliária *
        </Label>
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          ⚠️ Atenção: <strong>este mesmo texto será usado no layout</strong>.
          Escreva com cuidado, sem pressa, capricho na redação.
        </p>
        <Textarea
          id="historia"
          placeholder="Conte a história, a missão e os diferenciais da imobiliária..."
          rows={6}
          value={historia}
          onChange={(e) => updateFormData({ historia: e.target.value })}
        />
        <p className={`text-xs ${historia.trim().length < HISTORIA_MIN ? "text-muted-foreground" : "text-primary"}`}>
          {historia.trim().length}/{HISTORIA_MIN} caracteres mínimos
        </p>
      </div>

      <StepNavigation onNext={validate} />
    </div>
  );
}
