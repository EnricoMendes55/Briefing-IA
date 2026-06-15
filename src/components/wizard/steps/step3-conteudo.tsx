"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { DesignerField, type DesignerValue } from "../designer-field";
import { ItemListInput } from "../item-list-input";
import { BlocoConfigPanel, type BlocoConfigData } from "../bloco-config";
import {
  NAV_ITENS,
  NAV_MAX,
  BLOCOS,
  type NavItem,
} from "@/lib/content-config";

// IDs que ficam bloqueados quando o cliente marca "não quero quem somos" (Etapa 2)
const SOBRE_NAV_ID = "sobre";
const SOBRE_BLOCO_ID = "sobre-nos";

// ----------------------------------------------------------------------------
// Navegação
// ----------------------------------------------------------------------------
function NavToggle({
  item,
  checked,
  disabled,
  onToggle,
}: {
  item: NavItem;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled && !checked}
      onClick={onToggle}
      className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
        checked
          ? "border-primary bg-secondary/60"
          : disabled
            ? "cursor-not-allowed border-border opacity-40"
            : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {item.label}
    </button>
  );
}

function NavegacaoSection() {
  const { formData, updateFormData } = useWizard();
  const sel: string[] = formData.navItens || [];
  const detalhes: Record<string, DesignerValue> = formData.navDetalhes || {};
  const contato = formData.contatoConfig || {};
  const semHistoria = !!formData.semHistoria;

  function isItemBloqueado(id: string) {
    return semHistoria && id === SOBRE_NAV_ID;
  }

  function toggle(id: string) {
    if (isItemBloqueado(id)) {
      alert("Você marcou na Etapa 2 que o site não terá informações sobre quem somos. Desmarque essa opção lá pra liberar 'Sobre Nós' aqui.");
      return;
    }
    if (sel.includes(id)) {
      updateFormData({ navItens: sel.filter((s) => s !== id) });
    } else {
      if (sel.length >= NAV_MAX) {
        alert(`Você pode selecionar no máximo ${NAV_MAX} itens de navegação.`);
        return;
      }
      updateFormData({ navItens: [...sel, id] });
    }
  }

  function setDetalhe(id: string, v: DesignerValue) {
    updateFormData({ navDetalhes: { ...detalhes, [id]: v } });
  }

  const hamburguer = !!formData.navHamburguer;
  const hamburguerItens: string[] = formData.navHamburguerItens || [];

  function toggleHamb(id: string) {
    const has = hamburguerItens.includes(id);
    updateFormData({
      navHamburguerItens: has
        ? hamburguerItens.filter((s) => s !== id)
        : [...hamburguerItens, id],
    });
  }

  const selecionados = NAV_ITENS.filter((n) => sel.includes(n.id));

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-xl font-bold">Itens de navegação</h3>
        <p className="text-sm text-muted-foreground">
          Escolha até {NAV_MAX} itens para o menu principal.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {NAV_ITENS.map((item) => {
          const bloqueado = isItemBloqueado(item.id);
          return (
            <NavToggle
              key={item.id}
              item={item}
              checked={sel.includes(item.id)}
              disabled={bloqueado || sel.length >= NAV_MAX}
              onToggle={() => toggle(item.id)}
            />
          );
        })}
      </div>
      {semHistoria && (
        <p className="text-xs text-muted-foreground">
          🔒 &quot;Sobre nós&quot; está bloqueado porque você marcou na Etapa 2 que o
          site não terá informações sobre quem somos.
        </p>
      )}

      {/* Menu hambúrguer */}
      <div className="rounded-xl border border-border bg-card p-4">
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={hamburguer}
            onCheckedChange={(c) => updateFormData({ navHamburguer: !!c })}
          />
          <span className="font-medium">Menu hambúrguer</span>
        </label>
        <p className="mt-1 text-sm text-muted-foreground">
          Aquele menu que abre ao clicar/passar o mouse. Selecione o que vai dentro dele.
        </p>
        {hamburguer && (
          <div className="mt-3 flex flex-wrap gap-2">
            {NAV_ITENS.filter((i) => !isItemBloqueado(i.id)).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleHamb(item.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  hamburguerItens.includes(item.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detalhamento por item */}
      {selecionados.some((i) => !i.semDetalhe) && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Detalhe cada item</h4>
            <p className="text-sm text-muted-foreground">
              Descreva o que cada página/ação deve conter. Faremos o mais próximo
              possível do solicitado, dentro das nossas possibilidades.
            </p>
          </div>

          {selecionados
            .filter((i) => !i.semDetalhe)
            .map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 font-medium text-primary">{item.label}</p>

                {item.nota && (
                  <p className="rounded-lg bg-secondary/60 p-2 text-sm text-secondary-foreground">
                    {item.nota}
                  </p>
                )}

                {item.especial === "contato" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">O que exibir na página de contato?</p>
                    {[
                      ["formulario", "Formulário de contato"],
                      ["info", "Nome e contato da imobiliária"],
                      ["mapa", "Localização no mapa"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                        <Checkbox
                          checked={!!contato[key]}
                          onCheckedChange={(c) =>
                            updateFormData({ contatoConfig: { ...contato, [key]: !!c } })
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                )}

                {item.especial === "trabalhe" && (
                  <ItemListInput
                    label="Quais campos terá o formulário de Trabalhe conosco?"
                    placeholder="Ex.: Nome, E-mail, Telefone, Currículo"
                    value={formData.trabalheCampos || []}
                    onChange={(v) => updateFormData({ trabalheCampos: v })}
                  />
                )}

                {!item.especial && !item.nota && (
                  <DesignerField
                    label="O que essa página/ação deve conter?"
                    placeholder="Descreva brevemente..."
                    multiline
                    value={detalhes[item.id]}
                    onChange={(v) => setDetalhe(item.id, v)}
                  />
                )}
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

// ----------------------------------------------------------------------------
// Blocos / seções de conteúdo
// ----------------------------------------------------------------------------
function BlocosSection() {
  const { formData, updateFormData } = useWizard();
  const sel: string[] = formData.blocosSel || [];
  const config: Record<string, BlocoConfigData> = formData.blocosConfig || {};
  const semHistoria = !!formData.semHistoria;
  const redesSociais = Array.isArray(formData.redesSociais) ? formData.redesSociais : [];
  const semRedes = !!formData.semRedesSociais;

  function bloqueado(blocoId: string): { off: boolean; motivo?: string } {
    if (semHistoria && blocoId === SOBRE_BLOCO_ID)
      return {
        off: true,
        motivo: "Bloqueado porque você marcou na Etapa 2 que o site não terá informações sobre quem somos.",
      };
    if (blocoId === "redes-sociais" && (semRedes || redesSociais.length === 0))
      return {
        off: true,
        motivo: "Bloqueado porque nenhuma rede social foi preenchida na Etapa 1. Adicione ao menos uma pra liberar esta seção.",
      };
    return { off: false };
  }

  function toggle(id: string) {
    if (sel.includes(id)) {
      updateFormData({ blocosSel: sel.filter((s) => s !== id) });
    } else {
      updateFormData({ blocosSel: [...sel, id] });
    }
  }

  function setConfig(id: string, v: BlocoConfigData) {
    updateFormData({ blocosConfig: { ...config, [id]: v } });
  }

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-xl font-bold">Blocos e seções da página</h3>
        <p className="text-sm text-muted-foreground">
          Selecione as seções que o site terá. Ao marcar, configure os detalhes abaixo.
        </p>
      </div>

      <div className="space-y-3">
        {BLOCOS.map((bloco) => {
          const ativo = sel.includes(bloco.id);
          const blk = bloqueado(bloco.id);
          return (
            <div
              key={bloco.id}
              className={`overflow-hidden rounded-2xl border-2 transition-all ${
                blk.off
                  ? "border-border bg-muted/30"
                  : ativo
                    ? "border-primary bg-card"
                    : "border-border bg-card"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (blk.off) {
                    alert(blk.motivo);
                    return;
                  }
                  toggle(bloco.id);
                }}
                disabled={blk.off}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${blk.off ? "opacity-50" : ""}`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                    ativo && !blk.off ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {ativo && !blk.off && (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="font-medium">
                  {blk.off && "🔒 "}
                  {bloco.label}
                  {blk.off && (
                    <span className="ml-2 block text-xs font-normal text-muted-foreground">
                      {blk.motivo}
                    </span>
                  )}
                </span>
              </button>

              {ativo && !blk.off && (
                <div className="border-t border-border bg-secondary/20 px-4 py-4">
                  <BlocoConfigPanel
                    bloco={bloco}
                    value={config[bloco.id] || {}}
                    onChange={(v) => setConfig(bloco.id, v)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Ordem do menu
// ----------------------------------------------------------------------------
function OrdemSection() {
  const { formData, updateFormData } = useWizard();
  const sel: string[] = formData.navItens || [];

  if (sel.length === 0) return null;

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sel.length) return;
    const novo = [...sel];
    [novo[i], novo[j]] = [novo[j], novo[i]];
    updateFormData({ navItens: novo });
  }

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-xl font-bold">Ordem dos itens do menu</h3>
        <p className="text-sm text-muted-foreground">
          Defina a ordem em que os itens aparecem no menu (de cima para baixo).
        </p>
      </div>
      <ol className="space-y-2">
        {sel.map((id, i) => {
          const item = NAV_ITENS.find((n) => n.id === id);
          return (
            <li
              key={id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="font-medium">{item?.label || id}</span>
              </span>
              <span className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Subir"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={i === sel.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Descer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Etapa
// ----------------------------------------------------------------------------
export function Step3Conteudo() {
  const { formData, updateFormData } = useWizard();
  const semHistoria = !!formData.semHistoria;
  const semRedes = !!formData.semRedesSociais;
  const semRedesItens =
    semRedes ||
    !Array.isArray(formData.redesSociais) ||
    formData.redesSociais.length === 0;

  // Cascata: remove automaticamente "Sobre nós" e "Redes Sociais" das seleções
  // quando as pré-condições da Etapa 1/2 foram desmarcadas.
  useEffect(() => {
    const nav: string[] = formData.navItens || [];
    const hamb: string[] = formData.navHamburguerItens || [];
    const blocos: string[] = formData.blocosSel || [];

    const patch: Record<string, unknown> = {};
    if (semHistoria) {
      if (nav.includes(SOBRE_NAV_ID))
        patch.navItens = nav.filter((id) => id !== SOBRE_NAV_ID);
      if (hamb.includes(SOBRE_NAV_ID))
        patch.navHamburguerItens = hamb.filter((id) => id !== SOBRE_NAV_ID);
      if (blocos.includes(SOBRE_BLOCO_ID))
        patch.blocosSel = blocos.filter((id) => id !== SOBRE_BLOCO_ID);
    }
    if (semRedesItens && blocos.includes("redes-sociais")) {
      patch.blocosSel = (patch.blocosSel as string[] | undefined) ||
        blocos.filter((id) => id !== "redes-sociais");
      if (semHistoria) {
        patch.blocosSel = (patch.blocosSel as string[]).filter(
          (id) => id !== "redes-sociais" && id !== SOBRE_BLOCO_ID
        );
      } else {
        patch.blocosSel = blocos.filter((id) => id !== "redes-sociais");
      }
    }
    if (Object.keys(patch).length) updateFormData(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semHistoria, semRedesItens]);

  function validate(): boolean {
    const nav: string[] = formData.navItens || [];
    if (nav.length === 0) {
      alert("Selecione ao menos um item de navegação.");
      return false;
    }
    const blocos: string[] = formData.blocosSel || [];
    if (blocos.length === 0) {
      alert("Selecione ao menos uma seção de conteúdo.");
      return false;
    }
    return true;
  }

  return (
    <div className="space-y-10">
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
        O layout seguirá à risca o que for preenchido aqui. Não garantimos
        reproduzir tudo exatamente como descrito, mas faremos o mais próximo
        possível dentro das nossas possibilidades.
      </p>

      <NavegacaoSection />

      <div className="border-t border-border" />

      <BlocosSection />

      <div className="border-t border-border" />

      <OrdemSection />

      <StepNavigation onNext={validate} />
    </div>
  );
}
