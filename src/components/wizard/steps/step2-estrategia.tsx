"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AudioTextarea } from "@/components/audio-fields";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { OptionCards, type OptionItem } from "../option-cards";
import { GerarComIaModal } from "../gerar-com-ia-modal";
import { TIPO_IMOVEL_OPCOES, ESTAGIO_OPCOES } from "@/lib/content-config";

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

const CATEGORIAS_MACRO = ["Residencial", "Comercial", "Rural", "Outros"];

const HISTORIA_MIN = 150;

// ----------------------------------------------------------------------------
// Componente reutilizável: chips pré-definidos + input pra criar customizados
// ----------------------------------------------------------------------------
function ChipsComCustom({
  predefinidos,
  selecionados,
  customizados,
  onChange,
  onChangeCustom,
  placeholderAdd,
}: {
  predefinidos: readonly string[];
  selecionados: string[];
  customizados: string[];
  onChange: (sel: string[]) => void;
  onChangeCustom: (custom: string[]) => void;
  placeholderAdd: string;
}) {
  const [novo, setNovo] = useState("");
  const sel = new Set(selecionados);

  function toggle(v: string) {
    if (sel.has(v)) onChange(selecionados.filter((s) => s !== v));
    else onChange([...selecionados, v]);
  }

  function adicionar() {
    const v = novo.trim();
    if (!v || customizados.includes(v) || predefinidos.includes(v)) {
      setNovo("");
      return;
    }
    onChangeCustom([...customizados, v]);
    onChange([...selecionados, v]);
    setNovo("");
  }

  function removerCustom(v: string) {
    onChangeCustom(customizados.filter((c) => c !== v));
    onChange(selecionados.filter((s) => s !== v));
  }

  const todos = [...predefinidos, ...customizados];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {todos.map((v) => {
          const on = sel.has(v);
          const isCustom = customizados.includes(v);
          return (
            <button
              key={v}
              type="button"
              onClick={() => toggle(v)}
              className={`group inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {v}
              {isCustom && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Remover"
                  onClick={(e) => {
                    e.stopPropagation();
                    removerCustom(v);
                  }}
                  className={`-mr-1 ml-1 flex h-4 w-4 items-center justify-center rounded ${
                    on ? "hover:bg-primary-foreground/20" : "hover:bg-muted"
                  }`}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={novo}
          placeholder={placeholderAdd}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar();
            }
          }}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={adicionar}>
          + Adicionar
        </Button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Etapa 2
// ----------------------------------------------------------------------------
export function Step2Estrategia() {
  const { formData, updateFormData } = useWizard();
  const historia = formData.historia || "";
  const semHistoria = !!formData.semHistoria;
  const [iaOpen, setIaOpen] = useState(false);

  function validate(): boolean {
    if (!formData.objetivoSite) return fail("Selecione o objetivo principal do site.");
    if (!formData.clienteIdeal) return fail("Selecione o cliente ideal.");
    const finalidade: string[] = formData.finalidadeImoveis || [];
    if (finalidade.length === 0) return fail("Selecione ao menos uma finalidade dos imóveis.");
    const categorias: string[] = formData.categoriasMacro || [];
    if (categorias.length === 0) return fail("Selecione ao menos uma categoria macro de imóveis.");
    const tipos: string[] = formData.tiposImoveisSel || [];
    if (tipos.length === 0) return fail("Selecione ao menos um tipo de imóvel com que vocês trabalham.");
    if (!semHistoria && historia.trim().length < HISTORIA_MIN)
      return fail(`A história precisa ter pelo menos ${HISTORIA_MIN} caracteres.`);
    return true;
  }

  function fail(msg: string): boolean {
    alert(msg);
    return false;
  }

  return (
    <div className="space-y-8">
      <p className="rounded-xl bg-secondary/50 p-4 text-sm text-secondary-foreground">
        Esta seção ajuda a IA a gerar o layout, os textos fictícios e as imagens
        certas pro perfil da sua imobiliária. <strong>Tudo que você marcar aqui
        influencia diretamente o layout final.</strong>
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
          Define o que estará disponível nas próximas etapas (ex.: se marcar só
          Venda, não haverá listagens de locação).
        </p>
        <OptionCards
          multiple
          columns={3}
          options={finalidadeOpcoes}
          value={formData.finalidadeImoveis || []}
          onChange={(v) => updateFormData({ finalidadeImoveis: v as string[] })}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Categorias macro * <span className="font-normal text-muted-foreground">(pode marcar mais de uma)</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Útil quando vocês trabalham com muitos tipos diferentes — define o
          recorte mais amplo do portfólio.
        </p>
        <OptionCards
          multiple
          columns={2}
          options={CATEGORIAS_MACRO.map((c) => ({ value: c }))}
          value={formData.categoriasMacro || []}
          onChange={(v) => updateFormData({ categoriasMacro: v as string[] })}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Tipos de imóveis que vocês trabalham *
        </Label>
        <p className="text-sm text-muted-foreground">
          Clique nos tipos que se aplicam. Não achou? Digite e clique em &quot;Adicionar&quot;.
          A Etapa 4 (Imóveis) puxa esta lista pra montar as listagens.
        </p>
        <ChipsComCustom
          predefinidos={TIPO_IMOVEL_OPCOES}
          selecionados={formData.tiposImoveisSel || []}
          customizados={formData.tiposCustom || []}
          onChange={(sel) => updateFormData({ tiposImoveisSel: sel })}
          onChangeCustom={(custom) => updateFormData({ tiposCustom: custom })}
          placeholderAdd="Ex.: Studio, Flat, Loft..."
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Estágios <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Marque se vocês trabalham apenas com alguns estágios. Se deixar em
          branco, assumimos que aceitam todos.
        </p>
        <ChipsComCustom
          predefinidos={ESTAGIO_OPCOES}
          selecionados={formData.estagiosSel || []}
          customizados={formData.estagiosCustom || []}
          onChange={(sel) => updateFormData({ estagiosSel: sel })}
          onChangeCustom={(custom) => updateFormData({ estagiosCustom: custom })}
          placeholderAdd="Outro estágio..."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="historia" className="text-base font-semibold">
            História da imobiliária {semHistoria ? "" : "*"}
          </Label>
          {!semHistoria && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIaOpen(true)}
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Gerar com IA
            </Button>
          )}
        </div>

        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          ℹ️ Este texto será usado no bloco &quot;Sobre Nós&quot; da página inicial
          (se houver) e na página &quot;Quem Somos&quot; do menu (se houver).
          Se ficar muito longo, será resumido ou truncado pra caber no layout.
        </p>

        {!semHistoria && (
          <>
            <AudioTextarea
              id="historia"
              placeholder="Conte a história, a missão e os diferenciais da imobiliária..."
              rows={6}
              value={historia}
              onChange={(v) => updateFormData({ historia: v })}
            />
            <p className={`text-xs ${historia.trim().length < HISTORIA_MIN ? "text-muted-foreground" : "text-primary"}`}>
              {historia.trim().length}/{HISTORIA_MIN} caracteres mínimos
            </p>
          </>
        )}

        <label className="flex cursor-pointer items-start gap-2 pt-2">
          <Checkbox
            checked={semHistoria}
            onCheckedChange={(c) => updateFormData({ semHistoria: !!c })}
            className="mt-0.5"
          />
          <span className="text-sm">
            Não quero que o site tenha informações sobre quem somos
            {semHistoria && (
              <span className="mt-1 block text-xs text-muted-foreground">
                ⚠️ Ao marcar, o site não terá página &quot;Quem Somos&quot; nem
                seção &quot;Sobre Nós&quot; — essas opções ficarão desabilitadas
                nas próximas etapas.
              </span>
            )}
          </span>
        </label>
      </div>

      <StepNavigation onNext={validate} />

      <GerarComIaModal
        open={iaOpen}
        onClose={() => setIaOpen(false)}
        endpoint="/api/ai/gerar-texto"
        contexto={{
          tipo: "historia",
          imobiliaria: formData.imobiliaria,
          objetivo: formData.objetivoSite,
          clienteIdeal: formData.clienteIdeal,
        }}
        titulo="Gerar história com IA"
        descricao="Conte rapidamente sobre sua imobiliária e a IA escreve um texto pronto pra você revisar."
        promptPlaceholder="Ex.: imobiliária familiar fundada em 2005 em São Paulo, especializada em imóveis de alto padrão na zona oeste, com atendimento personalizado."
        onAplicar={(texto) => updateFormData({ historia: texto })}
      />
    </div>
  );
}
