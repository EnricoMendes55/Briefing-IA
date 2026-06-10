"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { DesignerField, type DesignerValue } from "../designer-field";
import { ItemListInput } from "../item-list-input";
import { OptionCards } from "../option-cards";
import { ChipMulti } from "../chip-multi";
import {
  TIPO_IMOVEL_OPCOES,
  ESTAGIO_OPCOES,
  EXIBICAO_OPCOES,
  CARD_INFO_OPCOES,
  CARD_INFO_MAX,
} from "@/lib/content-config";

interface Aba {
  nome?: string;
  finalidade?: string;
  tipos?: string[];
}
interface Listagem {
  titulo?: DesignerValue;
  subtitulo?: DesignerValue;
  exibicao?: string;
  linhas?: number;
  colunas?: number;
  finalidade?: string;
  tipos?: string[];
  estagio?: string[];
  abas?: Aba[];
}

const ESSENCIAIS = [
  "Imagem do imóvel",
  "Título do imóvel",
  "Valor do imóvel",
  "Endereço do imóvel",
];

function Stepper({
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
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-1">
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const n = min + i;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`h-9 w-9 rounded-lg border text-sm font-medium ${
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

function FinalidadeSelect({
  finalidades,
  value,
  onChange,
}: {
  finalidades: string[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  // Se há só uma finalidade, fica fixa.
  useEffect(() => {
    if (finalidades.length === 1 && value !== finalidades[0]) {
      onChange(finalidades[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalidades.length]);

  if (finalidades.length <= 1) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
        {finalidades[0] || "—"}{" "}
        <span className="text-xs text-muted-foreground">(única finalidade)</span>
      </div>
    );
  }
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
    >
      <option value="">Selecione...</option>
      {finalidades.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
}

function AbasEditor({
  abas,
  finalidades,
  tiposPool,
  onChange,
}: {
  abas: Aba[];
  finalidades: string[];
  tiposPool: string[];
  onChange: (a: Aba[]) => void;
}) {
  function set(i: number, patch: Partial<Aba>) {
    onChange(abas.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }
  return (
    <div className="space-y-3">
      <Label className="text-sm">Abas de filtro (botões acima da listagem)</Label>
      {abas.length === 0 && (
        <p className="text-xs text-muted-foreground">Nenhuma aba ainda.</p>
      )}
      {abas.map((aba, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Nome da aba (ex.: Lançamentos)"
              value={aba.nome || ""}
              onChange={(e) => set(i, { nome: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onChange(abas.filter((_, idx) => idx !== i))}
              aria-label="Remover aba"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          {finalidades.length > 1 && (
            <div>
              <Label className="text-xs text-muted-foreground">Finalidade desta aba</Label>
              <select
                value={aba.finalidade || ""}
                onChange={(e) => set(i, { finalidade: e.target.value })}
                className="mt-1 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
              >
                <option value="">Qualquer</option>
                {finalidades.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <Label className="text-xs text-muted-foreground">Tipos desta aba</Label>
            <div className="mt-1">
              <ChipMulti
                options={tiposPool}
                value={aba.tipos || []}
                onChange={(v) => set(i, { tipos: v })}
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...abas, {}])}
      >
        + Adicionar aba
      </Button>
    </div>
  );
}

function ListagemEditor({
  listagem,
  finalidades,
  tiposPool,
  onChange,
}: {
  listagem: Listagem;
  finalidades: string[];
  tiposPool: string[];
  onChange: (l: Listagem) => void;
}) {
  function patch(p: Partial<Listagem>) {
    onChange({ ...listagem, ...p });
  }
  const porAbas = listagem.exibicao === "Filtragem por abas";

  return (
    <div className="space-y-4">
      <DesignerField
        label="Título da listagem"
        placeholder="Ex.: Imóveis para venda"
        value={listagem.titulo}
        onChange={(v) => patch({ titulo: v })}
      />
      <DesignerField
        label="Subtítulo"
        optional
        value={listagem.subtitulo}
        onChange={(v) => patch({ subtitulo: v })}
      />

      <div className="space-y-2">
        <Label className="text-sm">Como exibir?</Label>
        <OptionCards
          columns={3}
          options={EXIBICAO_OPCOES.map((o) => ({ value: o }))}
          value={listagem.exibicao || ""}
          onChange={(v) => patch({ exibicao: v as string })}
        />
      </div>

      {porAbas ? (
        <AbasEditor
          abas={listagem.abas || []}
          finalidades={finalidades}
          tiposPool={tiposPool}
          onChange={(a) => patch({ abas: a })}
        />
      ) : (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Finalidade</Label>
            <div className="mt-1">
              <FinalidadeSelect
                finalidades={finalidades}
                value={listagem.finalidade}
                onChange={(v) => patch({ finalidade: v })}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Tipos de imóvel (pode marcar vários)</Label>
            <div className="mt-1">
              <ChipMulti
                options={tiposPool}
                value={listagem.tipos || []}
                onChange={(v) => patch({ tipos: v })}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Estágio (opcional)</Label>
            <div className="mt-1">
              <ChipMulti
                options={ESTAGIO_OPCOES}
                value={listagem.estagio || []}
                onChange={(v) => patch({ estagio: v })}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        <Stepper
          label="Linhas (1–3)"
          value={listagem.linhas || 1}
          min={1}
          max={3}
          onChange={(n) => patch({ linhas: n })}
        />
        <Stepper
          label="Cards por linha (1–5)"
          value={listagem.colunas || 1}
          min={1}
          max={5}
          onChange={(n) => patch({ colunas: n })}
        />
      </div>
    </div>
  );
}

export function StepImoveis() {
  const { formData, updateFormData } = useWizard();
  const finalidades: string[] = formData.finalidadeImoveis || [];
  const tiposCustom: string[] = formData.tiposCustom || [];
  const tiposPool = [...TIPO_IMOVEL_OPCOES, ...tiposCustom.filter(Boolean)];
  const listagens: Listagem[] = formData.listagens || [];
  const cardInfo: string[] = formData.cardInfo || [];

  const favoritosNoMenu = (formData.navItens || []).includes("favoritos");

  // Favoritar entra automaticamente se "Favoritos" foi adicionado na navegação.
  useEffect(() => {
    if (favoritosNoMenu && !cardInfo.includes("Favoritar")) {
      updateFormData({ cardInfo: [...cardInfo, "Favoritar"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritosNoMenu]);

  function addListagem() {
    updateFormData({
      listagens: [
        ...listagens,
        { finalidade: finalidades.length === 1 ? finalidades[0] : undefined },
      ],
    });
  }
  function setListagem(i: number, l: Listagem) {
    updateFormData({ listagens: listagens.map((x, idx) => (idx === i ? l : x)) });
  }
  function removeListagem(i: number) {
    updateFormData({ listagens: listagens.filter((_, idx) => idx !== i) });
  }

  function toggleCard(opt: string) {
    if (opt === "Favoritar" && favoritosNoMenu) return; // travado
    if (cardInfo.includes(opt)) {
      updateFormData({ cardInfo: cardInfo.filter((c) => c !== opt) });
    } else {
      if (cardInfo.length >= CARD_INFO_MAX) {
        alert(`Você pode selecionar no máximo ${CARD_INFO_MAX} informações no card.`);
        return;
      }
      updateFormData({ cardInfo: [...cardInfo, opt] });
    }
  }

  function validate(): boolean {
    if (listagens.length === 0) {
      alert("Adicione ao menos uma listagem de imóveis.");
      return false;
    }
    if (cardInfo.length === 0) {
      alert("Selecione ao menos uma informação para o card de imóvel.");
      return false;
    }
    const faltando = ESSENCIAIS.filter((e) => !cardInfo.includes(e));
    if (faltando.length > 0) {
      const ok = window.confirm(
        `Você não selecionou: ${faltando.join(", ")}.\n\nEssas informações costumam ser essenciais em um card de imóvel. Deseja continuar mesmo assim?`
      );
      if (!ok) return false;
    }
    return true;
  }

  return (
    <div className="space-y-10">
      {/* Listagens */}
      <section className="space-y-5">
        <div>
          <h3 className="text-xl font-bold">Listagens de imóveis</h3>
          <p className="text-sm text-muted-foreground">
            Monte as listagens que aparecerão no site. Cada uma define como exibe,
            a finalidade e os tipos de imóvel.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <ItemListInput
            label="Tipos de imóvel personalizados (opcional)"
            placeholder="Ex.: Flat, Loft, Studio"
            value={tiposCustom}
            onChange={(v) => updateFormData({ tiposCustom: v })}
          />
        </div>

        {listagens.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma listagem adicionada.</p>
        )}

        {listagens.map((l, i) => (
          <div key={i} className="rounded-2xl border-2 border-primary/30 bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-primary">Listagem {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => removeListagem(i)}
              >
                Remover
              </Button>
            </div>
            <ListagemEditor
              listagem={l}
              finalidades={finalidades}
              tiposPool={tiposPool}
              onChange={(nl) => setListagem(i, nl)}
            />
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addListagem}>
          + Adicionar listagem
        </Button>
      </section>

      <div className="border-t border-border" />

      {/* Informações do card */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold">Informações do card de imóvel</h3>
          <p className="text-sm text-muted-foreground">
            Selecione o que aparecerá em cada card (máximo {CARD_INFO_MAX}). Isso
            afeta o layout. Selecionados: {cardInfo.length}/{CARD_INFO_MAX}
          </p>
          {favoritosNoMenu && (
            <p className="mt-2 rounded-lg bg-secondary/60 p-2 text-sm text-secondary-foreground">
              &quot;Favoritar&quot; foi ativado automaticamente porque você incluiu
              &quot;Favoritos&quot; no menu de navegação.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_INFO_OPCOES.map((opt) => {
            const checked = cardInfo.includes(opt);
            const travado = opt === "Favoritar" && favoritosNoMenu;
            const essencial = ESSENCIAIS.includes(opt);
            const blocked = !checked && cardInfo.length >= CARD_INFO_MAX;
            return (
              <button
                key={opt}
                type="button"
                disabled={blocked || travado}
                onClick={() => toggleCard(opt)}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-all ${
                  checked
                    ? "border-primary bg-secondary/60"
                    : blocked
                      ? "cursor-not-allowed border-border opacity-40"
                      : "border-border bg-card hover:border-primary/40"
                } ${travado ? "cursor-default" : ""}`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {checked && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span>
                  {opt}
                  {essencial && <span className="ml-1 text-primary">*</span>}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">* informações geralmente essenciais</p>
      </section>

      <StepNavigation onNext={validate} />
    </div>
  );
}
